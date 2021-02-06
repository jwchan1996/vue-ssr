const path = require('path')
const fs = require('fs')
const chokidar = require('chokidar')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')

const resolve = file => path.resolve(__dirname, file)

module.exports = (server, callback) => {
  let ready
  const onReady = new Promise(r => ready = r)

  // 监视构建 -> 更新 Renderer

  let template
  let serverBundle
  let clientManifest

  const update = () => {
    // 等待所需要文件全部存在，调用传进来的回调函数
    if (template && serverBundle && clientManifest) {
      ready()
      callback(serverBundle, template, clientManifest)
    }
  }

  // 监视构建 template -> 调用 update -> 更新 Render 渲染器
  const templatePath = path.join(__dirname, '../index.template.html')
  template = fs.readFileSync(templatePath, 'utf8')
  update()
  // 监视变化 fs.watch、fs.watchFile
  chokidar.watch(templatePath).on('change', () => {
    template = fs.readFileSync(templatePath, 'utf8')
    update()
    console.log('template change')
  })

  // 监视构建 serverBundle -> 调用 update -> 更新 Render 渲染器
  const serverConfig = require('./webpack.server.config')
  const serverCompiler = webpack(serverConfig) 
  /**
   * 打包构建并将结果输出到内存中
   */
  const serverDevMiddleware = webpackDevMiddleware(serverCompiler, {
    logLevel: 'silent'
  })
  // 构建完成后执行
  serverCompiler.hooks.done.tap('server', () => {
    serverBundle = JSON.parse(
      // 从内存中读取文件 serverDevMiddleware.fileSystem 类似于 fs
      serverDevMiddleware.fileSystem.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8')
    )
    console.log(serverBundle)
    update()
  })
  // serverCompiler.watch({}, (err, stats) => {
  //   if (err) throw err
  //   if (stats.hasErrors()) return 
  //   serverBundle = JSON.parse(
  //     fs.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8')
  //   )
  //   update()
  // })
  
  // 监视构建 clientManifest -> 调用 update -> 更新 Render 渲染器
  const clientConfig = require('./webpack.client.config')
  const clientCompiler = webpack(clientConfig) 
  /**
   * 打包构建并将结果输出到内存中
   */
  const clientDevMiddleware = webpackDevMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    logLevel: 'silent'
  })
  // 构建完成后执行
  clientCompiler.hooks.done.tap('client', () => {
    clientManifest = JSON.parse(
      // 从内存中读取文件 serverDevMiddleware.fileSystem 类似于 fs
      clientDevMiddleware.fileSystem.readFileSync(resolve('../dist/vue-ssr-client-manifest.json'), 'utf-8')
    )
    console.log(clientManifest)
    update()
  })

  // 注意：将 clientDevMiddleware 挂载到 express 服务中。提供对其内存中数据的访问
  server.use(clientDevMiddleware)

  return onReady
}
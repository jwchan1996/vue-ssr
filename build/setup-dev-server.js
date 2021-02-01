const path = require('path')
const fs = require('fs')
const chokidar = require('chokidar')
const webpack = require('webpack')

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
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    if (stats.hasErrors()) return 
    serverBundle = JSON.parse(
      fs.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8')
    )
    console.log(serverBundle)
    update()
  })
  
  // 监视构建 clientManifest -> 调用 update -> 更新 Render 渲染器

  return onReady
}
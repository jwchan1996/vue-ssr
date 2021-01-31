const fs = require('fs')
const express = require('express')
const server = express()
const setupDevServer = require('./build/setup-dev-server')

server.use('/dist', express.static('./dist'))

const isProd = process.env.NODE_ENV === 'production'

let renderer
let onReady

if (isProd) {
  // 生产模式下基于构建后的 dist 文件
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  const serverBundle = require('./dist/vue-ssr-server-bundle.json')
  const template = fs.readFileSync('./index.template.html', 'utf8')

  // 通过读取打包后的 server-bundle.js 内容（entry--server.js 为入口文件的内容）加载得到 vue 实例
  // 然后将 vue 实例字符串注入到 template 中
  renderer = require('vue-server-renderer').createBundleRenderer(serverBundle, {
    template,
    clientManifest
  })
} else {
  // 开发模式 -> 监视打包构建 -> 重新生成 Renderer 渲染器
  onReady = setupDevServer(server, (serverBundle, template, clientManifest) => {
    renderer = require('vue-server-renderer').createBundleRenderer(serverBundle, {
      template,
      clientManifest
    })
  })
}

const render = (req, res) => {
  renderer.renderToString({
    title: 'vue-server-side-render',
    meta: `
      <meta name='vue-ssr' content='vue-server-side-render'>
    `
  }, (err, html) => {
    if (err) {
      return res.status(500).end('Internal Server Error')
    }
    res.setHeader('content-type', 'text/html; charset=utf8')
    return res.end(html)
  })
}

server.get('/', isProd
  ? render
  : async (req, res) => {
    // 等待有了 Renderer 渲染器以后，才能调用 render 函数进行渲染
    await onReady
    render()
  }
)

server.listen(3000, () => {
  console.log('server listen on port 3000')
})
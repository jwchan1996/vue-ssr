const Vue = require('vue')
const fs = require('fs')
const express = require('express')
const server = express()

const clientManifest = require('./dist/vue-ssr-client-manifest.json')
const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const template = fs.readFileSync('./index.template.html', 'utf8')

const renderer = require('vue-server-renderer').createBundleRenderer(serverBundle, {
  template,
  clientManifest
})

server.use('/dist', express.static('./dist'))

server.get('/', (req, res) => {
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
})

server.listen(3000, () => {
  console.log('server listen on port 3000')
})
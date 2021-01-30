const Vue = require('vue')
const fs = require('fs')
const renderer = require('vue-server-renderer').createRenderer({
  template: fs.readFileSync('./index.template.html', 'utf8')
})
const express = require('express')
const server = express()

server.get('/', (req, res) => {
  const app = new Vue({
    template: `
      <div id="app">
        <h1>{{ message }}</h1>
      </div>
    `,
    data: {
      message: '飘香豆腐'
    }
  })
  renderer.renderToString(app, (err, html) => {
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
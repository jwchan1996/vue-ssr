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
        <h2>客户端动态交互</h2>
        <div>
          <input v-model="message" />
        </div>
        <div>
          <button @click="onClick">点击测试</button>
        </div>
      </div>
    `,
    data: {
      message: '飘香豆腐'
    },
    methods: {
      onClick() {
        console.log('Hello World!')
      }
    }
  })
  renderer.renderToString(app, {
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
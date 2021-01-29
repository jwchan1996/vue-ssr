const Vue = require('vue')
const renderer = require('vue-server-renderer').createRenderer()

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
  if (err) throw err
  console.log(html)
})
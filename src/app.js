/**
 * 同构应用通用启动入口
 */

import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import VueMeta from 'vue-meta'
import { createStore } from './store'

Vue.use(VueMeta)

Vue.mixin({
  metaInfo: {
    titleTemplate: '%s | vue-ssr'
  }
})

// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp () {
  const router = createRouter()
  const store = createStore()
  const app = new Vue({
    router, // 把路由挂载到 Vue 根实例中
    store,  // 把容器挂载到 Vue 根实例中
    render: h => h(App) // 根实例简单的渲染应用程序组件。
  })
  return { app, router, store }
}
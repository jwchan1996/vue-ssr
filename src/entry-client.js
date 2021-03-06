/**
 * 客户端启动入口
 */
import { createApp } from './app'

// 客户端特定引导逻辑……

const { app, router, store } = createApp()

if (window.__INITIAL_STATE__) {
  // 替换客户端容器的 state
  store.replaceState(window.__INITIAL_STATE__)
}

// 等待路由初始化完成
router.onReady(() => {
  // 这里假定 App.vue 模板中根元素具有 `id="app"`
  app.$mount('#app')
})
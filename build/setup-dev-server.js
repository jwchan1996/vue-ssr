module.exports = (server, callback) => {
  let ready
  const onReady = new Promise()

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
  // 监视构建 serverBundle -> 调用 update -> 更新 Render 渲染器
  // 监视构建 clientManifest -> 调用 update -> 更新 Render 渲染器

  return onReady
}
# vue-ssr

## 打包文件介绍

### vue-ssr-server-bundle.json

是服务端打包的结果，描述了服务端的打包信息。

entry 是服务端打包后的入口，这个入口文件叫 server-bundle.js，是配置 webpack 打包的时候指定的。但是在 dist 目录下并没有看到输出的 server-bundle.js 文件，那么它在哪呢？

可以看到当前 json 文件的 files 属性有个属性名为 server-bundle.js，属性值就是 server-bundle.js 的内容，也就是 server-bundle.js 的内容直接输出到 json 文件当中了。这个 server-bundle.js 的内容是通过入口文件 .src/entry-server.js 所打包出来的内容。

最后还有一个 maps 属性，是 server-bundle.js 的 source-map 相关信息。

### vue-ssr-client-manifest.json

是客户端打包构建的文件清单，描述了构建相关的文件信息。

publicPath 是打包出来资源引入路径的前缀。

all 是打包构建出来的所有资源文件名称，包含 map 文件。

initial 是打包后的 js 文件，会自动以 script 标签注入到 `<!-- vue-ssr-outlet -->` 标记后面。

async 记录了一些异步资源的资源信息，比如异步组件和异步 js 模块等。

modules 是针对原始模块进行的一些依赖信息说明。
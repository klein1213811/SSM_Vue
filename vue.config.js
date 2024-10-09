const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
module.exports = {
  devServer: {
    port: 10000,
    proxy: {
      '/api':{ // 拦截器格式， / + 拦截器的名字
        target: 'http://localhost:8080', // 代理的目标地址，
        changeOrigin: true, // 设置同源
        pathRewrite: {
          '/api':''
        }
      }
    }
  }
}

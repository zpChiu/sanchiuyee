const path = require('path')
const resolve = dir => path.join(__dirname, dir)

module.exports = {
  publicPath: './',
  // 生产打包时不输出map文件，增加打包速度, 配合 new CompressionPlugin
  productionSourceMap: false,
  devServer: {
    // 自动打开浏览器
    open: true,
    // 实时打包编译
    hot: true,
    host: '0.0.0.0',
    // 表示实时刷新浏览器
    inline: true,
    // 指定打开浏览器的端口号
    port: '8099'
  },
  pages: {
    tab: {
      entry: `src/modules/tab/index.js`,
      template: `src/modules/tab/index.html`,
      filename: `index.html`,
      chunks: ['chunk-vendors', 'chunk-common', 'tab']
    },
    popup: {
      entry: `src/modules/popup/index.js`,
      template: `src/modules/popup/index.html`,
      filename: `popup.html`,
      chunks: ['chunk-vendors', 'chunk-common', 'popup']
    }
  },
  outputDir: 'dist/',
  assetsDir: 'static',
  css: {
    extract: false
  },
  configureWebpack: config => {
    return {
      resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
          '@': resolve('src')
        }
      }
    }
  }
}

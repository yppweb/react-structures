const webpackBase = require('./webpack.base.js');
const {
  merge
} = require('webpack-merge');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
// const ESLintPlugin = require('eslint-webpack-plugin');
console.log('dev',
  process.env.NODE_ENV);
/**
 * 开发环境需要配置功能
 * 1.mode为development
 * 2.sourceMap便于调试
 * 3.热模块（启动服务后，实时更新页面）
 * 4.eslint代码规范  直接运行npx eslint --init 可初始化一个.eslintrc文件,添加相关规范即可
 * 5.接口跨域代理 devserver proxy
 * 6.打包后的体积,便于根据包的体积优化性能
 */
const config = {
  /**
   *  配置全局环境变量
   * 1.直接在对应文件内写 mode:'development'/'production'
   * 2.安装cross-env插件，在package.json文件的scripts命令行处加上 cross-env NODE_ENV=development
   * 3. "build:dev": "cross-env NODE_ENV=development webpack  --config ./build/webpack.dev.config.js",
   */
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development', // development
  // 生成映射关系，便于找到错误代码产生的文件
  devtool: 'inline-source-map',
  devServer: {
    // 如果你使用的是 webpack-dev-server，那么就无需使用 HotModuleReplacementPlugin plugin。
    //  webpack-dev-server 使用 hot 选项决定是否启用/禁用 HMR。
    hot: true,
    // 配置代理 详细属性参考 https://webpack.docschina.org/configuration/dev-server/#devserverproxy
    proxy: {
      '/api/': {
        target: 'http://localhost:3000'
      }
    }
  },
  plugins: [
    // 直观的可以看到打包后每个包的体积，便于找出优化
    new BundleAnalyzerPlugin(),
    new CompressionPlugin({
      filename: '[path].gz', // 压缩后的文件名称 默认值[path][base].gz
      /**
       * 算法分为gzip brotlicompress 默认值gzip
       * 1.brotil是一种更高效的压缩算法，各大浏览器都支持，但是需要https，HTTP不支持brotli
       * 2.gzip:使用的是deflate算法压缩data部分 response-header中Content-Encoding:gzip/request-header中Accept-Encoding:gzip, deflate, sdch, br
       * 3.brotli:基于LZ77算法，使用Brotli替换Deflate来对文本文件压缩通常可以增加20%的压缩密度
       */
      algorithm: 'gzip', // gzip
      test: /\.(js|css|html|svg)$/,
      // exclude: /.map$/,
      // deleteOriginalAssets: true, // 是否删除原文件
      // threshold: 10240, // 超过多大的文件压缩 10KB 10*1024 默认值为0
      minRatio: 0.8 // 压缩率即为 Compressed size/Original size = 0.8 小于0.8的文件不压缩 默认值为0.8
    })
  ]
  // optimization: {
  //   usedExports: true
  // }
};

module.exports = merge(webpackBase, {
  ...config
});
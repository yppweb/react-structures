const webpackBase = require('./webpack.base.js');
const {
  merge
} = require('webpack-merge');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const zlib = require('zlib');
// webpack5.x
// const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
console.log('prod',
  process.env.NODE_ENV);
/**
 * 生产环境需要配置的功能
 * 1.压缩代码 compression
 */
const config = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development', // development
  devtool: 'source-map',
  plugins: [
    // 直观的可以看到打包后每个包的体积，便于找出优化
    new BundleAnalyzerPlugin(),
    // 压缩代码
    new CompressionPlugin({
      filename: '[path].br', // 压缩后的文件名称 默认值[path][base].gz
      /**
       * 算法分为gzip brotlicompress 默认值gzip
       * 1.brotil是一种更高效的压缩算法，各大浏览器都支持，但是需要https，HTTP不支持brotli
       * 2.gzip:使用的是deflate算法压缩data部分 response-header中Content-Encoding:gzip/request-header中Accept-Encoding:gzip, deflate, sdch, br
       * 3.brotli:基于LZ77算法，使用Brotli替换Deflate来对文本文件压缩通常可以增加20%的压缩密度
       */
      algorithm: 'brotliCompress', // gzip
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11
        }
      },
      // exclude: /.map$/,
      // deleteOriginalAssets: true, // 是否删除原文件
      threshold: 10240, // 超过多大的文件压缩 10KB 10*1024 默认值为0
      minRatio: 0.8 // 压缩率即为 Compressed size/Original size = 0.8 小于0.8的文件不压缩 默认值为0.8
    }),
    /**
     * css压缩 cssnano
     * 1.webpack5.x 使用css-minimizer-webpack-plugin
     * 2.webpack4.x使用optimize-css-assets-plugin
     */
    new OptimizeCssAssetsPlugin()
  ],
  // css-minimizer-webpack-plugin压缩
  // optimization: {
  //   minimize: true, //默认是production会压缩 ，设置minimize: true时development压缩开启
  //   minimizer: [
  //     new CssMinimizerPlugin()
  //   ]
  // }
  /**
   * optimization最优化
   * splitChunks分包 默认分包条件如下
   * 1.来自node_modules的第三方插件/或者是共享的chunk
   * 2.文件大小大于20kb
   * 3.按需加载时并行加载请求大于等于30
   * 4.初始化并发请求大于等于30
   */
  optimization: {
    splitChunks: {
      // chunks: 'async',
      chunks: 'all',
      // minChunks: 2,
      cacheGroups: {
        // vendors: {
        //   test: /[\\/]node_modules[\\/]/
        // },
        default: {
          minChunks: 2,
          reuseExistingChunk: true
        }
      }
    }
  },
  // 插件外部化 防止import的package打包到bundle中，而是运行时从外部获取依赖
  /**
   * 1.配置externals后，需要在html页面引入该库 script cdn地址
   * 2.可将这些配置外部的package放入cdn中，直接引用其地址
   */
  externals: {
    // 字符串
    react: 'react',
    'react-dom': 'react-dom'
  }
};

module.exports = merge(webpackBase, {
  ...config
});
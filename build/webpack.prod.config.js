const path = require('path');
const webpackBase = require('./webpack.base.js');
const { merge } = require('webpack-merge');
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const config = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development', //development
    devtool: 'source-map',
    plugins: [
        //直观的可以看到打包后每个包的体积，便于找出优化
        new BundleAnalyzerPlugin(),
    ],
}

module.exports = merge(webpackBase, {
    ...config,
});
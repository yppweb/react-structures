const webpackBase = require('./webpack.base.js');
const { merge } = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const ESLintPlugin = require('eslint-webpack-plugin');

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
        new BundleAnalyzerPlugin()
        // eslint代码规范检测
        // new ESLintPlugin()
    ]
};

module.exports = merge(webpackBase, {
    ...config
});

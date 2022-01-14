const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const config = {
    mode: 'development', // development
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        // __dirname当前文件所在的目录
        path: path.resolve(__dirname, '../dist')
        // assetModuleFilename:'images/[name].[hash:5][ext]'  webpack5配置图片 ext扩展名
        // publicPath: "../dist/"  //打包文件中引用文件的路径前缀 此处为换为CDN地址
    },
    module: {
        rules: [
            // typeScript-loader sass-loader
            {
                test: /\.js$/,
                // 解析es6+的代码为es5 cacheDirectory=true loader缓存
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                // css-loader用于解析使用@import和url()引入的样式 style-loader就是将样式渲染到页面
                use: ['style-loader', 'css-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|svg|ico)$/,
                // 将图片内联到文件 url-loader limit 大于则会生成一个新的文件，小于的话、不限制的话会转为base64格式
                // webpack5不需使用这两种loader了，直接配置相关属性即可
                use: [{
                    loader: 'file-loader',
                    options: {
                        esModule: false, // 不加的话会有这种情况 img属性src="[object Module]"
                        limit: 1 * 100, // 当大于100kb 1024*100 时候，将文件打包到publicPath中
                        outputPath: 'assets', // 将文件打包到哪里
                        publicPath: '/',
                        name: '[name].[ext]'
                    }
                }, {
                    loader: 'url-loader',
                    options: {
                        esModule: false, // 不加的话会有这种情况 img属性src="[object Module]"
                        limit: 1 * 100, // 当大于100kb 1024*100 时候，将文件打包到publicPath中
                        outputPath: 'assets', // 将文件打包到哪里
                        publicPath: '/',
                        name: '[name].[ext]' // 文件名称.扩展名 [hash:8] hash值取前8位的
                    }
                }]
            }
        ]
    },
    resolve: {
        // 补全文件后缀，文件类型多的后缀放前面，便于查找，
        extensions: ['.js', '.css'],
        // 配置短路径 别名
        alias: {
            '@': path.resolve(__dirname, '../src') // 使用：@/component/index
        }
    },
    plugins: [
        // 每次打包前都会清除掉dist文件
        new CleanWebpackPlugin(),
        // 自动生成html文件，并引入bundle.js
        new HtmlWebPackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, '../public/index.html')
        })
        // 配置一些默认的配置项
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         'NODE_ENV': JSON.stringify(process.env.NODE_ENV)  //development production
        //     }
        // }),
        // 压缩代码的 但是项目中使用es6语法后会报错，则需require('uglifyjs-webpack-plugin') 替换为new UglifyJsPlugin()
        // new webpack.optimize.UglifyJsPlugin()
        // new UglifyJsPlugin(),
    ]
    // webpack打包后体积超过244kb会报错
    // performance: {
    //     hints: false
    // }
};

module.exports = {
    ...config
};

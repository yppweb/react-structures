In the project directory, you can run:
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:8080](http://localhost:8080) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run build` fails to minify

### 配置环境变量 mode development/production/none 不设置默认为production

1.config配置中直接添加mode:'development'/'production'
2.scripts中运行命令行时 添加 --mode=development
3.利用cross-env插件设置全局变量 在scripts命令行前加 cross-env NODE_ENV=development；再配置文件中使用process.env.NODE_ENV获取设置的全局环境变量

### eslint规范检测 

npx eslint --init 会初始化一个配置文件，根据提示选择相应的选项，最后生成.eslintrc文件
eslint --fix 会自动修改不符合规范的代码
eslint --ext .js src  会去校验src文件下的js文件
结合husky hooks 在git提交各阶段校验是否符合.eslintrc文件中定义的规范【rules】 使用npm i husky@4.3.8 -D 、最新7.x版本设置的husky无效 
eslint代码规范检验一般是开发过程中需要，不需要用webpack的插件 ESLintPlugin,增加打包体积、影响打包性能

### css提取 

【默认打包情况下会将Css打包到bundle.js文件中，导致包过大；可将css提取到单独的css文件中，在进行压缩；此时css和js是并行加载，性能提高】
1.mini-css-extract-plugin提取css后，通过link标签将css文件添加到HTML头部， 生产环境使用且不能与style-loader一同使用
2.style-loader则是通过style添加在dom中去，开发环境使用，运行效率高
3.css-minimizer-webpack-plugin 压缩css文件使其体积变小；需放在配置项optimization中，默认是生产环境使用，若要开发环境开启，可配置optimization.minimize:true

### 图片loader file-loader/url-loader

1.将图片内联到文件 url-loader limit 大于则会生成一个新的文件，小于的话、不限制的话会转为base64格式
2.// webpack5不需使用这两种loader了，直接配置相关属性即可

### 压缩代码 compression-webpack-plugin

1.压缩代码有两种算法 gzip/brotliCompress
2.使用Brotli替换Deflate来对文本文件压缩通常可以增加20%的压缩密度
3./**
       * 算法分为gzip brotlicompress 默认值gzip
       * 1.brotil是一种更高效的压缩算法，各大浏览器都支持，但是需要https，HTTP不支持brotli
       * 2.gzip:使用的是deflate算法压缩data部分 response-header中Content-Encoding:gzip/request-header中Accept-Encoding:gzip, deflate, sdch, br
       * 3.brotli:基于LZ77算法，使用Brotli替换Deflate来对文本文件压缩通常可以增加20%的压缩密度
       */

### 分包 splitChunks  配置optimization.splitChunks

1./** optimization最优化
   * splitChunks分包 默认分包条件如下
   * 1.来自node_modules的第三方插件/或者是共享的chunk
   * 2.文件大小大于20kb
   * 3.按需加载时并行加载请求大于等于30
   * 4.初始化并发请求大于等于30
   */
2.配置相关属性需要了解各module之间的依赖关系

### 配置别名 resolve.alias

1.当import组建的时候。默认查找顺序是当前文件开始，往上查找，直到node_modules文件，配置别名后。路径明确，提高查找效率

### externals 插件外部化（外部扩展） 防止import的packag打包到bundle中，而是在运行时从外部获取依赖

1. externals: {
    react: 'react',  //react 不会打包到bundle
  }
2.将这些配置外部的package放入cdn中，通过script标签直接引用其地址

### 懒加载 动态加载

1.react.lazy(()=>import(../component)) 需要放在suspense标签内
2.路由懒加载： component: () => import('./component')
3.import('./component').then(({default:component})=>{ //component即为组件内容}) import()返回一个promise/可用于async await

### Tree Shaking 编译过程中自动清除未被import的export/treeshking是减小打包的bundle size很重要的一个手段，

1.production环境下，默认Tree Shaking
2.原理：webpack的Tree Shaking是基于es module静态分析的，编译期间能确定哪些模块没用过，并且配合解构【import {demoExport} from 'demoMudule'】可以确定哪些export没用到,对未使用的做标记，在【压缩阶段】可以删除未被使用的export/module
3.满足Tree Shaking的三个条件 ：
a.使用es module的模块规范、使用解构赋值 
b.默认开启 optimization.usedExports = true 
c.使用压缩代码的插件
注意：
1.package.json文件中可配置sideEffects【副作用】,配置sideEffects的文件不可被Tree Shaking
2.tree shaking的级别是export，如果export一个对象，但是只使用了对象中某些属性，其余的属性不是能被tree shaking,故尽量分散的去写export
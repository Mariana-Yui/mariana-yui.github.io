---
layout: post
title: webpack学习笔记
date: 2021-05-19
author: Mariana
header-img: /dev.azure.com/HealMSlin/8544be09-1224-4eb0-824b-90c4ec9d49ee/_apis/git/repositories/7a27a721-4c93-4ecf-8258-d5422217b60a/items?path=%2F1621590426989_7568.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=master&resolveLfs=true&%24format=octetStream&api-version=5.0
catalog: true
tags:
  - webpack
---

> 内卷, 内卷害了所有人

对 webpack 的配置做个笔记,后续不定期补充, 也会补充的 webpack 源码的学习

## mode

mode 分为`development`,`production`,`none`, 不配置默认为`production`, 构建时抛出警告 ⚠️

## performance

webpack 会抛出必要的影响性能的警告, 可以通过置为`false`屏蔽警告

## entry

可以是单文件入口和多文件, 有多少入口文件就会构建出多少文件

```js
// 单文件入口, 未指定name时name为main
entry: "/your/entry/file/path",
// 多文件入口
entry: {
  "main": "/your/entry/file/path1",
  "app": "/your/entry/file/path2",
},
// 数组形式, 相当于在入口文件最前面import @babel/polyfill, 用于引入一些必要的包
entry: ["@babel/polyfill", "/your/entry/file/path"]
```

## output

`filename` 中 name 为入口文件的`key`, 字符串形式时 name 为 main, hash,chunkhash,contenthash 区别见[hash, chunkhash, contenthash 区别](#hash,chunkhash,contenthash)
`chunkFilename`针对的是那些间接引入的文件,即非 entry 指定的文件, 命名以`chunkFilename`为准, `[name]`为`splitChunks`归类的文件名

```js
output: {
  filename: '[name].[hash:8].js',
  path: '/your/output/directory',
  chunkFilename: '[name].chunk.js'
}
```

## loader

webpack 默认只支持解析 js 和 json 文件, loader 用于解析不同后缀名的文件, 对于同一种文件类型使用多个 loader 时遵从从数组右向左解析原则, 写在`module.rules`中, 这里看几个常用的 loader

### babel

用于将 ES6+新语法转化成 ES5 语法, 需要配合`@babel/preset-env`和`@babel/core`使用. 对于 Promise, Map,Set 等新的 api 还需安装`@babel/polyfill`, 然后在入口文件开始引入, 也可以通过 entry 数组形式引入

```js
{
  test: /\.js(x)$/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env']
      }
    }
  ]
}
```

### css

一般搭配这些 loader 一起使用,

1. `sass-loader`(optional)解析 sass 成 css,相应的有('less-loader', 'stylus-loader'),
2. `postcss-loader`为 css 加上产商前缀, 增强兼容性,
3. `css-loader`解析 css,
4. 还有三个根据环境及框架选一个使用, `style-loader`开发环境下使用, 将 css 通过`<style>`标签的方式引入 html, `vue-style-loader`解析 vue 模板中的 css, `MiniCssExtractPlugin.loader`生产环境下使用, 会将 css 文件单独打包,防止 html 文件过大

`postcss-loader`需要配合`autoprefixer`使用, 在当前项目根目录下新建`postcss.config.js`引入`autoprefixer`, 同时在`package.json`添加`browserslist`字段指定覆盖的浏览器, 新版本不支持直接内联在 webpack.config.js 中的写法

```js
// postcss.config.js
module.exports = {
  plugins: [require('autoprefixer')]
};

// package.json
"browserslist": [
  "defaults",
  "not ie < 11",
  "last 2 versions",
  "> 1%",
  "iOS 7",
  "last 3 iOS versions"
]
```

```js
{
  test: /\.(s)?css$/,
  use: [process.env.NODE_ENV === 'production' ? MinCssExtractPlugin.loader : 'style-loader', 'css-loade', 'postcss-loader', 'sass-loader']
}
```

如果要使用 `MinCssExtractPlugin` 需要下载插件并配置

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// ...省略上面的配置
plugin: {
  new MiniCssExtractPlugin({
    filename: '[name].[hash].css',
    chunkFilename: '[id].css'
  });
}
```

### 图片&多媒体

使用`url-loader`和`file-loader`, 两个 loader 区别在于`url-loader`在文件大小未超过设置的阈值时会将文件转化成 base64 编码, 可以使用`url-loader`, 超过阈值再使用`file-loader`

```js
{
  test: /\.(jpe?g|png|gif)$/i,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 1024 * 10,
        fallback: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[hash:8].[ext]'
          }
        }
      }
    }
  ]
}
```

### vue

`vue-loader`专门用于处理 vue 文件

```js
{
  test: /\.vue$/;
  use: ['vue-loader'];
}
```

### typescript

`ts-loader`专门用于处理 typescript 文件

```js
{
  test: /\.tsx?$/,
  use: ['ts-loader']
}
```

## optimization

这个字段可以配置一个对象, 这里介绍几个重要属性(后续补充)

### usedExports

开启 tree shaking, 去除未被 import 的逻辑.
对于例如.css 这类文件, 不存在具体 import 内容, webpack 默认也会把它 shake 掉, 需要配合`package.json`配置的`sideEffects`使用, `sideEffects`维护一个数组告诉 webpack 不要对其中的文件进行 shake
**在开发环境下(mode: 'development')下, 即使开启了 tree shaking**

```js
// webpack.config.js
optimization: {
  usedExports: true;
}
// package.json
{
  "sideEffects": ["*.css"]
}
```

### splitChunks

- type: `boolean`

开启 code splitting 代码分隔, 设想以下场景, 文件中引入 lodash(假设 1MB), 业务逻辑(假设 1MB), 如果不进行代码分隔, 每回业务逻辑发生改动都会构建出 2MB 的文件, 用户每次请求都要请求 2MB, 但实际上 lodash 逻辑并没有发生改变, 这就产生了不必要的开销, 所以可以通过代码分隔将文件进行拆分为两个文件(库文件+业务逻辑文件)
_tips:_
**魔法注释**: 异步 import 是可使用, 可以设定 preload/prefetch, chunkname 等配置, 参考[魔法注释](https://medium.com/the-song-of-silence/%E4%BD%BF%E7%94%A8-webpack-%E4%BB%A3%E7%A0%81%E5%88%86%E5%89%B2-%E5%92%8C-%E9%AD%94%E6%9C%AF%E6%B3%A8%E9%87%8A-%E6%8F%90%E5%8D%87%E5%BA%94%E7%94%A8%E6%80%A7%E8%83%BD-f9e45aeb08c9)

下面介绍一些重要属性(待添加)

#### chunks

- value: 'all' | 'async' | false
  `all`对同步异步的 import 都进行代码分隔, `async`则只对异步 import 进行代码分隔.
  但是如果`cacheGroup`组中未匹配且`default`为`false`, 则 `chunks`不会对该文件进行代码分隔

#### minSize

- value: number
  进行代码分隔的 import 包大小, 单位 Kb

#### maxSize

- value: number
  一般不配, 是对代码分隔的包进行二次拆分的阈值(如果可以), 单位 Kb

#### minChunks

- value: number
  最小引入次数, 即 如果 lodash 制备引入了一次则不进行代码分隔, 2 次+就会进行代码分隔

#### maxAsyncRequest

- value: number
  一般也不配, 最多对 X 个 import 包进行代码分隔, 假设引入了 10 个包, 只会对前 5 个包进行代码分隔

#### automaticNameDelimiter

- value: string
  **当未指定`cacheGroup`组中`filename`时**作为代码分隔生成文件名中间的连接符, 文件名命名规范为`${cacheGroups匹配组的key(未匹配默认为default)}${automaticNameDelimiter连接符(默认为~)}${当前文件所在entry的key}.js`(疑惑: 如果相同的库被不同 entry 引用?)

#### cacheGroup

`cacheGroup`的每一个属性都作为一个组, 对于每个组中`test`匹配到相同正则的 import 包会打包到相同的组.
对于没有匹配到的包, 默认兜底到 default 组中, 不配置`cacheGroup`时默认会存在一个匹配 node_modules 的 `vendors` 组.
`reuseExistingChunk`则是配置是否服用之前已经缓存的相同包内容.
对于匹配到多个组的包, 会根据 `priority`优先级大小分到优先级最高的组.

```js
cacheGroups: {
  defaultVendors: {
    test: /[\\/]node_modules[\\/]/,
    priority: -10,
    reuseExistingChunk: true,
    filename: 'vendors.js'
  },
  default: {
    priority: -20,
    reuseExistingChunk: true,
    filename: 'common.js'
  }
}
```

## resolve

### alias

import from 路径的别名, 例如`import Cmp from '@/components/home.vue`会被解析为`import Cmp from '/your/project/root/path/src/components/home.vue`.
如果项目中使用了 typescript, 要使用 alias 别名, 需要同时在`webpack配置文件`和`tsconfig.json`配置别名, 旨在`tsconfig.json`配置是不生效的.

```js
alias: {
  vue$: 'vue/dist/vue.runtime.esm.js',
  '@': path.resolve(__dirname, '../src')
}
```

### extensions

缺省后缀, import from 路径缺少后缀时, webpack 会在该目录下从左向右寻找符合的文件

```js
extensions: ['*', '.js', '.json', '.vue'],
```

### mainFiles

缺省文件名, 这回文件都不用写了.. import from 路径最后一级为目录时, webpack 会寻找目录下和 `mainFiles`匹配的文件名

```js
mainFiles: ['index', 'main'];
```

### devServer

暂时用的不多, 可以参考[webpack 开发服务器 devServer](https://webpack.docschina.org/configuration/dev-server/#devservercontentbase)

## Plugin

### HtmlWebpackPlugin

入口文件要挂载的 html 路径, 配置`new HtmlWebpackPlugin`默认会将 entry 所有入口文件都引入 html, 生成单页面, 如果要生成多页面只需配置多个`new HtmlWebpackPlugin`并且配置对应的 chunk 即可

```js
// ...省略其他配置
[
  new HtmlWebpackPlugin({
    template: '/your/template/html/file/path',
    filename: 'index.html',
    // 忽略此项则全部引入
    chunks: ['app']
  }),
  new HtmlWebpackPlugin({
    template: 'your/template/html/file/path',
    filename: 'main.html',
    chunks: ['main']
  })
];
```

### CleanWebpackPlugin

每次构建时先清空 output 目录上次构建的产物, 保证 output 目录构建产物都是最新的
`const {CleanWebpackPlugin} = require('clean-webpack-plugin')`

```js
new CleanWebpackPlugin();
```

### MiniCssExtractPlugin

上面已经描述过了, 用于生产环境下剥离 css 文件, 降低耦合
`const MiniCssExtractPlugin = require('mini-css-extract-plugin')`

```js
new MiniCssExtractPlugin({
  filename: '[name].[hash].css', // 有指定entry的output文件名
  chunkFilename: '[id].css' // 未指定entry的output文件名
});
```

### VueLoaderPlugin

`const {VueLoaderPlugin} = require('vue-loader')`

```js
new VueLoaderPlugin();
```

### HotModuleReplacementPlugin

内置插件, 热更新

```js
new webpack.HotModuleReplacementPlugin();
```

### ProvidePlugin

当在文件中使用了插件中配置的库或者库函数时, webpack 会自动引入

```js
new webpack.ProvidePlugin({
  // 自动引入jquery
  $: 'jquery',
  // 自动引入lodash库中join方法
  _join: ['lodash', 'join']
});
```

### DllReferencePlugin & DllPlugin(已被 vue 和 react 废弃)

**虽然被废弃了, 但还是写一下 orz, 推荐使用 HardSourceWebpackPlugin**

上面说到 code splitting 可以通过`splitChunks`实现, 但对于库文件, 大部分时候是 不会更改的, 而 webpack 每次打包时都会根据`splitChunks`配置打包库文件, 这其实是没有必要的, 所以可以单独配置`webpack.dll.js`文件, 用于打包库文件, 这样第一次打包后后续打包就不会再次打包库文件了

**DllPlugin 作用于 dll 文件**, 用于生成 manifest 文件作为打包前后库文件的映射, 后续打包时 webpack 检测
`webpack.dll.js`其实就是一个 webpack 配置文件, 只不过针对的对象不同. 这里给出一个`webpack.dll.js`的配置 demo.

```js
module.exports = {
  mode: 'production',
  // entry为需要打包的库文件名
  entry: ['react', 'react-dom', 'lodash'],
  // output的library是打包后库的名称
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, './dll'),
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name].manifest.json',
      path: path.resolve(__dirname, './dll')
    })
  ]
};
```

**DllReferencePlugin 作用于 webpack.config.js**, 通过比对 manifest.json 映射文件不进行打包命中的库文件

```js
new webpack.DllReferencePlugin({
  // 传入映射文件
  manifest: path.resolve(__dirname, '../dll/vendors.manifest.json')
});
```

### AddAssetHtmlWebpackPlugin

将资源文件插入 html 中, 作用于`HtmlWebpackPlugin`之后, 上面说的 dll 打包的库文件就可以这样引入

```js
new AddAssetHtmlWebpackPlugin({
  filepath: path.resolve(__dirname, '../bundle.dll.js')
});
```

## common development production

可以新建`webpack.dev.js`和`webpack.prod.js`分别存储开发环境和生产环境的配置, 最后通过`webpack.common.js`存储通用配置并且通过判断当前环境输出最终配置.
webpack 除了可以输出对象, 也可以输出函数, 参数为环境变量, 函数返回配置对象

```js
const merge = require('webpack-merge');
// 省略其他配置
// webpack --env.production --config webpack.config.js
// 此时env就存在production属性, 也可以指定production的值(--env.production=nxx)
module.exports = (env) => {
  if (env && env.production) {
    return merge(commonCfg, prodCfg);
  } else {
    return merge(commonCfg, devCfg);
  }
};
```

## hash,chunkhash,contenthash

`hash`表示整个构建产物的 hash 值, 多文件入口中即使只修改了一个文件, 另一个文件未作修改, hash 值也会发生改变, 多文件构建产物的 hash 值都是一样的

`chunkhash`顾名思义,表示块的 hash 值,即单独入口文件构建产物 hash 值, 互相不影响, 但是如果一个 js 文件中引入了 css 文件, 当 css 文件发生变化时, 该 js 文件的 hash 值也会发生改变, 多文件构建产物的 hash 值不影响

`contenthash`则是在`chunkhash`的基础上忽略文件中引入 css 文件产生的变化, 仅在自身内容发生变化时改变 hash 值
详情参考[segmentfault](https://segmentfault.com/a/1190000020104777)

```

```

---
layout: post
title: fetch获取线上图片引发的思考
date: 2020-03-16
author: Mariana
header-img: /dev.azure.com/HealMSlin/8544be09-1224-4eb0-824b-90c4ec9d49ee/_apis/git/repositories/7a27a721-4c93-4ecf-8258-d5422217b60a/items?path=%2F1621390808197_589.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=master&resolveLfs=true&%24format=octetStream&api-version=5.0
catalog: true
tags:
  - 前端
  - ajax
---

# 背景

起因是想下载一个套图但是貌似要 VIP 会员才能下载的样子,于是抱着侥幸的心理点开 F12 看了一眼,发现居然 src 就是图片的真实 uri,并且整个套图文件名数字是累加的, 嘴角疯狂上扬的同时决定写个脚本白嫖一下.

# 实现过程

该过程主要还是对 `fetch` 这个 api 的探究, 使用了能够运行在 node 中的`node-fetch`, 以下三种方法对图片音频进行下载测试均正常

## stream

使用`fetch`返回的是一个`Promise`对象且`resolve`状态下的`res.body`是一个`readablestream`可读流,可以直接利用管道接到创建的可写流中.

```javascript
fetch(url).then(res => {
  return new Promise((resolve, reject) => {
    const dest = fs.createWriteStream(path.resolve(__dirname, "./images", `${no}-0${num}.jpg`))
    res.body.pipe(dest)
    res.body.on("end", resolve)
    res.body.on("error", reject)
  })
})
```

## buffer()

利用`node-fetch`相较浏览器`fetch`特有的 buffer()方法

```javascript
fetch(url)
  .then(res => res.buffer())
  .then(image => {
    fs.writeFile(path.resolve(__dirname, "./images", `${no}-0${num}.jpg`), image, function(err) {
      console.log(err)
    })
  })
```

## arrayBuffer()

我们知道 node 中传输二进制数据需要通过`buffer`进行存储, 而 fetch 只提供了`res.arrayBuffer()`的方法, 所以在使用`arrayBuffer()`后还需要使用`Buffer.from`将`arrayBuffer`转化为`buffer`,这也是第二种方法简化的操作

```javascript
fetch(url)
  .then(res => res.arrayBuffer())
  .then(image => {
    fs.writeFile(path.resolve(__dirname, "./images", `test-${no}-0${num}.jpg`), Buffer.from(image), function(err) {
      console.log(err)
    })
  })
```

**到这里已经对于获取远程文件的方法已经讲完了,下面是个人对其中不理解的部分的笔记**

# `fetch` 对比 `ajax`

之前一直觉得 fetch 与 \$.ajax,axios 一样,对上面案例实践后发现还是自己菜了.
根据 MDN 上的描述:

> Fetch API 提供了一个 JavaScript 接口，用于访问和操纵 HTTP 管道的一些具体部分，例如请求和响应。它还提供了一个全局 fetch() 方法，该方法提供了一种简单，合理的方式来跨网络异步获取资源。这种功能以前是使用 XMLHttpRequest 实现的。

也就是说 fetch 实际上是在`Promise`出现来解决`callback hell`前提下的一个新的异步获取资源的方案.
而 `fetch`与传统 ajax 的区别是

- 除非出现网络故障或请求被阻止的情况下, `fetch`会将`Promise`状态置为`reject`,其余像响应状态码`404`,`500`, `fetch`都会将状态标记为`resolve`,但会将`resolve`的响应对象的`ok`属性置为`false`
- `fetch`不会接收跨域的`cookie`,即跨域响应头中的`set-cookie`将被忽略
- `fetch`默认不会跨域时发送`cookie`,(ajax 也是一样的), 默认`fetch`的`credentials`为`same-origin`

## `fetch` 跨域

fetch 跨域需要后端配合`CORS`,后端需要对以下响应头字段进行设置,否则会报错

```js
// Koa框架设置响应头
ctx.set("Access-Control-Allow-Origin", "*")
ctx.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
ctx.set("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
```

之后,`fetch`设置`fetch(url, {mode: 'cors'})`即可进行跨域
若设置为`{mode: 'no-cors'}`, `fetch`不会进行报错,但会把`Promise`的`resolve`会返回`ok: false, type: 'opaque'`表明你没有权限访问
![resolve内容](https://pic1.zhimg.com/80/v2-5bbd2fc2f90d8c5b3755616e5dd449bb_720w.jpg)

- Q: 提问! 后端没有提供`CORS`, `fetch`需要怎么跨域?
- A: 那就不要使用`fetch api`, 建议`JSONP`.

# arrayBuffer, Buffer, typedArray

对于`arrayBuffer`与`typedArray`都属于二进制数组,对于详细内容可以参考掘金的这篇文章:
[掘金文章](https://juejin.im/post/5cde6dae6fb9a07eda02e5f1)
这里做简述:

```js
let a1 = new ArrayBuffer(4)
// 这里创建了四个格子, 一个格子一个字节
let u1 = new Uint8Array(a1)
// 这里就利用arraybuffer创建了一个typedArray, 由于数组的每个元素同样是8bit1个字节, 所以输出为[0,0,0,0]
u1.buffer === a1
// true
// 而通过typedArray.buffer方法又能够的到ArrayBuffer
```

下面这张图也能看出两者的关系:
![arrayBuffer](/img/2020-03-16-fetch-and-ajax/arraybuffer.png)

## Buffer 与 TypedArray

编写脚本时便有一个困扰,`Buffer`与`arrayBuffer`有啥关系? 这里记录一下.

- `Buffer`是对`Uint8Array`的实现
  `Buffer`对`Uint8Array`的相关 API 进行了实现,但 node 对`Buffer`类进行了优化,使之更适合在 node 下运行
- `Buffer`并不是完全兼容`TypedArray`实现
  `Buffer`同样是一个`Uint8Array`类型数组实例。但它与 ES6 中的类型数组规范并不完全兼容，如：`ArrayBuffer#slice()`会创建一个分隔部分数据的拷贝，而 `Buffer#slice()`会创建一个从 Buffer 中拷贝数据的视图，相对来说 `Buffer#slice()`更高效。
- `Buffer`可以与类型数组共享内存区
  可以从`TypedArray`的`.buffer`属性或`new ArrayBuffer()`创建一个 Buffer 对象。该对象会与类型数组共享内存区：

```js
const arr = new Uint16Array(2)
arr[0] = 5000
arr[1] = 4000

const buf1 = Buffer.from(arr) // 复制 buffer, 开辟新内存区
const buf2 = Buffer.from(arr.buffer) // 与 arr 共享内存空间

console.log(buf1) // <Buffer 88 a0>，由于Buffer'等同于'Uint8Array所以对于16bit的类型数组,会截取8bit
console.log(buf2) // <Buffer 88 13 a0 0f>
```

回到开头那个困扰, 除了底层规范不完全兼容, 我们可以以`Uint8Array`来看待`Buffer`,并可以通过`Buffer.buffer`的方式获得`ArrayBuffer`.

# 延伸的实践

谈了那么多关于二进制数据的话题,现在对掘金文章中的一些小案例进行一下实践

## 获取远程图片并转换为 base64 格式

to be continue...

# reference

[MDN fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)

[知乎 fetch 如何跨域](https://www.zhihu.com/question/47029864)

[fetch 从 URL 提取 Blob 并写入文件](https://stackoom.com/question/3TrAt/%E4%BB%8EURL%E6%8F%90%E5%8F%96Blob%E5%B9%B6%E5%86%99%E5%85%A5%E6%96%87%E4%BB%B6)

[Node.js Buffer 与 JavaScript TypeArray 类型数组的异同](https://itbilu.com/nodejs/core/NyIjmp0wZ.html)

[前端处理后端接口传递过来的图片文件](https://juejin.im/post/5c98ed7cf265da610e5ed862#heading-9)

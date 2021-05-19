---
layout: post
title: 浅谈script中的defer与async属性
date: 2020-03-14
author: Mariana
header-img: /dev.azure.com/HealMSlin/8544be09-1224-4eb0-824b-90c4ec9d49ee/_apis/git/repositories/7a27a721-4c93-4ecf-8258-d5422217b60a/items?path=%2F1621390800701_9396.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=master&resolveLfs=true&%24format=octetStream&api-version=5.0
catalog: true
tags:
  - 前端
  - javascript
---

## 背景

个人学习简单记录, 不喜误喷, 有错误麻烦指正, 具体细节直接底部 reference, 感谢.

## script

1. 占据主线程, html parser 处于阻塞状态
2. 并行下载多个 js 文件
3. 下载完成后顺序执行

![script](https://www.growingwiththeweb.com/images/2014/02/26/script.svg)

## script with defer

1. 与 html parser 同时进行
2. 并行下载多个 js 文件
3. `DOMContentLoaded`事件触发前顺序执行

![defer](https://www.growingwiththeweb.com/images/2014/02/26/script-defer.svg)

### DOMContentLoaded

MDN 中是这么解释的:

> The `load` event is fired when the whole page has loaded, including all dependent resources such as stylesheets and images. This is in contrast to `DOMContentLoaded`, which is fired as soon as the page DOM has been loaded, without waiting for resources to finish loading.

也就是说`DOMContentLoaded`只要 DOM 树解析完成就会触发, 而`load`事件会继续等待样式,图片等资源解析完毕后触发.

## script with async

1. 与 html parser 同时进行
2. 并行下载多个 js 文件
3. 下载完成后阻塞 html parser, 开始执行
4. 执行不一定是顺序的,所以禁止脚本间存在依赖

![async](https://www.growingwiththeweb.com/images/2014/02/26/script-async.svg)

## Summary

1. 存在多个 js 文件时都会并行下载
2. defer 与 async 下载 js 与解析 html 同时进行
3. defer 在`DOMContentLoaded`触发前执行 js, async 则在下载结束后立即执行
4. defer 顺序执行 js 文件, async 则先下载完的先执行

## reference

[async vs defer attributes](https://www.growingwiththeweb.com/2014/02/async-vs-defer-attributes.html)
[浏览器的渲染引擎](https://www.cnblogs.com/wuguanglin/p/JSAndImgLoadOrder.html)

## negative example

贴一下 google 中找到的反面教材
**async 是会影响到页面解析的**
[彻底搞懂 async & defer](https://github.com/xiaoyu2er/blog/issues/8)

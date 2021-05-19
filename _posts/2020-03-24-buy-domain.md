---
layout: post
title: 购买域名及本地调试博客
date: 2020-03-24
author: Mariana
header-img: /dev.azure.com/HealMSlin/8544be09-1224-4eb0-824b-90c4ec9d49ee/_apis/git/repositories/7a27a721-4c93-4ecf-8258-d5422217b60a/items?path=%2F1621390819129_2937.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=master&resolveLfs=true&%24format=octetStream&api-version=5.0
catalog: true
tags:
  - 博客
---

# 背景

事情大概是这样, 做毕设需要用到图床, 于是用了七牛云图床, 然后发现可以自定义的加速域名, 于是就打算整个域名玩玩. 然后发现不能备案, 再然后 emmm 决定曲线救国给博客安个域名.

# 绑定域名

## 购买域名

我是在阿里云的万网上购买的,搜索自己喜欢的域名,点击结算.
![结算](/img/2020-03-24-buy-domain/buy-domain-process1.png)
如果是初次购买需要填写一下默认的个人信息模板,大概过半天阿里会审核完成,我这里已经审核完成通过了.
![模板](/img/2020-03-24-buy-domain/buy-domain-process2.png)

## 域名解析

买完域名后就要把域名映射到博客的域名,我这里是映射到 mariana-yui.github.io
点击解析
![解析](/img/2020-03-24-buy-domain/buy-domain-process3.png)
点击添加记录, 记录类型选择 CNAME(域名映射域名), 然后输入自定义二级域名, 记录值输入指向的博客域名, 点击确定.
![记录](/img/2020-03-24-buy-domain/buy-domain-process4.png)

## 博客配置文件

域名映射还没完, 还需要在 mariana-yui.github.io 新建`CNAME`配置文件, 添加域名 `blog.mariana.fun`

![配置](/img/2020-03-24-buy-domain/buy-domain-process5.png)

然后在 `Setting` 中看到 `GitHub Pages` 如图说明成功了.

![git pages](/img/2020-03-24-buy-domain/buy-domain-process6.png)

大概还需要过个 10 来分钟就能通过自定义的域名来访问博客了~

![blog](/img/2020-03-24-buy-domain/buy-domain-process7.png)

# 本地查看博客

曾经也是本地改改 push 上去看效果不断 loop, 现在看看真是 nt 行为(笑)
博客是`Ruby`系`jekyll`搭建的, 所以以下操作适用于(**linux 系统**)`jekyll`:

1. 安装 ruby 依赖: `sudo apt install ruby-full ruby-bundler`
2. 安装 jekyll, 安装时间可能比较长: `sudo gem install jekyll`
3. 安装完成后查看是否成功: `jekyll -v`
4. 启动本地服务: `jekyll serve`

## 报错解决

**Q**: `Deprecation: You appear to have pagination turned on, but you haven't included the`jekyll-paginate`gem. Ensure you have`plugins: [jekyll-paginate]`in your configuration file.`
**A**: 

1. `sudo gem install jekyll-paginate`
2. 在`_config.yml`添加:
   ![解决报错](/img/2020-03-24-buy-domain/solve-error.png)

**Q**: `Liquid Warning: Liquid syntax error (line 38): Unexpected character { in "tag[1].size > {{site.featured-condition-size}}" in /_layouts/page.html`
**A**: Liquid模板语法的问题,将`tag[1].size > {{site.featured-condition-size}}` 修改为 `tag[1].size > site.featured-condition-size`就ok了

然后就正常啦~
![blog](/img/2020-03-24-buy-domain/buy-domain-process8.png)

# reference

[域名绑定博客](https://blog.csdn.net/Maple_ROSI/article/details/79629531)

[jekyll 本地调试博客](https://blog.csdn.net/yaakire/article/details/78932528?depth_1-utm_source=distribute.pc_relevant.none-task&utm_source=distribute.pc_relevant.none-task)

[解决报错1](https://github.com/ValchanOficial/valchan/issues/1)

[解决报错2](https://github.com/Huxpro/huxpro.github.io/issues/105)
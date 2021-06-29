---
layout: post
title: 解决git push时the requested upstream branch 'origin/main' does not exist
date: 2021-06-29
author: Mariana
header-img: /dev.azure.com/HealMSlin/8544be09-1224-4eb0-824b-90c4ec9d49ee/_apis/git/repositories/7a27a721-4c93-4ecf-8258-d5422217b60a/items?path=%2F1624955986822_5957.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=master&resolveLfs=true&%24format=octetStream&api-version=5.0
catalog: true
tags:
  - git
---

# 背景

本地文件夹未关联远程仓库, 在 github 新建仓库后,远程仓库也有文件
本地仓库关联远程仓库
`git branch --set-upstream-to=origin/main master`
会出现
![](https://dev.azure.com/HealMSlin/8544be09-1224-4eb0-824b-90c4ec9d49ee/_apis/git/repositories/7a27a721-4c93-4ecf-8258-d5422217b60a/items?path=%2F1624955303018_9856.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=master&resolveLfs=true&%24format=octetStream&api-version=5.0)

# 解决流程

1. `git remote add origin 远程仓库地址`
2. `git pull origin master --allow-unrelated-histories`
3. `git branch --set-upstream-to=origin/main master`
4. `git push`

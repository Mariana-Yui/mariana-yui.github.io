---
layout: post
title: VScode代码规范
subtitle: 利用editorconfig, prettier, eslint
date: 2020-01-20
author: Mariana
header-img: /dev.azure.com/HealMSlin/8544be09-1224-4eb0-824b-90c4ec9d49ee/_apis/git/repositories/7a27a721-4c93-4ecf-8258-d5422217b60a/items?path=%2F1621390787183_7251.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=master&resolveLfs=true&%24format=octetStream&api-version=5.0
catalog: true
tags:
  - 前端
  - vscode
---

## 背景

马上就要大学毕业工作了，实习过程中意识到自己以前一直不在意的团队协作中的代码规范重要性。现在整理一下供以后温习，写的很随意，仅供参考。

## vscode 中的 editorconfig, prettier, eslint

三者是渐进的过程。  
editorconfig 配置编码时的代码风格，prettier 配置编码后的保存时的规范，eslint 和 prettier 类似，但 prettier 不会仅仅是定义规范，不会对不符合规范的代码抛出错误或警告，eslint 则会检查语法，在例如变量未定义时抛出错误。

## editorconfig 配置

1. 安装 editorconfig 包 `npm install -g editorconfig`
2. 安装 vscode 扩展 `ext install EditorConfig`
3. 在项目根目录新建.editorconfig 文件

配置参考：

```sh
# This is the top-most .editorconfig file (do not search in parent directories)
root = true

### All files
[*]
# Force charset utf-8
charset = utf-8
# Indentation
indent_style = tab
indent_size = 4
# line breaks and whitespace
insert_final_newline = true
trim_trailing_whitespace = true
# end_of_line = lf

### Frontend files
[*.{css,scss,less,js,json,ts,sass,php,html,hbs,mustache,phtml,html.twig}]

### Markdown
[*.md]
indent_style = space
indent_size = 4
trim_trailing_whitespace = false

### YAML
[*.yml]
indent_style = space
indent_size = 2

### Specific files
[{package,bower}.json]
indent_style = space
indent_size = 2
```

## prettier 配置

1. 安装 prettier 包 `npm install -g prettier`
2. 安装 prettier for vscode 插件
3. 新建.prettierrc.js 文件

配置参考：全部参数[here](https://prettier.io/docs/en/configuration.html)

```js
// prettier.config.js or .prettierrc.js
module.exports = {
  // 一行最多 100 字符
  printWidth: 100,
  // 使用 4 个空格缩进
  tabWidth: 4,
  // 不使用缩进符，而使用空格
  useTabs: false,
  // 行尾需要有分号
  semi: true,
  // 使用单引号
  singleQuote: true,
  // 对象的 key 仅在必要时用引号
  quoteProps: "as-needed",
  // jsx 不使用单引号，而使用双引号
  jsxSingleQuote: false,
  // 末尾不需要逗号
  trailingComma: "none",
  // 大括号内的首尾需要空格
  bracketSpacing: true,
  // jsx 标签的反尖括号需要换行
  jsxBracketSameLine: false,
  // 箭头函数，只有一个参数的时候，也需要括号
  arrowParens: "always",
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // 使用默认的折行标准
  proseWrap: "preserve",
  // 根据显示样式决定 html 要不要折行
  htmlWhitespaceSensitivity: "css",
  // 换行符使用 lf
  endOfLine: "lf"
};
```

### vscode 中集成 prettier

```json
{
  "files.eol": "\n",
  "editor.tabSize": 4,
  // 与files.autoSave: "afterDelay"冲突
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```
### update
- 2020-03-28 使用配置文件的场合将vscode的默认选项屏蔽一下,否则可能有冲突, 具体: 在`setting.json`末尾加上`"prettier.requireConfig": true`(使用配置文件格式化) 

## js 中 eslint 配置

1. 安装 eslint 包 `npm install -g eslint` 或 `npm install --save-dev prettier`
2. 初始化 eslint 文件 `eslint --init`, 这里我选择 json 文件 eslint 不生效不知道为什么，换成 js 文件就好了。
3. 配置 .eslintrc.js 文件

配置参考：

```js
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    sourceType: "module"
  },
  rules: {
    indent: ["error", "tab"],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "single"],
    semi: ["error", "never"]
  }
};
```

## Typescript 中 eslint 配置

### 2019.1 开始 TS 官方不再使用 tslint，建议使用 eslint 进行代码规范

1. 在项目中安装 eslint `npm install --save-dev eslint`
2. eslint 无法识别 ts 的部分语法，安装 ts 的解析器替换默认解析器 `npm install --save-dev typescript @typescript-eslint/parser`
3. 安装对 eslint 默认规则补充的包 `npm install --save-dev @typescript-eslint/eslint-plugin`
4. 新建.eslintrc.js 文件(不知道为啥 json 文件没效果)
   配置如下:

```js
module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    // 禁止使用 var
    "no-var": "error",
    // 优先使用 interface 而不是 type
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"]
  }
};
```

### 遇到`ImportDeclaration should appear when the mode is ES6 and in the module context`报错，在.eslintrc.js 中加入以下配置：

```js
parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
        modules: true
    }
}
```

### vscode 中集成 eslint 检查并在保存时自动修复

在`setting.json`文件中加入对 ts 的检查

```json
{
  // instead of "eslint.autoFixOnSave": true
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  // autoFix默认开启
  "eslint.validate": ["javascript", "javascriptreact", "typescript"],
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### (精)使用 AlloyTeam 的 ESLint 配置

alloy 团队的 eslint 配置去掉了糟粕，并且不再包含代码格式的规则，把其交给更专业的 prettier

1. 安装`npm install --save-dev eslint typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-alloy`
2. 添加配置如下：(可以将 parser 和 plugin 去掉了)

```js
module.exports = {
  extends: ["alloy", "alloy/typescript"],
  env: {
    // 您的环境变量（包含多个预定义的全局变量）
    // Your environments (which contains several predefined global variables)
    //
    // browser: true,
    // node: true,
    // mocha: true,
    // jest: true,
    // jquery: true
  },
  globals: {
    // 您的全局变量（设置为 false 表示它不允许被重新赋值）
    // Your global variables (setting to false means it's not allowed to be reassigned)
    //
    // myGlobal: false
  },
  rules: {
    // 自定义您的规则
    // Customize your rules
  }
};
```
## Vue with Typescript
建议直接使用官方提供的脚手架, 引用官网的一句话:
> The most rules of eslint-plugin-vue require vue-eslint-parser to check `<template>` ASTs.

由于vue是html+ts的特殊模板文件性质,使上述的`ts`扩展无法对`.vue`进行解析, 我尝试配置发现各种各样的问题,还是官方脚手架一键操作简单,只能说..真香

1. 安装脚手架`vue-cli`
```
    npm install -g @vue/cli @vue/cli-service-global
    # or
    yarn global add @vue/cli @vue/cli-service-global
```
2. 新建项目`vue create your-project-name`, 放个配置例子
![1](/img/2020-01-16/1.png)
![2](/img/2020-01-16/2.png)
3. 加入上述的`.editorconfig`和`.prettierrc.js`文件, 就可以愉快地用`ts`开发`vue`了.

### node-sass ?? dart-sass ??
由于`node-sass`使用C++开发, 安装`node-sass`可能会遇到卡死/下载失败等问题(博主也遇到了), 官方现在也推荐使用`dart-sass`


参考资料：  
[editorconfig vs prettier vs eslint](https://stackoverflow.com/questions/48363647/editorconfig-vs-eslint-vs-prettier-is-it-worthwhile-to-use-them-all)  
[editorconfig 配置](https://stackoverflow.com/questions/46846128/editorconfig-for-vs-code-not-working)  
[prettier 配置](https://www.robinwieruch.de/how-to-use-prettier-vscode)
[eslint 配置](https://segmentfault.com/a/1190000009077086)  
[eslint 中 js 规范配置参考](https://juejin.im/post/5cd3f035e51d456e6479b538#heading-4)  
[ImportDeclaration should appear when the mode is ES6 and in the module context 报错解决](https://github.com/eslint/eslint/issues/4344)
[typescript 配置代码规范](https://ts.xcatliu.com/engineering/lint)

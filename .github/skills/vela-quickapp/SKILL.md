---
name: vela-quickapp
description: 'Create, build, and debug Xiaomi Vela JS applications (快应用). Use when: creating new Vela quickapp projects; building .rpk packages; writing UX template files; configuring manifest.json; developing for Xiaomi smartwatch/wearable devices; working with aiot-toolkit CLI; debugging Vela app compilation errors. DO NOT use for: general web development; React/Vue/Angular projects; native C/C++ Vela OS development.'
argument-hint: '[action: create|build|debug|explain] [topic]'
---

# Xiaomi Vela JS Application Development

## Overview

Xiaomi Vela JS 应用是一种基于 Xiaomi Vela OS 的轻量级应用，面向智能穿戴设备（手表等）。采用前端 MVVM 开发范式，使用 JavaScript + 类 HTML 模板 + CSS 样式。

## Project Structure

```
project-root/
├── src/
│   ├── manifest.json          # 必需：应用配置
│   ├── app.ux                 # 必需：应用入口
│   ├── pages/
│   │   ├── index/
│   │   │   └── index.ux       # 主页面
│   │   └── detail/
│   │       └── detail.ux      # 其他页面
│   ├── common/                # 公共资源（注意小写）
│   │   ├── style.css
│   │   ├── utils.js
│   │   └── icon.png
│   └── i18n/                  # 可选：多语言
│       ├── defaults.json
│       └── zh-CN.json
├── sign/                      # 签名文件（release 模式需要）
│   ├── private.pem
│   └── certificate.pem
├── package.json
└── build.js                   # 构建脚本
```

## manifest.json (Required Fields)

```json
{
  "package": "com.example.appname",
  "name": "应用名称",
  "icon": "/common/icon.png",
  "versionName": "1.0",
  "versionCode": 1,
  "minAPILevel": 1,
  "features": [],
  "config": {
    "logLevel": "log",
    "designWidth": 480
  },
  "router": {
    "entry": "pages/index",
    "pages": {
      "pages/index": { "component": "index" }
    }
  },
  "display": {
    "backgroundColor": "#ffffff"
  }
}
```

### Critical Rules
- `config` 字段是**必需的**，缺少会导致构建失败
- `router.entry` 和 `router.pages` 的 key 必须与 `src/` 下的目录路径一致
- `component` 值必须与 `.ux` 文件名一致（不含扩展名）
- `icon` 路径使用绝对路径（以 `/` 开头），指向 `src/` 下的资源
- `designWidth` 根据目标设备设置（手表常用 480）

## UX File Syntax

每个页面由一个 `.ux` 文件定义，包含三个部分：

```html
<template>
  <!-- 只能有一个根节点 -->
  <div class="page">
    <text>{{message}}</text>
  </div>
</template>

<style>
  .page {
    flex-direction: column;
    align-items: center;
  }
</style>

<script>
  export default {
    private: {
      message: 'Hello Vela'
    }
  }
</script>
```

### Template 语法

| 特性 | 语法 | 示例 |
|------|------|------|
| 数据绑定 | `{{variable}}` | `<text>{{title}}</text>` |
| 事件绑定 | `onclick="fn"` 或 `@click="fn"` | `<div @click="handleTap">` |
| 列表渲染 | `for="{{list}}"` | `<div for="{{items}}" tid="id">` |
| 条件渲染 | `if/elif/else` | `<text if="{{show}}">` |
| 显示隐藏 | `show="{{visible}}"` | `<div show="{{visible}}">` |

### 列表渲染详细

```html
<div for="{{list}}" tid="uniqueId">
  <text>{{$idx}}: {{$item.name}}</text>
</div>

<!-- 自定义变量名 -->
<div for="{{(index, item) in list}}">
  <text>{{index}}: {{item.name}}</text>
</div>
```

`tid` 属性指定数组元素唯一标识，优化渲染性能。必须保证该属性值在每个元素中唯一。

### Style 语法

- 类似 CSS，使用 Flexbox 布局
- 单位为 `px`（逻辑像素，框架自动适配不同屏幕）
- 支持 `class` 和 `style` 属性
- `style` 可以是 string 或 object

### Script 语法

```javascript
import router from '@system.router'

export default {
  // 页面私有数据（不可被覆盖）
  private: {
    title: '页面标题',
    list: []
  },

  // 生命周期
  onInit() { /* 页面初始化 */ },
  onReady() { /* 页面渲染完成 */ },
  onShow() { /* 页面显示 */ },
  onHide() { /* 页面隐藏 */ },
  onDestroy() { /* 页面销毁 */ },

  // 自定义方法
  handleClick() {
    router.push({ uri: '/pages/detail' })
  }
}
```

## Build Process

### 安装依赖

```bash
npm install  # 安装 aiot-toolkit
```

### 构建命令

```bash
# 开发模式（生成 .debug.rpk）
npx aiot build

# 生产模式（生成 .release.rpk，需要 sign/ 下的签名文件）
npx aiot release
```

### 构建产物

- `dist/` — 最终 rpk 文件
- `build/` — webpack 编译中间产物
- `.temp_<project>/` — 临时构建目录

### 生成签名文件（release 模式）

```bash
openssl req -newkey rsa:2048 -nodes \
  -keyout sign/private.pem \
  -x509 -days 3650 \
  -out sign/certificate.pem \
  -subj "/CN=appname/O=Example/C=CN"
```

## Common Pitfalls & Solutions

| 错误 | 原因 | 解决 |
|------|------|------|
| `must have required property 'config'` | manifest.json 缺少 config 字段 | 添加 `"config": {"logLevel": "log", "designWidth": 480}` |
| `path does not exist` | router 路径与实际目录不匹配 | 确保 router.entry/pages key 与 src/ 下路径一致 |
| `Compilation failed` | component 名与 ux 文件名不匹配 | component 值必须是 ux 文件名（不含 .ux） |
| 资源文件找不到 | 大小写不匹配 | Windows 不区分大小写，但 Vela 内部可能区分，统一用小写 |
| 导入的 css 中图片路径失效 | 被导入文件的相对路径在编译后失效 | 使用绝对路径如 `/common/img.png` |

## File Path Rules

| 类型 | 路径方式 | 示例 |
|------|----------|------|
| 导入代码文件 | 相对路径 | `import util from '../common/utils'` |
| 引用资源文件 | 相对路径 | `src="./logo.png"` |
| manifest 中的资源 | 绝对路径 | `"icon": "/common/icon.png"` |
| CSS 中引用资源 | url() + 绝对路径 | `background: url(/common/bg.png)` |

## API & Components

- **UI 组件**: `<div>`, `<text>`, `<image>`, `<input>`, `<list>`, `<list-item>`, `<switch>`, `<slider>` 等
- **系统接口**: 通过 `features` 在 manifest.json 中声明后使用
  - `system.router` — 页面路由
  - `system.fetch` — 网络请求
  - `system.storage` — 本地存储
  - `system.device` — 设备信息

## References

- [官方文档](https://iot.mi.com/vela/quickapp/zh/guide/)
- [UI 组件](https://iot.mi.com/vela/quickapp/zh/components/)
- [JS 接口](https://iot.mi.com/vela/quickapp/zh/features/)
- [AIoT-IDE 下载](https://iot.mi.com/vela/quickapp/zh/guide/start/use-ide.html)

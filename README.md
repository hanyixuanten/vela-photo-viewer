# Xiaomi Vela JS 照片查看器应用

这是一个基于 Xiaomi Vela JS 应用框架的照片查看器应用。

## 项目结构

```
src/
├── manifest.json          # 应用配置文件
├── app.ux                 # 应用入口文件
├── pages/
│   └── index/
│       └── index.ux       # 主页面
├── common/
│   ├── style.css          # 公共样式
│   └── utils.js           # 公共工具函数
└── common/
    ├── icon.png           # 应用图标
    ├── photo1.png         # 示例照片1
    ├── photo2.png         # 示例照片2
    └── photo3.png         # 示例照片3
```

## 开发说明

### 环境要求

- Node.js 14+
- npm
- 系统安装了 OpenSSL（release 模式需要）

### 安装依赖

```bash
npm install
```

### 构建 rpk 文件

**开发模式构建**（生成 `.debug.rpk`）：
```bash
npm run build
```
或直接：
```bash
node build.js
```

**生产模式构建**（生成 `.release.rpk`，需要签名文件）：
```bash
npm run build:release
```

构建成功后，rpk 文件会输出到 `dist/` 目录。

### 运行应用

1. 使用 AIoT-IDE 打开项目
2. 启动模拟器
3. 运行项目查看效果

或使用命令行：
```bash
npm start
```

## 应用特点

- 轻量化：适合智能穿戴设备
- 跨平台兼容性：支持多种设备
- 高性能渲染：流畅的动画和交互
- 安全性能：三重隔离机制保护数据安全

## 开发语法

Xiaomi Vela JS 应用采用以下语法：

### 模板语法（template）
- 数据绑定：`{{variable}}`
- 事件绑定：`onclick="handler"` 或 `@click="handler"`
- 列表渲染：`for="{{list}}"`
- 条件渲染：`if="{{condition}}"`、`elif="{{condition}}"`、`else`

### 样式语法（style）
- 类似 CSS 的样式定义
- 支持 Flexbox 布局
- 单位为 px

### 脚本语法（script）
- 使用 JavaScript 语言
- 支持 MVVM 开发范式
- 数据与视图自动同步

## 参考文档

- [Xiaomi Vela JS 应用概述](https://iot.mi.com/vela/quickapp/zh/guide/)
- [开发语法](https://iot.mi.com/vela/quickapp/zh/guide/framework/)
- [UI 组件](https://iot.mi.com/vela/quickapp/zh/components/)
- [JS 接口](https://iot.mi.com/vela/quickapp/zh/features/)

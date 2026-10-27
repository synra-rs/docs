---
title: Project Structure
---

# 项目结构

一个插件的目录很小，里面每个文件只有一件事要做。本页说明哪件是哪件。

## 文件

```
hello-synra/
├─ manifest.json      what the plugin is and what it needs
├─ Cargo.toml         how the Rust is built
├─ src/lib.rs         the plugin's behaviour
├─ README.md          for a person reading the repository
└─ .gitignore
```

`hybrid` 模板在 Rust 组件之外增加界面源码，两部分共用一份清单。
使用前端框架时，可以增加自己的 `package.json` 和构建脚本。

## `manifest.json`

内核在加载任何东西之前先读它。用户的安装提示就是从这份文件生成的，所以这里改一个字段，就是改用户被请求
批准的内容。

- 标识符与版本。
- 必需的 `runtime.headless` 组件与可选的 `runtime.ui` 包。
- 要声明哪些能力、要发出哪些事件。
- 插件处理什么：分享目标、动作、收到的事件。

字段见[清单](/zh/plugins/manifest)，确切形状见 [schema](/schema/manifest/v1.json)。

## `Cargo.toml`

| 配置 | 为什么 |
| --- | --- |
| `crate-type = ["cdylib"]` | 插件是内核加载的库，不是程序 |
| `synra-plugin-sdk` | 宿主调用，仅此而已 |
| `opt-level = "s"`、`lto = true` | 插件加载一次、调用多次，而它的体积是要下载的 |
| `panic = "abort"` | 没有东西可以往回展开 |

::: info 为什么 SDK 自己不依赖任何东西
一个拖进异步运行时的插件，会被 `verify` 拒绝：调度归内核所有，自带一套的插件是内核看不见其工作的插件。这
同时也是把产物做小的决定 —— 同一件事的另一面。
:::

## `src/lib.rs`

行为所在：内核调用的函数，以及插件回调宿主的调用。一个插件必须提供哪些函数，由它的 `runtime` 条目决定 ——
headless 插件实现生命周期，UI 插件一个都没有，hybrid 两半都有。

[编写逻辑](/zh/plugins/authoring) 讲这一部分。

## 构建它

```bash
synra-plugin build
```

产物是 headless 那半的 `plugin.wasm`，以及 UI 那半构建出的资源目录。两者都落在清单说的地方。

::: warning `target/` 不是插件的一部分
它是 Rust 的构建目录，而插件的产物是它产出的**一个** `.wasm`。把 `target/` 打包进去，就是让用户下载几百
兆只为了拿一个文件。
:::

## 接下来

- [编写逻辑](/zh/plugins/authoring) —— Rust 那一侧。
- [清单](/zh/plugins/manifest) —— 每个字段。
- [测试](/zh/plugins/testing) —— 发布前该检查什么。

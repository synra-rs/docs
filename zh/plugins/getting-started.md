---
title: Your First Plugin
---

# 你的第一个插件

插件是一个内核加载的 WebAssembly 组件，外加一份说明"它是什么、它需要什么"的清单。跑起来大约需要三十
分钟。

本页从空目录走到一个内核愿意安装的插件。

## 需要什么

| 工具 | 为什么 |
| --- | --- |
| Rust | 插件是用它写的 |
| `wasm32-wasip2` 目标 | 插件就编译成它 |
| `synra-plugin` | 生成脚手架、构建、检查 |

```bash
rustup target add wasm32-wasip2
cargo install synra-plugin
```

## 生成脚手架

```bash
synra-plugin new @your-scope/hello-synra --title "Hello Synra"
```

标识符是 `@scope/name`。scope 归你，其中三个是保留的：`synra`、`core`、`system`。其余一切 —— 目录名、
产物名、缓存路径 —— 都由它派生。

::: info 为什么标识符在写任何东西之前就被校验
它出现在每一个路径和每一条能力字符串里，所以事后才发现它不合法，意味着一次改名。脚手架按内核在安装时
的同一套规则校验它 —— 于是这个工具写出来的插件，就是能装上架的插件。
:::

`--template` 决定你拿到什么：

| 模板 | 是什么 |
| --- | --- |
| `headless` | 只有 WebAssembly，没有界面 |
| `ui` | 只有 WebView 包，没有内核要跑的代码 |
| `hybrid` | 两半都有，共用一份清单 |

## 生成了什么

```
hello-synra/
├─ manifest.json
├─ Cargo.toml
├─ src/lib.rs
└─ README.md
```

`src/lib.rs` 是插件行为所在。`manifest.json` 说明那个行为是什么。两者必须一致 —— 哪些字段会与代码对照，
见[清单](/zh/plugins/manifest)。

## 构建

```bash
synra-plugin build
```

它把 Rust 编译成 `plugin.wasm`，并写到清单说的地方。release profile 已经按体积调好，因为插件的体积是用
户每次安装都要付的代价。

## 检查

```bash
synra-plugin verify
```

刚生成的脚手架会报三件事：

```
ok    manifest               parses and validates
fail  wasm                   the manifest names a Wasm entry point and there is no plugin.wasm
warn  imports                the artifact's imports were not read, so they were not checked
```

构建之前出现那个失败是正常的。构建之后它会变成通过，而关于 imports 的警告会变成一项检查 —— 插件声明的
导入会与它实际调用的东西做比对。

::: tip `verify` 跑的就是内核在安装时跑的那些检查
它存在的原因，是作者在这里能对失败做点什么，而在安装时不能。一个在用户机器上装不上的插件，是用户不会再
试第二次的插件。
:::

## 试一试

把插件目录拷到跑着 Synra 的设备上，从文件夹安装。不在注册表里的插件从目录安装 —— 这也是插件开发的方式：
改、构建、安装、看。

## 接下来看什么

- [项目结构](/zh/plugins/structure) —— 每个文件是干什么的。
- [编写逻辑](/zh/plugins/authoring) —— Rust 那一侧。
- [构建界面](/zh/plugins/ui) —— 如果它需要画东西。
- [测试](/zh/plugins/testing) —— 发布前该检查什么。
- [发布](/zh/plugins/publishing) —— 签名与用户看到什么。

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

它在 `dist/` 生成包含 manifest 和 `plugin.wasm` 的安装目录；hybrid 还包含 `ui.zip`。release profile 已经按体积调好，因为插件的体积是用
户每次安装都要付的代价。

## 检查

```bash
synra-plugin verify --dir dist
```

构建后校验 `dist/`，检查实际组件 ABI、导入声明覆盖和可选 UI ZIP。缺失或读取失败均导致失败，不能跳过导入检查。

::: tip `verify` 跑的就是内核在安装时跑的那些检查
它存在的原因，是作者在这里能对失败做点什么，而在安装时不能。一个在用户机器上装不上的插件，是用户不会再
试第二次的插件。
:::

## 试一试

把构建生成的 `dist/` 安装目录拷到跑着 Synra 的设备上，从文件夹安装。不在注册表里的插件从目录安装 —— 这也是插件开发的方式：
改、构建、安装、看。

## 接下来看什么

- [项目结构](/zh/plugins/structure) —— 每个文件是干什么的。
- [编写逻辑](/zh/plugins/authoring) —— Rust 那一侧。
- [构建界面](/zh/plugins/ui) —— 如果它需要画东西。
- [测试](/zh/plugins/testing) —— 发布前该检查什么。
- [发布](/zh/plugins/publishing) —— 签名与用户看到什么。

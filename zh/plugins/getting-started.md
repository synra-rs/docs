---
title: 第一个插件
---

# 第一个插件

每个 Synra 插件都包含 Rust/Wasm 组件。需要页面时，选择 hybrid 模板。

## 准备工具链

使用所选 core 提交要求的开发工具链，再安装模块目标和作者 CLI。
下面固定一组已审查的 SDK/CLI 版本：

```sh
rustup target add wasm32-unknown-unknown
cargo install synra-plugin-cli --git https://github.com/synra-rs/synra-core.git --rev ffec0a2dd3833346bccc6f75bb49447c4e2cc9eb --locked
```

Rust SDK 当前从源码使用，不要依赖假定存在的 crates.io 发布版本。

## 创建项目

```sh
synra-plugin new @your-scope/hello-synra --template hybrid --dir hello-synra --title "Hello Synra"
cd hello-synra
```

| 模板 | 内容 |
| --- | --- |
| `headless` | Rust 组件与清单 |
| `hybrid` | 相同组件，以及 UI 包 |

不支持纯 UI 模板。插件标识使用 `@scope/name`，保留 scope 会被拒绝。

## 固定 SDK

脚手架会写入版本依赖。构建这个开发示例前，将它替换为与 CLI 相同的 Git 提交：

```toml
[dependencies]
synra-plugin-sdk = { git = "https://github.com/synra-rs/synra-core.git", rev = "ffec0a2dd3833346bccc6f75bb49447c4e2cc9eb" }
```

提交 Cargo.lock，并使用匹配宿主。SDK 生成的 guest 绑定提供完整 WIT world；
添加逻辑时保留生成的入口结构。

## 构建与校验

```sh
synra-plugin build
synra-plugin verify --dir dist
```

构建会编译模块、编码组件、打包可选 UI，并在替换 `dist/` 前校验实际包。
直接运行 Cargo 得到的文件不是可安装的完整组件包。

::: tip 检查真正用于安装的文件
校验构建后的 `dist/`，不要只看源码清单。混合插件需要 `plugin.wasm` 和有效 UI ZIP。
:::

## 安装并打开

在 Synra 中安装构建后的文件夹，明确确认插件、授予所需能力并启用。
空能力列表也需要批准。混合插件从管理入口打开。

独立的 [Starter](https://github.com/synra-rs/synra-plugin-starter) 和
[Touchpad](https://github.com/synra-rs/synra-plugin-touchpad) 仓库提供具体示例，
各自固定经过审查的依赖版本。

## 下一步

- [目录结构](/zh/plugins/structure)。
- [编写逻辑](/zh/plugins/authoring)。
- [编写界面](/zh/plugins/ui)。

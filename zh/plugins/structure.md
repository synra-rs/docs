---
title: 目录结构
---

# 目录结构

区分源码、构建包与运行数据。

## 源码布局

```text
hello-synra/
├─ manifest.json
├─ Cargo.toml
├─ Cargo.lock
├─ src/lib.rs
└─ ui/index.html
```

无界面项目没有 `ui/`。使用前端框架时，可以增加包管理器配置和独立的前端构建输出。

## 包布局

```text
dist/
├─ manifest.json
├─ plugin.wasm
└─ ui.zip
```

清单快照指向包内相对路径，UI 入口是 ZIP 内的文件。
不要把 Cargo 的 `target/` 或已安装依赖目录打进包。

## 构建配置

| 位置 | 控制内容 |
| --- | --- |
| 源码清单 | 标识、SDK 要求、运行文件和请求能力 |
| Cargo.toml | Rust crate、SDK 提交和可选 UI 构建命令 |
| Cargo.lock | 经审查的依赖解析 |
| UI 工程 | 页面逻辑、内置资源及相对资源路径 |

插件使用 `cdylib`，由 CLI 完成组件编码。
框架 UI 通过 `package.metadata.synra.ui` 配置，见[编写逻辑](/zh/plugins/authoring#构建完整包)。

## 运行数据

插件存储与安装文件使用不同路径，更新代码不需要覆盖已保存数据。
不要把秘密或签名私钥放入 UI 包。

## 下一步

- [Manifest](/zh/plugins/manifest)。
- [编写逻辑](/zh/plugins/authoring)。
- [测试](/zh/plugins/testing)。

---
title: Writing the Logic
---

# 编写逻辑

插件的代码是一个 Rust 库：它实现清单里声明要提供的那些函数，并通过 SDK 回调宿主。

## 内核调用什么

每个插件都必须包含实现完整 WIT world 的 Rust headless 组件。SDK 提供全部必需导出；
清单声明决定宿主何时调用这些入口。

| 函数 | 何时被调用 | 谁会有 |
| --- | --- | --- |
| `activate` | 插件被加载 | headless、hybrid |
| `deactivate` | 插件被卸载或停用 | headless、hybrid |
| `migrate` | 存储的 schema 版本比插件的旧 | headless、hybrid |
| `on_tick` | 内核给插件一个时间片 | 申请过时间片的插件 |
| `on_event` | 本地插件事件命中 `handles` 且当前接收授权通过 | headless、hybrid |
| `can_handle` | 有东西被分享，内核在问谁想要它 | 声明了分享处理器的插件 |
| `execute` | 插件说了它想要这个分享 | 同上 |
| `invoke` | 用户运行了插件的某个动作 | 声明了动作的插件 |

::: info 两种支持的模板
使用 `headless` 创建 Wasm 插件，或使用 `hybrid` 增加 UI 包。不支持纯 UI 插件和 `ui` 模板；
构建、verify 和原生安装都要求 `runtime.headless`。

CLI 与原生宿主检查实际组件字节，包括全部必需导出及其签名。清单声明本身不能证明二进制实现了入口。
:::

## 构建完整安装包

```bash
synra-plugin build
synra-plugin verify --dir dist
synra-plugin pack --dir dist --out plugin.tgz
```

build 在独立暂存目录生成 manifest 快照、Wasm 组件及可选的 UI ZIP，通过实际校验后整体替换 `dist/`。
清单中的 artifact 路径相对包根，例如 `plugin.wasm` 和 `ui.zip`。
失败重建保留旧包；成功重建移除旧签名。已有非空输出必须带当前项目的构建标记，避免覆盖其他文件。

hybrid 默认直接打包静态 `ui/`，不要求包管理器。框架项目在 Cargo.toml 配置：

```toml
[package.metadata.synra.ui]
source = "ui/dist"
directory = "ui"
command = ["pnpm", "run", "build"]
```

source 与 directory 相对项目根。command 是直接执行的 argv，不自动安装依赖或拼接 shell 命令；
Windows 可配置实际安装的入口，例如 `pnpm.cmd`。作者的本地构建命令须只写自己的 UI 资源目录。
verify 和原生安装共用实际 ZIP 的入口、路径、重复条目、链接、大小、压缩比及 CRC 校验。
这条构建链路不代表跨设备宿主调用或手机 UI 已完成验收。

## 接收本地插件事件

headless WIT world 要求导出 `lifecycle.on-event(event-json: string) -> outcome`。
通过 `handles` 声明路由选择器；接收其他包的事件还需要 `event:subscribe:<event-name>`。
headless 不提供动态 `event-subscribe` import。

上下文 JSON 包含宿主提供的 `event`、`from`、`senderPluginId`、`requestId`、`traceId`，
发送者的数据位于 `payload` 下。宿主验证声明的 payload schema，投递前重查安装状态、同意记录和授权；
卸载或重载发射插件会使其排队任务失效。

`event_emit` 成功只表示本地事件入队，handler 结果单独记录，不重试、不自动回复远端。
队列最多 128 条、8 MiB 编码 payload，单条 payload 最多 64 KiB，排队任务五秒后过期。
本地 headless 投递、UI 的 JavaScript 事件订阅和跨设备投递分别处理。

## 调用宿主

SDK 把宿主调用暴露成函数，每个契约函数一个。它们中每一个，要么需要一份清单里声明过的能力，要么因为只是读
取环境事实而无闸门。

```rust
// Ungated: reading the environment.
let version = host::env_sdk_version();

// Gated: the manifest must declare `log:info`.
host::log(LogLevel::Info, "started", None);

// Gated: the manifest must declare `storage:local:read`.
let saved = host::storage_get("last-seen");
```

::: warning 声明与调用必须一致
调用所需的能力没有被声明时，它会在运行时以 `capability_denied` 被拒绝。`verify` 会更早抓到它 —— 把产物
实际导入的东西与清单声明的做比对。这也是为什么这项检查值得**每次安装前**都跑，而不只是发布前。
:::

## 存储

插件的存储是它自己的。键是字符串，值是字符串，而内核按插件做命名空间隔离，所以两个插件不会撞车。

| 调用 | 需要 |
| --- | --- |
| `storage_get`、`storage_keys`、`storage_quota` | `storage:local:read` |
| `storage_set`、`storage_delete` | `storage:local:write` |
| `secret_get` | `storage:secure:read` |
| `secret_set`、`secret_delete` | `storage:secure:write` |

`storage` 与 `secret` 是两个不同的地方。secret 在落盘时加密，而且**永远不会**被放进诊断包；storage 的值
是普通数据。

::: tip secret 是给那种"泄漏了会让用户难堪"的东西用的
一个 API token。而一份服务器响应的缓存不是 secret —— 把它放进安全存储，代价是用户每次读都要解一次密。
:::

## 迁移

当存储的 schema 版本比插件的旧时，会调用 `migrate`。这是插件自己改它存下来的东西的形状的机会 —— 也是唯一
的机会，因为内核不知道插件的值是什么意思。

::: warning 迁移只跑一次，而且不能重跑
它返回之后版本号才被写入。中途失败的迁移会留下一个迁了一半的存储 —— 这就是为什么设计要求它能被中断后再
跑一次，而不是假设自己是唯一在进行的事。
:::

## 错误

失败的宿主调用返回内核的稳定错误码，插件对它做分支，而不是对消息做分支。列表见[错误码](/zh/reference/errors)。

## 接下来

- [构建界面](/zh/plugins/ui) —— 如果插件要画东西。
- [测试](/zh/plugins/testing) —— 发布前该检查什么。
- [能力](/zh/reference/capabilities) —— 每条声明对用户意味着什么。

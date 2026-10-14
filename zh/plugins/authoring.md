---
title: Writing the Logic
---

# 编写逻辑

插件的代码是一个 Rust 库：它实现清单里声明要提供的那些函数，并通过 SDK 回调宿主。

## 内核调用什么

你实现其中哪些，由清单里的 `runtime` 决定。

| 函数 | 何时被调用 | 谁会有 |
| --- | --- | --- |
| `activate` | 插件被加载 | headless、hybrid |
| `deactivate` | 插件被卸载或停用 | headless、hybrid |
| `migrate` | 存储的 schema 版本比插件的旧 | headless、hybrid |
| `on_tick` | 内核给插件一个时间片 | 申请过时间片的插件 |
| `can_handle` | 有东西被分享，内核在问谁想要它 | 声明了分享处理器的插件 |
| `execute` | 插件说了它想要这个分享 | 同上 |
| `invoke` | 用户运行了插件的某个动作 | 声明了动作的插件 |

::: info 没有 `runtime.headless` 的插件，这些一个都没有
只有界面的插件是一个 WebView 包：内核不从它加载任何代码，它做的一切都通过注入的客户端。那就是 `ui` 模
板。
:::

## 调用宿主

SDK 把宿主调用暴露成函数，每个契约函数一个。它们中每一个，要么需要一份清单里声明过的能力，要么因为只是读
取环境事实而无闸门。

```rust
// Ungated: reading the environment.
let version = host::env_sdk_version();

// Gated: the manifest must declare `log:write`.
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

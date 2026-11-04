---
title: 事件
---

# 事件

区分宿主界面状态事件与插件业务事件，两者名称及交付契约不同。

## 宿主界面事件

应用的 kernel-event 桥传递带序号的 IPC 事件。

| 事件 | 含义 |
| --- | --- |
| `deviceCardUpdated` / `deviceRemoved` | 设备列表变化 |
| `scanUpdated` | 扫描状态 |
| `pairingUpdated` | 配对请求与结果 |
| `inputUpdated` | 当前输入会话状态 |
| `intentUpdated` / `intentFinished` | 通用任务状态与结果 |
| `transferUpdated` / `transferFinished` | 传输状态与结果 |
| `pluginUpdated` / `pluginConsentRequested` | 插件状态与待确认请求 |
| `pluginInstallProgress` / `pluginUpdateAvailable` / `pluginHealthChanged` | 安装、更新与健康状态 |
| `configUpdated` | 配置快照 |
| `debugWire` / `logLine` / `notice` | 诊断与通知 |

应用使用唯一的中央订阅和共享 store，忽略重复序号，
发现缺口时重读权威快照。旧快照不能覆盖更新的事件。

## 插件事件命名空间

| 前缀 | 所有者 |
| --- | --- |
| `_synra.` | 宿主定义的事件目录 |
| `_plugin.<full-plugin-id>.` | 准确的 scoped 插件 |
| `synra.internal.` | 进程内宿主事件 |

例如，`_plugin.@acme/notes.ready` 属于 `@acme/notes`。
插件不能发出其他包的名称或宿主保留事件。

## 目录与交付

协议声明了 `_synra.device.changed`、`_synra.transfer.completed`、
`_synra.plugin.capability-changed` 和宿主生命周期等名称。
名称已声明，不表示每个宿主的所有工作流都会发布它。

使用真实宿主支持的订阅与选择器，
不要把 `pairingUpdated` 等 IPC 名称当成插件事件选择器。

## Headless 与 UI 接收方

Headless 接收方声明 `handles` 并实现 `on_event`，
JavaScript 页面通过注入客户端订阅，退出时需要退订。

宿主检查事件所有权、声明负载和当前授权。
入队成功不表示处理器已运行，也不表示远端业务成功。
跨设备交付还需要对应宿主路径和接收插件状态。

## 下一步

- [编写逻辑](/zh/plugins/authoring)。
- [编写界面](/zh/plugins/ui)。
- [能力](/zh/reference/capabilities)。

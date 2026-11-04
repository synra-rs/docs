---
title: 错误码
---

# 错误码

根据结构化错误码分支处理，不要匹配翻译后的界面文字。

## 错误形态

| 边界 | 消息表示 | 其他上下文 |
| --- | --- | --- |
| 插件客户端 `SynraError` | 面向人的消息字符串 | 错误码、可重试性、建议动作和可选详情 |
| 宿主管理 `IpcError` | 可本地化的消息键 | 错误码、可选 params/details、可重试性和建议动作 |

序列化可能省略可选字段与空数组。
消费方按各自声明的类型处理缺省 `actions`、`params` 和 `details`。

## 错误码目录

| 错误码 | 含义 | 按错误码可重试 |
| --- | --- | --- |
| `capability_denied` | 缺少所需授权或范围 | 否 |
| `plugin_not_installed` | 缺少对应插件 | 否 |
| `device_offline` | 目标当前不可达 | 是 |
| `not_paired` | 需要配对 | 否 |
| `transport_not_open` | 链路尚不可用 | 是 |
| `transfer_failed` | 传输失败 | 是 |
| `integrity_mismatch` | 摘要不匹配 | 否 |
| `payload_too_large` | 负载超过上限 | 否 |
| `timeout` | 操作超时 | 是 |
| `rate_limited` | 调用频率超限 | 是 |
| `unsupported` | 宿主或平台不支持操作 | 否 |
| `invalid_argument` | 输入无效 | 否 |
| `scheme_not_allowed` | URL 协议被拒绝 | 否 |
| `host_not_allowed` | HTTP 主机不在允许范围 | 否 |
| `ip_not_allowed` | 解析地址被拒绝 | 否 |
| `redirect_blocked` | 跳转离开允许范围 | 否 |
| `response_too_large` | 响应超过上限 | 否 |
| `protocol_violation` | 违反契约或命名空间 | 否 |
| `protocol_version_unsupported` | 对端协议不兼容 | 否 |
| `plugin_trapped` | Guest trap 或超过运行时限制 | 否 |
| `plugin_timeout` | 插件执行超时 | 否 |
| `internal` | 未预期失败 | 是 |

最后一列是协议错误码的默认分类，不代表可以自动重复业务操作。

## 重试与恢复

可重试网络错误可以支持重试幂等读取，
不表示可以在结果未知时重放点击、传输决定或其他副作用。

`capability_denied` 应检查声明和当前授权，
`unsupported` 应选择受支持路径，`not_paired` 应先完成配对。
摘要不匹配按错误码默认分类不可重试；应检查或重建源文件，
必要时明确发起一次新的传输。

## 有用上下文

在失败操作附近显示对应建议动作和带参数的原因，保存失败时保留表单草稿。
报告中包含首条错误和任务标识，避免转发私密负载或秘密。

## 下一步

- [故障排查](/zh/guide/troubleshooting)。
- [能力](/zh/reference/capabilities)。

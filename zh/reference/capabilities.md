---
title: 能力
---

# 能力

能力描述一个操作及作用范围。清单声明、用户授权和宿主实现是三个不同条件。

## 语法

```text
log:info
device:list
device:send:01900000-0000-7000-8000-000000000001
storage:local:read
network:fetch:api.example.com
```

| 约束 | 限制 |
| --- | --- |
| 段数 | 最多 6 |
| 编码后的总长度 | 最多 256 字节 |
| 前缀段长度 | 最多 64 字节 |
| 域 | 下列十个域之一 |

限定部分按域定义语法，包括设备 UUID、事件名、网络主机和路径。
裸通配符不是能力。

## 域

| 域 | 用途 | 示例 |
| --- | --- | --- |
| `log` | 日志 | `log:info` |
| `event` | 发出与接收事件 | `event:emit:_plugin.@acme/notes.ready` |
| `device` | 设备与会话 | `device:list` |
| `storage` | 插件存储 | `storage:local:read` |
| `network` | 宿主代理 HTTP | `network:fetch:api.example.com` |
| `fs` | 范围文件访问 | `fs:read` |
| `file` | 传输权限 | `file:transfer:send` |
| `platform` | 原生宿主操作 | `platform:notify` |
| `action` | 声明动作 | `action:declare:debug` |
| `ui` | UI 能力声明 | `ui:page:settings` |

语法能表达的操作，多于某一个宿主已经实现的操作。

## 模式与具体检查

授权模式用于匹配具体请求。`device:send:*` 可以覆盖具体设备 UUID；
只授权一个 UUID 不会允许向所有设备发送。

| 模式 | 含义 |
| --- | --- |
| `*` | 一个完整段 |
| `**` | 零个或多个段 |
| 按域定义的限定模式 | 按对应限定部分的规则解析 |

不要把普通前缀字符串当成隐式通配符。
网络主机、方法、路径和事件模式应符合匹配版本宿主及 verify 工具接受的语法。

## 输入会话权限

| 一端 | 必需检查 |
| --- | --- |
| 控制端 | `device:input`、具体 `device:send:<UUID>`、目标已配对且未阻止 |
| 接收端 | 插件启用并获准运行、当前授权、`platform:control-pointer`、本次会话同意 |

接收能力通过 WIT 的 receiver-capability 元数据声明。
它不会暴露无需授权的原生函数，也不会让发送方替接收方同意。

## 确认与执行检查

安装时核对实际导入与声明，调用时复核当前权限及范围。
权限变化可以结束持续任务。没有能力的插件仍需明确批准运行。

使用最小必要范围，并说明用途。即使已获授权，宿主不支持时仍会拒绝。

## 下一步

- [Manifest](/zh/plugins/manifest)。
- [错误码](/zh/reference/errors)。

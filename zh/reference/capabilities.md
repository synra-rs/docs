---
title: Capabilities
---

# 能力

能力是"做某一类事"的许可，写成一个冒号分隔的字符串。插件在清单里声明它需要的能力，用户在安装前看到那
份清单，而内核在每次宿主调用之前做检查。

本页是语法与目录。

## 语法

一个能力是一个域，后跟最多五段，用冒号分隔。

```
log:write
storage:local:read
device:send:dev_7f3a
network:fetch:api.example.com
```

| 规则 | 限制 |
| --- | --- |
| 段数 | 最多 6 段 |
| 总长度 | 最多 256 字符 |
| 第一段 | 下面十个域之一 |
| 单段 | 不得为空，最多 64 字符 |

::: warning 裸 `*` 不是一个能力
它会意味着"现有的一切能力"，而一个说什么都可以的声明，是用户读不出任何信息的声明。通配符必须是**完
整的一段**：`log:*` 可以，`log:w*` 不行。
:::

## 十个域

| 域 | 涵盖 | 例子 |
| --- | --- | --- |
| `log` | 写日志 | `log:write` |
| `event` | 发出与订阅事件 | `event:emit:status` |
| `device` | 列出并触达其他设备 | `device:send:dev_7f3a` |
| `storage` | 插件自己的存储 | `storage:local:read` |
| `network` | 对外发起请求 | `network:fetch:api.example.com` |
| `fs` | 用户选中的文件 | `fs:read` |
| `file` | 传输 | `file:transfer:send` |
| `platform` | 操作系统 | `platform:notify` |
| `action` | 声明与调用动作 | `action:invoke:*` |
| `ui` | 插件绘制的页面 | `ui:page:settings` |

没有 `plugin` 这个域。想要自己数据的插件用 `storage` —— 那是用户已经知道其含义的域。

## 模式与授予

清单里可以在"整整一段"的位置用通配符；用户给出的授予是一个具体的能力。

通配符有**两个**，区别在于它们代表多少：

| 通配符 | 代表 | 例子 |
| --- | --- | --- |
| `*` | 恰好一段 | `device:send:*` —— 任意设备，但仍是"一台设备" |
| `**` | 一段或多段 | `storage:local:**` —— 这个前缀下的一切 |

- 清单里的 `device:send:*` 是在请求"能发给任意设备"的能力。
- `device:send:dev_7f3a` 是用户给出的授予，点名了一台设备。

当请求的每一段都被授予的对应段匹配时，授予就覆盖该请求。所以请求 `log:*` 会被 `log:write` 的授予覆盖，而请求
`log:write` 不会被 `log:read` 的授予覆盖。

::: warning `**` 不是把 `*` 写两遍
`*` 止步于段边界，`**` 不止，所以 `device:send:*` 覆盖不了 `device:send:dev_a:extra`，而 `device:send:**` 可
以。一个本意是"再多一层"却写成 `**` 的声明，是在要得比它需要的更多 —— 而安装提示会如实说出来。
:::

::: info 为什么通配符是**逐段**匹配的
`log:*` 不该被 `log` 的授予覆盖 —— 那是另一个能力，而把前缀当成通配符，正是插件取得"没人授予过它的权
限"的方式。
:::

## 用户看到什么

安装提示会展示插件声明的能力，因为那份清单就是"它能做的、而用户从其描述里预料不到的事"的全部。

| 声明 | 用户读到的 |
| --- | --- |
| `storage:local:read` | 读它自己保存的数据 |
| `network:fetch:api.example.com` | 访问 api.example.com |
| `device:send:*` | 发给任意已配对设备 |
| `platform:notify` | 显示通知 |

::: tip 声明得窄是一个**卖点**，不是限制
`network:fetch:api.example.com` 告诉了用户一件 `network:fetch:*` 没告诉的事：哪台服务器会看到他的数
据。能说清这一点的插件，比说不清的更容易被装上。
:::

## 检查什么，什么时候检查

检查发生在插件正要调用的那个宿主函数**之前**，而不是在它内部。

- 需要某个能力而插件没有时，函数被拒绝，拒绝携带 `capability_denied`。
- 什么都不需要的函数 —— 读 SDK 版本、问这是哪个平台 —— 是无闸门的，而契约对此有显式说明。其余每个宿主
  函数都点名自己需要的能力。
- 用了不属于自己的事件名的插件，会被以 `protocol_violation` 拒绝。

能力检查产生的拒绝见[错误码](/zh/reference/errors)。

---
title: 编写界面
---

# 编写界面

混合插件页面是独立文档，通过注入客户端访问宿主，并调用自己组件中的业务逻辑。

## 客户端类型

将 `@synra/client` 安装为开发依赖，并启用全局声明：

```json
{
  "compilerOptions": {
    "types": ["@synra/client"]
  }
}
```

这个包提供类型，不提供连接运行时。宿主在页面脚本运行前注入 `window.synra`。
独立浏览器需要单独的测试环境。

## 客户端接口

| 命名空间 | 用途 |
| --- | --- |
| `env` | 宿主版本、类型、语言、主题、授权与功能支持 |
| `log` | 诊断消息 |
| `event` | JavaScript 事件发出与订阅 |
| `device` | 设备列表、变化及声明的设备操作 |
| `storage` | 按插件隔离的本地存储 |
| `network` | 宿主代理的 HTTP |
| `transfer` | 传输调用与状态 |
| `platform` / `clipboard` | 已支持的系统效果 |
| `self` | 调用本插件声明的动作 |

远程 `device.send` / `broadcast` 及宿主选择器虽然存在于类型中，
当前注入实现仍明确返回不支持。使用 `device.list` 实现自己的选择界面；
不要从方法存在推断远程执行已实现。

多数操作返回 Promise。环境检查及 `ready()`、`requestId()` 等辅助方法同步返回，
以实际类型签名为准。

## 区分三种判断

| 查询 | 回答 |
| --- | --- |
| `env.can` | 本插件是否获得授权？ |
| `env.platformSupports` | 此平台是否提供能力？ |
| `env.hostSupports` | 此宿主是否实现客户端功能？ |

先检查对应条件，执行时仍处理失败。页面不能同意属于宿主的自身授权对话框。

## 加载与样式

在 `runtime.ui` 中声明 HTML 入口。脚本、字体、图标和样式随包携带，资源使用相对路径。
宿主 CSP 限制浏览器网络访问；浏览器 `fetch` API 仍存在，但不能绕过已声明 HTTP 权限。

使用 `synra.network.fetch` 发起宿主代理请求，处理其类型化响应。
语言和主题由页面应用到自己的文档，宿主样式不会泄漏进去。
可选的 `@synra/theme` 适配器提供共享 token，无需将业务界面移入主程序。

## 导航与生命周期

宿主在桌面打开独立窗口，在 Android 打开 `PluginActivity`。
Android 的返回栏和系统返回位于插件文档之外。

离开、隐藏或替换页面时，停止订阅和插件拥有的任务，忽略旧目标或旧请求的迟到响应。
除了成功，也要提供等待、拒绝、错误与重试状态；破坏性决定由真正的所有者处理。

## 下一步

- [Manifest](/zh/plugins/manifest)。
- [测试](/zh/plugins/testing)。
- [平台支持](/zh/reference/platform-matrix)。

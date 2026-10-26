---
title: The Manifest
---

# 清单

每个插件的包根目录都有一个 `manifest.json`。它说明插件是什么、由哪个产物实现、以及它被允许做什么。宿主在运行
任何东西之前读它，而 `synra-plugin verify` 在你发布之前检查它。

```jsonc
{
  "$schema": "https://synra-app.dev/schema/manifest/v1.json",

  "schemaVersion": 1,
  "id": "@synra-plugin/github-bridge",
  "version": "1.2.0",
  "title": "GitHub Bridge",
  "description": "Recognises GitHub links and opens them, completing shorthand like owner/repo.",

  "publisher": {
    "id": "synra",
    "name": "Synra",
    "pubkey": "…"                       // ed25519, base64
  },

  "sdk": { "min": "1.0.0" },
  "wit": "synra:plugin@1.0.0",

  "runtime": {
    "headless": { "artifact": "dist/plugin.wasm" },
    "ui": { "artifact": "dist/ui.zip", "entry": "index.html" }
  },

  "capabilities": [
    { "cap": "platform:open-url", "reason": "Open the link the user shared." },
    { "cap": "network:fetch:api.github.com", "optional": true,
      "reason": "Resolve private repositories. The plugin works without it." }
  ],

  "shareHandlers": [
    { "kinds": ["text", "url"], "description": "GitHub links and owner/repo shorthand" }
  ],

  "events": [
    {
      "name": "_plugin.@synra-plugin/github-bridge.opened",
      "payload": {
        "type": "object",
        "required": ["url"],
        "properties": { "url": { "type": "string", "maxLength": 2048 } },
        "additionalProperties": false
      }
    }
  ],

  "handles": [
    { "event": "_synra.transfer.completed" }
  ],

  "actions": [
    {
      "name": "open-url",
      "description": "Open a URL on this device",
      "args": {
        "type": "object",
        "properties": { "url": { "type": "string" } },
        "required": ["url"]
      }
    }
  ],

  "pages": [
    { "key": "home", "title": "GitHub Bridge", "path": "/home" }
  ]
}
```

## 最关键的几个字段

其中四个决定插件的行为，而把它们写错，通常就是插件被拒绝的原因。

### `runtime`

`headless` 是必需的，指向实现你逻辑的那个 `.wasm` 组件。`ui` 是可选的，用来加一个界面。这里**故意**没有
`kind`、`isolation` 或 `target` 字段 —— 插件如何被运行是宿主的决定，不是插件的。

### `capabilities`

插件可以做的一切。这份清单会被检查两次：安装时对照产物**实际引用**的导入，以及**每一次调用**时。当插件没有它
也能工作时，把条目标上 `optional: true` —— 这样即使用户拒绝了它，插件仍会激活。

::: warning 声明得比导入的少
如果产物导入了这里没覆盖的宿主函数，安装会失败。正是这项检查让"插件做不到它声明之外的事"成为**事实**，而不是
一句愿望。
:::

### `events` 与 `handles`

事件名称使用完整包身份，例如 `_plugin.@synra-plugin/github-bridge.opened`；发布者和包名前缀都参与所有权判断，不能省略。

`events` 是*你*发出的事件，每个名字都必须住在你自己的 `_plugin.<full-plugin-id>.` 命名空间下。`handles` 是你想接收的事
件 —— 内置的如 `_synra.transfer.completed`，或你自己的。

声明你发出的事件不是记账：它正是让宿主能在安装时检查"已配对设备上那份你的插件，是否仍看得懂你发的东西"的东西。
加一个可选字段，仍然兼容；加一个必需字段，就不兼容了。

### 让它们与代码保持一致

清单声明 `actions`、`handles` 与 `events`；产物实现它们。声明了一个从未实现的条目，或实现了从未声明的条目，都会
被 `synra-plugin verify` 抓到。

## 完整参考

完整的字段列表与每一条约束，就是 schema 本身：

- <https://synra-app.dev/schema/manifest/v1.json>

你的编辑器会从 `$schema` 那一行自动读取它，于是你打字时就有补全与内联校验。那个 URL 是一份**已发布的契约**：它
永不改变。字段在新版本里增加，而不是就地修改。

## 下一步

- [项目结构](/zh/plugins/structure) —— 文件是如何摆放的。
- [编写逻辑](/zh/plugins/authoring) —— Rust 那一侧。

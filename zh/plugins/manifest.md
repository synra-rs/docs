---
title: Manifest
---

# Manifest

宿主在执行插件前读取 `manifest.json`，其中声明标识、运行文件和请求能力。

## 最小混合插件示例

```json
{
  "$schema": "https://synra-app.dev/schema/manifest/v1.json",
  "id": "@your-scope/hello-synra",
  "version": "0.1.0",
  "title": "Hello Synra",
  "description": "A hybrid plugin for Synra.",
  "publisher": { "id": "your-publisher-id" },
  "sdk": { "min": "0.1.0" },
  "wit": "synra:plugin@1.0.0",
  "runtime": {
    "headless": { "artifact": "plugin.wasm", "stateful": false },
    "ui": { "artifact": "ui.zip", "entry": "index.html" }
  },
  "capabilities": []
}
```

示例不请求能力，但运行前仍需要用户明确批准。

## 运行文件

`runtime.headless` 必填，指向组件；`runtime.ui` 添加页面包。
逻辑需要在多次调用间保留实例状态时，设置 `stateful`。
UI 包补充组件，不支持纯 UI 插件。

文件路径相对于构建包根目录，UI 的 `entry` 相对于 ZIP 内部。

## 能力

每项请求能力应有具体用途。安装检查实际导入，执行检查当前授权与范围。
接收侧能力可授权接收端服务，不会因此增加可直接调用的原生函数。

可选功能按需要使用 `optional: true`，并处理拒绝。
声明能力不表示当前宿主或平台已经实现它。

## 动作与事件

`actions` 声明可调用动作，`events` 声明发出事件的模式，`handles` 声明接收选择器。
插件事件名称包含完整 scoped id：
`_plugin.@your-scope/hello-synra.ready`。

Verify 检查实际组件 ABI 和导入，不能证明所有动作分支及事件模式都实现正确；
仍需在真实宿主调用验证。

## Schema 与版本对齐

使用[清单 schema](/schema/manifest/v1.json)获得编辑器校验，
再用匹配版本 CLI 的 verify 完成运行时相关检查。
当前 schema 作为开发契约维护，不能仅从 `v1` 路径推断不可变的发布兼容承诺。

保持 SDK、CLI 和宿主匹配。重建会移除过期签名，因此对最终包签名。

## 下一步

- [能力](/zh/reference/capabilities)。
- [编写逻辑](/zh/plugins/authoring)。
- [签名与打包](/zh/plugins/publishing)。

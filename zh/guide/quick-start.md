---
title: Quick Start
---

# 快速上手

两台设备、一个动作，大约三十秒。本页走的是主要旅程：在手机上分享点什么，让它在桌面上打开。

## 开始之前

在两台设备上都安装 Synra（[安装](/zh/guide/installation)），并确认它们在同一个网络里 —— 同一个 Wi-Fi，或同一
个有线网络。别的都不需要：没有账号要创建，也没有服务器要指向。

## 1. 配对两台设备

在任一台设备上打开**设备**。另一台一旦被看到、并在握手中应答过，就会出现在列表里。

```
phone                          laptop
  │  Devices  →  tap "laptop"     │
  │  ─────── pair request ──────▶ │
  │                               │  a prompt appears
  │  ◀───── accepted ───────────  │
  │  both now show "paired"       │
```

配对是一次性的。两台设备一旦配上对，只要双方都在运行且可达，它们会自行重连。

::: tip 另一台设备没有出现
等几秒：发现是广播出去再等的。如果它仍然不出现，在两台设备上打开**设置 → 诊断**，比对它们报告的内容 —— 见
[故障排查](/zh/guide/troubleshooting)。
:::

## 2. 分享一些东西

在手机上，从任意应用里找到一个链接，用系统分享面板。选 **Synra**。

```
Share sheet  →  Synra
```

Synra 会在已安装的插件里找认识这段内容的那个。一个插件都没装时，它转而提供内置的兜底动作 —— 其中包括把文本发
到另一台设备的剪贴板。

## 3. 确认目标

当某个插件认领了内容，Synra 会展示它打算做什么、以及在哪里做：

| | |
| --- | --- |
| 动作 | 打开 URL |
| 目标 | `laptop` |
| 插件 | `github-bridge` |

如果你有多台设备，从列表里换一台，然后确认。

## 4. 看它发生

另一台设备收到这个动作，检查插件是否已安装、能力是否已授予，运行它，然后回报。发起的那台设备展示结果，包括花
了多久。

```
phone                                     laptop
  │  intent  github-bridge / open-url        │
  │  ──────────────────────────────────────▶ │
  │                                          │  capability platform:open-url granted
  │                                          │  opens the URL in the default browser
  │  ◀────── result: ok, 41 ms ────────────  │
  │  "opened on laptop"                      │
```

## 接下来试什么

- **发一个文件。** 用分享面板发文件，或者在桌面端把它拖到窗口上。
- **在一台设备上复制，在另一台上粘贴。** 在**设置 → 剪贴板**里启用剪贴板同步；它默认关闭，因为剪贴板内容往往
  是敏感的。
- **装一个插件。** 打开**插件**，浏览，安装。装好的插件可以用一次点击送到你的其他设备，而不用装两遍。
- **写你自己的。** [你的第一个插件](/zh/plugins/getting-started)大约需要三十分钟。

## 等价的命令行

如果你更喜欢终端，或者想验证同一段旅程在**没有用户界面**时也能走通：

```bash
synra devices --output json          # the devices this kernel has seen
synra send --to <device-id> --text "https://example.com"
synra logs --lines 50                # the kernel's log, most recent last
synra status                         # its state and its links
```

`synra send` 搬运的是文本或文件。它**不会**在另一台设备上打开 URL —— 打开 URL 是插件拿到内容之后做的事，而内核
自己的活是搬运。

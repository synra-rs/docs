---
title: Installation
---

# 安装

在每一台该参与进来的设备上安装 Synra。没有账号，也没有要配置的服务器：设备在本地网络上互相发现。

## 桌面端

::: code-group

```bash [Windows]
winget install Synra.Synra
```

```bash [macOS]
brew install --cask synra
```

```bash [Linux]
# Debian / Ubuntu
curl -fsSL https://synra-app.dev/install.sh | sh

# Arch
yay -S synra-bin
```

:::

桌面应用从托盘启动，关掉窗口之后仍在运行。这是刻意的：从手机发来的动作，需要另一端有东西在听。

::: tip 让它一直跑着
如果你把桌面应用完全退出，对其他设备来说这台设备就离线了。右键托盘图标里的*退出*，和关闭窗口是两回事。
:::

## 移动端

### Android

从 releases 页面安装。APK 用 Synra 的发布密钥签名；如果你的设备提示"从商店之外安装"，那条提示是预期的。

### iOS

通过 TestFlight 获取。iOS 构建是这样分发的，而不是通过商店上架，所以 TestFlight 链接才是正式的那个。

::: warning 后台限制
移动操作系统会挂起不在前台的 app，所以手机没法总在东西发出的那一刻就收到。Synra 会把动作排队，并在 app 被
允许再次运行时投递。发生这种情况时界面会显示*已排队*；在真正送达之前，它从不声称*已送达*。
:::

## 命令行

内核附带一个 CLI，它通过本地套接字与运行中的内核通信。图形应用不配合的时候，它是看清内核所见最快的方式。

```bash
cargo install synra-cli

synra devices                     # the devices this kernel has seen
synra status                      # its state and its links
synra send --to <id> --text "hi"  # text or a file, to one device
synra plugin                      # list, install, enable, disable, remove
synra logs                        # the kernel's log
synra doctor                      # whether this machine can run the kernel
```

配对本身在界面里完成，而一条以某台设备为目标的命令，需要先把它配上对。

## 系统权限

Synra 在需要的时候才要它需要的东西，而不是在安装时一次要完。有两类值得提前知道：

| 平台 | 权限 | 为了 |
| --- | --- | --- |
| Windows | 本地网络的防火墙例外 | 设备之间的发现与配对 |
| macOS | 本地网络访问 | 发现；没有它，设备永远不会被看到 |
| macOS | 辅助功能 | 模拟按键组合，前提是有插件用了那个能力 |
| Linux | X11 或 Wayland 会话 | 打开文件与模拟输入；部分 Wayland 合成器对两者都有限制 |
| Android | 通知 | 在 app 处于后台时展示收到了什么 |

需要某个你尚未授予的权限的能力会被拒绝，而插件会被告知这一点。没有东西会静默失败。

## 确认它工作了

```bash
synra doctor
```

它探测的是**这台机器**而不是网络：传输端口与发现端口能否绑定、数据目录是否可写、平台的防火墙或 WebView 是否
需要处理。每个探针报告 `ok`、`warn` 或 `fail`，而只有真的失败了退出码才非零。

如果两台设备互相看不见，这是第一个该看的地方 —— 每个探针的含义见[故障排查](/zh/guide/troubleshooting)。

## 下一步

- [给另一台设备发点什么](/zh/guide/quick-start)。
- [了解设备与配对](/zh/guide/devices-and-pairing)。

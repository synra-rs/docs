---
title: 安装
---

# 安装

每台参与协作的设备都需要运行匹配的 Synra 构建。保持宿主与插件版本一致，
尤其是在插件新增能力时。

## 桌面端

使用项目提供的 Windows 构建，或从源码构建应用。
仓库的[开发指南](https://github.com/synra-rs/synra-app/blob/main/CONTRIBUTING.md)列出了 Rust、Node 和 Tauri 环境要求。

本文不提供已经上线的 winget、Homebrew、AUR 或安装脚本渠道。
实际分发文件以[应用仓库](https://github.com/synra-rs/synra-app)及项目交付为准。

::: tip 保持接收端运行
关闭桌面窗口与退出应用是不同操作。接收设备需要宿主进程持续运行，并能访问网络。
:::

## 移动端

### Android

安装项目开发交付中的 Android ARM64 APK。核对设备支持的 ABI，
更新时保持签名身份一致。卓易通等 Android 兼容环境需要在对应设备上验收。

插件页面具有原生返回栏和系统返回。检查发现、配对与交互式插件时，请保持应用在前台。

### 其他移动系统

当前流程不代表已有 iOS 安装包或 TestFlight 分发。
共享内核和源码中的平台类型，不能证明对应移动端已经可用。

## 命令行工具

Rust workspace 当前从源码使用，包含独立于图形应用的 CLI、daemon 和插件作者工具：

```sh
cargo run --locked -p synra-cli -- --help
cargo run --locked -p synra-daemon -- --help
cargo run --locked -p synra-plugin-cli -- --help
```

在内核仓库运行这些命令。CLI 通过同一数据目录连接 daemon；
图形应用在自己的进程内承载状态。

## 网络与系统访问

| 要求 | 原因 |
| --- | --- |
| 可互通的同一局域网 | 设备发现和连接 |
| 防火墙允许 Synra | UDP 发现与公告中的 TCP 监听端口 |
| 接收端运行 | 请求需要宿主监听 |
| 原生能力受支持 | 插件授权不会创造系统实现 |

移动系统挂起应用时，不应期待自动完成交付。回到前台后，先检查当前任务状态再重试。

## 下一步

- [快速上手](/zh/guide/quick-start)。
- [故障排查](/zh/guide/troubleshooting)。

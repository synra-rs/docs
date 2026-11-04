---
title: 编写逻辑
---

# 编写逻辑

实现 SDK 的 guest traits，并通过 `synra_plugin_sdk::export!` 导出。
实际效果使用宿主导入，纯业务逻辑保持可独立测试。

## 入口

| 入口 | 用途 |
| --- | --- |
| `activate` / `deactivate` | 获取与释放插件拥有的状态 |
| `migrate` | 处理插件数据模式变化 |
| `on_tick` | 在宿主预算内执行定时工作 |
| `on_event` | 接收路由事件 |
| `can_handle` / `execute` | 匹配并执行分享输入 |
| `invoke` | 执行声明动作，包括页面对自身的调用 |

即使部分处理器返回中性结果，也需要完整组件 world。
不要生成第二份绑定 world 或手写原始导出。

## 构建完整包

```sh
synra-plugin build
synra-plugin verify --dir dist
synra-plugin pack --dir dist --out plugin.tgz
```

CLI 使用 `wasm32-unknown-unknown`，随后编码并校验组件。
构建先在 staging 中准备完整包，再替换 `dist/`；失败重建保留上一份包。

框架 UI 的配置：

```toml
[package.metadata.synra.ui]
source = "ui/dist"
directory = "ui"
command = ["pnpm", "run", "build"]
```

路径相对于项目。命令是 argv，不是 shell 脚本；需要时使用平台对应入口，
例如 Windows 的 `pnpm.cmd`。构建前安装 UI 依赖，
并将 UI 输出与 CLI staging、输出目录分开。

## 调用宿主

导入 `synra_plugin_sdk::host`。每个 WIT 导入都明确标为无需授权，或标注所需能力；
具体调用仍检查作用范围。

环境查询读取事实，存储、网络、系统效果与设备操作各需相应权限。
部分宿主适配器明确拒绝尚未实现的能力组；SDK 中存在函数不代表一定成功。

## 事件

发出事件在完整 `_plugin.<id>.` 命名空间声明，通过 `handles` 路由接收。
无界面事件使用 `on_event`，没有动态的 headless subscribe 导入。

宿主补入发送方身份、请求和 trace 上下文，检查声明的负载，并复核安装和授权。
emit 成功表示入队，不表示远端业务已执行。
UI JavaScript 订阅和 headless 事件处理属于不同路径。

## 存储与迁移

本地存储按插件隔离，使用相应读写能力。
契约中存在 secure-storage 导入，但当前应用宿主明确拒绝这些调用；
不要将它描述成所有设备上可用的加密存储。

迁移应能安全处理中断和重复尝试，不要假定只执行一次，
也不要假定失败时所有效果都会回滚。

## 持续操作

将任务绑定到明确选择的设备、插件和会话；异步步骤完成后复核取消与授权，
在停止、更新、断连或撤权时释放所拥有的资源。

鼠标控制使用宿主的 `input-session` 服务：发送端需要 `device:input` 与
目标范围的 `device:send`；接收端需要 `platform:control-pointer` 及本次会话的明确同意。
插件不能直接调用原生鼠标函数，也不能替接收端同意对话框。

## 下一步

- [编写界面](/zh/plugins/ui)。
- [测试](/zh/plugins/testing)。
- [能力](/zh/reference/capabilities)。

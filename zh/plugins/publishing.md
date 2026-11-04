---
title: 签名与打包
---

# 签名与打包

按构建、校验、签名和打包的顺序准备实际分发文件。
作者 CLI 的 publish 命令校验静态分发文件，不会隐式上传。

## 创建签名密钥

```sh
synra-plugin sign --generate-key
```

命令会打印私密签名材料。请在项目和包之外安全保存，
并按输出核对对应公钥。私钥文件使用十六进制表示的 32 字节内容。

::: warning 不要把私密签名材料写入日志
不要在共享 CI 日志中运行密钥生成，也不要提交输出。
发布者密钥需要单独保护的备份。
:::

## 签名并核对构建包

```sh
synra-plugin build
synra-plugin verify --dir dist
synra-plugin sign --dir dist --key path/to/private-key
synra-plugin sign --dir dist --verify path/to/public-key.txt
```

签名绑定清单摘要及具名文件摘要，包括 UI ZIP。
修改文件或重新构建后，需要重新签名。
签名不会让未经核实的发布者自动可信，也不会授予能力。

## 打包与检查

```sh
synra-plugin pack --dir dist --out plugin.tgz
```

注册表归档与本地安装目录是同一插件包的分发形式。
将清单、组件、UI 和签名一起交付，不要把原始 Cargo 模块当成插件包。

## 静态分发

使用 `pack --index` 生成静态注册表索引。
`publish --index` 检查本地文件，`upload` 使用作者提供的上传命令。
准确参数由固定版本工具给出：

```sh
synra-plugin pack --help
synra-plugin publish --help
synra-plugin upload --help
```

上传或发布是明确的交付步骤，与本地构建分开。

## 更新与用户决定

使用有意义的版本，并保持发布者身份一致。
新增能力需要检查；安装更新不代表允许所有新操作。
公钥变化和发布者撤销也有独立的信任决定。

## 下一步

- [测试](/zh/plugins/testing)。
- [插件管理](/zh/guide/plugins)。

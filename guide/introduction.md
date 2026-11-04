---
title: What is Synra
---

# What is Synra

Synra connects devices through plugins. The application manages devices, permissions and tasks;
plugins provide the pages and logic for specific features.

## What you can do

- Discover and pair devices on a local network.
- Install from a directory or a configured registry, approve, enable, update and synchronize plugins.
- Open a plugin page and choose the device it should work with.
- Review requests, task results and diagnostic logs.

For example, the Touchpad plugin lets a phone control a Windows pointer after the computer
approves the current session. Starter demonstrates local diagnostics and explicit target selection.

## How the pieces fit

| Part | Responsibility |
| --- | --- |
| Application | Device and plugin management, confirmation dialogs, settings and page hosting |
| Rust kernel | Discovery, pairing, connections, tasks, transfer and plugin execution rules |
| JS libraries | Client and protocol types, test tools and shared theme |
| Plugins | Feature-specific pages and logic using declared host capabilities |

Both devices are hosts, but native capabilities differ by platform. See
[Platform Support](/reference/platform-matrix) before choosing a receiving device.

## Current boundaries

Synra is a development project. Windows and Android ARM64 builds are available in the development
workflow; this documentation does not imply a published store listing or a release for every OS.
Sharing, clipboard workflows and remote actions depend on the installed plugin and implemented host API.

::: warning Use a trusted local network
Device traffic currently uses plain TCP. A pairing code helps people confirm the intended request;
it does not encrypt traffic or provide cryptographic device authentication.
:::

The kernel does not require a cloud account. Plugins can contact external services only through
the host capabilities they request and receive.

## Next

- [Install a compatible build](/guide/installation).
- [Pair devices and open a plugin](/guide/quick-start).
- [Write a plugin](/plugins/getting-started).

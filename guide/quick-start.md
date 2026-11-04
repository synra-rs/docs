---
title: Quick Start
---

# Quick Start

Start with two running hosts and one installed plugin. This guide covers the actual device and
plugin workflow without assuming a built-in sharing or clipboard feature.

## 1. Prepare both devices

Run compatible builds on the same reachable local network. Keep mobile Synra in the foreground.
See [Installation](/guide/installation) for the available workflow.

## 2. Pair

1. Open **Devices**, scan and choose the other device.
2. Start pairing. Both sides display the same six-digit code.
3. Check the code. The initiator waits and can cancel; the receiver can accept, refuse or block.
4. Accept on the receiver. Both sides show the completed pairing.

::: tip Wait for the decision
A discovered device or an established connection does not finish pairing.
The receiver must explicitly accept the request.
:::

## 3. Install and approve a plugin

Open **Plugins** and install a package or folder. Review its declared capabilities, approve the
desired permissions and enable it. A plugin requesting no capabilities still needs explicit
permission to run.

For a cross-device feature, install the matching plugin on both hosts, or use **Sync to devices**
from the plugin's management actions. Check the receiving device's confirmation and permissions.

## 4. Open the plugin

Choose **Open** and follow the plugin's own page. Select a target explicitly.
Some actions require a separate confirmation on the target even when devices are paired.

| Plugin | What to try |
| --- | --- |
| Starter | Inspect host information and select a paired computer |
| Touchpad | Connect from the phone, allow the session on Windows, then move or tap the touch surface |

Return using the host's native bar or system Back on Android, or close the plugin window on desktop.

## If something does not work

Check these in order: the device is online, the plugin exists on the required hosts, its permissions
are approved, it is enabled, and any current request has been accepted.

See [Troubleshooting](/guide/troubleshooting) for discovery logs and connection failures.

## Next

- [Devices & Pairing](/guide/devices-and-pairing).
- [Plugin management](/guide/plugins).
- [Tasks & Transfers](/guide/transfers).

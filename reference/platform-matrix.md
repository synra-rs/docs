---
title: Platform Support
---

# Platform Support

Separate a build target, a host implementation and physical-device acceptance.

## Application availability

| Platform | Current evidence |
| --- | --- |
| Windows | Desktop application built; WebView-based plugin hosting exercised |
| Android ARM64 | APK built; native plugin Activity and return integration compiled |
| Android compatibility environments | Require acceptance in the specific environment, including 卓易通 |
| macOS and Linux | Desktop adapters exist; this workflow does not establish distributed application builds |
| iOS | No installer or TestFlight distribution established by this workflow |

A successful Android build does not prove every mobile system behavior.
Keep the app in the foreground when using interactive cross-device features.

## Native capabilities

| Capability | Current boundary |
| --- | --- |
| Pointer-session receiver | Windows native backend; other receivers refuse unsupported control |
| Desktop URL, path, notification and clipboard operations | Depend on the desktop adapter, installed tools and system policy |
| Desktop command-based operations on mobile | Explicitly unsupported by the current command runner |
| File transfer and plugin runtime | Shared core, with host integration and platform build requirements |
| Background mobile reception | Subject to OS suspension; no always-on delivery guarantee |

## Capability checks

A plugin needs both a declared and approved capability, and an implementation on the current host.
A paired device or an installed package does not create platform support.

For pages, use `env.can`, `env.platformSupports` and `env.hostSupports` for their distinct questions.
Handle an execution refusal even after a support check.

## Unsupported operations

An unsupported platform or API reports a structured refusal.
Do not offer repeated retries as the only recovery for a missing implementation.
Choose a supported receiving device or use another available plugin path.

## Next

- [Installation](/guide/installation).
- [Capabilities](/reference/capabilities).
- [Testing](/plugins/testing).

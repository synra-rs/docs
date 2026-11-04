---
title: Installation
---

# Installation

Run a compatible Synra build on every participating device. Keep host and plugin versions aligned,
especially when a plugin introduces new capabilities.

## Desktop

Use a Windows build supplied by the project or build the application from source.
The repository's [development guide](https://github.com/synra-rs/synra-app/blob/main/CONTRIBUTING.md)
lists the required Rust, Node and Tauri tooling.

No winget, Homebrew, AUR or install-script channel is established by this documentation.
Check the [application repository](https://github.com/synra-rs/synra-app) for actual distributed artifacts.

::: tip Keep the receiver running
Closing a desktop window and quitting the application are different operations.
A receiving device needs its host process running and network access available.
:::

## Mobile

### Android

Install an Android ARM64 APK from the project's development delivery. Check that the device supports
the APK's ABI and retain a consistent signing identity when updating it.
Android compatibility environments, including 卓易通, need device-specific acceptance.

Plugin pages have a native return bar and system Back. Keep the app in the foreground when checking
discovery, pairing and an interactive plugin.

### Other mobile systems

This workflow does not establish an iOS installer or a TestFlight distribution.
A shared kernel or a platform type in the code is not evidence of a usable mobile build.

## Command line tools

The Rust workspace is used from source. It contains the application-independent CLI, daemon and
plugin author tool:

```sh
cargo run --locked -p synra-cli -- --help
cargo run --locked -p synra-daemon -- --help
cargo run --locked -p synra-plugin-cli -- --help
```

Run these in the core checkout. The CLI connects to a daemon using the same data directory;
the graphical application hosts its own in-process state.

## Network and system access

| Requirement | Why |
| --- | --- |
| Same reachable local network | Discovery and device connections |
| Firewall access for Synra | UDP discovery and the advertised TCP listening port |
| Running receiver | Requests need a listening host |
| Supported native capability | Plugin permission does not create an OS implementation |

Do not expect automatic delivery while a mobile OS has suspended the app.
Bring it to the foreground and check current task state before retrying.

## Next

- [Quick Start](/guide/quick-start).
- [Troubleshooting](/guide/troubleshooting).

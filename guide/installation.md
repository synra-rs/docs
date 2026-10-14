---
title: Installation
---

# Installation

Install Synra on every device that should take part. There is no account and no server to
configure: devices find each other on the local network.

## Desktop

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

The desktop app starts in the tray and keeps running when the window is closed. That is deliberate:
an action sent from your phone needs something listening on the other end.

::: tip Keep it running
If you quit the desktop app entirely, the device goes offline for other devices. Right-clicking the
tray icon offers *Quit* separately from closing the window.
:::

## Mobile

### Android

Install from the releases page. The APK is signed with Synra's release key; if your device warns
about installing from outside a store, that warning is expected.

### iOS

Available through TestFlight. iOS builds are distributed this way rather than through a store
listing, so the TestFlight link is the canonical one.

::: warning Background restrictions
Mobile operating systems suspend apps that are not in the foreground, so a phone cannot always
receive the instant something is sent. Synra queues the action and delivers it when the app is
allowed to run again. The interface says *queued* when that happens; it never claims *delivered*
until it is.
:::

## The command line

The kernel ships with a CLI that talks to a running kernel over its local socket. It is the quickest
way to see what the kernel sees when the graphical app is not cooperating.

```bash
cargo install synra-cli

synra devices                     # the devices this kernel has seen
synra status                      # its state and its links
synra send --to <id> --text "hi"  # text or a file, to one device
synra plugin                      # list, install, enable, disable, remove
synra logs                        # the kernel's log
synra doctor                      # whether this machine can run the kernel
```

Pairing itself is done in the interface, and a command that targets a device needs it to be paired
first.

## System permissions

Synra asks for what it needs when it needs it, not at install time. The two worth knowing about in
advance:

| Platform | Permission | Needed for |
| --- | --- | --- |
| Windows | Firewall exception for the local network | Discovery and pairing between devices |
| macOS | Local Network access | Discovery; without it, devices are never seen |
| macOS | Accessibility | Simulating key chords, if a plugin uses that capability |
| Linux | X11 or Wayland session | Opening files and simulating input; some Wayland compositors restrict both |
| Android | Notifications | Showing what was received while the app was in the background |

A capability that needs a permission you have not granted is refused, and the plugin is told so.
Nothing fails silently.

## Checking it worked

```bash
synra doctor
```

It probes the machine rather than the network: whether the transport and discovery ports can be bound,
whether the data directory is writable, whether the platform's firewall or WebView needs attention.
Each probe reports `ok`, `warn` or `fail`, and the exit code is non-zero only when something failed.

If two devices cannot see each other, this is the first thing to look at — see
[Troubleshooting](/guide/troubleshooting) for what each probe means.

## Next

- [Send something to another device](/guide/quick-start).
- [Understand devices and pairing](/guide/devices-and-pairing).

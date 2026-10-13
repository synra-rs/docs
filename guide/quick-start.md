---
title: Quick Start
---

# Quick Start

Two devices, one action, about thirty seconds. This walks the primary journey: share something on
your phone and have it open on your desktop.

## Before you start

Install Synra on both devices ([Installation](/guide/installation)) and make sure they are on the
same network — the same Wi-Fi, or the same wired network. Nothing else is required: there is no
account to create and no server to point at.

## 1. Pair the two devices

Open **Devices** on either device. The other one appears in the list once it has been seen and has
answered a handshake.

```
phone                          laptop
  │  Devices  →  tap "laptop"     │
  │  ─────── pair request ──────▶ │
  │                               │  a prompt appears
  │  ◀───── accepted ───────────  │
  │  both now show "paired"       │
```

Pairing is a one-time step. Once two devices are paired they reconnect on their own whenever both
are running and reachable.

::: tip If the other device does not appear
Give it a few seconds: discovery broadcasts and waits. If it still does not show up, open
**Settings → Diagnostics** on both devices and compare what they report — see
[Troubleshooting](/guide/troubleshooting).
:::

## 2. Share something

On your phone, find a link in any app and use the system share sheet. Choose **Synra**.

```
Share sheet  →  Synra
```

Synra looks through the installed plugins for one that recognises the content. With no plugins
installed, it offers the built-in fallback actions instead — sending the text to the other device's
clipboard among them.

## 3. Confirm the target

When a plugin claims the content, Synra shows what it intends to do and where:

| | |
| --- | --- |
| Action | Open URL |
| Target | `laptop` |
| Plugin | `github-bridge` |

Pick a different device from the list if you have more than one, then confirm.

## 4. Watch it happen

The other device receives the action, checks that the plugin is installed and that the capability
is granted, runs it, and reports back. The originating device shows the result, including how long
it took.

```
phone                                     laptop
  │  intent  github-bridge / open-url        │
  │  ──────────────────────────────────────▶ │
  │                                          │  capability platform:open-url granted
  │                                          │  opens the URL in the default browser
  │  ◀────── result: ok, 41 ms ────────────  │
  │  "opened on laptop"                      │
```

## What to try next

- **Send a file.** Use the share sheet with a file, or drag one onto the window on the desktop.
- **Copy on one device, paste on the other.** Enable clipboard sync in **Settings → Clipboard**;
  it is off by default because clipboard contents are often sensitive.
- **Install a plugin.** Open **Plugins**, browse, and install. Installed plugins can be sent to
  your other devices with one tap instead of installing them twice.
- **Write your own.** [Your First Plugin](/plugins/getting-started) takes about thirty minutes.

## Command line equivalent

If you prefer a terminal, or want to check that the same journey works without the user interface:

```bash
synra devices --json                 # list reachable devices
synra send --to <device-id> --url https://example.com
synra log --follow                   # watch the intent, the gate checks and the result
```

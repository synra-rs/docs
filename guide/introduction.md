---
title: What is Synra
---

# What is Synra

Synra is a **cross-device action orchestration framework**. It takes an action on one device and
turns it into an execution on another — and *what actually happens* is defined by plugins.

The everyday version of that: you see a link on your phone, and it opens in the browser on your
laptop. The general version: a button on your phone, a keyboard shortcut on your desktop, a file
that arrives where you need it.

::: info Both sides are hosts
Desktop and phone run the same kernel and are equally capable. Neither is "the one that runs
plugins". Either can share, either can execute, and a single device can do both roles in different
transfers.
:::

## The two models

Synra serves two shapes of the same idea. Which one you use depends on where the action starts.

### Share and receive

An action starts in another app. You share content to Synra, a plugin recognises it, and the
result lands on whichever device you choose.

```
You see a GitHub link in a chat app
  → Share to Synra
  → A plugin matches it and completes the URL
  → Synra asks which device should open it
  → Your laptop opens it in the default browser
```

### The action panel

An action starts in Synra itself. A plugin draws a panel of buttons, and pressing one runs
something on another device.

```
You open a plugin's panel on your phone
  → It shows a grid of shortcuts
  → You tap "Undo"
  → Your desktop sends Ctrl+Z to the focused window
```

The second model is what makes Synra useful as a remote control; the first is what makes it useful
without thinking about it.

## How the pieces fit

Three parts, and it is worth knowing which is which because they have different rules.

### Capabilities are the host's

The host provides a fixed set of system abilities: open a URL, open a file, simulate a key chord,
send a notification, read and write the clipboard, transfer a file. These are what the plugin is
allowed to *use*, and the host enforces the list rather than trusting the plugin to behave.

### Plugins decide what it means

A plugin answers two questions: *does this input concern me?* and *what should happen?* It never
touches the system directly — it asks the host to, and the host checks permission first.

### The kernel does the moving

Discovery, pairing, connections, message routing, file transfer and the sandbox all live in a
kernel that runs without a user interface at all. The desktop and mobile apps are front ends onto
it, which is why the same behaviour is available from every platform and from the command line.

## What Synra is not

Knowing the boundaries saves time when deciding whether a plugin is the right tool.

| | |
| --- | --- |
| Not a cloud service | No account, no central server. Nothing about your devices leaves your network. |
| Not remote desktop | No screen streaming, no input streaming. Intents and files only. |
| Not a general RPC framework | Device-to-device messaging exists to serve action orchestration. |
| Not a plugin store | Plugins come from a registry; the host verifies and installs them. |

## Next

- [Install Synra](/guide/installation) on your devices.
- [Run your first transfer](/guide/quick-start) in about thirty seconds.
- [Write a plugin](/plugins/getting-started) if you have something specific in mind.

---
title: Plugins
---

# Plugins

Synra moves things between your devices and nothing else. What it means to *send* something — to a chat app, to
a notes file, to a printer — is a plugin's business.

This page is what a plugin is from a user's side: what installing one asks you, and what it can do afterwards.

## What installing asks you

A plugin declares what it needs, and the install prompt shows that list. It is the whole of what the plugin can
do that you would not expect from its description.

| What you see | What it means |
| --- | --- |
| read its own saved data | it keeps settings and history |
| reach api.example.com | that server will see your data |
| send to any paired device | it can move things between your devices |
| show notifications | it may put something on your screen |

::: tip A plugin that asks for less is a plugin that told you more
`reach api.example.com` is a narrower promise than `reach any server`, and the narrow one is the one that says
which machine sees your data. A plugin that can say that is easier to decide about.
:::

## What a plugin can reach

A plugin runs in a sandbox with no filesystem, no network and no devices — except the ones it declared **and**
you approved. Those are two separate conditions, and both have to hold.

::: info "Sandboxed" is not the whole promise
The sandbox says a plugin cannot make a system call. It does not say which hosts it may reach or which devices
it may send to — that is the capability list you approved, and it is a different guarantee.
:::

## Where plugins come from

| Source | What it is |
| --- | --- |
| a registry | signed, and the publisher's key is checked |
| a plugin directory | what you use while developing one |
| a file someone sent you | installs, and the signature is checked |

A plugin that is not signed installs, and the prompt says so. A signed plugin whose signature does not match its
publisher's key does not install at all.

## Turning one off

Disabling a plugin stops it being called and keeps its data. Uninstalling removes its data too. Neither affects
the others: a plugin that is stopped cannot take anything else down with it.

::: warning Uninstalling removes what the plugin saved
Its storage goes with it. Disabling is the reversible one, and it is the one to reach for when you are not sure.
:::

## What is built in

Sharing, receiving, transfers, pairing and the device list are the kernel's, not a plugin's. A plugin can add a
meaning for what you sent — send this to a chat, save this to a note — but it cannot replace the moving of it.

## Next

- [Your First Plugin](/plugins/getting-started) — writing one.
- [Capabilities](/reference/capabilities) — what each declaration means.
- [Data Locations](/reference/paths) — where a plugin's data lives on disk.

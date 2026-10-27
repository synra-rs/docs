---
title: Built-in Events
---

# Built-in Events

An event is something the kernel tells the rest of the application about. Plugins emit them, the kernel
emits some of its own, and the interface subscribes to the ones it draws.

This page is the catalogue of the kernel's own: what exists, what each one carries, and when it fires.

## Names

An event name is a dotted string with a reserved prefix. Who may emit what follows from the prefix, so
the prefix is not decoration — it is the rule.

| Prefix | Emitted by | Reach |
| --- | --- | --- |
| `_synra.` | the kernel | built-in events, listed below |
| `_plugin.` | a plugin | namespaced under the plugin that emitted it |
| `synra.internal.` | the kernel | never leaves the process |

Plugin events use the complete package identity: `_plugin.@acme/notes.ready` belongs to `@acme/notes`.
An unqualified name or another package's namespace is refused.

::: info Why the prefix is checked rather than trusted
A plugin that emitted `_synra.device.offline` could make every interface on every paired device show a
device as offline. The prefix is what makes that impossible rather than merely discouraged.
:::

## The catalogue

These are the kernel's own. A plugin cannot emit one, and the interface receives them regardless of which
plugins are installed.

| Name | Carries | When |
| --- | --- | --- |
| `_synra.device.changed` | the device card | a device appeared or changed state |
| `_synra.device.offline` | the device id | a paired device stopped answering |
| `_synra.device.renamed` | the device id and its new name | the user renamed a device |
| `_synra.pairing.changed` | the pairing state | a device was paired or unpaired |
| `_synra.share.received` | what was shared, and by whom | another device shared something with this one |
| `_synra.intent.completed` | the intent id and its result | an intent finished successfully |
| `_synra.intent.failed` | the intent id and the error | an intent finished with a failure |
| `_synra.transfer.completed` | the transfer id and where it went | a file finished arriving or leaving |
| `_synra.transfer.failed` | the transfer id and the error | a transfer gave up |
| `_synra.transfer.progress` | the transfer id and how far | a transfer moved |
| `_synra.clipboard.received` | what arrived | clipboard sync delivered something |
| `_synra.plugin.installed` | the plugin snapshot | a plugin was installed |
| `_synra.plugin.updated` | the plugin snapshot | a plugin was updated |
| `_synra.plugin.uninstalled` | the plugin id | a plugin was removed |
| `_synra.host.foreground` | nothing | the application came to the front |
| `_synra.host.background` | nothing | the application went to the back |
| `_synra.network.changed` | the new state | the network changed |

::: tip Subscribe to what you draw
`_synra.transfer.progress` fires many times per second for a large file. An interface that subscribed to it
to update a badge would be doing work proportional to the transfer's speed rather than to what the user
sees.
:::

## Delivery and order

Every event the interface receives carries a sequence number, and that number is what makes a gap visible.

- The sequence is **per kernel**, not per subscriber, so two windows agree about which event came first.
- A number at or below the last one seen is a **repeat**. It is applied once and the rest are ignored.
- A jump forward means events were missed, and the interface re-reads a snapshot rather than showing a
  list that is quietly out of date.

::: warning A gap is not repaired by the events that follow it
The missed events are gone. What the sequence number buys is that the interface **knows** to re-read —
without it the panel renders, the numbers are plausible, and one of them is wrong.
:::

## A plugin's own events

A plugin declares the events it emits in its manifest. Local headless receivers select them through
`handles` and implement `on_event`; see [Writing the Logic](/plugins/authoring). Two rules hold:

- **The full package owns its namespace.** `@acme/notes` and `@other/notes` cannot emit as each other.
- **An event is declared before it is emitted.** Emitting an undeclared name is refused, because a
  subscriber that had to guess would be subscribing to something that may never arrive.

See [The Manifest](/plugins/manifest) for how a plugin declares one, and
[Capabilities](/reference/capabilities) for what a plugin needs before it may emit at all.

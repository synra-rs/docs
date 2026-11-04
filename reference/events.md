---
title: Events
---

# Events

Distinguish host UI state events from plugin business events. Their names and delivery contracts differ.

## Host UI events

The application's kernel-event bridge carries sequenced IPC events.

| Event | Meaning |
| --- | --- |
| `deviceCardUpdated` / `deviceRemoved` | Device list changes |
| `scanUpdated` | Scan state |
| `pairingUpdated` | Pairing request and result |
| `inputUpdated` | Current input-session state |
| `intentUpdated` / `intentFinished` | Generic task state and result |
| `transferUpdated` / `transferFinished` | Transfer state and result |
| `pluginUpdated` / `pluginConsentRequested` | Plugin state and pending confirmation |
| `pluginInstallProgress` / `pluginUpdateAvailable` / `pluginHealthChanged` | Installation, update and health |
| `configUpdated` | Configuration snapshot |
| `debugWire` / `logLine` / `notice` | Diagnostics and notices |

The application has one central subscriber and shared stores. Repeated sequence numbers are ignored;
a gap requires a fresh authoritative snapshot. An old snapshot must not overwrite a newer event.

## Plugin event namespaces

| Prefix | Owner |
| --- | --- |
| `_synra.` | Host-defined event catalogue |
| `_plugin.<full-plugin-id>.` | The exact scoped plugin |
| `synra.internal.` | In-process host events |

For example, `_plugin.@acme/notes.ready` belongs to `@acme/notes`.
A plugin cannot emit another package's name or a host-reserved event.

## Catalogue and delivery

The protocol declares names including `_synra.device.changed`, `_synra.transfer.completed`,
`_synra.plugin.capability-changed` and host lifecycle events.
A declared name is not proof that every host publishes it in every workflow.

Use actual host subscriptions and supported selectors. Do not substitute IPC event names such as
`pairingUpdated` for plugin event selectors.

## Headless and UI receivers

Headless receivers declare `handles` and implement `on_event`.
JavaScript pages subscribe through the injected client and must unsubscribe on exit.

The host validates event ownership, declared payloads and current grants.
Successful queueing does not mean a handler ran or a remote business action succeeded.
Cross-device delivery additionally needs the relevant host route and receiving plugin state.

## Next

- [Writing the Logic](/plugins/authoring).
- [Building a UI](/plugins/ui).
- [Capabilities](/reference/capabilities).

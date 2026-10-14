---
title: Capabilities
---

# Capabilities

A capability is permission to do one kind of thing, named as a colon-separated string. A plugin declares the
ones it needs in its manifest, the user sees that list before installing, and the kernel checks it before
every host call.

This page is the grammar and the catalogue.

## The grammar

A capability is a domain followed by up to five further segments, separated by colons.

```
log:write
storage:local:read
device:send:dev_7f3a
network:fetch:api.example.com
```

| Rule | Limit |
| --- | --- |
| segments | at most 6 |
| total length | at most 256 characters |
| first segment | one of the ten domains below |
| a segment | never empty, at most 64 characters |

::: warning A bare `*` is not a capability
It would mean every capability there is, and a declaration that said everything is a declaration no user can
read. A wildcard must be a **whole segment**: `log:*` is fine, `log:w*` is not.
:::

## The ten domains

| Domain | Covers | Example |
| --- | --- | --- |
| `log` | writing to the log | `log:write` |
| `event` | emitting and subscribing | `event:emit:status` |
| `device` | listing and reaching other devices | `device:send:dev_7f3a` |
| `storage` | the plugin's own storage | `storage:local:read` |
| `network` | outgoing requests | `network:fetch:api.example.com` |
| `fs` | files the user chose | `fs:read` |
| `file` | transfers | `file:transfer:send` |
| `platform` | the operating system | `platform:notify` |
| `action` | declaring and invoking actions | `action:invoke:*` |
| `ui` | pages the plugin draws | `ui:page:settings` |

There is no `plugin` domain. A plugin that wants its own data uses `storage`, which is the domain whose meaning
a user already knows.

## Patterns and grants

A manifest may use a wildcard where a whole segment is one; a grant the user gives is a concrete capability.

- `device:send:*` in a manifest asks for the ability to send to any device.
- `device:send:dev_7f3a` is what the user grants, naming one device.

A grant covers a request when every segment of the request is matched by the grant's, with `*` matching any
one segment. So a request of `log:*` is covered by a grant of `log:write`, while a request of `log:write` is
not covered by a grant of `log:read`.

::: info Why a wildcard is matched segment by segment
`log:*` must not be covered by a grant of `log` — that is a different capability, and treating a prefix as a
wildcard is how a plugin acquires permissions nobody granted it.
:::

## What the user sees

The install prompt shows the capabilities a plugin declares, because that list is the whole of what it can do
that the user would not expect from its description.

| Declaration | What the user reads |
| --- | --- |
| `storage:local:read` | read its own saved data |
| `network:fetch:api.example.com` | reach api.example.com |
| `device:send:*` | send to any paired device |
| `platform:notify` | show notifications |

::: tip A narrow declaration is a feature, not a restriction
`network:fetch:api.example.com` tells the user something `network:fetch:*` does not: which server will see
their data. A plugin that can say that gets installed more often than one that cannot.
:::

## What is checked, and when

The check runs before the host function the plugin is calling, not inside it.

- A function that needs a capability is refused when the plugin does not hold it, and the refusal carries
  `capability_denied`.
- A function that needs nothing — reading the SDK version, asking which platform this is — is ungated, and
  the contract says so explicitly. Every other host function names the capability it needs.
- A plugin that uses an event name it does not own is refused with `protocol_violation`.

See [Error Codes](/reference/errors) for the refusals a capability check produces.

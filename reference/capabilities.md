---
title: Capabilities
---

# Capabilities

A capability names an operation and its scope. A manifest declaration, a user grant and a
host implementation are three different conditions.

## Grammar

```text
log:info
device:list
device:send:01900000-0000-7000-8000-000000000001
storage:local:read
network:fetch:api.example.com
```

| Constraint | Limit |
| --- | --- |
| Segments | At most 6 |
| Total encoded length | At most 256 bytes |
| Prefix segment length | At most 64 bytes |
| Domain | One of the ten domains below |

Qualifiers have domain-specific syntax, including device UUIDs, event names, network hosts and paths.
A bare wildcard is not a capability.

## Domains

| Domain | Purpose | Example |
| --- | --- | --- |
| `log` | Logging | `log:info` |
| `event` | Emission and reception | `event:emit:_plugin.@acme/notes.ready` |
| `device` | Devices and sessions | `device:list` |
| `storage` | Plugin storage | `storage:local:read` |
| `network` | Host-mediated HTTP | `network:fetch:api.example.com` |
| `fs` | Scoped filesystem access | `fs:read` |
| `file` | Transfer authority | `file:transfer:send` |
| `platform` | Native host operations | `platform:notify` |
| `action` | Declared actions | `action:declare:debug` |
| `ui` | UI capability declarations | `ui:page:settings` |

The grammar can represent more operations than a particular host implements.

## Patterns and concrete checks

A granted pattern is matched against the concrete requested operation.
`device:send:*` can cover a concrete device UUID; granting one UUID does not authorize every device.

| Pattern | Meaning |
| --- | --- |
| `*` | One complete segment |
| `**` | Zero or more segments |
| Domain-specific qualifier pattern | Parsed according to that qualifier's rules |

Do not use prefix strings as implicit wildcards. Keep network host, method, path and event
patterns within the grammar accepted by the matching host and verify tool.

## Input-session authority

| Side | Required checks |
| --- | --- |
| Controller | `device:input`, concrete `device:send:<UUID>`, paired and unblocked target |
| Receiver | Enabled and approved plugin, current grants, `platform:control-pointer`, current session consent |

The receiving capability is declared through WIT's receiver-capability metadata.
It does not expose an ungated native function or let the sender approve the receiver.

## Approval and enforcement

Installation validates actual imports against declarations. Calls recheck current authority and
scope. Permission changes can end ongoing work.
A no-capability plugin still needs explicit approval to run.

Use the narrowest necessary scope and explain why it is needed.
An unsupported host reports refusal even when a permission has been granted.

## Next

- [The Manifest](/plugins/manifest).
- [Error Codes](/reference/errors).

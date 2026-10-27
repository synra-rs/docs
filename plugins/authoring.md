---
title: Writing the Logic
---

# Writing the Logic

A plugin's code is a Rust library that implements the functions its manifest says it provides, and calls back
into the host through the SDK.

## What the kernel calls

Which of these you implement follows from `runtime` in the manifest.

| Function | Called when | A plugin that has it |
| --- | --- | --- |
| `activate` | the plugin is loaded | headless, hybrid |
| `deactivate` | the plugin is unloaded or disabled | headless, hybrid |
| `migrate` | the stored schema version is older than the plugin's | headless, hybrid |
| `on_tick` | the kernel gives the plugin a slice of time | a plugin that asked for one |
| `on_event` | a local plugin event matches `handles` and current receive grants | headless, hybrid |
| `can_handle` | something is being shared and the kernel is asking who wants it | a plugin that declares a share handler |
| `execute` | the plugin said it wants this share | the same |
| `invoke` | the user ran one of the plugin's actions | a plugin that declared actions |

::: info A plugin with no `runtime.headless` has none of these
A UI-only plugin is a WebView bundle: the kernel loads no code from it, and everything it does it does through
the injected client. That is the `ui` template.
:::

## Receiving local plugin events

The headless WIT world requires `lifecycle.on-event(event-json: string) -> outcome`.
Declare routing selectors in `handles`; receiving another package's event also requires
`event:subscribe:<event-name>`. There is no dynamic headless `event-subscribe` import.

The JSON context contains host-provided `event`, `from`, `senderPluginId`, `requestId` and `traceId`,
with the sender's data under `payload`. The host validates declared payload schemas and rechecks
installation, consent and grants before delivery; unloading or reloading the emitter invalidates its queued work.

`event_emit` success means the local event was queued. Handler results are recorded separately, without retries
or automatic remote replies. The queue holds at most 128 events and 8 MiB of encoded payload, each payload is
limited to 64 KiB, and queued work expires after five seconds. Local headless delivery is separate from the UI's
JavaScript event subscriptions and from cross-device delivery.

## Calling the host

The SDK exposes the host calls as functions, one per contract function. Every one of them either needs a
capability the manifest declares or is ungated because it only reads a fact about the environment.

```rust
// Ungated: reading the environment.
let version = host::env_sdk_version();

// Gated: the manifest must declare `log:info`.
host::log(LogLevel::Info, "started", None);

// Gated: the manifest must declare `storage:local:read`.
let saved = host::storage_get("last-seen");
```

::: warning The declaration and the call have to agree
A call whose capability is not declared is refused at run time with `capability_denied`. `verify` catches it
earlier, by comparing what the artifact imports against what the manifest declares — which is why the check is
worth running before every install rather than only before publishing.
:::

## Storage

A plugin's storage is its own. Keys are strings, values are strings, and the kernel namespaces them by plugin
so two plugins cannot collide.

| Call | Needs |
| --- | --- |
| `storage_get`, `storage_keys`, `storage_quota` | `storage:local:read` |
| `storage_set`, `storage_delete` | `storage:local:write` |
| `secret_get` | `storage:secure:read` |
| `secret_set`, `secret_delete` | `storage:secure:write` |

`storage` and `secret` are two different places. A secret is encrypted at rest and is never included in a
diagnostic bundle; a storage value is ordinary data.

::: tip A secret is for what would embarrass the user if it leaked
An API token. A cache of server responses is not a secret, and putting it in secure storage costs the user a
decryption on every read.
:::

## Migrations

`migrate` is called when the stored schema version is older than the plugin's. It is the plugin's own chance to
change the shape of what it saved — and the only one, because the kernel does not know what a plugin's values
mean.

::: warning A migration runs once and cannot be re-run
The version is written after it returns. A migration that fails partway leaves a half-migrated store, which is
why the design asks for one that can be interrupted and run again rather than one that assumes it is the only
thing happening.
:::

## Errors

A host call that fails returns the kernel's stable error code, and a plugin branches on that rather than on a
message. See [Error Codes](/reference/errors) for the list.

## Next

- [Building a UI](/plugins/ui) — if the plugin draws something.
- [Testing](/plugins/testing) — what to check before publishing.
- [Capabilities](/reference/capabilities) — what each declaration means to a user.

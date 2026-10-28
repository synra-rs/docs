---
title: Writing the Logic
---

# Writing the Logic

A plugin's code is a Rust library that implements the functions its manifest says it provides, and calls back
into the host through the SDK.

## What the kernel calls

Every plugin must include a Rust headless component implementing the complete WIT world. The SDK provides
all required exports; manifest declarations determine when the host calls them.

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

::: info Two supported templates
Use `headless` for a Wasm plugin or `hybrid` to add a UI bundle. UI-only plugins and the `ui` template
are not supported. Build, verify and native installation require `runtime.headless`.

The CLI and native host validate actual component bytes, including every required export and its signature.
A manifest declaration alone cannot prove that the binary implements an entry point.
:::

## Building a complete package

```bash
synra-plugin build
synra-plugin verify --dir dist
synra-plugin pack --dir dist --out plugin.tgz
```

Build assembles a manifest snapshot, a component and optional UI ZIP in an isolated staging directory,
validates actual bytes, then replaces `dist/` as a complete package. Manifest artifact paths are relative
to that package root, such as `plugin.wasm` and `ui.zip`. Failed rebuilds preserve the previous package;
successful rebuilds remove its stale signature. Nonempty output must carry this project's build marker.

A hybrid packages static source `ui/` without a package manager. Configure framework builds in Cargo.toml:

```toml
[package.metadata.synra.ui]
source = "ui/dist"
directory = "ui"
command = ["pnpm", "run", "build"]
```

Paths are relative to the project root. The argv command runs directly; build does not install dependencies
or concatenate shell commands. On Windows, select the installed executable entry, such as `pnpm.cmd`.
Author-controlled commands must write their own UI assets, keeping CLI output and staging directories separate.
Verify and native installation share actual ZIP checks for the entry, paths, duplicates, links, sizes,
compression ratios and CRC. This authoring gate does not establish cross-device actions or phone UI readiness.

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

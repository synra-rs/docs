---
title: Writing the Logic
---

# Writing the Logic

Implement the SDK's guest traits and export them through `synra_plugin_sdk::export!`.
Use host imports for effects and keep pure business logic independently testable.

## Entry points

| Entry | Purpose |
| --- | --- |
| `activate` / `deactivate` | Acquire and release plugin-owned state |
| `migrate` | Handle the plugin's data schema transition |
| `on_tick` | Scheduled work under the host's budget |
| `on_event` | Receive a routed event |
| `can_handle` / `execute` | Match and execute shared input |
| `invoke` | Execute a declared action, including self-calls from a page |

The complete component world is required even if some handlers return a neutral result.
Do not generate a second binding world or handwrite raw exports.

## Building a complete package

```sh
synra-plugin build
synra-plugin verify --dir dist
synra-plugin pack --dir dist --out plugin.tgz
```

The CLI targets `wasm32-unknown-unknown`, then encodes and verifies the component.
Build stages the complete package before replacing `dist/`; a failed rebuild preserves the previous package.

For a framework UI:

```toml
[package.metadata.synra.ui]
source = "ui/dist"
directory = "ui"
command = ["pnpm", "run", "build"]
```

Paths are project-relative. The command is argv, not a shell script; use the platform's executable
entry where necessary, such as `pnpm.cmd` on Windows. Install UI dependencies before building.
Keep UI output separate from CLI staging and output directories.

## Calling the host

Import `synra_plugin_sdk::host`. Each WIT import is either explicitly ungated or names its
required capability. Scoped checks still happen for the concrete call.

Environment queries read facts. Storage, network, platform effects and device operations require
their own authority. Some host adapters explicitly refuse groups they do not implement;
the presence of an SDK function is not a success guarantee.

## Events

Declare emitted events under your full `_plugin.<id>.` namespace and route receivers through
`handles`. Headless event delivery uses `on_event`; there is no dynamic headless subscribe import.

The host adds sender identity, request and trace context, validates declared payloads and
rechecks installation and grants. A successful emit acknowledges queueing, not remote execution.
UI JavaScript subscriptions and headless event handling are separate routes.

## Storage and migration

Local storage is namespaced by plugin. Use the matching read and write capabilities.
Secure-storage imports exist in the contract, but the current application host explicitly refuses
them; do not describe them as working encrypted storage on every device.

Write migrations so interruption and repeated attempts are safe. Do not assume exactly-once
execution or rollback of all effects when a migration fails.

## Persistent operations

Bind work to its selected device, plugin and session. Recheck cancellation and authorization
after asynchronous steps, and release owned resources on stop, update, disconnection or revocation.

Pointer control uses the host's `input-session` service: the sender needs `device:input` and
target-scoped `device:send`; the receiver needs `platform:control-pointer` and explicit session
consent. The plugin does not call a raw native-pointer function or approve the receiver's dialog.

## Next

- [Building a UI](/plugins/ui).
- [Testing](/plugins/testing).
- [Capabilities](/reference/capabilities).

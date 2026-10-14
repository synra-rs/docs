---
title: Project Structure
---

# Project Structure

A plugin's directory is small, and each file in it has one job. This page says which.

## The files

```
hello-synra/
├─ manifest.json      what the plugin is and what it needs
├─ Cargo.toml         how the Rust is built
├─ src/lib.rs         the plugin's behaviour
├─ README.md          for a person reading the repository
└─ .gitignore
```

A plugin with an interface adds `package.json` and its UI sources; a `hybrid` template has both, and one
manifest describes the pair.

## `manifest.json`

The kernel reads this before it loads anything. It is the file a user's install prompt is built from, so a
field changed here changes what they are asked to approve.

- The identifier and version.
- Which entry points exist — `runtime.headless`, `runtime.ui`, or both.
- The capabilities to declare and the events to emit.
- What the plugin handles: share targets, actions, incoming events.

See [The Manifest](/plugins/manifest) for the fields, and the [schema](/schema/manifest/v1.json) for the exact
shape.

## `Cargo.toml`

| Setting | Why |
| --- | --- |
| `crate-type = ["cdylib"]` | a plugin is a library the kernel loads, not a program |
| `synra-plugin-sdk` | the host calls, and nothing else |
| `opt-level = "s"`, `lto = true` | a plugin is loaded once and called many times, and its size is downloaded |
| `panic = "abort"` | there is nothing to unwind into |

::: info Why the SDK has no dependencies of its own
A plugin that pulled in an async runtime would be one `verify` refuses: the kernel owns the scheduling, and a
plugin that brought its own would be one whose work the kernel cannot see. It also keeps the artifact small,
which is the same decision from the other side.
:::

## `src/lib.rs`

The behaviour: the functions the kernel calls, and the calls the plugin makes back. Which functions a plugin
must provide follows from its `runtime` entries — a headless plugin implements the lifecycle, a UI plugin has
none, a hybrid one has both.

[Writing the Logic](/plugins/authoring) covers it.

## Building it

```bash
synra-plugin build
```

The output is `plugin.wasm` for the headless half, and a built asset directory for the UI half. Both land
where the manifest says they are.

::: warning `target/` is not part of a plugin
It is Rust's build directory, and a plugin's artifact is a single `.wasm` the build produces from it. Packaging
`target/` would be several hundred megabytes a user downloads to get one file.
:::

## Next

- [Writing the Logic](/plugins/authoring) — the Rust side.
- [The Manifest](/plugins/manifest) — every field.
- [Testing](/plugins/testing) — what to check before publishing.

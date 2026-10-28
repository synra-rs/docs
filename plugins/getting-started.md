---
title: Your First Plugin
---

# Your First Plugin

A plugin is a WebAssembly component the kernel loads, plus a manifest that says what it is and what it needs. It
takes about thirty minutes to get one running.

This page goes from an empty directory to a plugin the kernel will install.

## What you need

| Tool | Why |
| --- | --- |
| Rust | plugins are written in it |
| the `wasm32-wasip2` target | it is what a plugin is compiled to |
| `synra-plugin` | scaffolds, builds and checks a plugin |

```bash
rustup target add wasm32-wasip2
cargo install synra-plugin
```

## Scaffold it

```bash
synra-plugin new @your-scope/hello-synra --title "Hello Synra"
```

The identifier is `@scope/name`. The scope is yours, and three are reserved: `synra`, `core` and `system`.
Everything else — the directory name, the artifact name, the cache path — follows from it.

::: info Why the identifier is validated before anything is written
It appears in every path and in every capability string, so finding out later that it is malformed means a
rename. The scaffold checks it the same way the kernel checks it at install, which means a plugin this tool
writes is one that can install.
:::

`--template` chooses what you get:

| Template | What it is |
| --- | --- |
| `headless` | WebAssembly only, no interface |
| `hybrid` | both halves, sharing one manifest |

## What you got

```
hello-synra/
├─ manifest.json
├─ Cargo.toml
├─ src/lib.rs
└─ README.md
```

`src/lib.rs` is where the plugin's behaviour goes. `manifest.json` says what that behaviour is. The two have to
agree — see [The Manifest](/plugins/manifest) for which fields are checked against the code.

## Build it

```bash
synra-plugin build
```

That writes an installable `dist/` directory containing the manifest and `plugin.wasm`; a hybrid also includes `ui.zip`. The release profile is
already tuned for size, because a plugin's size is what a user pays on every install.

## Check it

```bash
synra-plugin verify --dir dist
```

After building, verify `dist/` to check the actual component ABI, declared imports and optional UI ZIP. Missing or unreadable artifacts fail; imports are never silently skipped.

::: tip `verify` runs the checks the kernel runs at install
It exists because an author can act on a failure here and cannot act on one at install time. A plugin that fails
to install on a user's machine is one they will not try twice.
:::

## Try it

Copy the generated `dist/` package directory to a device running Synra and install from the folder. A plugin that is not in a
registry installs from a directory, which is how a plugin is developed: edit, build, install, look.

## Where to go next

- [Project Structure](/plugins/structure) — what each file is for.
- [Writing the Logic](/plugins/authoring) — the Rust side.
- [Building a UI](/plugins/ui) — if it needs to draw something.
- [Testing](/plugins/testing) — what to check before publishing.
- [Publishing](/plugins/publishing) — signing and what a user sees.

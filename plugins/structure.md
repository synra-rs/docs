---
title: Project Structure
---

# Project Structure

Keep source, built package and runtime data separate.

## Source layout

```text
hello-synra/
├─ manifest.json
├─ Cargo.toml
├─ Cargo.lock
├─ src/lib.rs
└─ ui/index.html
```

A headless project omits `ui/`. A framework-based page can add package-manager configuration
and its own build output.

## Package layout

```text
dist/
├─ manifest.json
├─ plugin.wasm
└─ ui.zip
```

The manifest snapshot points to package-relative artifacts. The UI entry is a file inside the ZIP.
Do not package Cargo's `target/` or the installed dependency directory.

## Build configuration

| Location | Controls |
| --- | --- |
| Source manifest | Identity, SDK requirement, runtime files and requested capabilities |
| Cargo.toml | Rust crate, SDK revision and optional UI build command |
| Cargo.lock | Reviewed dependency resolution |
| UI project | Page logic, bundled assets and relative asset paths |

A plugin uses `cdylib`; the CLI handles component encoding. Configure a framework UI through
`package.metadata.synra.ui`, as described in [Writing the Logic](/plugins/authoring#building-a-complete-package).

## Runtime data

Plugin storage and installed artifacts have separate paths. Updating code does not require
overwriting saved data. Do not put secrets or a signing key into the UI bundle.

## Next

- [The Manifest](/plugins/manifest).
- [Writing the Logic](/plugins/authoring).
- [Testing](/plugins/testing).

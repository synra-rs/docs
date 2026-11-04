---
title: Your First Plugin
---

# Your First Plugin

Every Synra plugin includes a Rust/Wasm component. Choose a hybrid template when it also needs a page.

## Prepare the toolchain

Use the development toolchain required by the selected core revision, then install the module target
and the author CLI. This example pins a reviewed SDK/CLI pair:

```sh
rustup target add wasm32-unknown-unknown
cargo install synra-plugin-cli --git https://github.com/synra-rs/synra-core.git --rev ffec0a2dd3833346bccc6f75bb49447c4e2cc9eb --locked
```

The Rust SDK is used from source. Do not depend on an assumed crates.io release.

## Create a project

```sh
synra-plugin new @your-scope/hello-synra --template hybrid --dir hello-synra --title "Hello Synra"
cd hello-synra
```

| Template | Contains |
| --- | --- |
| `headless` | Rust component and manifest |
| `hybrid` | The same component plus a UI bundle |

There is no UI-only template. Plugin ids use `@scope/name`; reserved scopes are refused.

## Pin the SDK

The scaffold writes a version dependency. Before building this development example, replace it
with the same Git revision as the CLI:

```toml
[dependencies]
synra-plugin-sdk = { git = "https://github.com/synra-rs/synra-core.git", rev = "ffec0a2dd3833346bccc6f75bb49447c4e2cc9eb" }
```

Commit Cargo.lock and use a matching host. The SDK's generated guest bindings supply the complete
WIT world; keep the generated entry-point structure while adding your logic.

## Build and verify

```sh
synra-plugin build
synra-plugin verify --dir dist
```

Build compiles a module, encodes the component, packages optional UI assets and validates the actual
package before replacing `dist/`. Raw Cargo output is not an installable component package.

::: tip Build the files you will install
Verify the built `dist/`, not only the source manifest. A hybrid needs both `plugin.wasm` and a valid UI ZIP.
:::

## Install and open

Install the built folder in Synra. Explicitly approve the plugin, grant the capabilities it needs,
and enable it. An empty capability list still requires approval.
Open a hybrid plugin from its management entry.

Use the independent [Starter](https://github.com/synra-rs/synra-plugin-starter) and
[Touchpad](https://github.com/synra-rs/synra-plugin-touchpad) repositories as concrete examples;
each pins its own reviewed dependencies.

## Next

- [Project Structure](/plugins/structure).
- [Writing the Logic](/plugins/authoring).
- [Building a UI](/plugins/ui).

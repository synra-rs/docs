---
title: The Manifest
---

# The Manifest

Every plugin has a `manifest.json` at the root of its package. It says what the plugin is, which
artifact implements it, and what it is allowed to do. The host reads it before running anything,
and `synra-plugin verify` checks it before you publish.

```jsonc
{
  "$schema": "https://synra-app.dev/schema/manifest/v1.json",

  "schemaVersion": 1,
  "id": "@synra-plugin/github-bridge",
  "version": "1.2.0",
  "title": "GitHub Bridge",
  "description": "Recognises GitHub links and opens them, completing shorthand like owner/repo.",

  "publisher": {
    "id": "synra",
    "name": "Synra",
    "pubkey": "…"                       // ed25519, base64
  },

  "sdk": { "min": "1.0.0" },
  "wit": "synra:plugin@1.0.0",

  "runtime": {
    "headless": { "artifact": "plugin.wasm" },
    "ui": { "artifact": "ui.zip", "entry": "index.html" }
  },

  "capabilities": [
    { "cap": "platform:open-url", "reason": "Open the link the user shared." },
    { "cap": "network:fetch:api.github.com", "optional": true,
      "reason": "Resolve private repositories. The plugin works without it." }
  ],

  "shareHandlers": [
    { "kinds": ["text", "url"], "description": "GitHub links and owner/repo shorthand" }
  ],

  "events": [
    {
      "name": "_plugin.@synra-plugin/github-bridge.opened",
      "payload": {
        "type": "object",
        "required": ["url"],
        "properties": { "url": { "type": "string", "maxLength": 2048 } },
        "additionalProperties": false
      }
    }
  ],

  "handles": [
    { "event": "_synra.transfer.completed" }
  ],

  "actions": [
    {
      "name": "open-url",
      "description": "Open a URL on this device",
      "args": {
        "type": "object",
        "properties": { "url": { "type": "string" } },
        "required": ["url"]
      }
    }
  ],

  "pages": [
    { "key": "home", "title": "GitHub Bridge", "path": "/home" }
  ]
}
```

## The fields that matter most

Four of them decide how the plugin behaves, and getting them wrong is what usually causes a plugin
to be refused.

### `runtime`

`headless` is required and points at the `.wasm` component that implements your logic. `ui` is
optional and adds an interface. There is deliberately no `kind`, `isolation` or `target` field —
how a plugin is run is the host's decision, not the plugin's.

### `capabilities`

Everything your plugin may do. This list is checked twice: at install time against the imports the
artifact actually references, and again on every single call. Mark an entry `optional: true` when
the plugin can work without it — the plugin then still activates if the user declines.

::: warning Declaring less than you import
If the artifact imports a host function that is not covered here, installation fails. That check is
what makes "the plugin cannot do more than it declared" true rather than aspirational.
:::

### `events` and `handles`

`events` are the events *you* emit, and each name must live under your own `_plugin.<full-plugin-id>.`
namespace. The owner is the exact scoped package id, including any conventional package prefix;
publishers with the same package name own different namespaces. `handles` are the events you want to receive — built-in ones such as
`_synra.transfer.completed`, or your own.

Declaring your emitted events is not bookkeeping: it is what lets the host check, at install time,
that a paired device's copy of your plugin still understands what you send. Add an optional field
and it stays compatible; add a required one and it does not.

### Keep them in step with the code

The manifest declares `actions`, `handles` and `events`; the artifact implements them. Declaring an
entry you never implement, or implementing one you never declared, is caught by
`synra-plugin verify`.

## Full reference

The complete field list, with every constraint, is the schema itself:

- <https://synra-app.dev/schema/manifest/v1.json>

Your editor reads it automatically from the `$schema` line, which gives you completion and inline
validation as you type. That URL is a published contract: it never changes. Fields are added in a
new version, not in place.

## Next

- [Project Structure](/plugins/structure) — how the files are laid out.
- [Writing the Logic](/plugins/authoring) — the Rust side.

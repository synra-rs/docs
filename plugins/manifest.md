---
title: The Manifest
---

# The Manifest

The host reads `manifest.json` before executing a plugin. It declares identity, runtime artifacts
and requested capabilities.

## Minimal hybrid example

```json
{
  "$schema": "https://synra-app.dev/schema/manifest/v1.json",
  "id": "@your-scope/hello-synra",
  "version": "0.1.0",
  "title": "Hello Synra",
  "description": "A hybrid plugin for Synra.",
  "publisher": { "id": "your-publisher-id" },
  "sdk": { "min": "0.1.0" },
  "wit": "synra:plugin@1.0.0",
  "runtime": {
    "headless": { "artifact": "plugin.wasm", "stateful": false },
    "ui": { "artifact": "ui.zip", "entry": "index.html" }
  },
  "capabilities": []
}
```

This example requests no capabilities. It still needs explicit user approval before running.

## Runtime artifacts

`runtime.headless` is required and names the component. `runtime.ui` adds a page bundle.
Set `stateful` for logic that needs an instance to retain state between calls.
A UI bundle supplements the component; UI-only plugins are not supported.

Artifact paths resolve from the built package root. The UI `entry` resolves inside the ZIP.

## Capabilities

Every requested capability needs a specific purpose. Installation checks actual imports, and
execution checks current grants and scopes. A receiver-only capability can authorize a service
on the receiving host without adding a directly callable native function.

Mark optional functionality with `optional: true` where appropriate, and handle refusal.
A declared capability does not prove that the selected host or platform implements it.

## Actions and events

Declare callable actions in `actions`, emitted event schemas in `events`, and reception selectors
in `handles`. Plugin event names include the full scoped id:
`_plugin.@your-scope/hello-synra.ready`.

Verify checks the actual component ABI and imports. It cannot prove every action branch or
declared event schema is implemented correctly; exercise them in a real host.

## Schema and version alignment

Use the [manifest schema](/schema/manifest/v1.json) for editor validation and the matching
CLI's verify command for runtime-specific checks.
The current schema is maintained as a development contract; do not infer immutable release
compatibility from the `v1` path.

Keep SDK, CLI and host compatible. Rebuilds remove stale signatures, so sign the final package.

## Next

- [Capabilities](/reference/capabilities).
- [Writing the Logic](/plugins/authoring).
- [Signing & Packaging](/plugins/publishing).

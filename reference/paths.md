---
title: Data Locations
---

# Data Locations

The application chooses platform data and cache roots. The CLI/daemon can use their own configured
directory; do not assume a separately running daemon shares the application's state.

## Find the right profile

The application uses Tauri's application data and cache directories for identifier `com.synra.app`.
Android uses application-private storage. Isolated development profiles use different identifiers
and therefore different roots.

For CLI/daemon work, use the configured data directory consistently, including any `SYNRA_DATA_DIR`
override. Consult that binary's help for supported flags rather than passing daemon flags to the GUI.

## Data layout

| Relative path | Contents |
| --- | --- |
| `kernel.db` | SQLite devices, plugin state, configuration and task records |
| `config.json` | Bootstrap configuration |
| `plugins/` | Installed plugin artifacts |
| `plugin-data/` | Separate per-plugin data sandboxes |
| `inbox/` | Received files and packages |
| `logs/` | Host log files |
| `logs/crash/` | Crash records |

A version update replaces artifacts without requiring plugin-data deletion.
Pairing records are database state; current pairing does not depend on a shared encryption secret.

## Cache layout

| Relative path | Contents |
| --- | --- |
| `wasm/` | Compiled component cache |
| `catalog/` | Registry response cache |
| `diagnostics/` | Exported diagnostic bundles |

Logs are under the data root, not the cache root. A diagnostic export is an explicit artifact;
inspect what it contains before sharing it.

## Backup and removal

Quit the host before copying or removing a profile. Back up the data root when preserving settings,
device relationships and plugin data. Deleting it removes that local state and requires setup again.

Do not remove a directory merely because it is named like an old cache.
A relative path is meaningful only together with the host profile that owns it.

## Next

- [Plugin management](/guide/plugins).
- [Troubleshooting](/guide/troubleshooting).

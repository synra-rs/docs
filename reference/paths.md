---
title: Data Locations
---

# Data Locations

Synra keeps everything on the machines it runs on. There is no account, no server, and nothing to sign in to.
This page says where the files are, so a backup, a bug report or a manual clean-up can find them.

## The two roots

Two directories hold everything, and they are separated because they have different lifetimes.

| Root | Holds | Safe to delete |
| --- | --- | --- |
| data | the database, keys, plugins, plugin storage | no — this is the installation |
| cache | compiled plugins, catalogues, logs, crash reports | yes — it is rebuilt |

::: warning Deleting the data directory unpairs every device
The keys are there. Losing them means every other device has to be paired again, because the pairing is a
secret both ends hold rather than a record either end can rebuild.
:::

## Inside the data directory

| Path | Holds |
| --- | --- |
| `db` | the database: devices, plugins, settings, transfers |
| `bootstrap/config.json` | the settings a user has changed |
| `keys/` | this device's identity and pairing secrets |
| `plugins/<id>/` | an installed plugin's artifact and manifest |
| `plugins/data/` | what plugins have saved |

A plugin's saved data is under the plugins directory rather than beside its code, so replacing a plugin's
artifact — an update — does not disturb what it stored.

## Inside the cache directory

| Path | Holds |
| --- | --- |
| `wasm/` | compiled plugin components |
| `catalog/` | downloaded plugin catalogues |
| `logs/` | the kernel's log |
| `diagnostics/` | exported diagnostic bundles |
| `crashes/` | reports from a run that did not exit cleanly |

## Per platform

The two roots are the platform's own directories, chosen by the shell. A machine that should use somewhere
else can say so with `--data-dir`.

| Platform | Data root |
| --- | --- |
| Windows | `%LOCALAPPDATA%\Synra` |
| macOS | `~/Library/Application Support/Synra` |
| Linux | `~/.local/share/synra` |
| Android, iOS | the application's private storage |

::: tip `--data-dir` names the data directory itself
Not its parent. Pointing Synra at `D:\synra-data` puts the database at `D:\synra-data\db`, not at
`D:\synra-data\data\db`.
:::

## Which of it is yours to move

- **A backup** wants the data directory. The cache is rebuilt on the next start.
- **A bug report** wants a diagnostic bundle, which includes the cache's logs and the crash reports but not
  the keys.
- **A clean reinstall** wants both removed, and means pairing every device again.

---
title: Plugins
---

# Plugins

Plugins supply Synra's concrete features. The application provides their installation, permissions,
lifecycle and page container.

## Install

### From a directory

**From a directory** takes a built package folder or a package file.
The host validates the actual manifest, component, UI archive and any supplied signature before it
stores anything.

A hybrid package carries a Rust/Wasm component and a UI ZIP under one manifest.

### From the registry

Registry search queries the sources configured in **Settings → Plugins and sources**, in order.
There is no built-in public catalogue, and an empty list turns registry installs off.

Search by name or exact package id, then open a result to preview it before downloading.
The preview names the plugin, version, publisher, the key the index lists for that publisher, the
requested permissions and the package size. Installing runs the same checks as a local package.

::: tip A source is not a trust decision
Adding a registry, or finding a package in one, trusts nobody and grants nothing.
The publisher key and the plugin's capabilities are decided separately.
:::

## Publisher keys

A signed package records the key that signed it. A key this device has not reviewed starts as
**Not reviewed**, and the plugin list marks it **Publisher not trusted**.
**Publishers** opens every key this device has seen, and counts those still needing a decision.

| State | Meaning |
| --- | --- |
| Not reviewed | A package signed with this key was verified here; nobody has compared it yet |
| Trusted | You accepted this key for future packages from that publisher |
| Revoked | You rejected this key; an installed plugin may still run |

Compare the fingerprint with the one the publisher gave you before trusting a key.
The decision belongs to the key, not the display name: the same name under a different key is a
different publisher. Trusting a key still grants no capability.

## Approve and enable

| Step | Meaning |
| --- | --- |
| Install | Validate and store the package |
| Confirm | Explicitly allow the plugin to run |
| Grant capabilities | Choose the permitted operations and scopes |
| Enable | Request activation |
| Open | Enter the plugin's own page |

::: info No capabilities still needs confirmation
“No permissions required” describes an empty capability list. If approval is pending, choose
“Allow running”; installation and the enabled switch do not silently approve it.
:::

Existing grants open in view mode; choose edit to change them. New capabilities are not preselected.
A failed save keeps your draft so you can correct the cause and retry.

## Updates

**Check for updates** asks the configured registry what it publishes for one installed plugin.
The answer shows the version and whether it asks for the same or for additional permissions.
Nothing is installed until you choose **Update**.

Background checks run once a day for installed plugins.
**Settings → Plugins and sources → Plugin updates** selects what happens next:

| Policy | Background behaviour |
| --- | --- |
| Check manually | No background request; **Check for updates** still works |
| Notify only | Checks, then reports available updates without installing |
| Same major version | Installs a verified update that keeps the major version |
| All stable versions | Installs any verified stable update |

Automatic installation is deliberately narrow: it needs the same trusted publisher key, no added
capability, and a package that passed verification. A version that asks for new permissions waits
for a person. An update keeps plugin data.

## Activity and limits

**Recent calls** lists this plugin's allowed and refused calls on this device, with elapsed time
and a trace a report can quote. **Clear history** removes those records only; plugin data and
permissions stay. Retention is set under **Settings → Plugins and sources → Audit history** and is
applied at the next start.

Each plugin also runs inside limits for memory, instances, calls per second, call time, storage,
open transfers, events, network requests and filesystem operations. Exceeding one returns a
structured error to that call; the host and other plugins keep running.

## Synchronize to devices

Choose **Sync to devices**, inspect the plan and select a paired target.
The target must be reachable to inspect its installed plugins. “Needs plugin files” is a plan
result, not proof that an offline device accepted a transfer.

A received package goes through installation checks. Review the receiving host's confirmation,
permissions and enabled state before opening it.

## Open and return

Desktop plugins open in a separate window. Android uses an independent plugin Activity with a
native return bar and system Back. Navigation remains available outside the plugin document.

Some operations need per-request consent on another host. Pairing and a static grant do not accept
that request for the other user.

## Disable and remove

Disabling stops calls while preserving saved data.

Removal offers a choice about saved data. Use the keep-data option when you intend to reinstall;
check the confirmation rather than assuming uninstall always deletes or always retains it.

## Next

- [Capabilities](/reference/capabilities).
- [Write a plugin](/plugins/getting-started).
- [Troubleshooting](/guide/troubleshooting).

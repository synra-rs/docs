---
title: Devices & Pairing
---

# Devices & Pairing

Device visibility, pairing and current reachability are separate facts.

## Device states

| State | Meaning |
| --- | --- |
| Nearby | A recent discovery announcement exists; pairing may still be needed |
| Paired | The pairing workflow recorded the accepted relationship |
| Online | Recent discovery or a live session indicates current reachability |
| Blocked | Local policy refuses the device, including further connections |

An offline paired device remains paired. A stored address alone does not make it online.

## Pairing step by step

1. A starts pairing with B.
2. A displays a six-digit code and waits. B displays the same code and the requesting name.
3. A can cancel. B can accept, refuse or block.
4. Only acceptance advances the pairing and saves the relationship.
5. Both hosts report the result. A refused or cancelled request grants no usable pairing.

The prompt is application-wide, so the receiver can answer while another page is open.
If the code disappears before a decision or the two hosts disagree, update both hosts and retry.

::: warning What the code proves
The code is a human check for the current request. Current plain-TCP pairing does not exchange a
shared encryption secret and does not authenticate a peer cryptographically.
:::

## Forgetting and blocking

**Forget** removes the local saved relationship or block decision. A later connection needs a new pairing.
Blocking refuses the current request and subsequent connections; it does not grant a paired state.

Review the device's details before removing a decision. The other device's saved state may need to
be reviewed too; do not assume a local deletion remotely resets its database.

## Offline devices

Discovery records expire when a device stops announcing, and an offline announcement also updates
the interface. When it reappears, the host uses its current advertised endpoint.
A changed address or restarted application does not by itself require re-pairing.

## Pairing and plugin permissions

Pairing does not install a plugin, approve its capabilities or accept every future operation.
Each plugin still needs the relevant installation, approval and enabled state; session-based
control asks the target separately.

## Next

- [Plugins](/guide/plugins).
- [Troubleshooting](/guide/troubleshooting).

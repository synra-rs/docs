---
title: Error Codes
---

# Error Codes

Every failure the kernel reports carries a stable code. The code is what a caller branches on; the message
beside it is a sentence for a person, and nothing should match on it.

## How to read a failure

A response that failed carries four things:

| Field | What it is | What to do with it |
| --- | --- | --- |
| `code` | one of the codes below | branch on this |
| `message` | a message **key**, not a sentence | render it in the user's language |
| `retryable` | whether the same call may be made again as it was | decide whether to offer a retry |
| `actions` | what the user can do, in the kernel's order | show them, in that order |

::: warning The message is not a sentence
`message` is a key such as `error.deviceOffline`, and the interface renders it. A program that displayed the
field directly would show the key, and one that matched on it would break the first time a translation
changed.
:::

## Permissions and policy

These are refused before anything runs. The call was understood and the answer is no.

| Code | Means |
| --- | --- |
| `capability_denied` | the plugin was not granted the capability the call needs |
| `scheme_not_allowed` | a URL scheme outside the allowed set |
| `host_not_allowed` | a host outside the plugin's declared allowlist |
| `ip_not_allowed` | an address in a range the network capability refuses — loopback, link-local, private |
| `redirect_blocked` | a redirect pointed outside the allowlist |

::: info Why the address ranges are refused rather than warned about
A plugin holding `network:fetch:*` was granted the ability to reach the internet, not the ability to probe the
network it is running on. Those are different permissions, and only one of them was shown to the user.
:::

## Devices and links

These are about the other end, and most of them are temporary.

| Code | Means | Retryable |
| --- | --- | --- |
| `device_offline` | the target device is not reachable right now | yes |
| `not_paired` | the two devices are not paired | no |
| `transport_not_open` | the link exists but is not usable — still connecting, or draining | yes |
| `timeout` | the operation did not complete in time | yes |

::: tip `not_paired` is the one to act on
It is the only code in this group that a retry cannot fix, and the one with a next step for the user: pairing.
The others are worth waiting out.
:::

## Messages and arguments

These are about what was sent.

| Code | Means |
| --- | --- |
| `invalid_argument` | the arguments did not validate |
| `payload_too_large` | the payload exceeds the ceiling for an inline message |
| `response_too_large` | the response body exceeded the configured ceiling |
| `unsupported` | the action is not supported on this platform, or by this host version |

## Transfers

| Code | Means | Retryable |
| --- | --- | --- |
| `transfer_failed` | the transfer failed for a reason other than integrity | yes |
| `integrity_mismatch` | the received bytes did not match the declared digest | yes |

::: warning An integrity mismatch is not silent corruption
The digest is declared before the bytes are sent, so a mismatch means what arrived is not what was promised.
The kernel discards the partial file rather than keeping it, and a retry starts the transfer again.
:::

## Plugins and the runtime

| Code | Means | Retryable |
| --- | --- | --- |
| `plugin_not_installed` | the target device does not have this plugin installed | no |
| `plugin_trapped` | the plugin trapped, ran out of fuel, or exceeded its memory ceiling | no |
| `plugin_timeout` | the plugin exceeded its time budget | no |
| `protocol_violation` | a plugin exceeded the capabilities it declared, or used a namespace it does not own | no |
| `protocol_version_unsupported` | the peer speaks an incompatible protocol version | no |
| `rate_limited` | too many calls in too short a window | yes |
| `internal` | something unexpected | yes |

::: details Why `internal` is retryable
It reads as the code that should not be retried, and the opposite is deliberate. An `internal` failure is one
the kernel did not anticipate, and the cases it covers — a lock held a moment too long, a task that ran out of
room — are transient far more often than they are permanent. A caller that refused to retry would turn a
hiccup into a failure the user has to work around by hand.
:::

::: info `internal` carries no structure on purpose
If a caller needs to branch on an unexpected failure, that failure is not unexpected — it has a name, and the
name belongs in the list above. An ad-hoc field on `internal` would make it a code with a private meaning.
:::

## What the user should be told

How much of a failure reaches the user is a separate question from which code it carries.

| Visibility | When | What the interface does |
| --- | --- | --- |
| silent | transient network noise, local shutdowns | nothing — it resolves on its own |
| degraded | the feature works, but not fully | say so, without an error |
| visible | the user needs to act | show it, with the suggested actions |

::: tip Silent is a decision, not an omission
A dropped packet during a reconnect is not something to tell the user about. An interface that reported every
code it received would train them to ignore all of them.
:::

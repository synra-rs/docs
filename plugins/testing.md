---
title: Testing
---

# Testing

`synra-plugin verify` runs the checks the kernel runs at install, moved earlier so you can still act on them.
This page says what each one means and what to do about it.

## Running it

```bash
synra-plugin verify
```

A plugin that passes reports only passes. Each finding is one of three:

| Result | Means | What to do |
| --- | --- | --- |
| `ok` | the check ran and passed | nothing |
| `warn` | the check could not run, or found something not fatal | read it; it may be about your machine |
| `fail` | the kernel would refuse this plugin | fix it before publishing |

`--brief` prints the findings without the suggestions, and `--json` prints one JSON value for a script to read.
The exit code is zero only when nothing failed.

## What is checked

| Check | What it looks at |
| --- | --- |
| manifest | the manifest parses and every field validates |
| wasm | the artifact the manifest names exists and is a component |
| imports | what the artifact imports against what the manifest declares |

::: warning A `warn` about imports is not a pass
It means the artifact's imports were not read — usually because there is no artifact yet. The kernel checks
them at install time, so a plugin that shipped with this warning is one whose capability mismatch is found by
a user rather than by you.
:::

## The failure worth understanding

The most common `fail` is a capability the code uses and the manifest does not declare. The symptom at run time
is `capability_denied` on a call that looks correct, because the missing piece is in a different file.

The fix is to add the declaration — never to widen an existing one. A declaration of `network:fetch:*` where
`network:fetch:api.example.com` would do is a plugin the user is less likely to install, and the narrow one is
what earns the install.

## Testing the logic

The SDK's host calls are what a plugin's code calls, so a unit test either stubs them or exercises a pure
function that does not call them. The second is worth arranging for: a plugin whose behaviour is a function
from inputs to outputs is one that can be tested without a kernel at all.

| Approach | Good for |
| --- | --- |
| a pure function, called directly | parsing, deciding, formatting |
| a stub for the host calls | the wiring between them |

## Before publishing

- [ ] `verify` reports no failures.
- [ ] every capability in the manifest is one the plugin actually needs.
- [ ] the version is higher than the published one.
- [ ] the artifact is signed with the publisher's key — see [Publishing](/plugins/publishing).

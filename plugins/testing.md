---
title: Testing
---

# Testing

Verify the package you will install, then exercise the user path in a real host.

## Package validation

```sh
synra-plugin build
synra-plugin verify --dir dist
```

| Check | Establishes |
| --- | --- |
| Manifest | Fields and constraints parse |
| Component | Actual bytes implement the required WIT ABI |
| Imports | Imported host functions have valid declarations |
| UI ZIP | Entry, paths, sizes, duplicates and archive integrity are acceptable |

Unreadable or missing artifacts fail. Passing verify does not establish business behavior,
cross-device delivery or an operating-system effect.

## Logic and page checks

Test pure parsing, decisions and gesture recognition without a host. Test page waiting, refusal,
cancellation, errors and late responses with a mock client.
Keep mock data faithful to serialization: omitted optional fields must also be absent in fixtures.

The SDK's real host imports require a component host; a native unit test is not a substitute for them.

## Host integration

Install the actual package, explicitly approve it, enable it, open its page and invoke its actions.
Check identity, scoped grants and rejection paths through production RPC and real Wasm.

For a two-device feature, drive both endpoints. Confirm that declining or cancelling prevents effects,
and that stopping or revoking permission releases ongoing work.

## Physical device acceptance

| Environment | Can establish |
| --- | --- |
| Browser preview | Layout and browser interaction |
| Loopback TCP | Two-ended transport and protocol behavior |
| Recording platform adapter | Commands and cleanup at the native boundary |
| Real phone and computer | Navigation, touch behavior, native effects and measured performance |

Record which layers ran. Do not report a recording adapter as a physical pointer test.

## Before delivery

- [ ] Build and verify the final package.
- [ ] Check normal, rejected, cancelled and interrupted paths.
- [ ] Match host, SDK and author CLI versions.
- [ ] Inspect new permissions and the final signature.
- [ ] Record device coverage and limits.

## Next

- [Signing & Packaging](/plugins/publishing).
- [Troubleshooting](/guide/troubleshooting).

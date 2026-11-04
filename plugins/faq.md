---
title: FAQ
---

# FAQ

## Does every plugin need Rust?

Yes. Every supported package includes a Rust/Wasm component. A hybrid adds a page;
a UI-only package is refused.

## Why does a no-permission plugin need approval?

An empty capability list means no additional capabilities are requested.
Running installed code is still an explicit user decision. Choose **Allow running**, then enable it.

## Does installing the JS client create a connection?

No. `@synra/client` contains declarations. Synra injects the runtime client;
`@synra/testkit` provides a mock for development.

## Can a plugin directly access the OS?

Wasm uses host imports, capability checks and execution limits.
The UI uses the injected client and the host's browser policy. Neither a declaration nor pairing
bypasses current grants or a required receiver decision.

## Does an API in the SDK work on every host?

No. Check the host implementation and platform support.
For example, secure-storage and generic headless device-send imports are explicitly refused
by the current application adapter. Pointer sessions use a separate implemented service.

## Can I use a device name as a target?

Use its canonical UUID. Names are display text and can change or collide.
A device discovered as `desktop` is a valid computer candidate without identifying its exact OS.

## Can a plugin keep working after I leave its page?

Only work with an appropriate host-owned lifetime can outlive a page.
An interactive control session ends when its page is hidden or closed, permissions change or
the connection is lost. Mobile background execution is not guaranteed.

## Are paired connections encrypted?

Current device communication uses plain TCP. The pairing code is a human check, not a shared
encryption secret. Use a trusted local network.

## What does a successful test prove?

See [Testing](/plugins/testing). A browser preview, real component, loopback connection and
physical platform effect are different evidence.

## Where do I report a problem?

Use the plugin repository for plugin behavior, the application repository for page hosting and
management, and the core repository for the kernel, SDK or author tool. Include versions and
the first error without private data.

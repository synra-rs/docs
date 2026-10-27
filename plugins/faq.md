---
title: FAQ
---

# FAQ

## Do I need to write Rust?

Yes. Every plugin includes a Rust headless component. Add a UI with the `hybrid` template;
the page may use JavaScript or TypeScript, but it accompanies the Rust component.

## Why WebAssembly?

Because it is the only sandbox that answers the question a user actually has: not "can this code read my
memory" but "what can it do to my system". A plugin gets no filesystem, no network and no devices except the
ones it declared and a user approved.

::: info WebAssembly is not the whole answer
It says a plugin cannot make a syscall. It does not say which hosts it may reach, which directories it may
touch or which devices it may send to. Those are the capabilities, and they are what the install prompt is
built from.
:::

## How big is a plugin?

A headless plugin is tens of kilobytes: the release profile is tuned for size, and the SDK carries no
dependencies of its own. A plugin with an interface is larger by whatever its UI bundle is.

## Can two plugins see each other's data?

No. Storage is namespaced by plugin, and a plugin's declared capabilities are checked on every call. A plugin
cannot read another's values even if it guessed a key.

## Can a plugin talk to another device?

Yes, if it declares `device:send:*` or names specific devices. The permission is what the user approved, and
the device list a plugin receives carries identifiers rather than addresses — an address is not something a
plugin was granted.

## What happens when a plugin is updated?

The kernel installs the new version, calls `migrate` if the stored schema version is older, and the plugin
keeps its stored data. A change that removes a field is a major version, which is what tells users the update
is not the one they had.

## What happens when a plugin crashes?

It is stopped, and nothing else is. A plugin runs in its own instance with a time budget and a memory ceiling,
so a plugin that traps or runs out of fuel is one the kernel refuses to keep calling rather than one that takes
the application down.

## Can a plugin run in the background?

On desktop, yes — the kernel is a daemon and a plugin can be loaded without a window. On mobile there is no
always-on background process, so work may be suspended and resumed by the system.

## Why is my call refused with `capability_denied`?

The manifest does not declare the capability the call needs, or the user did not grant it. Both look the same
at run time and are different to fix — the first is a manifest edit, available with `synra-plugin verify`, and
the second is a prompt.

## Where do I report a problem?

The issue tracker for the repository you got the plugin from. For the kernel, the CLI or the SDK, see the links
in the footer.

## Next

- [Your First Plugin](/plugins/getting-started) — start here.
- [Capabilities](/reference/capabilities) — what a declaration means.
- [Error Codes](/reference/errors) — what a refusal is telling you.

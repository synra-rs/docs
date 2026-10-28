---
title: Publishing
---

# Publishing

A published plugin is one a user can install without seeing its source. What makes that reasonable is a
signature: the artifact is signed with a publisher's key, and the kernel refuses one whose signature does not
match.

## Signing

```bash
synra-plugin sign --generate-key
```

That writes the private key where you asked it to, prints it, and writes the public half to `public-key.txt`.
Then, for each release:

```bash
synra-plugin sign --dir dist --key path/to/key
```

::: danger The private key cannot be recovered
Nobody holds a copy but you. A publisher who loses their key cannot ship an update to a plugin users have
already installed, because the new artifact would not verify against the key they trust.
:::

::: warning `--generate-key` prints the private key to the terminal
That is deliberate: a tool that hid it would be one whose keys the author never backed up. It also means the
key ends up in a scrollback buffer, so generate it where that does not matter, and copy it somewhere safe
before closing the window.
:::

## Checking a signature

```bash
synra-plugin sign --dir dist --verify public-key.txt
```

An author verifying their own release before shipping it, or anyone checking an artifact they were handed.

## What is signed

The whole artifact: the WebAssembly component, and for a plugin with an interface, the UI bundle as well. A
bundle whose UI and code ship together is signed as one thing, so a change to either invalidates the
signature.

For a UI bundle the signature covers every file, in a fixed order, so two bundles with the same contents
produce the same signature regardless of how the files were ordered on disk.

## Versioning

| Change | Version |
| --- | --- |
| a fix | patch |
| a new capability, event or action | minor |
| a removed field, a renamed action, a narrower behavior | major |

::: warning A capability change is a new install prompt
Adding one means the user is asked about it. A plugin that adds a capability in a patch release is one whose
users get a prompt they did not expect from a version number that said "a fix".
:::

## What the user sees

| Shown | Where it comes from |
| --- | --- |
| the title and description | the manifest |
| the publisher | the manifest's `publisher.id` |
| what it can do | its declared capabilities, in plain words |
| that it is signed | the artifact's signature against the publisher's key |

See [Capabilities](/reference/capabilities) for how a declaration becomes a sentence.

## Before you publish

- [ ] `synra-plugin verify` reports no failures.
- [ ] the version is higher than the published one.
- [ ] the artifact is signed with the key this publisher has used before.
- [ ] the private key is backed up somewhere that is not this machine.

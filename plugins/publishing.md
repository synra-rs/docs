---
title: Signing & Packaging
---

# Signing & Packaging

Build, verify, sign and package the exact files you intend to distribute.
The author CLI's publish command validates a static distribution; it does not silently upload it.

## Create a signing key

```sh
synra-plugin sign --generate-key
```

The command prints private signing material. Store it securely outside the project and package;
follow the output for the corresponding public key. A signing key file contains 32 bytes as hex.

::: warning Keep private signing material out of logs
Do not run key generation in shared CI logs or commit its output.
A publisher's key needs a separate protected backup.
:::

## Sign and check the built package

```sh
synra-plugin build
synra-plugin verify --dir dist
synra-plugin sign --dir dist --key path/to/private-key
synra-plugin sign --dir dist --verify path/to/public-key.txt
```

The signature binds the manifest digest and named artifact digests, including the UI ZIP.
Changing an artifact or rebuilding requires a new signature.
It does not make an unreviewed publisher trustworthy or grant any capability.

## Package and inspect

```sh
synra-plugin pack --dir dist --out plugin.tgz
```

A registry archive and a locally installed folder are distribution forms of the same package.
Keep the manifest, component, UI and signature together; do not send a raw Cargo module as a plugin.

## Static distribution

Use `pack --index` to create a static registry index.
`publish --index` checks local files, while `upload` uses an author-provided upload command.
Inspect the exact arguments with the pinned tool:

```sh
synra-plugin pack --help
synra-plugin publish --help
synra-plugin upload --help
```

Uploading or publishing is an explicit delivery step, separate from a local build.

## Updates and user decisions

Use meaningful versions and keep publisher identity consistent.
New capabilities require review; an installed update is not permission to run every new operation.
Key changes and revoked publishers also have their own trust decisions.

## Next

- [Testing](/plugins/testing).
- [Plugin management](/guide/plugins).

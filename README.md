# Synra Docs

The website, user documentation and JSON schemas for **Synra** — a cross-device action
orchestration framework.

**Live at [synra-app.dev](https://synra-app.dev)**

> One action on one device becomes an execution on another. Two hosts, both equal: either side can
> share and either side can execute. What actually happens is defined by plugins.

## What is here

- **The home page** — what Synra is, the two models it serves (share/receive, and the shortcut
  panel), and how to get running in thirty seconds.
- **The guide** — installation, first run, devices and pairing, clipboard and file transfer,
  plugins, troubleshooting.
- **The reference** — the capability grammar, the built-in event catalogue, error codes, data
  locations, and the platform capability matrix.
- **Plugin authoring** — the manifest, the headless contract, the UI contract, testing, publishing.
- **The schemas** — served publicly at `/schema/…`, referenced by every plugin manifest's
  `$schema`.

Written twice, in English at `/` and Simplified Chinese at `/zh/`. The two are kept structurally
identical; `pnpm check` enforces it.

## Where the design documents live

They do not live here. This repository addresses **users and plugin authors**; the internal design
documents — target architecture, protocol contracts, ADRs, risks, the roadmap — are in
[`synra-rs/design-docs`](https://github.com/synra-rs/design-docs).

The split is deliberate, and it is why this repository exists separately:

| | This repository | `design-docs` |
| --- | --- | --- |
| Reader | users, plugin authors | us, the implementers |
| Tone | how to install, how to use, what a flag does | why it is designed this way, what it costs |
| Undecided items | never mentioned | explicitly marked |

A page here states **settled** behaviour only. Anything still being decided is not published — a
`🔴` on a public page reads as a promise. CI enforces this.

## Repository map

| Repository | Contains |
| --- | --- |
| [`synra-core`](https://github.com/synra-rs/synra-core) | Rust kernel, CLI, plugin toolchain |
| [`synra-app`](https://github.com/synra-rs/synra-app) | Tauri application (desktop + mobile + host UI) |
| [`synra-js`](https://github.com/synra-rs/synra-js) | Plugin UI type library (`@synra/client` and friends) |
| [`design-docs`](https://github.com/synra-rs/design-docs) | Internal design documents |
| **`docs`** ← this repository | Website, user documentation, JSON schemas |

## Development

```bash
pnpm install
pnpm dev          # local server
pnpm build        # static output in dist/
pnpm check        # bilingual structure check
pnpm lint         # eslint
pnpm typecheck    # vue-tsc --noEmit
```

## Schemas are a public contract

`public/schema/manifest/v1.json` is fetched by every plugin manifest's `$schema`, so its URL is
frozen:

- versions live in the path (`v1`, `v2`) and a published version's **structure never changes** —
  only its `description` text may;
- `public/schema/.frozen/v1.sha256` pins the structural part, and CI fails if it moves;
- served with `Cache-Control: public, max-age=31536000, immutable` and permissive CORS, because the
  URL is immutable and editors fetch it from the browser.

Adding a field means a new version directory, not an edit to `v1`.

## Writing style

`.vitepress/writing-style.md` holds the rules for writing pages here — structure over spacing,
which VitePress container to reach for, how the two languages must stay in step, and what not to
touch when reformatting. It is a working reference, not published content.

## License

MIT


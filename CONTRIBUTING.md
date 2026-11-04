# Working on the documentation

## Preview and checks

Use the pnpm version in package.json.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm ready
pnpm build
```

The checks cover lint, Vue types, bilingual structure, JSON Schemas and public-content rules.
VitePress builds into `dist/` and checks internal links. Review long tables, code groups and navigation at desktop and mobile widths.

## Writing

Follow [.vitepress/writing-style.md](./.vitepress/writing-style.md).
Keep the current theme and typography. Use headings for separate tasks, tables for parallel facts,
and titled VitePress containers for short context or important platform differences.

English pages under guide/, plugins/ and reference/ mirror their Chinese pages under zh/.
Keep headings, containers, table shapes and fenced code synchronized. Translate explanations outside code fences.

## Sources of truth

Check capabilities, command flags and data paths against the matching implementation.
Separate a declared interface from a host implementation and a compiled platform from a verified device.
Public pages describe current behavior; design proposals and historical test counts remain in the design repository.

## Schemas

Public schemas live under `public/schema/`, with reviewed structural digests under `types/frozen/`.
The current schemas are development contracts. A structural change requires review and an explicit
`pnpm exec esno scripts/check-schema.ts --update`, followed by the normal schema check.
Editorial changes alone should not update the digests.

Do not infer an externally released compatibility promise from a `v1` URL.

# Documentation style

The rules pages here are written to. They exist because a page of consecutive paragraphs with no
headings reads as a wall.

This file is a working reference, not published content. `srcExclude` in `.vitepress/config.mts`
keeps it off the site, and nothing links to it.

## Structure first, spacing second

Most "the text is too dense" complaints are a structure problem, not a leading problem.

- **Break parallel content into `###`.** If a section holds four points that each begin with a
  bolded phrase, those are four subsections, not four paragraphs.
- **One idea per paragraph**, two to four sentences. A paragraph that runs past five is usually two
  paragraphs, or a list.
- **A list beats a paragraph that enumerates things.** If you are writing "the first is…, the
  second is…", use a list.
- **A table beats a list of parallel facts.** If every item has the same two or three attributes,
  the attributes are columns.
- **Keep manual line breaks at ~100 columns** in source. The published line width comes from CSS,
  not from the source; the source width is for editing.

## VitePress modules, and when each one earns its place

All of these are built in. Use them; do not add styling or custom components.

| Module | Use it for |
| --- | --- |
| `::: code-group` | Two or more interchangeable ways to do the same thing — per-platform, per-shell. **Not** for sequential steps. |
| `::: tip` | The main shortcut, or a rule worth remembering. At most one per section. |
| `::: info` | Background that helps but is not required. |
| `::: warning` | Something that will bite the reader: a data-loss risk, silent misbehaviour, a platform difference with consequences. |
| `::: danger` | Destructive and irreversible. |
| `::: details` | Deep material that interrupts the main line: wire formats, full tables, the long reasoning behind a decision. |
| `- [ ]` / `- [x]` | Task lists — a short set of things the reader confirms. Non-interactive here. |
| `**bold**` / `*italic*` / `` `code` `` | Inline emphasis. Do not bold a whole sentence. |

A container's title is **required**, not optional: `::: tip Just want to try it?` rather than a bare
`::: tip`.

This is a hard rule rather than a preference. VitePress 1.6.x cannot translate container titles per
locale — its `LocaleSpecificConfig` has no `markdown` field, so `markdown.container` under
`locales.zh` is silently ignored. A bare `::: tip` on a Chinese page therefore renders the English
word `TIP`. An explicit title on every container sidesteps the limitation and reads better anyway.

### One feature that is not built in

| Feature | Status in 1.6.x | What this site does |
| --- | --- | --- |
| Task lists (`- [ ]`) | Not supported. No Task Lists section in its markdown guide, and no `task-list` rules in the default theme. | `markdown-it-task-lists` in `.vitepress/config.mts`, plus the task-list block in `chrome.css` — the plugin marks up the HTML and ships no CSS. |

The lesson generalises: when a VitePress feature seems to do nothing, check the pinned version's own
docs before assuming the configuration is wrong.

## What must not appear on a page

`scripts/check-public-content.ts` fails the build on all of these, and the reasons are worth knowing
rather than just obeying:

- **Undecided items.** `🔴`, "not yet decided", "planned". A page here states settled behaviour. An
  open question reads as a promise.
- **Links into `synra-rs/design-docs`.** That repository is for implementers and is full of
  trade-offs and open questions. A reader who follows a link there cannot tell which parts are real.
- **Absolute promises** such as "works on every platform". Platform differences are real; use the
  support matrix.

Fenced code is exempt: quoted command output may legitimately contain any of these strings, and
rewriting it to satisfy a checker would make the documentation wrong.

## Consistency across languages

`guide/`, `plugins/` and `reference/` are mirrored under `zh/`. `scripts/check-structure.ts`
enforces:

- the same `h2` / `h3` at the same positions and in the same order;
- the same containers in the same places, with translated titles;
- the same tables with the same rows;
- the same code blocks **byte for byte** — code, comments inside fences, and command output are
  never translated.

### Pages that are not translated yet

A page whose English side is finished and whose Chinese side is still a stub cannot have
byte-identical code fences, because the Chinese side has no code. Such a pair declares itself:

```yaml
---
translated: false
---
```

Heading and container structure is **still** compared, so a stub keeps the shape of the page it will
become and a translation cannot drift into a different outline unnoticed. Only code fences and table
rows are skipped. Removing the line is what marks a page as translated.

Generate the mirror with:

```bash
pnpm translate guide/installation.md      # one page
pnpm translate --all-untranslated         # everything still flagged
```

It reports headings with no entry in its `HEADING_MAP` and leaves them in English rather than
guessing. Add the translation there and run it again.

`pnpm check:public` prints how many pages are still flagged, so the backlog stays a visible number.

## What not to touch

Rewriting for layout must not change meaning:

- commands, flags, file names, paths, type names, numbers;
- quoted console output inside code fences;
- the technical claims;
- existing internal links and their targets;
- frontmatter, except where a page genuinely needs a page-level setting.

If a sentence is unclear while you are restructuring it, leave the wording alone and note it in your
report rather than guessing.

## Schema pages

`reference/` documents the capabilities grammar, the built-in event catalogue and the error codes.
Those three must agree with `public/schema/` and with `synra-core`:

- a field name in a table is the field name in the code, spelled the same way;
- a code block showing a manifest snippet is checked by `pnpm check` once the schema comparison job
  exists;
- if you add a section here, check whether the schema's `description` for the same thing needs the
  same correction. They are read side by side.

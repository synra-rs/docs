/**
 * Ambient declarations for things that have no types of their own.
 *
 * Kept in one file, and kept honest: each entry says why it is here rather than leaving a bare
 * `declare module '…'` that a future reader has to re-derive.
 */

/**
 * `markdown-it-task-lists` ships no declaration file and has no `@types` package.
 *
 * Only the options this site passes are typed. Typing the full markdown-it surface would mean
 * depending on `markdown-it`'s own types for no benefit: the plugin is used at exactly one call
 * site, in `config.mts`, with two options.
 */
declare module 'markdown-it-task-lists' {
  import type { PluginSimple } from 'markdown-it'

  interface TaskListOptions {
    /** Keeps the checkboxes non-interactive. These are a checklist, not a form. */
    enabled?: boolean
    /** Renders the item text in a `<label>`, so the whole line is clickable. */
    label?: boolean
    labelAfter?: boolean
  }

  const taskLists: PluginSimple extends (md: infer M) => void
    ? (md: M, options?: TaskListOptions) => void
    : never

  export default taskLists
}

/**
 * CSS imports.
 *
 * A stylesheet has no type to check, and TypeScript has no built-in knowledge of `.css` imports.
 * VitePress does declare them, but only in its own client entry, which TypeScript cannot reach
 * through this package's `types` setting (its `vite` dependency is private to VitePress).
 *
 * Consequence worth knowing: a typo in a `.css` path is not caught here. The build fails instead,
 * which is also where it would fail with the upstream declarations, so nothing is lost.
 */
declare module '*.css' {
  const css: string
  export default css
}

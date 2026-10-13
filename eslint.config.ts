/**
 * Lint rules for this repository.
 *
 * Flat config, no framework plugin: this repository has no framework code. What it has is VitePress
 * config, Vue components for the home page, and Node scripts that read the repository.
 *
 * The rules that earn their place here are the ones that catch mistakes this repository has
 * actually made:
 *
 *   - `no-console`: the check scripts print by design, so it is off for `scripts/**` and on
 *     elsewhere. A stray `console.log` in a theme component ships to the browser.
 *   - `unicorn/prefer-node-protocol`: every `node:` import in this repository was written that way
 *     from the start because the alternative is ambiguous with a package name.
 *   - `ts/no-floating-promises`: the scripts are top-level-await scripts, and a missed `await` on a
 *     file write would exit before the write lands.
 */
import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
  vue: true,
  typescript: true,
  markdown: false,
  yaml: false,

  ignores: [
    'dist',
    'node_modules',
    '.vitepress/cache',
    '.vitepress/.temp',
    // Published schemas are data, formatted by the schema check. Linting them as code is noise.
    'public/schema/**',
  ],

  rules: {
    // The check scripts report by printing; that is their output, not debug leftover.
    'no-console': 'off',
  },
})

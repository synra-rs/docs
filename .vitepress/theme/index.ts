/**
 * The single theme both locales extend.
 *
 * This file is the theme VitePress resolves for the root locale. The Chinese site re-exports it
 * (`theme/zh/index.ts`) so there is exactly one implementation; the `en/` and `zh/` directories
 * exist only because VitePress looks for a locale's theme at `<locale>/theme/index.*` and treats a
 * locale directory without one as an error.
 *
 * Everything shared lives in `./shared/`: components, composables, styles.
 */
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import Home from './shared/components/Home.vue'
import './shared/styles/tokens.css'
import './shared/styles/chrome.css'

export const synraTheme = {
  extends: DefaultTheme,

  /**
   * A custom layout rather than the default `layout: home`.
   *
   * The hero has to hold a live component (the two-device demo), which frontmatter cannot express.
   * Every non-home page falls through to the default layout, so the documentation stays on stock
   * VitePress -- which is the point: docs pages should look like docs pages.
   */
  Layout: Home,
} satisfies Theme

export default synraTheme

/**
 * The Chinese locale's theme.
 *
 * Re-exports the single implementation in the parent directory. See `theme/en/index.ts` for why a
 * per-locale file is needed at all.
 *
 * The locale-specific *strings* are not here: the components read `isZh` from the route and pick
 * their own copy, so there is no translation table to keep in sync with a file layout.
 */
export { default } from '../index'

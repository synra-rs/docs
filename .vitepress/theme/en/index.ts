/**
 * The English locale's theme.
 *
 * Re-exports the single implementation in the parent directory. This file exists because VitePress
 * resolves a locale's theme from `<locale>/theme/index.*` and errors when a locale directory has
 * none -- not because there is anything English-specific to add.
 */
export { default } from '../index'

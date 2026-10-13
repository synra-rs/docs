/**
 * Compares the English and Chinese halves of the site, structurally.
 *
 * The two are the same document in two languages, so they must agree on: heading levels and order,
 * container type and order, fenced-code count, and table row count. Code inside fences is compared
 * byte for byte — commands and console output are never translated.
 *
 * ── Pages that are not translated yet ──────────────────────────────────────────────────────────
 *
 * A page whose English side is finished but whose Chinese side is still a stub cannot have
 * byte-identical code fences, because the Chinese side has no code yet. Rather than force the two
 * into agreement — which would mean either writing a translation that does not exist or deleting
 * the English content — such a pair declares itself:
 *
 *     ---
 *     translated: false
 *     ---
 *
 * Heading and container structure is *still* compared for those pairs, so a stub keeps the shape of
 * the page it will become and a translation cannot drift into a different outline unnoticed. Only
 * code fences and table rows are skipped. Removing the flag is what marks a page as translated, and
 * `check-public-content.ts` reports how many remain so the gap stays visible.
 *
 * The two `index.md` files are excluded entirely: they carry no prose, only frontmatter.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/** Section directories that must exist in both languages. */
const SECTIONS = ['guide', 'plugins', 'reference'] as const

interface Analysis {
  headings: number[]
  containers: string[]
  fences: string[]
  tableRows: string[]
  unclosed: boolean
}

interface PagePair {
  en: string
  zh: string | null
}

/** Reads a `key: value` pair out of YAML frontmatter, without a YAML dependency. */
function frontmatter(text: string): Record<string, string> {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match)
    return {}

  const out: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    // A literal space after the colon rather than `\s*`: the two would overlap (`.*` can also
    // match spaces), which is what makes a regex backtrack, and `frontmatter` is called on every
    // page. No space means no value.
    const kv = line.match(/^([A-Z][\w-]*): (.*)$/i)
    if (kv)
      out[kv[1]] = kv[2].trim()
  }
  return out
}

/** Splits a page into the things that must match across languages. */
function analyse(text: string): Analysis {
  const headings: number[] = []
  const containers: string[] = []
  const fences: string[] = []
  const tableRows: string[] = []
  let inFence = false
  let buffer: string[] = []

  for (const line of text.split(/\r?\n/)) {
    if (/^\s*```/.test(line)) {
      if (inFence) {
        fences.push(buffer.join('\n'))
        buffer = []
      }
      inFence = !inFence
      continue
    }

    if (inFence) {
      buffer.push(line)
      continue
    }

    const heading = line.match(/^(#{1,6})\s+/)
    if (heading) {
      headings.push(heading[1].length)
      continue
    }

    const container = line.match(/^:::\s*(tip|info|warning|danger|details)\s/)
    if (container) {
      containers.push(container[1])
      continue
    }

    // A table row, excluding the delimiter row (`| --- |`).
    if (/^\s*\|.*\|\s*$/.test(line) && !/^\s*\|[\s:|-]+\|\s*$/.test(line))
      tableRows.push(line)
  }

  return { headings, containers, fences, tableRows, unclosed: inFence }
}

/** Every page that exists in both halves, plus any that do not. */
function collect(): PagePair[] {
  const out: PagePair[] = []

  for (const section of SECTIONS) {
    const enDir = join(root, section)
    if (!existsSync(enDir))
      continue

    for (const name of readdirSync(enDir)) {
      if (!name.endsWith('.md'))
        continue
      const zhPath = join(root, 'zh', section, name)
      out.push({ en: `${section}/${name}`, zh: existsSync(zhPath) ? `zh/${section}/${name}` : null })
    }
  }

  return out
}

let failures = 0
let checked = 0
let untranslated = 0

for (const pair of collect()) {
  if (!pair.zh) {
    console.log(`${pair.en.padEnd(34)}  MISSING Chinese page`)
    failures++
    continue
  }

  const enText = readFileSync(join(root, pair.en), 'utf8')
  const zhText = readFileSync(join(root, pair.zh), 'utf8')
  const en = analyse(enText)
  const zh = analyse(zhText)

  // Either side may carry the flag; the pair counts as untranslated if either says so.
  const translated = frontmatter(enText).translated !== 'false'
    && frontmatter(zhText).translated !== 'false'

  const problems: string[] = []
  const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

  // Compared unconditionally: a stub still has to have the shape of the page it will become.
  if (!same(en.headings, zh.headings))
    problems.push(`headings EN[${en.headings}] != ZH[${zh.headings}]`)
  if (!same(en.containers, zh.containers))
    problems.push(`containers EN[${en.containers}] != ZH[${zh.containers}]`)

  if (translated) {
    if (en.fences.length !== zh.fences.length) {
      problems.push(`fence count ${en.fences.length} != ${zh.fences.length}`)
    }
    else {
      const differing = en.fences
        .map((body, i) => (body === zh.fences[i] ? null : i + 1))
        .filter((i): i is number => i !== null)
      if (differing.length)
        problems.push(`code differs in fence(s): ${differing.join(', ')}`)
    }

    if (en.tableRows.length !== zh.tableRows.length)
      problems.push(`table rows ${en.tableRows.length} != ${zh.tableRows.length}`)
  }
  else {
    untranslated++
  }

  if (en.unclosed)
    problems.push('unclosed fence in English page')
  if (zh.unclosed)
    problems.push('unclosed fence in Chinese page')

  checked++
  if (problems.length) {
    failures++
    console.log(`${pair.en.padEnd(34)}  FAIL`)
    for (const problem of problems) console.log(`      ${problem}`)
  }
  else if (!translated) {
    console.log(`${pair.en.padEnd(34)}  ok   h${en.headings.length} · boxes ${en.containers.length} · UNTRANSLATED`)
  }
  else {
    console.log(
      `${pair.en.padEnd(34)}  ok   h${en.headings.length} · boxes ${en.containers.length} · fences ${en.fences.length} · rows ${en.tableRows.length}`,
    )
  }
}

console.log('-'.repeat(60))
console.log(`${checked} pairs checked, ${failures} with differences, ${untranslated} not translated yet`)
process.exit(failures ? 1 : 0)

/**
 * Guards what may appear on a published page.
 *
 * The site is a promise. Three kinds of sentence break that promise, and all three are easy to
 * write by accident because they are exactly what the internal design documents are full of:
 *
 *   1. **Undecided items.** `🔴`, "not yet decided", "planned". On a design page these are honest;
 *      on this site a reader takes them as a commitment. If it is not settled, it does not ship.
 *
 *   2. **Links into the design documents.** A reader who follows one lands in a page full of
 *      trade-offs and open questions, with no way to tell which parts are real. The split between
 *      this repository and `synra-rs/design-docs` is deliberate; this keeps it real.
 *
 *   3. **Unbounded promises.** "works everywhere", "always". Platform differences are real and the
 *      honest answer is a matrix. Checked as a short explicit list rather than a heuristic, because
 *      a heuristic here produces false positives that people learn to ignore.
 *
 * It also reports the translation backlog — pages still carrying `translated: false` — as a number
 * printed on every run. Not a failure: a stub is a legitimate state, and failing on it would mean
 * either blocking a commit for a missing translation or hiding the page.
 *
 * Fenced code is exempt from the content rules. A command's output may legitimately contain any of
 * these strings, and rewriting quoted output to satisfy a checker would make the documentation
 * wrong.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/** Entries whose contents are published. */
const PUBLIC_ENTRIES = ['guide', 'plugins', 'reference', 'zh', 'index.md'] as const

interface Rule {
  label: string
  re: RegExp
  why: string
}

const FORBIDDEN: Rule[] = [
  {
    label: 'undecided marker',
    re: /🔴/,
    why: 'A red circle is how the design documents mark "not settled". On this site it reads as a promise.',
  },
  {
    label: 'undecided wording',
    re: /(尚未拍板|还没定|待定|未定|计划中|to be decided|not yet decided|still being decided)/i,
    why: 'Say what is true today. If the behaviour is not settled, do not document it yet.',
  },
  {
    label: 'internal design-document link',
    re: /synra-rs\/design-docs|design-docs\//,
    why: 'Design documents are for implementers. A reader who lands there cannot tell trade-offs from commitments.',
  },
  {
    label: 'TODO',
    re: /\bTODO\b/,
    why: 'A TODO on a published page is a leak, not a note.',
  },
  {
    label: 'absolute promise',
    re: /(在所有平台上都|所有平台都支持|works on every platform|always works|guaranteed to work)/i,
    why: 'Platform differences are real. Use the support matrix instead of an absolute.',
  },
]

/** Every published markdown file. */
function collect(): string[] {
  const out: string[] = []

  const walk = (dir: string): void => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name)
      if (statSync(full).isDirectory()) {
        walk(full)
        continue
      }
      if (name.endsWith('.md'))
        out.push(full)
    }
  }

  for (const entry of PUBLIC_ENTRIES) {
    const full = join(root, entry)
    if (!existsSync(full))
      continue
    if (statSync(full).isFile()) {
      if (full.endsWith('.md'))
        out.push(full)
      continue
    }
    walk(full)
  }

  return out
}

/** 1-based line number of a character offset. */
function lineOf(text: string, offset: number): number {
  return text.slice(0, offset).split(/\r?\n/).length
}

let failures = 0
let checked = 0

console.log('published content')
console.log('-'.repeat(60))

for (const file of collect()) {
  const rel = relative(root, file).replace(/\\/g, '/')
  const text = readFileSync(file, 'utf8')
  const withoutFences = text.replace(/```[\s\S]*?```/g, '')
  const problems: string[] = []

  for (const rule of FORBIDDEN) {
    const match = withoutFences.match(rule.re)
    if (match && match.index !== undefined)
      problems.push(`${rule.label} at line ${lineOf(withoutFences, match.index)}: ${rule.why}`)
  }

  checked++
  if (problems.length) {
    failures++
    console.log(`${rel.padEnd(40)}  FAIL`)
    for (const problem of problems) console.log(`      ${problem}`)
  }
}

console.log('-'.repeat(60))
if (failures) {
  console.log(`${checked} file(s) checked, ${failures} with problems`)
}
else {
  console.log(`${checked} file(s) checked`)
  console.log('no undecided items, no design-document links, no absolute promises')
}

const pending = collect().filter((file) => {
  const rel = relative(root, file).replace(/\\/g, '/')
  if (!rel.startsWith('zh/'))
    return false
  return /^---\r?\n[\s\S]*?^translated:\s*false\s*$/m.test(readFileSync(file, 'utf8'))
})

if (pending.length) {
  console.log('')
  console.log(`${pending.length} page(s) still awaiting translation (translated: false):`)
  for (const file of pending) console.log(`  ${relative(root, file).replace(/\\/g, '/')}`)
}

process.exit(failures ? 1 : 0)

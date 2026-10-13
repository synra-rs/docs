/**
 * Validates the published JSON Schemas.
 *
 * Two different things are checked, and they are checked differently:
 *
 *   1. **Structure** — every schema is valid JSON, is a JSON Schema 2020-12 document, and every
 *      `$ref` inside it resolves. A broken schema is worse than a missing one: an editor silently
 *      stops validating, and the author gets no errors until `verify` rejects the package at
 *      publish time.
 *
 *   2. **Frozen versions** — a published version's structure must not change. `manifest/v1.json`
 *      is fetched by every plugin manifest's `$schema`, so a field added to it retroactively
 *      changes what "valid" means for packages already in the wild. Adding a field means a new
 *      version directory.
 *
 *      The freeze compares a *structural* digest: `description`, `title` and similar prose are
 *      excluded, so wording can be fixed in place while the contract stays put.
 *
 * The digests live in `types/frozen/`, outside `public/`. That placement is deliberate: VitePress
 * copies everything under `public/` into the published output, and it does so after Vite's own
 * bundle phase, so there is no hook to filter them out. Keeping build metadata outside `public/` is
 * what makes `public/` mean exactly "what gets published".
 *
 * Usage: esno scripts/check-schema.ts            # check
 *        esno scripts/check-schema.ts --update   # rewrite the digests (review the diff!)
 */
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const schemaRoot = join(root, 'public', 'schema')
const frozenRoot = join(root, 'types', 'frozen')

const update = process.argv.includes('--update')

/** Keys whose values are prose and may be revised without breaking the contract. */
const PROSE_KEYS = new Set(['description', 'title', 'examples', '$comment', 'markdownDescription'])

/**
 * Files under `public/schema/` that are data rather than schemas.
 *
 * The index is how tooling discovers versions, so it belongs next to the schemas it points at. It
 * still has to be valid JSON with no unresolved refs — it just is not a schema, so it has no `$id`
 * to match its path and nothing to freeze.
 */
const DATA_FILES = new Set(['index.json'])

/**
 * Canonical JSON with prose stripped, so a digest changes only when the contract does.
 *
 * Object keys are sorted because JSON key order carries no meaning, and a reordered file is not a
 * change to the schema.
 */
function canonical(value: unknown): unknown {
  if (Array.isArray(value))
    return value.map(canonical)

  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const key of Object.keys(value).sort()) {
      if (PROSE_KEYS.has(key))
        continue
      out[key] = canonical((value as Record<string, unknown>)[key])
    }
    return out
  }

  return value
}

/** Every `*.json` under `public/schema`. */
function collect(): string[] {
  const out: string[] = []

  const walk = (dir: string): void => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name)
      if (statSync(full).isDirectory()) {
        walk(full)
        continue
      }
      if (name.endsWith('.json'))
        out.push(full)
    }
  }

  walk(schemaRoot)
  return out
}

/** Resolves a local `$ref` (`#/a/b`) against the document root. */
function resolveRef(doc: unknown, ref: string): { value?: unknown, missing?: string, external?: boolean } {
  if (!ref.startsWith('#'))
    return { external: true }

  let cur: unknown = doc
  for (const raw of ref.slice(1).split('/').filter(Boolean)) {
    const key = raw.replace(/~1/g, '/').replace(/~0/g, '~')
    if (cur && typeof cur === 'object' && key in cur)
      cur = (cur as Record<string, unknown>)[key]
    else
      return { missing: ref }
  }

  return { value: cur }
}

/** Walks the document collecting every `$ref` string. */
function collectRefs(node: unknown, out: string[] = []): string[] {
  if (Array.isArray(node)) {
    for (const item of node) collectRefs(item, out)
  }
  else if (node && typeof node === 'object') {
    const record = node as Record<string, unknown>
    if (typeof record.$ref === 'string')
      out.push(record.$ref)
    for (const value of Object.values(record)) collectRefs(value, out)
  }
  return out
}

let failures = 0

console.log('schema files')
console.log('-'.repeat(60))

for (const file of collect()) {
  const rel = relative(schemaRoot, file).replace(/\\/g, '/')
  const problems: string[] = []
  const isData = DATA_FILES.has(rel)

  let doc: Record<string, unknown>
  try {
    doc = JSON.parse(readFileSync(file, 'utf8')) as Record<string, unknown>
  }
  catch (error) {
    failures++
    console.log(`${rel.padEnd(34)}  FAIL  invalid JSON: ${(error as Error).message}`)
    continue
  }

  if (!isData) {
    if (doc.$schema !== 'https://json-schema.org/draft/2020-12/schema')
      problems.push(`$schema must be the 2020-12 dialect, got ${JSON.stringify(doc.$schema)}`)

    if (typeof doc.$id !== 'string' || !doc.$id.startsWith('https://synra-app.dev/schema/'))
      problems.push('$id must be an absolute synra-app.dev/schema/… URL')

    // `$id` must match where the file is actually served from, or refs between schemas mislead.
    if (typeof doc.$id === 'string') {
      const expected = `https://synra-app.dev/schema/${rel}`
      if (doc.$id !== expected)
        problems.push(`$id is ${doc.$id} but the file is served at ${expected}`)
    }
  }

  for (const ref of collectRefs(doc)) {
    const result = resolveRef(doc, ref)
    if (result.missing)
      problems.push(`unresolvable $ref: ${result.missing}`)
    if (result.external)
      problems.push(`external $ref is not allowed here (offline validation must work): ${ref}`)
  }

  /**
   * A versioned schema must be frozen.
   *
   * The freeze is what makes "a published version never changes" enforceable rather than a promise
   * in a comment. Data files are exempt: the index has no structure anyone validates against.
   */
  const versioned = !isData && /\/v\d+\.json$/.test(rel)
  const frozenPath = join(frozenRoot, `${rel.replace(/\//g, '__')}.sha256`)
  const digest = createHash('sha256').update(JSON.stringify(canonical(doc))).digest('hex')

  if (versioned) {
    if (update) {
      mkdirSync(frozenRoot, { recursive: true })
      writeFileSync(frozenPath, `${digest}\n`)
    }
    else if (!existsSync(frozenPath)) {
      problems.push(`no frozen digest; run \`pnpm check:schema --update\` and commit ${relative(root, frozenPath)}`)
    }
    else if (readFileSync(frozenPath, 'utf8').trim() !== digest) {
      problems.push(
        'a published version\'s structure changed. A published schema is a contract: add a new '
        + 'version directory instead of editing this one. If the change was only prose, the digest '
        + 'would not have moved -- so this is structural.',
      )
    }
  }

  if (problems.length) {
    failures++
    console.log(`${rel.padEnd(34)}  FAIL`)
    for (const problem of problems) console.log(`      ${problem}`)
  }
  else {
    const label = isData ? 'data' : versioned ? `frozen ${digest.slice(0, 12)}` : 'unversioned'
    console.log(`${rel.padEnd(34)}  ok   ${label}`)
  }
}

console.log('-'.repeat(60))
console.log(failures ? `${failures} file(s) failed` : 'all schemas valid')
process.exit(failures ? 1 : 0)

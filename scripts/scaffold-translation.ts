/**
 * Generates a structurally-mirrored Chinese stub from an English page.
 *
 * Why this exists: `check-structure.ts` requires the two languages to agree on heading levels and
 * order, and on container types and order, whether or not a page has been translated. That rule is
 * what keeps a translation from drifting into a different outline. It also means a stub cannot be a
 * single `# heading` — it has to have the shape of the page it will become.
 *
 * So the stub is generated rather than hand-written: same `##`/`###` in the same order, same
 * containers in the same places, headings translated, body replaced by a note, and
 * `translated: false` in the frontmatter so the checker skips code and table comparison and
 * `check-public-content.ts` reports the page as outstanding.
 *
 * A scaffolding tool for writing translations, not part of the build. Run it, edit what it produced,
 * then delete the `translated: false` line.
 *
 * Usage: esno scripts/scaffold-translation.ts guide/installation.md
 *        esno scripts/scaffold-translation.ts --all-untranslated
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/** Section directories that hold translatable pages. */
const SECTIONS = ['guide', 'plugins', 'reference'] as const

/**
 * Heading translations.
 *
 * A flat lookup keyed on the English heading text, deliberately: the whole point is that a human
 * reads the result and fixes the wording, so an exact map that reports an unknown heading is more
 * useful than a guess that silently produces something wrong.
 */
const HEADING_MAP: Record<string, string> = {
  // guide/plugins.md
  'What installing asks you': '安装时会问你什么',
  'What a plugin can reach': '插件能触达什么',
  'Where plugins come from': '插件从哪里来',
  'Turning one off': '关掉一个插件',
  'What is built in': '内置的部分',
  // guide/devices-and-pairing.md
  'Seeing and being seen': '看见与被看见',
  'How pairing goes': '配对的过程',
  'Why a request can be refused': '请求为什么会被拒绝',
  'Blocking': '拉黑',
  'What a paired device learns': '已配对设备会知道什么',
  'When a device goes quiet': '设备安静下来时',
  // guide/transfers.md
  'Text': '文本',
  'Files': '文件',
  'Pausing and resuming': '暂停与续传',
  'Where a received file goes': '收到的文件去哪',
  'Clipboard sync': '剪贴板同步',
  // guide/troubleshooting.md
  'Start with the diagnostic': '先跑诊断',
  'What each probe means': '每个探针的含义',
  'The two devices cannot see each other': '两台设备互相看不见',
  'They can see each other and not pair': '看得见但配不上对',
  'A transfer stops': '传输中断了',
  'Where the logs are': '日志在哪里',
  // plugins/getting-started.md
  'What you need': '需要什么',
  'Scaffold it': '生成脚手架',
  'What you got': '生成了什么',
  'Build it': '构建',
  'Check it': '检查',
  'Try it': '试一试',
  'Where to go next': '接下来看什么',
  // plugins/structure.md
  'The files': '文件',
  '`manifest.json`': '`manifest.json`',
  '`Cargo.toml`': '`Cargo.toml`',
  '`src/lib.rs`': '`src/lib.rs`',
  'Building it': '构建它',
  // plugins/authoring.md
  'What the kernel calls': '内核调用什么',
  'Calling the host': '调用宿主',
  'Storage': '存储',
  'Migrations': '迁移',
  'Errors': '错误',
  // plugins/testing.md
  'Running it': '运行它',
  'What is checked': '检查了什么',
  'The failure worth understanding': '值得弄懂的那个失败',
  'Testing the logic': '测试逻辑',
  'Before publishing': '发布之前',
  // plugins/ui.md
  'The two kinds of plugin': '两类插件',
  'The injected client': '注入的客户端',
  'Declaring the pages': '声明页面',
  'Capabilities and the interface': '能力与界面',
  'Styling': '样式',
  // plugins/publishing.md
  'Signing': '签名',
  'Checking a signature': '校验签名',
  'What is signed': '签的是什么',
  'Versioning': '版本',
  'Before you publish': '发布之前',
  // plugins/faq.md
  'Do I need to write Rust?': '我需要写 Rust 吗？',
  'Why WebAssembly?': '为什么是 WebAssembly？',
  'How big is a plugin?': '插件有多大？',
  'Can two plugins see each other\'s data?': '两个插件能看到彼此的数据吗？',
  'Can a plugin talk to another device?': '插件能和另一台设备通信吗？',
  'What happens when a plugin is updated?': '插件更新时会怎样？',
  'What happens when a plugin crashes?': '插件崩溃时会怎样？',
  'Can a plugin run in the background?': '插件能在后台运行吗？',
  'Why is my call refused with `capability_denied`?': '为什么我的调用被以 `capability_denied` 拒绝？',
  'Where do I report a problem?': '在哪里报告问题？',
  // reference/paths.md
  'The two roots': '两个根目录',
  'Inside the data directory': '数据目录内部',
  'Inside the cache directory': '缓存目录内部',
  'Per platform': '各平台',
  'Which of it is yours to move': '哪些是你可以搬走的',
  // reference/platform-matrix.md
  'What ships': '支持的平台',
  'How a difference is reported': '差异如何被报告',
  'What is the same everywhere': '哪些处处相同',
  'Mobile': '移动端',
  // reference/capabilities.md
  'The grammar': '语法',
  'The ten domains': '十个域',
  'Patterns and grants': '模式与授予',
  'What the user sees': '用户看到什么',
  'What is checked, and when': '检查什么，什么时候检查',
  // reference/errors.md
  'How to read a failure': '如何读懂一次失败',
  'Permissions and policy': '权限与策略',
  'Devices and links': '设备与链路',
  'Messages and arguments': '消息与参数',
  'Transfers': '传输',
  'Plugins and the runtime': '插件与运行时',
  'What the user should be told': '应当告诉用户什么',
  // reference/events.md
  'Names': '名称',
  'The catalogue': '目录',
  'Delivery and order': '投递与顺序',
  'A plugin\'s own events': '插件自己的事件',
  // Page titles.
  'What is Synra': 'Synra 是什么',
  'Installation': '安装',
  'Quick Start': '快速上手',
  'Devices & Pairing': '设备与配对',
  'Clipboard & Files': '剪切板与文件',
  'Plugins': '插件',
  'Troubleshooting': '故障排查',
  'Your First Plugin': '第一个插件',
  'The Manifest': 'Manifest',
  'Project Structure': '目录结构',
  'Writing the Logic': '编写逻辑',
  'Building a UI': '编写界面',
  'Testing': '测试',
  'Publishing': '发布',
  'FAQ': '常见问题',
  'Capabilities': '能力（Capability）',
  'Built-in Events': '内置事件',
  'Error Codes': '错误码',
  'Data Locations': '数据位置',
  'Platform Support': '平台支持',

  // Second level, in the pages that have one.
  'The two models': '两种模型',
  'How the pieces fit': '各部分如何配合',
  'What Synra is not': 'Synra 不是什么',
  'Next': '下一步',
  'Desktop': '桌面端',
  'Mobile': '移动端',
  'The command line': '命令行',
  'System permissions': '系统权限',
  'Checking it worked': '确认它工作了',
  'Before you start': '开始之前',
  '1. Pair the two devices': '1. 配对两台设备',
  '2. Share something': '2. 分享一些东西',
  '3. Confirm the target': '3. 确认目标',
  '4. Watch it happen': '4. 看它发生',
  'What to try next': '接下来试什么',
  'Command line equivalent': '等价的命令行',
  'The fields that matter most': '最关键的几个字段',
  'Full reference': '完整参考',
  'Share and receive': '分享与接收',
  'The action panel': '动作面板',
  'Capabilities are the host\'s': '能力属于宿主',
  'Plugins decide what it means': '插件决定它的含义',
  'The kernel does the moving': '内核负责搬运',
  'Keep them in step with the code': '让它们与代码保持一致',

  // Code-group labels and heading-shaped code identifiers. Translating these would be wrong, but
  // they must be present so the map does not report them as unknown.
  'Android': 'Android',
  'iOS': 'iOS',
  'Arch': 'Arch',
  'Debian / Ubuntu': 'Debian / Ubuntu',
  '`runtime`': '`runtime`',
  '`capabilities`': '`capabilities`',
  '`events` and `handles`': '`events` 与 `handles`',
}

/** The note that stands in for a body until someone writes the real thing. */
const STUB_NOTE = [
  '本页正在撰写中。主题已经确定，说明内容尚未发布。',
  '',
  '在它完成之前，它所描述的行为现在就可以访问：',
  '',
  '- 命令行可以查询：`synra --help`',
  '- 内核的契约在 schema 与 `synra-core` 里',
  '- 这里有不清晰的地方，欢迎在 <https://github.com/synra-rs/docs/issues> 提 issue',
].join('\n')

/** Reads a `key: value` pair out of YAML frontmatter. */
function frontmatter(text: string): Record<string, string> {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match)
    return {}

  const out: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    // A literal space after the colon, not `\s*`: the two overlap, which is what makes a regex
    // backtrack. No space means no value.
    const kv = line.match(/^([A-Z][\w-]*): (.*)$/i)
    if (kv)
      out[kv[1]] = kv[2].trim()
  }
  return out
}

/** Builds the mirror. Reports headings with no translation. */
function build(english: string): { text: string, missing: string[] } {
  const lines = english.split('\n')
  const out: string[] = []
  const missing: string[] = []

  // Frontmatter, with `translated: false` inserted before the closing delimiter.
  const fmEnd = lines.findIndex((line, i) => i > 0 && line.trim() === '---')
  const fm = lines.slice(0, fmEnd + 1)
  fm.splice(fm.length - 1, 0, 'translated: false')
  out.push(...fm, '')

  let index = fmEnd + 1
  let sawH1 = false

  /**
   * Fenced code is skipped wholesale. Without this, a fence carrying a label — ```` ```bash [Arch] ````
   * inside a `code-group` — reads as a level-3 heading, and the mirror picks up structure the
   * English page does not have.
   */
  let inFence = false

  while (index < lines.length) {
    const line = lines[index]

    if (/^\s*```/.test(line)) {
      inFence = !inFence
      index++
      continue
    }

    if (inFence) {
      index++
      continue
    }

    // A literal space after the hashes, not `\s+`: the two overlap with `.*`, which is what makes a
    // regex backtrack. `## heading` is the only form Markdown produces.
    const heading = line.match(/^(#{1,6}) (.*)$/)
    if (heading) {
      const original = heading[2].trim()
      const translated = HEADING_MAP[original]
      if (translated === undefined && heading[1].length <= 3)
        missing.push(original)

      out.push(`${heading[1]} ${translated ?? original}`)

      // The page title gets the stub note. Later headings get nothing: repeating the note under
      // every heading would be noise.
      if (!sawH1) {
        out.push('', STUB_NOTE)
        sawH1 = true
      }

      index++
      continue
    }

    // Containers are mirrored by type so the structure check sees the same sequence. Their bodies
    // are dropped along with the rest of the prose.
    const container = line.match(/^:::\s*(tip|info|warning|danger|details)\b(.*)$/)
    if (container) {
      const [, type, rawLabel] = container
      const label = rawLabel.trim()
      const translated = HEADING_MAP[label] ?? label
      out.push('', `::: ${type} ${translated}`, '待补充。', ':::', '')

      index++
      while (index < lines.length && !/^:::\s*$/.test(lines[index])) index++
      index++
      continue
    }

    index++
  }

  const text = `${out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd()}\n`
  return { text, missing }
}

/** Every English page whose Chinese side is missing or still flagged. */
function untranslated(): string[] {
  const out: string[] = []

  for (const section of SECTIONS) {
    const dir = join(root, section)
    if (!existsSync(dir))
      continue

    for (const name of readdirSync(dir)) {
      if (!name.endsWith('.md'))
        continue

      const zhPath = join(root, 'zh', section, name)
      const needs = !existsSync(zhPath)
        || frontmatter(readFileSync(zhPath, 'utf8')).translated === 'false'
      if (needs)
        out.push(`${section}/${name}`)
    }
  }

  return out
}

const args = process.argv.slice(2)
const targets = args.includes('--all-untranslated')
  ? untranslated()
  : args.filter(a => a.endsWith('.md'))

if (!targets.length) {
  console.error('usage: esno scripts/scaffold-translation.ts [--all-untranslated | <page.md> …]')
  process.exit(2)
}

let written = 0
const allMissing = new Set<string>()

for (const target of targets) {
  const enPath = join(root, target)
  if (!existsSync(enPath)) {
    console.error(`${target}: no such English page`)
    process.exitCode = 1
    continue
  }

  const { text, missing } = build(readFileSync(enPath, 'utf8'))
  for (const m of missing) allMissing.add(m)

  const zhPath = join(root, 'zh', target)
  mkdirSync(dirname(zhPath), { recursive: true })
  writeFileSync(zhPath, text)
  written++
  console.log(`zh/${target}`)
}

console.log('-'.repeat(60))
console.log(`${written} stub(s) written`)

if (allMissing.size) {
  console.log('')
  console.log('These headings have no translation in HEADING_MAP and were left in English:')
  for (const m of [...allMissing].sort()) console.log(`  ${m}`)
  console.log('Add them to HEADING_MAP, then run this script again.')
}

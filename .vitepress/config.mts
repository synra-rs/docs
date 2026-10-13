import { fileURLToPath } from 'node:url'
import taskLists from 'markdown-it-task-lists'
import { defineConfig } from 'vitepress'

const REPO = 'https://github.com/synra-rs/docs'
const ORIGIN = 'https://synra-app.dev'

/**
 * `docs/dist`, resolved from this file rather than from whatever the build's working directory
 * happens to be.
 *
 * `outDir` is interpreted against Vite's root, which differs between `vitepress build` and
 * `vitepress build docs`, so a bare relative path is not stable across the two.
 */
const OUT_DIR = fileURLToPath(new URL('../dist', import.meta.url))

/**
 * The English sidebar. The Chinese one below mirrors it exactly -- same pages, same order -- so a
 * reader who switches locale keeps their bearings. Only the labels differ, and
 * `scripts/check-structure.mjs` enforces that the two stay in step.
 */
const enSidebar = [
  {
    text: 'Getting Started',
    items: [
      { text: 'What is Synra', link: '/guide/introduction' },
      { text: 'Installation', link: '/guide/installation' },
      { text: 'Quick Start', link: '/guide/quick-start' },
    ],
  },
  {
    text: 'Using Synra',
    items: [
      { text: 'Devices & Pairing', link: '/guide/devices-and-pairing' },
      { text: 'Clipboard & Files', link: '/guide/transfers' },
      { text: 'Plugins', link: '/guide/plugins' },
      { text: 'Troubleshooting', link: '/guide/troubleshooting' },
    ],
  },
  {
    text: 'Plugin Authoring',
    items: [
      { text: 'Your First Plugin', link: '/plugins/getting-started' },
      { text: 'The Manifest', link: '/plugins/manifest' },
      { text: 'Project Structure', link: '/plugins/structure' },
      { text: 'Writing the Logic', link: '/plugins/authoring' },
      { text: 'Building a UI', link: '/plugins/ui' },
      { text: 'Testing', link: '/plugins/testing' },
      { text: 'Publishing', link: '/plugins/publishing' },
      { text: 'FAQ', link: '/plugins/faq' },
    ],
  },
  {
    text: 'Reference',
    items: [
      { text: 'Capabilities', link: '/reference/capabilities' },
      { text: 'Built-in Events', link: '/reference/events' },
      { text: 'Error Codes', link: '/reference/errors' },
      { text: 'Data Locations', link: '/reference/paths' },
      { text: 'Platform Support', link: '/reference/platform-matrix' },
    ],
  },
]

const zhSidebar = [
  {
    text: '开始使用',
    items: [
      { text: 'Synra 是什么', link: '/zh/guide/introduction' },
      { text: '安装', link: '/zh/guide/installation' },
      { text: '快速上手', link: '/zh/guide/quick-start' },
    ],
  },
  {
    text: '使用',
    items: [
      { text: '设备与配对', link: '/zh/guide/devices-and-pairing' },
      { text: '剪切板与文件', link: '/zh/guide/transfers' },
      { text: '插件', link: '/zh/guide/plugins' },
      { text: '故障排查', link: '/zh/guide/troubleshooting' },
    ],
  },
  {
    text: '插件开发',
    items: [
      { text: '第一个插件', link: '/zh/plugins/getting-started' },
      { text: 'Manifest', link: '/zh/plugins/manifest' },
      { text: '目录结构', link: '/zh/plugins/structure' },
      { text: '编写逻辑', link: '/zh/plugins/authoring' },
      { text: '编写界面', link: '/zh/plugins/ui' },
      { text: '测试', link: '/zh/plugins/testing' },
      { text: '发布', link: '/zh/plugins/publishing' },
      { text: '常见问题', link: '/zh/plugins/faq' },
    ],
  },
  {
    text: '参考',
    items: [
      { text: '能力（Capability）', link: '/zh/reference/capabilities' },
      { text: '内置事件', link: '/zh/reference/events' },
      { text: '错误码', link: '/zh/reference/errors' },
      { text: '数据位置', link: '/zh/reference/paths' },
      { text: '平台支持', link: '/zh/reference/platform-matrix' },
    ],
  },
]

const repoNav = [
  { text: 'Guide', link: '/guide/introduction', activeMatch: '^/guide/' },
  { text: 'Plugins', link: '/plugins/getting-started', activeMatch: '^/plugins/' },
  { text: 'Reference', link: '/reference/capabilities', activeMatch: '^/reference/' },
  {
    text: 'Downloads',
    items: [
      { text: 'Releases', link: 'https://github.com/synra-rs/synra-app/releases' },
      { text: 'Kernel crates', link: 'https://github.com/synra-rs/synra-core' },
    ],
  },
]

const zhRepoNav = [
  { text: '指南', link: '/zh/guide/introduction', activeMatch: '^/zh/guide/' },
  { text: '插件', link: '/zh/plugins/getting-started', activeMatch: '^/zh/plugins/' },
  { text: '参考', link: '/zh/reference/capabilities', activeMatch: '^/zh/reference/' },
  {
    text: '下载',
    items: [
      { text: '版本发布', link: 'https://github.com/synra-rs/synra-app/releases' },
      { text: '内核 crate', link: 'https://github.com/synra-rs/synra-core' },
    ],
  },
]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Synra',
  description:
    'Cross-device action orchestration. One action on one device becomes an execution on another, and what happens is defined by plugins.',
  lang: 'en-US',
  cleanUrls: true,
  lastUpdated: true,
  outDir: OUT_DIR,

  /**
   * Keep the repository's own documents out of the site.
   *
   * VitePress uses the project root as its source directory, so any root `.md` becomes a published
   * page. These address people working *on* this repository, not readers of the site, and every
   * page that belongs on the site lives under a content directory.
   *
   * For `README.md` it is also a correctness fix: its relative links point at repository files
   * rather than routes, which fails the dead-link check.
   */
  srcExclude: ['README.md', '.vitepress/writing-style.md'],

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'apple-touch-icon', href: '/brand-mark.svg' }],
    ['meta', { name: 'theme-color', content: '#0b0b0f' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Synra' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    // Schema discovery for tooling.
    ['link', { rel: 'alternate', type: 'application/schema+json', href: '/schema/manifest/v1.json' }],
  ],

  markdown: {
    /**
     * GitHub-style task lists.
     *
     * VitePress 1.6.x has no built-in support: a `- [ ]` renders as the literal text `[ ]`. The
     * plugin marks up the HTML but ships no CSS, so `chrome.css` supplies the styles.
     *
     * `enabled: false` keeps the checkboxes non-interactive. These are things a reader confirms
     * about their own plugin, not a form on the page.
     */
    config: (md) => {
      md.use(taskLists, { enabled: false, label: true })
    },
  },

  themeConfig: {
    logo: '/brand-mark.svg',
    siteTitle: 'Synra',
    socialLinks: [{ icon: 'github', link: 'https://github.com/synra-rs' }],

    /**
     * Three levels in the right-hand outline, site-wide.
     *
     * `themeConfig`, not `markdown`: VitePress 1.6.x's `MarkdownOptions` has no `outline` field, so
     * setting it there is a type error and is ignored at runtime.
     *
     * Three rather than the default two, because a page written as `## section` then `### item`
     * otherwise offers no way to jump to the items -- and those items are usually the point.
     */
    outline: { level: [2, 3] },

    darkModeSwitchLabel: 'Appearance',
    sidebarMenuLabel: 'Menu',
    returnToTopLabel: 'Return to top',
    externalLinkIcon: true,
  },

  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      title: 'Synra',
      description:
        'One action on one device becomes an execution on another. Both sides are hosts; plugins decide what happens.',
      themeConfig: {
        nav: repoNav,
        sidebar: enSidebar,
        editLink: { pattern: `${REPO}/edit/main/:path`, text: 'Edit this page on GitHub' },
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Two hosts, either direction. Plugins decide what happens.',
        },
        outline: { level: [2, 3], label: 'On this page' },
        docFooter: { prev: 'Previous', next: 'Next' },
        search: { provider: 'local' },
      },
    },

    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      title: 'Synra',
      description: '一台设备上的一个动作，变成另一台设备上的一次执行。两端都是宿主，做什么由插件决定。',
      themeConfig: {
        nav: zhRepoNav,
        sidebar: zhSidebar,
        editLink: { pattern: `${REPO}/edit/main/:path`, text: '在 GitHub 上编辑此页' },
        footer: {
          message: '基于 MIT 协议开源发布。',
          copyright: '两端对等，任一方向。做什么由插件决定。',
        },
        outline: { level: [2, 3], label: '本页目录' },
        docFooter: { prev: '上一页', next: '下一页' },
        search: { provider: 'local' },
      },
    },
  },

  sitemap: { hostname: ORIGIN },

  /**
   * Canonical URLs, and the pairing between the two languages.
   *
   * `cleanUrls` is on, so `/guide/installation` and `/guide/installation.html` would otherwise be
   * two addresses for one page; the canonical link is what picks one. VitePress does not emit
   * `hreflang` alternates on its own, and without them a search engine treats the English and
   * Chinese pages as unrelated duplicates rather than as translations of one another.
   *
   * The Chinese page's path maps to the English one and back by adding or stripping the leading
   * `/zh`, which is exactly how `locales.zh.link` defines the split.
   */
  transformHead({ pageData }) {
    const relative = pageData.relativePath.replace(/(index)?\.md$/, '')
    const isZh = relative.startsWith('zh/')
    const shared = isZh ? relative.slice(3) : relative

    const en = `${ORIGIN}/${shared}`
    // `/` and `/zh/` are the two locales' home pages -- an empty `shared` still needs its slash.
    const zh = `${ORIGIN}/${shared ? `zh/${shared}` : 'zh/'}`

    return [
      ['link', { rel: 'canonical', href: isZh ? zh : en }],
      ['link', { rel: 'alternate', hreflang: 'en', href: en }],
      ['link', { rel: 'alternate', hreflang: 'zh-CN', href: zh }],
      ['link', { rel: 'alternate', hreflang: 'x-default', href: en }],
      // Schema discovery, per locale-independent path.
      ['link', { rel: 'alternate', type: 'application/schema+json', href: `${ORIGIN}/schema/manifest/v1.json` }],
    ]
  },
})

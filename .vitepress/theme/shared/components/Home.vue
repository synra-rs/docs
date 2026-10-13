<script setup lang="ts">
import { useData } from 'vitepress'
/**
 * The layout for every page.
 *
 * VitePress's `Layout` slot is replaced wholesale, so this component decides what to render: the
 * custom hero on the home page, and stock VitePress everywhere else. Doing it here rather than via
 * `layout: home` frontmatter is necessary because the hero holds a live component -- something
 * frontmatter cannot express.
 *
 * The check is on the route rather than on frontmatter deliberately: frontmatter would let any page
 * accidentally opt into the marketing layout, and the home page is the only page that should have
 * it.
 */
import DefaultTheme from 'vitepress/theme'
import { computed } from 'vue'

import TwoDeviceDemo from './TwoDeviceDemo.vue'

const { page } = useData()

const isHome = computed(() => page.value.relativePath === 'index.md' || page.value.relativePath === 'zh/index.md')
const isZh = computed(() => page.value.relativePath.startsWith('zh/'))

const t = computed(() => (isZh.value
  ? {
      tagline: '一台设备上的一个动作，变成另一台设备上的一次执行。',
      sub: '两端都是宿主：都能分享，也都能执行。具体做什么由插件决定，插件跑在内核的沙箱里。',
      start: '开始使用',
      plugins: '写一个插件',
      repo: 'GitHub',
    }
  : {
      tagline: 'One action on one device becomes an execution on another.',
      sub: 'Both sides are hosts: either can share, either can execute. What happens is defined by plugins, running in the kernel\'s sandbox.',
      start: 'Get started',
      plugins: 'Write a plugin',
      repo: 'GitHub',
    }))

const features = computed(() => (isZh.value
  ? [
      { title: '两端对等', body: '桌面与手机都是宿主。不存在"只有电脑能装插件"。' },
      { title: '插件在沙箱里', body: '逻辑是 Wasm 组件，能力由内核强制，而不是靠约定。' },
      { title: '一次操作可追溯', body: '从界面上的点击到对端的执行结果，共用同一个 trace。' },
      { title: '安装即可用', body: '插件在作者机器上构建并签名，用户机器上不编译任何东西。' },
    ]
  : [
      { title: 'Two equal hosts', body: 'Desktop and phone are both hosts. Neither is "the one that runs plugins".' },
      { title: 'Plugins in a sandbox', body: 'Logic is a Wasm component; the kernel enforces capabilities rather than trusting a convention.' },
      { title: 'One trace per action', body: 'From the tap in the UI to the result on the other device, one shared trace.' },
      { title: 'Install, then use', body: 'Plugins are built and signed on the author\'s machine. Nothing is compiled on the user\'s.' },
    ]))
</script>

<template>
  <DefaultTheme.Layout>
    <template v-if="isHome" #home-hero-before>
      <div class="synra-hero">
        <h1 class="synra-hero__title">
          Synra
        </h1>
        <p class="synra-hero__tagline">
          {{ t.tagline }}
        </p>
        <p class="synra-hero__sub">
          {{ t.sub }}
        </p>
        <div class="synra-hero__actions">
          <a class="synra-btn synra-btn--primary" :href="isZh ? '/zh/guide/installation' : '/guide/installation'">
            {{ t.start }}
          </a>
          <a class="synra-btn" :href="isZh ? '/zh/plugins/getting-started' : '/plugins/getting-started'">
            {{ t.plugins }}
          </a>
          <a class="synra-btn synra-btn--ghost" href="https://github.com/synra-rs">
            {{ t.repo }}
          </a>
        </div>
        <TwoDeviceDemo />
      </div>
    </template>

    <template v-if="isHome" #home-features-after>
      <div class="synra-features">
        <div v-for="f in features" :key="f.title" class="synra-feature">
          <h3>{{ f.title }}</h3>
          <p>{{ f.body }}</p>
        </div>
      </div>
    </template>
  </DefaultTheme.Layout>
</template>

<style scoped>
.synra-hero {
  max-width: 1152px;
  margin: 0 auto;
  padding: 4rem 1.5rem 2rem;
}

.synra-hero__title {
  font-size: 3.2rem;
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 0.6rem;
  background: linear-gradient(120deg, var(--synra-accent-strong), var(--synra-accent), #a78bfa);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.synra-hero__tagline {
  font-size: 1.35rem;
  line-height: 1.5;
  font-weight: 500;
  margin: 0 0 0.9rem;
}

.synra-hero__sub {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  max-width: 46rem;
  margin: 0 0 1.8rem;
}

.synra-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
}

.synra-btn {
  display: inline-block;
  font-size: 0.92rem;
  font-weight: 500;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: border-color 0.2s, background-color 0.2s;
}

.synra-btn:hover {
  border-color: var(--synra-accent-strong);
}

.synra-btn--primary {
  background: var(--synra-accent-strong);
  border-color: var(--synra-accent-strong);
  color: #04202a;
}

.synra-btn--primary:hover {
  background: var(--synra-accent);
}

.synra-btn--ghost {
  border-color: transparent;
  color: var(--vp-c-text-2);
}

.synra-features {
  max-width: 1152px;
  margin: 0 auto;
  padding: 1rem 1.5rem 4rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.synra-feature h3 {
  font-size: 1rem;
  margin: 0 0 0.35rem;
}

.synra-feature p {
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  margin: 0;
}

@media (max-width: 640px) {
  .synra-hero__title {
    font-size: 2.4rem;
  }

  .synra-features {
    grid-template-columns: 1fr;
  }
}
</style>

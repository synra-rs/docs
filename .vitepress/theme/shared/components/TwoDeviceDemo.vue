<script setup lang="ts">
/**
 * A two-device illustration: explicit pairing followed by plugin synchronization.
 *
 * Written as a single scripted sequence rather than two independent animations. The point being
 * made is the *transfer* between the two panels, so the timeline is one thing that advances --
 * if the panels animated separately a reader could not tell which event caused which.
 *
 * The lines are fixed strings, not narration invented per render: this is the product's primary
 * journey, and it should read the same every time someone loads the page.
 */
import { useData } from 'vitepress'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

interface Line {
  /** Which panel the line belongs to. */
  side: 'phone' | 'desktop'
  /** Rendered text. Lines are shown whole -- this is not a per-character typewriter. */
  text: string
  /** Shown in the dimmed colour: context rather than the action being demonstrated. */
  dim?: boolean
}

const { page } = useData()
const isZh = computed(() => page.value.relativePath.startsWith('zh/'))
const LINES = computed<Line[]>(() => isZh.value
  ? [
      { side: 'phone', text: '→ 向电脑发起配对' },
      { side: 'phone', text: '  配对码 418205 · 等待确认', dim: true },
      { side: 'desktop', text: '← 收到配对请求 · 418205' },
      { side: 'desktop', text: '✓ 核对后同意' },
      { side: 'phone', text: '✓ 配对完成' },
      { side: 'phone', text: '→ 同步 Starter 插件' },
      { side: 'desktop', text: '✓ 收到并校验插件包' },
      { side: 'desktop', text: '  检查权限，确认并启用', dim: true },
    ]
  : [
      { side: 'phone', text: '→ request pairing with laptop' },
      { side: 'phone', text: '  code 418205 · waiting', dim: true },
      { side: 'desktop', text: '← pairing request · 418205' },
      { side: 'desktop', text: '✓ check code and accept' },
      { side: 'phone', text: '✓ pairing complete' },
      { side: 'phone', text: '→ sync Starter plugin' },
      { side: 'desktop', text: '✓ package received and checked' },
      { side: 'desktop', text: '  review grants, approve, enable', dim: true },
    ])

/** How long each line stays hidden. Slow enough to read, fast enough to reach the end. */
const STEP_MS = 520

const shown = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

const phoneLines = computed(() => LINES.value.slice(0, shown.value).filter(l => l.side === 'phone'))
const desktopLines = computed(() => LINES.value.slice(0, shown.value).filter(l => l.side === 'desktop'))

function start() {
  stop()
  shown.value = 0
  timer = setInterval(() => {
    shown.value += 1
    if (shown.value >= LINES.value.length)
      stop()
  }, STEP_MS)
}

function stop() {
  if (timer !== undefined) {
    clearInterval(timer)
    timer = undefined
  }
}

onMounted(start)
onBeforeUnmount(stop)
</script>

<template>
  <div class="synra-demo-wrap">
    <div class="synra-panel">
      <div class="synra-panel__label">
        {{ isZh ? '手机' : 'phone' }}
      </div>
      <div class="synra-demo">
        <div
          v-for="(line, i) in phoneLines"
          :key="`p${i}`"
          class="synra-demo__line"
          :class="{ 'synra-demo__dim': line.dim }"
        >
          {{ line.text }}
        </div>
      </div>
    </div>

    <div class="synra-panel">
      <div class="synra-panel__label">
        {{ isZh ? '电脑' : 'laptop' }}
      </div>
      <div class="synra-demo">
        <div
          v-for="(line, i) in desktopLines"
          :key="`d${i}`"
          class="synra-demo__line"
          :class="{ 'synra-demo__dim': line.dim }"
        >
          {{ line.text }}
        </div>
      </div>
    </div>

    <button v-if="shown >= LINES.length" class="synra-replay" type="button" @click="start">
      {{ isZh ? '重播' : 'replay' }}
    </button>
  </div>
</template>

<style scoped>
.synra-demo-wrap {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  align-items: start;
  /* Reserve the tallest the two panels can get, so the page below does not jump as lines appear.
     `LINES` has 5 phone lines and 4 desktop lines; 5 × 1.7em plus padding is the ceiling. */
  min-height: calc(5 * 1.7em + 3.4rem);
}

.synra-panel__label {
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.6;
  margin-bottom: 0.4rem;
}

.synra-replay {
  grid-column: 1 / -1;
  justify-self: start;
  font-family: var(--vp-font-family-mono);
  font-size: 0.78rem;
  color: var(--synra-accent-strong);
  background: none;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 0.2rem 0.7rem;
  cursor: pointer;
}

.synra-replay:hover {
  border-color: var(--synra-accent-strong);
}

@media (max-width: 640px) {
  .synra-demo-wrap {
    grid-template-columns: 1fr;
    min-height: 0;
  }
}
</style>

<script setup lang="ts">
/**
 * A two-device demo: a phone shares a link, and it opens in a browser on the desktop.
 *
 * Written as a single scripted sequence rather than two independent animations. The point being
 * made is the *transfer* between the two panels, so the timeline is one thing that advances --
 * if the panels animated separately a reader could not tell which event caused which.
 *
 * The lines are fixed strings, not narration invented per render: this is the product's primary
 * journey, and it should read the same every time someone loads the page.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

interface Line {
  /** Which panel the line belongs to. */
  side: 'phone' | 'desktop'
  /** Rendered text. Lines are shown whole -- this is not a per-character typewriter. */
  text: string
  /** Shown in the dimmed colour: context rather than the action being demonstrated. */
  dim?: boolean
}

const LINES: Line[] = [
  { side: 'phone', text: '$ open the share sheet on a GitHub link', dim: true },
  { side: 'phone', text: '  → share to Synra' },
  { side: 'phone', text: '  → plugin matches: github-bridge', dim: true },
  { side: 'phone', text: '  → target: laptop (paired, online)', dim: true },
  { side: 'desktop', text: '← intent received  trace 4f2a…c1' },
  { side: 'desktop', text: '  → action open-url', dim: true },
  { side: 'desktop', text: '  → capability platform:open-url  granted', dim: true },
  { side: 'desktop', text: '✓ opened in the default browser' },
  { side: 'phone', text: '✓ done' },
]

/** How long each line stays hidden. Slow enough to read, fast enough to reach the end. */
const STEP_MS = 520

const shown = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

const phoneLines = computed(() => LINES.slice(0, shown.value).filter(l => l.side === 'phone'))
const desktopLines = computed(() => LINES.slice(0, shown.value).filter(l => l.side === 'desktop'))

function start() {
  stop()
  shown.value = 0
  timer = setInterval(() => {
    shown.value += 1
    if (shown.value >= LINES.length)
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
        phone
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
        laptop
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
      replay
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

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ items: { label: string; value: number }[]; center: string }>()
const colors = ['var(--c1)', 'var(--c2)', 'var(--c3)', 'var(--c4)', 'var(--c5)', 'var(--c6)']
const total = computed(() => props.items.reduce((s, i) => s + i.value, 0))
const R = 52, C = 2 * Math.PI * R
const arcs = computed(() => {
  let acc = 0
  return props.items.map((it, i) => {
    const len = total.value ? (it.value / total.value) * C : 0
    const a = { ...it, color: colors[i % 6], dash: `${Math.max(len - 2, 0)} ${C}`, off: -acc }
    acc += len
    return a
  })
})
</script>

<template>
  <div class="donutwrap">
    <svg viewBox="0 0 140 140" width="150" height="150" role="img" :aria-label="`Distribution: ${items.map(i => i.label + ' ' + i.value).join(', ')}`">
      <g transform="rotate(-90 70 70)" fill="none" stroke-width="20">
        <circle cx="70" cy="70" :r="R" stroke="#efe9d8" />
        <circle v-for="a in arcs" :key="a.label" cx="70" cy="70" :r="R" :stroke="a.color" :stroke-dasharray="a.dash" :stroke-dashoffset="a.off" />
      </g>
      <text x="70" y="68" text-anchor="middle" font-size="24" font-weight="600" fill="var(--ink)" style="font-family: var(--serif)">{{ total }}</text>
      <text x="70" y="86" text-anchor="middle" font-size="10" fill="var(--muted)">{{ center }}</text>
    </svg>
    <ul class="legend">
      <li v-for="a in arcs" :key="a.label"><i :style="{ background: a.color }" /><span>{{ a.label }}</span><span class="num">{{ a.value }}</span></li>
    </ul>
  </div>
</template>

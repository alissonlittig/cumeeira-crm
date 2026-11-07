<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ points: { label: string; value: number }[]; label: string }>()
const W = 600, H = 190, P = { l: 28, r: 8, t: 10, b: 24 }
const max = computed(() => Math.max(4, ...props.points.map(p => p.value)))
const xy = computed(() => props.points.map((p, i) => [P.l + (i / Math.max(1, props.points.length - 1)) * (W - P.l - P.r), H - P.b - (p.value / max.value) * (H - P.t - P.b)] as const))
const line = computed(() => xy.value.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' '))
const area = computed(() => `${line.value} L${xy.value.at(-1)![0]} ${H - P.b} L${P.l} ${H - P.b}Z`)
const ticks = computed(() => [0, 0.5, 1].map(f => ({ y: H - P.b - f * (H - P.t - P.b), v: Math.round(f * max.value) })))
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" width="100%" role="img" :aria-label="label" style="display: block">
    <defs><linearGradient id="ar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9a850" stop-opacity=".55" /><stop offset="1" stop-color="#d9a850" stop-opacity="0" /></linearGradient></defs>
    <g v-for="t in ticks" :key="t.y"><line :x1="P.l" :x2="W - P.r" :y1="t.y" :y2="t.y" stroke="#e4ddcc" stroke-dasharray="3 4" /><text :x="P.l - 6" :y="t.y + 4" text-anchor="end" font-size="10.5" fill="var(--muted)">{{ t.v }}</text></g>
    <path :d="area" fill="url(#ar)" />
    <path :d="line" fill="none" stroke="var(--ink)" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" />
    <circle v-for="([x, y], i) in xy" :key="i" :cx="x" :cy="y" r="3" fill="var(--card)" stroke="var(--ink)" stroke-width="2"><title>{{ points[i]!.label }}: {{ points[i]!.value }}</title></circle>
    <text v-for="(p, i) in points" :key="'l' + i" v-show="i % 2 === 0" :x="xy[i]![0]" :y="H - 6" text-anchor="middle" font-size="10.5" fill="var(--muted)">{{ p.label }}</text>
  </svg>
</template>

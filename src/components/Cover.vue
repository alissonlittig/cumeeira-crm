<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ hue: number; seed: number }>()
// Procedural skyline: no photos, so no licensing and a tiny payload.
const blocks = computed(() => {
  let s = props.seed * 9301 + 49297
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  const out: { x: number; w: number; h: number }[] = []
  for (let x = 6; x < 290; ) {
    const w = 26 + Math.floor(r() * 30)
    out.push({ x, w, h: 40 + Math.floor(r() * 80) })
    x += w + 4
  }
  return out
})
const sky = computed(() => `hsl(${props.hue} 38% 82%)`)
const sky2 = computed(() => `hsl(${(props.hue + 30) % 360} 45% 93%)`)
const fg = computed(() => `hsl(${props.hue} 40% 24%)`)
const fg2 = computed(() => `hsl(${props.hue} 32% 38%)`)
</script>

<template>
  <svg class="cover" viewBox="0 0 300 150" preserveAspectRatio="xMidYMax slice" role="img" aria-label="Illustrative skyline">
    <defs>
      <linearGradient :id="`g${seed}`" x1="0" y1="0" x2="0" y2="1"><stop offset="0" :stop-color="sky" /><stop offset="1" :stop-color="sky2" /></linearGradient>
    </defs>
    <rect width="300" height="150" :fill="`url(#g${seed})`" />
    <circle cx="238" cy="38" r="15" fill="#fff" opacity=".7" />
    <g :fill="fg2" opacity=".55"><rect v-for="(b, i) in blocks" :key="'a' + i" :x="b.x + 8" :y="150 - b.h - 20" :width="b.w" :height="b.h + 20" rx="2" /></g>
    <g :fill="fg">
      <rect v-for="(b, i) in blocks" :key="i" :x="b.x" :y="150 - b.h" :width="b.w" :height="b.h" rx="2" />
    </g>
    <g fill="#f4d58a" opacity=".85">
      <template v-for="(b, i) in blocks" :key="'w' + i">
        <rect v-for="k in Math.min(5, Math.floor(b.h / 22))" :key="k" :x="b.x + 6 + ((k * 7 + i) % 2) * 12" :y="150 - b.h + k * 16 - 6" width="5" height="7" rx="1" />
      </template>
    </g>
  </svg>
</template>

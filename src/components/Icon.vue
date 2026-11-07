<script setup lang="ts">
const paths: Record<string, string> = {
  dash: 'M4 13h6V4H4zM14 20h6V4h-6zM4 20h6v-4H4z',
  home: 'M3 11 12 4l9 7M5 10v10h14V10M10 20v-6h4v6',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.900 1.900 6.500 5.500M16 4.500a3.500 3.500 0 0 1 0 6.500M18 14.800c1.800.700 3 2.300 3.500 5.200',
  cal: 'M4 7h16v13H4zM4 11h16M8 3v4M16 3v4',
  funnel: 'M3 5h18l-7 8v6l-4-2v-4z',
  coin: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM14.500 9c-.5-1-1.500-1.500-2.700-1.500-1.500 0-2.500.8-2.500 2 0 3 5.400 1.500 5.400 4.500 0 1.200-1.100 2-2.700 2-1.300 0-2.400-.6-2.900-1.700M12 6v1.500M12 16.500V18',
}
defineProps<{ name: string }>()
</script>

<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="paths[name]" /></svg>
</template>

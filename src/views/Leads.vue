<script setup lang="ts">
import { computed, ref } from 'vue'
import { db, prop } from '../store'
import { ORIGINS, bySource, pct, type LeadStage, type Origin } from '../lib'

const origin = ref<'All' | Origin>('All')
const list = computed(() => db.leads.filter(l => origin.value === 'All' || l.origin === origin.value))
const counts = computed(() => bySource(db.leads))
const max = computed(() => Math.max(1, ...counts.value.map(c => c.count)))
const tone = (s: LeadStage) => ({ New: 'info', Contacted: '', Visiting: 'warn', Proposal: 'ok', Lost: 'bad' })[s]
</script>

<template>
  <section class="card" style="margin-bottom: 16px">
    <h2>Source performance</h2><p class="sub">Share of leads, and how many reached a proposal</p>
    <div class="fun">
      <div v-for="c in counts" :key="c.origin" style="grid-template-columns: 92px 1fr 90px">
        <span>{{ c.origin }}</span><span class="bar" :style="{ width: pct(c.count, max) + '%' }" />
        <span class="num"><b>{{ c.count }}</b> · {{ pct(db.leads.filter(l => l.origin === c.origin && l.stage === 'Proposal').length, c.count) }}% prop.</span>
      </div>
    </div>
  </section>
  <div class="filters">
    <button v-for="o in ['All', ...ORIGINS] as const" :key="o" class="chip" :aria-pressed="origin === o" @click="origin = o">{{ o }}</button>
  </div>
  <section class="card tw">
    <table>
      <thead><tr><th>Lead</th><th>Source</th><th>Interested in</th><th>Stage</th><th>Agent</th><th>Created</th></tr></thead>
      <tbody>
        <tr v-for="l in list.slice(0, 40)" :key="l.id">
          <td><b>{{ l.name }}</b></td><td>{{ l.origin }}</td><td>{{ prop(l.propertyId).title }}</td>
          <td><span class="pill" :class="tone(l.stage)">{{ l.stage }}</span></td><td>{{ l.agent }}</td><td class="num">{{ l.created }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="list.length > 40" class="sub" style="margin: 12px 0 0">Showing 40 of {{ list.length }}.</p>
  </section>
</template>

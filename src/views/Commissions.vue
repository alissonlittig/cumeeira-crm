<script setup lang="ts">
import { computed } from 'vue'
import { db, lead, prop } from '../store'
import { AGENTS, commission, money } from '../lib'

const closed = computed(() => db.proposals.filter(p => p.stage === 'Closed'))
const expected = computed(() => db.proposals.filter(p => ['Negotiating', 'Accepted'].includes(p.stage)))
const sum = (xs: typeof db.proposals) => xs.reduce((s, p) => s + commission(p), 0)
const byAgent = computed(() => AGENTS.map(a => ({ a, earned: sum(closed.value.filter(p => prop(p.propertyId).agent === a)), exp: sum(expected.value.filter(p => prop(p.propertyId).agent === a)) })))
const max = computed(() => Math.max(1, ...byAgent.value.map(x => x.earned + x.exp)))
</script>

<template>
  <div class="grid kpis" style="grid-template-columns: repeat(3, minmax(0, 1fr))">
    <div class="card kpi"><div class="lab">Earned</div><div class="val num">{{ money(sum(closed)) }}</div><div class="delta">{{ closed.length }} closed deals</div></div>
    <div class="card kpi"><div class="lab">Expected</div><div class="val num">{{ money(sum(expected)) }}</div><div class="delta">{{ expected.length }} deals in play</div></div>
    <div class="card kpi"><div class="lab">Sales volume closed</div><div class="val num">{{ money(closed.reduce((s, p) => s + p.value, 0), true) }}</div><div class="delta">rent counted as contract value</div></div>
  </div>
  <div class="grid two">
    <section class="card">
      <h2>By agent</h2><p class="sub">Earned (dark) and expected (gold)</p>
      <svg :viewBox="`0 0 520 ${byAgent.length * 44}`" width="100%" role="img" aria-label="Commission by agent" style="display: block">
        <g v-for="(x, i) in byAgent" :key="x.a" :transform="`translate(0 ${i * 44})`">
          <text x="0" y="14" font-size="12.5" fill="var(--text)">{{ x.a }}</text>
          <rect x="0" y="20" :width="Math.max(2, (x.earned / max) * 440)" height="14" rx="4" fill="var(--ink)" />
          <rect :x="(x.earned / max) * 440" y="20" :width="(x.exp / max) * 440" height="14" rx="4" fill="var(--brass-l)" />
          <text :x="((x.earned + x.exp) / max) * 440 + 8" y="32" font-size="12" font-weight="600" fill="var(--ink)">{{ money(x.earned + x.exp, true) }}</text>
        </g>
      </svg>
    </section>
    <section class="card">
      <h2>Rates</h2><p class="sub">Fictional agency policy</p>
      <ul class="legend"><li><i style="background: var(--c1)" /><span>Sale</span><span>5% of price</span></li><li><i style="background: var(--c2)" /><span>Rent</span><span>8% of contract</span></li></ul>
    </section>
  </div>
  <section class="card tw">
    <h2 style="margin-bottom: 10px">Closed deals</h2>
    <table>
      <thead><tr><th>Listing</th><th>Client</th><th>Agent</th><th class="right">Value</th><th class="right">Rate</th><th class="right">Commission</th></tr></thead>
      <tbody>
        <tr v-for="p in closed" :key="p.id"><td><b>{{ prop(p.propertyId).title }}</b></td><td>{{ lead(p.leadId).name }}</td><td>{{ prop(p.propertyId).agent }}</td><td class="right num">{{ money(p.value) }}</td><td class="right num">{{ p.pct }}%</td><td class="right num"><b>{{ money(commission(p)) }}</b></td></tr>
        <tr v-if="!closed.length"><td colspan="6">No closed deals yet.</td></tr>
      </tbody>
    </table>
  </section>
</template>

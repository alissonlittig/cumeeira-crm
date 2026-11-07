<script setup lang="ts">
import { computed } from 'vue'
import { db, prop } from '../store'
import { bySource, commission, funnel, money, pct } from '../lib'
import Donut from '../components/Donut.vue'
import Area from '../components/Area.vue'

const open = computed(() => db.proposals.filter(p => !['Closed', 'Lost'].includes(p.stage)))
const closed = computed(() => db.proposals.filter(p => p.stage === 'Closed'))
const pipeline = computed(() => open.value.reduce((s, p) => s + p.value, 0))
const earned = computed(() => closed.value.reduce((s, p) => s + commission(p), 0))
const expected = computed(() => db.proposals.filter(p => ['Negotiating', 'Accepted'].includes(p.stage)).reduce((s, p) => s + commission(p), 0))
const conv = computed(() => pct(closed.value.length, db.leads.length))
const upcoming = computed(() => db.visits.filter(v => v.status === 'Scheduled').length)
const src = computed(() => bySource(db.leads).map(s => ({ label: s.origin, value: s.count })))
const fun = computed(() => funnel(db.proposals))
const weeks = computed(() => {
  const now = Date.now()
  return Array.from({ length: 12 }, (_, i) => {
    const end = now - (11 - i) * 7 * 864e5, start = end - 7 * 864e5
    return { label: new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: db.leads.filter(l => { const t = Date.parse(l.created); return t > start && t <= end }).length }
  })
})
const hot = computed(() => [...db.proposals].filter(p => ['Negotiating', 'Accepted'].includes(p.stage)).sort((a, b) => b.value - a.value).slice(0, 4))
</script>

<template>
  <div class="grid kpis">
    <div class="card kpi"><div class="lab">Open pipeline</div><div class="val num">{{ money(pipeline, true) }}</div><div class="delta">{{ open.length }} live proposals</div></div>
    <div class="card kpi"><div class="lab">Commission earned</div><div class="val num">{{ money(earned) }}</div><div class="delta"><b>{{ closed.length }}</b> closed deals</div></div>
    <div class="card kpi"><div class="lab">Expected commission</div><div class="val num">{{ money(expected) }}</div><div class="delta">negotiating + accepted</div></div>
    <div class="card kpi"><div class="lab">Lead to close</div><div class="val num">{{ conv }}%</div><div class="delta">{{ upcoming }} visits scheduled</div></div>
  </div>

  <div class="grid two">
    <section class="card"><h2>New leads per week</h2><p class="sub">Last 12 weeks, all sources</p><Area :points="weeks" label="New leads per week, last 12 weeks" /></section>
    <section class="card"><h2>Leads by source</h2><p class="sub">Where the demand comes from</p><Donut :items="src" center="leads" /></section>
  </div>

  <div class="grid two">
    <section class="card">
      <h2>Proposal funnel</h2><p class="sub">Proposals that reached each stage</p>
      <div class="fun"><div v-for="f in fun" :key="f.stage"><span>{{ f.stage }}</span><span class="bar" :style="{ width: Math.max(2, pct(f.count, fun[0]!.count || 1)) + '%' }" /><b class="num">{{ f.count }}</b></div></div>
    </section>
    <section class="card">
      <h2>Hottest deals</h2><p class="sub">Highest value in negotiation or accepted</p>
      <p v-if="!hot.length" class="sub">Nothing in negotiation right now.</p>
      <div v-for="p in hot" :key="p.id" class="visit" style="grid-template-columns: 1fr auto">
        <div><b>{{ prop(p.propertyId).title }}</b><small>{{ prop(p.propertyId).code }} · {{ p.stage }}</small></div>
        <b class="num">{{ money(p.value, true) }}</b>
      </div>
    </section>
  </div>
</template>

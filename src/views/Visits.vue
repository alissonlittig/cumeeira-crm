<script setup lang="ts">
import { computed } from 'vue'
import { db, lead, prop, setVisit } from '../store'

const upcoming = computed(() => {
  const g = new Map<string, typeof db.visits>()
  const today = new Date(); today.setHours(0, 0, 0, 0)
  for (const v of db.visits) {
    if (v.status !== 'Scheduled' || new Date(v.at) < today) continue
    const k = new Date(v.at).toDateString()
    g.set(k, [...(g.get(k) ?? []), v])
  }
  return [...g.entries()]
})
const past = computed(() => db.visits.filter(v => v.status !== 'Scheduled').slice(-6).reverse())
const hm = (iso: string) => new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
const label = (d: string) => new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
</script>

<template>
  <div class="grid two">
    <section class="card">
      <h2>Upcoming visits</h2><p class="sub">{{ upcoming.reduce((s, [, v]) => s + v.length, 0) }} scheduled</p>
      <p v-if="!upcoming.length" class="sub">No visits scheduled. Use “New visit”.</p>
      <div class="days">
        <div v-for="[d, vs] in upcoming" :key="d" class="day">
          <h3>{{ label(d) }} <small>{{ vs.length }} visit{{ vs.length > 1 ? 's' : '' }}</small></h3>
          <div v-for="v in vs" :key="v.id" class="visit">
            <span class="t num">{{ hm(v.at) }}</span>
            <div><b>{{ prop(v.propertyId).title }}</b><small>{{ lead(v.leadId).name }} · {{ prop(v.propertyId).agent }}</small></div>
            <div class="acts"><button class="btn sm" @click="setVisit(v.id, 'Done')">Done</button> <button class="btn ghost sm" @click="setVisit(v.id, 'Cancelled')">Cancel</button></div>
          </div>
        </div>
      </div>
    </section>
    <section class="card">
      <h2>Recent outcomes</h2><p class="sub">Latest completed or cancelled</p>
      <div v-for="v in past" :key="v.id" class="visit" style="grid-template-columns: 1fr auto">
        <div><b>{{ prop(v.propertyId).title }}</b><small>{{ lead(v.leadId).name }} · {{ new Date(v.at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}</small></div>
        <span class="pill" :class="v.status === 'Done' ? 'ok' : 'bad'">{{ v.status }}</span>
      </div>
    </section>
  </div>
</template>

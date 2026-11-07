<script setup lang="ts">
import { computed, ref } from 'vue'
import { db } from '../store'
import { money, type PropStatus } from '../lib'
import Cover from '../components/Cover.vue'

const deal = ref<'All' | 'Sale' | 'Rent'>('All')
const status = ref<'All' | PropStatus>('All')
const q = ref('')
const list = computed(() =>
  db.properties.filter(p => (deal.value === 'All' || p.deal === deal.value) && (status.value === 'All' || p.status === status.value) && `${p.title} ${p.code}`.toLowerCase().includes(q.value.toLowerCase())),
)
const tone = (s: PropStatus) => ({ Available: 'ok', Reserved: 'warn', Sold: 'info', Rented: 'info' })[s]
</script>

<template>
  <div class="filters">
    <input v-model="q" class="search" type="search" placeholder="Search title or code" aria-label="Search listings" />
    <button v-for="d in ['All', 'Sale', 'Rent'] as const" :key="d" class="chip" :aria-pressed="deal === d" @click="deal = d">{{ d }}</button>
    <select v-model="status" aria-label="Filter by status"><option>All</option><option>Available</option><option>Reserved</option><option>Sold</option><option>Rented</option></select>
  </div>
  <p v-if="!list.length" class="sub">No listing matches these filters.</p>
  <div class="grid props">
    <article v-for="p in list" :key="p.id" class="card prop">
      <Cover :hue="p.hue" :seed="p.id" />
      <div class="body">
        <div class="top"><span>{{ p.code }} · For {{ p.deal.toLowerCase() }}</span><span class="pill" :class="tone(p.status)">{{ p.status }}</span></div>
        <h3>{{ p.title }}</h3>
        <div class="price num">{{ money(p.price) }}<small v-if="p.deal === 'Rent'" style="font: 400 13px var(--sans); color: var(--muted)"> /mo</small></div>
        <div class="meta num"><span>{{ p.area }} m²</span><span>{{ p.beds }} bd</span><span>{{ p.parking }} pk</span></div>
        <div class="top"><span>Agent: {{ p.agent }}</span></div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Icon from './components/Icon.vue'
import Dashboard from './views/Dashboard.vue'
import Properties from './views/Properties.vue'
import Leads from './views/Leads.vue'
import Visits from './views/Visits.vue'
import Pipeline from './views/Pipeline.vue'
import Commissions from './views/Commissions.vue'
import { addLead, addVisit, db, resetDemo } from './store'
import { AGENTS, ORIGINS, type Origin } from './lib'

const tabs = [
  { id: 'dashboard', label: 'Overview', icon: 'dash', title: 'Agency overview', sub: 'Pipeline, sources and commissions at a glance.', view: Dashboard },
  { id: 'listings', label: 'Listings', icon: 'home', title: 'Listings', sub: 'Inventory with live status from the proposal funnel.', view: Properties },
  { id: 'leads', label: 'Leads', icon: 'users', title: 'Leads by source', sub: 'Which channels bring people who actually buy.', view: Leads },
  { id: 'visits', label: 'Visits', icon: 'cal', title: 'Visits', sub: 'Agenda for the next days and recent outcomes.', view: Visits },
  { id: 'funnel', label: 'Funnel', icon: 'funnel', title: 'Proposal funnel', sub: 'Move each deal from draft to closed.', view: Pipeline },
  { id: 'money', label: 'Money', icon: 'coin', title: 'Commissions', sub: 'Earned and expected, by agent.', view: Commissions },
] as const
type Id = (typeof tabs)[number]['id']

const initial = (location.hash.slice(1) as Id) || 'dashboard'
const current = ref<Id>(tabs.some(t => t.id === initial) ? initial : 'dashboard')
watch(current, id => (location.hash = id))
const tab = computed(() => tabs.find(t => t.id === current.value)!)

const leadDlg = ref<HTMLDialogElement>()
const visitDlg = ref<HTMLDialogElement>()
const nl = ref({ name: '', origin: 'Portal' as Origin, propertyId: 1, agent: AGENTS[0]! })
const nv = ref({ leadId: db.leads[0]?.id ?? 1, propertyId: 1, date: '', time: '10:00' })
const today = new Date().toISOString().slice(0, 10)

function saveLead() {
  addLead({ ...nl.value, name: nl.value.name.trim(), stage: 'New', created: today })
  nl.value.name = ''
  leadDlg.value?.close()
  current.value = 'leads'
}
function saveVisit() {
  const at = new Date(`${nv.value.date}T${nv.value.time}`)
  addVisit({ leadId: nv.value.leadId, propertyId: nv.value.propertyId, at: at.toISOString(), status: 'Scheduled' })
  visitDlg.value?.close()
  current.value = 'visits'
}
const openVisit = () => { nv.value.date = today; visitDlg.value?.showModal() }
</script>

<template>
  <div class="shell">
    <aside class="side">
      <div class="brand">
        <svg width="34" height="34" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#1d4a40" /><path d="M6 17 16 8l10 9v8H6z" fill="none" stroke="#d9a850" stroke-width="2.4" stroke-linejoin="round" /></svg>
        <div><b>Cumeeira</b><small>Realty CRM</small></div>
      </div>
      <nav class="nav" aria-label="Main">
        <button v-for="t in tabs" :key="t.id" :aria-current="current === t.id ? 'page' : undefined" @click="current = t.id"><Icon :name="t.icon" />{{ t.label }}</button>
      </nav>
      <div class="foot">Demo data stays in this browser.<button @click="resetDemo">Reset demo data</button></div>
    </aside>

    <main class="main">
      <div class="banner" role="note">Portfolio demo. Every name, listing and number here is fictional and stored only in your browser.</div>
      <header class="head">
        <div><h1>{{ tab.title }}</h1><p>{{ tab.sub }}</p></div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap">
          <button class="btn ghost" @click="openVisit">New visit</button>
          <button class="btn" @click="leadDlg?.showModal()">New lead</button>
        </div>
      </header>
      <component :is="tab.view" />
    </main>

    <nav class="tabbar" aria-label="Main mobile">
      <button v-for="t in tabs" :key="t.id" :aria-current="current === t.id ? 'page' : undefined" @click="current = t.id"><Icon :name="t.icon" />{{ t.label }}</button>
    </nav>

    <dialog ref="leadDlg" aria-labelledby="lt">
      <form @submit.prevent="saveLead">
        <h2 id="lt">New lead</h2>
        <label>Name<input v-model="nl.name" required minlength="2" autocomplete="off" /></label>
        <label>Source<select v-model="nl.origin"><option v-for="o in ORIGINS" :key="o">{{ o }}</option></select></label>
        <label>Interested in<select v-model.number="nl.propertyId"><option v-for="p in db.properties" :key="p.id" :value="p.id">{{ p.code }} · {{ p.title }}</option></select></label>
        <label>Agent<select v-model="nl.agent"><option v-for="a in AGENTS" :key="a">{{ a }}</option></select></label>
        <div class="row"><button type="button" class="btn ghost" @click="leadDlg?.close()">Cancel</button><button class="btn">Add lead</button></div>
      </form>
    </dialog>

    <dialog ref="visitDlg" aria-labelledby="vt">
      <form @submit.prevent="saveVisit">
        <h2 id="vt">Schedule visit</h2>
        <label>Lead<select v-model.number="nv.leadId"><option v-for="l in db.leads" :key="l.id" :value="l.id">{{ l.name }}</option></select></label>
        <label>Listing<select v-model.number="nv.propertyId"><option v-for="p in db.properties" :key="p.id" :value="p.id">{{ p.code }} · {{ p.title }}</option></select></label>
        <label>Date<input v-model="nv.date" type="date" :min="today" required /></label>
        <label>Time<input v-model="nv.time" type="time" required /></label>
        <div class="row"><button type="button" class="btn ghost" @click="visitDlg?.close()">Cancel</button><button class="btn">Schedule</button></div>
      </form>
    </dialog>
  </div>
</template>

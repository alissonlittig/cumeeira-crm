<script setup lang="ts">
import { db, lead, moveProposal, prop } from '../store'
import { STAGES, commission, money, type Stage } from '../lib'

const go = (id: number, cur: Stage, d: number) => moveProposal(id, STAGES[STAGES.indexOf(cur) + d]!)
</script>

<template>
  <div class="board">
    <section v-for="s in STAGES" :key="s" class="col" :aria-label="s">
      <h3><span>{{ s }}</span><span class="num">{{ db.proposals.filter(p => p.stage === s).length }}</span></h3>
      <article v-for="p in db.proposals.filter(x => x.stage === s)" :key="p.id" class="deal">
        <b>{{ prop(p.propertyId).title }}</b>
        <small>{{ lead(p.leadId).name }} · {{ prop(p.propertyId).code }}</small>
        <div class="v num">{{ money(p.value) }}</div>
        <small class="num" style="margin-bottom: 8px">Commission {{ money(commission(p)) }} ({{ p.pct }}%)</small>
        <div class="acts">
          <button :disabled="s === 'Draft'" :aria-label="`Move ${prop(p.propertyId).title} back`" @click="go(p.id, s, -1)">←</button>
          <button :aria-label="`Mark ${prop(p.propertyId).title} lost`" @click="moveProposal(p.id, 'Lost')">Lost</button>
          <button :disabled="s === 'Closed'" :aria-label="`Advance ${prop(p.propertyId).title}`" @click="go(p.id, s, 1)">→</button>
        </div>
      </article>
    </section>
  </div>
  <p class="sub" style="margin-top: 14px">Lost proposals: {{ db.proposals.filter(p => p.stage === 'Lost').length }}. Use the stage buttons to move deals; listing status follows automatically.</p>
</template>

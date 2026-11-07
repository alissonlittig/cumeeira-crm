import { reactive, watch } from 'vue'
import { seedData } from './seed'
import type { Lead, Property, Proposal, Stage, Visit } from './lib'

const KEY = 'cumeeira:v1'
type Data = { properties: Property[]; leads: Lead[]; visits: Visit[]; proposals: Proposal[] }

function load(): Data {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* corrupted storage: fall back to the seed */
  }
  return seedData()
}

export const db = reactive<Data>(load())
watch(db, v => localStorage.setItem(KEY, JSON.stringify(v)), { deep: true })

const nextId = (a: { id: number }[]) => Math.max(0, ...a.map(x => x.id)) + 1
export const prop = (id: number) => db.properties.find(p => p.id === id)!
export const lead = (id: number) => db.leads.find(l => l.id === id)!

export function resetDemo() {
  Object.assign(db, seedData())
}
export function addLead(l: Omit<Lead, 'id'>) {
  db.leads.unshift({ ...l, id: nextId(db.leads) })
}
export function addVisit(v: Omit<Visit, 'id'>) {
  db.visits.push({ ...v, id: nextId(db.visits) })
  db.visits.sort((a, b) => a.at.localeCompare(b.at))
  const l = lead(v.leadId)
  if (l.stage === 'New' || l.stage === 'Contacted') l.stage = 'Visiting'
}
export function setVisit(id: number, status: Visit['status']) {
  db.visits.find(v => v.id === id)!.status = status
}
export function moveProposal(id: number, stage: Stage) {
  const p = db.proposals.find(x => x.id === id)!
  p.stage = stage
  const home = prop(p.propertyId)
  home.status = stage === 'Closed' ? (home.deal === 'Sale' ? 'Sold' : 'Rented') : stage === 'Accepted' ? 'Reserved' : 'Available'
  if (stage !== 'Lost') lead(p.leadId).stage = 'Proposal'
}

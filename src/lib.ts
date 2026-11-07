export type Origin = 'Portal' | 'Instagram' | 'Referral' | 'Website' | 'Walk-in' | 'WhatsApp'
export type PropStatus = 'Available' | 'Reserved' | 'Sold' | 'Rented'
export type LeadStage = 'New' | 'Contacted' | 'Visiting' | 'Proposal' | 'Lost'
export type VisitStatus = 'Scheduled' | 'Done' | 'Cancelled'
export type Stage = 'Draft' | 'Sent' | 'Negotiating' | 'Accepted' | 'Closed' | 'Lost'

export interface Property { id: number; code: string; title: string; hood: string; kind: string; deal: 'Sale' | 'Rent'; price: number; area: number; beds: number; parking: number; status: PropStatus; hue: number; agent: string }
export interface Lead { id: number; name: string; origin: Origin; stage: LeadStage; propertyId: number; created: string; agent: string }
export interface Visit { id: number; leadId: number; propertyId: number; at: string; status: VisitStatus }
export interface Proposal { id: number; leadId: number; propertyId: number; value: number; stage: Stage; pct: number }

export const ORIGINS: Origin[] = ['Portal', 'Instagram', 'Referral', 'Website', 'Walk-in', 'WhatsApp']
export const STAGES: Stage[] = ['Draft', 'Sent', 'Negotiating', 'Accepted', 'Closed']
export const AGENTS = ['Helena Prado', 'Marcos Tavares', 'Beatriz Lemos', 'Rafael Quintas']

export const money = (v: number, compact = false) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: compact ? 1 : 0, notation: compact ? 'compact' : 'standard' }).format(v)

/** Commission in USD: `pct` percent of the proposal value (sale price, or rent-contract value). */
export const commission = (p: Pick<Proposal, 'value' | 'pct'>) => Math.round((p.value * p.pct) / 100)

/** Funnel counts: how many proposals reached at least each stage (Lost excluded). */
export function funnel(ps: Proposal[]) {
  const idx = (s: Stage) => STAGES.indexOf(s)
  return STAGES.map(s => ({ stage: s, count: ps.filter(p => p.stage !== 'Lost' && idx(p.stage) >= idx(s)).length }))
}

export const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0)

export function bySource(leads: Lead[]) {
  return ORIGINS.map(o => ({ origin: o, count: leads.filter(l => l.origin === o).length }))
}

/** Deterministic PRNG so the demo data is identical on every machine. */
export function rng(seed: number) {
  return () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296)
}

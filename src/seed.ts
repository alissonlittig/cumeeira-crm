import { AGENTS, ORIGINS, rng, type Lead, type LeadStage, type Property, type Proposal, type Stage, type Visit } from './lib'

const HOODS = ['Riverside', 'Old Town', 'Pine Heights', 'Harbor Point', 'Maple Grove', 'Cedar Park', 'Lakeview', 'Union Square']
const KINDS = ['Apartment', 'House', 'Loft', 'Townhouse', 'Penthouse', 'Studio']
const FIRST = ['Ana', 'Bruno', 'Clara', 'Diego', 'Elisa', 'Felipe', 'Gabi', 'Heitor', 'Irene', 'Jonas', 'Karina', 'Leo', 'Marta', 'Nico', 'Olga', 'Paulo', 'Rita', 'Saulo', 'Tania', 'Vitor']
const LAST = ['Almeida', 'Barros', 'Cardoso', 'Duarte', 'Esteves', 'Farias', 'Gomes', 'Holanda', 'Ibarra', 'Junqueira']
const day = 864e5

export function seedData() {
  const r = rng(457)
  const pick = <T>(a: T[]): T => a[Math.floor(r() * a.length)]!
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const properties: Property[] = Array.from({ length: 18 }, (_, i) => {
    const deal: Property['deal'] = r() < 0.3 ? 'Rent' : 'Sale'
    const kind = pick(KINDS), hood = pick(HOODS)
    const area = 38 + Math.floor(r() * 190)
    const price = deal === 'Sale' ? Math.round((area * (2100 + r() * 2600)) / 1000) * 1000 : Math.round((area * (14 + r() * 18)) / 10) * 10
    return { id: i + 1, code: `CM-${1040 + i}`, title: `${kind} in ${hood}`, hood, kind, deal, price, area, beds: kind === 'Studio' ? 1 : 1 + Math.floor(r() * 4), parking: Math.floor(r() * 3), status: 'Available', hue: Math.floor(r() * 360), agent: pick(AGENTS) }
  })

  const stages: LeadStage[] = ['New', 'New', 'Contacted', 'Contacted', 'Visiting', 'Proposal', 'Lost']
  const leads: Lead[] = Array.from({ length: 64 }, (_, i) => ({
    id: i + 1, name: `${pick(FIRST)} ${pick(LAST)}`, origin: ORIGINS[Math.floor(Math.pow(r(), 1.3) * ORIGINS.length)]!,
    stage: pick(stages), propertyId: 1 + Math.floor(r() * properties.length),
    created: new Date(now.getTime() - Math.floor(r() * 90) * day).toISOString().slice(0, 10), agent: pick(AGENTS),
  }))

  const visits: Visit[] = Array.from({ length: 22 }, (_, i) => {
    const off = i < 8 ? -1 - Math.floor(r() * 12) : Math.floor(r() * 9)
    const d = new Date(now.getTime() + off * day)
    d.setHours(9 + Math.floor(r() * 9), r() < 0.5 ? 0 : 30)
    const l = pick(leads)
    return { id: i + 1, leadId: l.id, propertyId: l.propertyId, at: d.toISOString(), status: off < 0 ? (r() < 0.85 ? 'Done' : 'Cancelled') : 'Scheduled' } as Visit
  }).sort((a, b) => a.at.localeCompare(b.at))
  visits.forEach((v, i) => (v.id = i + 1))

  const flow: Stage[] = ['Draft', 'Sent', 'Sent', 'Negotiating', 'Negotiating', 'Accepted', 'Closed', 'Closed', 'Closed', 'Lost']
  const used = new Set<number>()
  const proposals: Proposal[] = []
  for (const l of leads.filter(l => l.stage === 'Proposal' || (l.stage === 'Visiting' && r() < 0.6))) {
    const p = properties[l.propertyId - 1]!
    if (used.has(p.id)) continue
    used.add(p.id)
    const stage = pick(flow)
    proposals.push({ id: proposals.length + 1, leadId: l.id, propertyId: p.id, value: Math.round((p.price * (0.93 + r() * 0.07)) / 10) * 10, stage, pct: p.deal === 'Sale' ? 5 : 8 })
    if (stage === 'Closed') p.status = p.deal === 'Sale' ? 'Sold' : 'Rented'
    else if (stage === 'Accepted') p.status = 'Reserved'
  }
  return { properties, leads, visits, proposals }
}

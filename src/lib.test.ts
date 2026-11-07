import { describe, expect, it } from 'vitest'
import { bySource, commission, funnel, pct, type Proposal } from './lib'
import { seedData } from './seed'

const P = (stage: Proposal['stage']): Proposal => ({ id: 1, leadId: 1, propertyId: 1, value: 100, stage, pct: 5 })

describe('lib', () => {
  it('commission rounds percentage of value', () => expect(commission({ value: 412_350, pct: 5 })).toBe(20_618))
  it('funnel counts proposals that reached each stage, ignoring lost', () => {
    const f = funnel([P('Draft'), P('Sent'), P('Closed'), P('Lost')])
    expect(f.map(x => x.count)).toEqual([3, 2, 1, 1, 1])
  })
  it('pct guards divide by zero', () => {
    expect(pct(1, 0)).toBe(0)
    expect(pct(1, 4)).toBe(25)
  })
  it('bySource totals all leads', () => {
    const { leads } = seedData()
    expect(bySource(leads).reduce((s, x) => s + x.count, 0)).toBe(leads.length)
  })
  it('seed is deterministic and consistent', () => {
    const a = seedData(), b = seedData()
    expect(a.properties).toEqual(b.properties)
    for (const p of a.proposals) expect(a.properties.some(x => x.id === p.propertyId)).toBe(true)
  })
})

import { describe, it, expect } from 'vitest'
import { getStatus } from '@/utils/dataSourceUtils'
import dataSourceFixtures from '../test/fixtures/dataSourceFixtures'

describe('getStatus', () => {
  it('returns "pending" if lastSynced is not set', () => {
    let dataSource = JSON.parse(JSON.stringify(dataSourceFixtures[0]))
    dataSource = { ...dataSource, lastSynced: null }
    expect(getStatus(dataSource)).toBe('pending')
  })

  it('returns "ok" if lastSyncSuccessful is false but nextSync is in the future', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1) // Set to tomorrow
    let dataSource = JSON.parse(JSON.stringify(dataSourceFixtures[0]))

    dataSource = {
      ...dataSource,
      lastSynced: new Date(),
      lastSyncSuccessful: false,
      nextSync: futureDate.toISOString(),
    }
    expect(getStatus(dataSource)).toBe('ok')
  })

  it('returns "bad" if lastSyncSuccessful is false and dataSourceThru is null', () => {
    let dataSource = JSON.parse(JSON.stringify(dataSourceFixtures[0]))
    dataSource = {
      ...dataSource,
      lastSynced: new Date(),
      lastSyncSuccessful: false,
      dataSourceThru: null,
    }
    expect(getStatus(dataSource)).toBe('bad')
  })

  it('returns "stale" if nextSync is in the past', () => {
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 1)

    let dataSource = JSON.parse(JSON.stringify(dataSourceFixtures[0]))
    dataSource = {
      ...dataSource,
      lastSynced: new Date(),
      nextSync: pastDate.toISOString(),
    }
    expect(getStatus(dataSource)).toBe('stale')
  })

  it('returns "bad" for other conditions', () => {
    let dataSource = JSON.parse(JSON.stringify(dataSourceFixtures[1]))
    dataSource = {
      ...dataSource,
      lastSynced: new Date(),
      lastSyncSuccessful: true,
    }
    expect(getStatus(dataSource)).toBe('bad')
  })
})

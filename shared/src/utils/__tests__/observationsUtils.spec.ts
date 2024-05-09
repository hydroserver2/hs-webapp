import { describe, it, expect } from 'vitest'
import { subtractHours, preProcessData } from '../observationsUtils'
import { DataArray, Datastream } from '../../types'

describe('subtractHours', () => {
  it('correctly subtracts hours from a timestamp', () => {
    const timestamp = '2022-01-01T10:00:00Z'
    const hours = 5
    const expected = '2022-01-01T05:00:00.000Z'
    expect(subtractHours(timestamp, hours)).toBe(expected)
  })
})

describe('preProcessData', () => {
  it('Properly pre-processes data', () => {
    const input = [
      ['2023-01-01T00:00:00Z', 10],
      // Time Gap
      ['2023-01-01T02:00:00Z', 20],
      ['2023-01-01T02:05:00Z', -9999], // No data val
      ['2023-01-01T02:10:00Z', 30],
      ['2023-01-01T02:15:00Z', 40],
      ['2023-01-01T02:20:00Z', -9999], // No data val
      // Time Gap
      ['2023-01-01T02:30:00Z', 50],
      ['2023-01-01T02:35:00Z', 60],
    ]

    let newDatastream = new Datastream()
    newDatastream = {
      ...newDatastream,
      intendedTimeSpacing: 5,
      intendedTimeSpacingUnits: 'minutes',
    }

    const data = preProcessData(input as DataArray, newDatastream)

    const expected = [
      { date: new Date('2023-01-01T00:00:00.000Z'), value: 10 },
      { date: new Date('2023-01-01T00:00:00.001Z'), value: NaN },
      { date: new Date('2023-01-01T02:00:00.000Z'), value: 20 },
      { date: new Date('2023-01-01T02:05:00.000Z'), value: NaN },
      { date: new Date('2023-01-01T02:10:00.000Z'), value: 30 },
      { date: new Date('2023-01-01T02:15:00.000Z'), value: 40 },
      { date: new Date('2023-01-01T02:20:00.000Z'), value: NaN },
      { date: new Date('2023-01-01T02:20:00.001Z'), value: NaN },
      { date: new Date('2023-01-01T02:30:00.000Z'), value: 50 },
      { date: new Date('2023-01-01T02:35:00.000Z'), value: 60 },
    ]

    expect(data).toStrictEqual(expected)
  })
})

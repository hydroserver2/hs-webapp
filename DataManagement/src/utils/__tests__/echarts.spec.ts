import { describe, it, expect } from 'vitest'
import {
  createYAxisConfigurations,
  generateSeriesOptions,
  generateYAxisOptions,
} from '@/utils/plotting/echarts'

describe('createYAxisConfigurations', () => {
  it('should correctly map single series to yAxis configurations', () => {
    const seriesArray = [
      {
        id: '1',
        name: 'Series 1',
        data: [],
        yAxisLabel: 'Y1',
        lineColor: '#FF0000',
      },
    ]
    const result = createYAxisConfigurations(seriesArray)
    expect(result.size).toBe(1)
    expect(result.get('Y1')).toEqual({
      index: 0,
      yAxisLabel: 'Y1',
      color: '#FF0000',
    })
  })

  it('should set color to black if multiple series use the same yAxis', () => {
    const seriesArray = [
      {
        id: '1',
        name: 'Series 1',
        data: [],
        yAxisLabel: 'Y1',
        lineColor: '#FF0000',
      },
      {
        id: '2',
        name: 'Series 2',
        data: [],
        yAxisLabel: 'Y1',
        lineColor: '#00FF00',
      },
    ]
    const result = createYAxisConfigurations(seriesArray)
    const config = result.get('Y1')
    expect(config).toBeDefined()
    expect(config!.color).toBe('black')
  })
})

describe('generateYAxisOptions', () => {
  it('should correctly generate yAxis options from configurations', () => {
    const yAxisConfigurations = new Map([
      ['Y1', { index: 0, yAxisLabel: 'Y1', color: '#FF0000' }],
    ])
    const result = generateYAxisOptions(yAxisConfigurations)
    expect(result.length).toBe(1)
    expect(result[0]).toMatchObject({
      name: 'Y1',
      axisLine: { lineStyle: { color: '#FF0000' } },
    })
  })
})

describe('generateSeriesOptions', () => {
  it('should correctly generate series options from series array and yAxis configurations', () => {
    const seriesArray = [
      {
        id: '1',
        name: 'Series 1',
        data: [{ date: new Date(), value: 100 }],
        yAxisLabel: 'Y1',
        lineColor: '#FF0000',
      },
    ]
    const yAxisConfigurations = new Map([
      ['Y1', { index: 0, yAxisLabel: 'Y1', color: '#FF0000' }],
    ])
    const result = generateSeriesOptions(seriesArray, yAxisConfigurations)
    expect(result.length).toBe(1)
    expect(result[0]).toMatchObject({
      name: 'Series 1',
      type: 'line',
      yAxisIndex: 0,
      itemStyle: { color: '#FF0000' },
    })
  })
})

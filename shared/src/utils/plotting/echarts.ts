import { EChartsOption, YAXisComponentOption, SeriesOption } from 'echarts'
import { GraphSeries } from '@shared/types'
import { storeToRefs } from 'pinia'
import { useDataVisStore } from '@shared/store/dataVisualization'

type yAxisConfigurationMap = Map<
  string,
  { index: number; yAxisLabel: string; color: string }
>

/**
Function that processes an array of GraphSeries and returns a map for Y-Axis configurations in order 
to allow multiple series to share the same Y-Axis if yAxisLabels are the same.
Colors axis black if multiple series use it.
*/
export function createYAxisConfigurations(
  data: GraphSeries[]
): yAxisConfigurationMap {
  const yAxisConfigurations: yAxisConfigurationMap = new Map()

  data.forEach((series) => {
    if (!yAxisConfigurations.has(series.yAxisLabel)) {
      yAxisConfigurations.set(series.yAxisLabel, {
        index: yAxisConfigurations.size,
        yAxisLabel: series.yAxisLabel,
        color: series.lineColor,
      })
    } else {
      const existingEntry = yAxisConfigurations.get(series.yAxisLabel)
      if (existingEntry && existingEntry.color !== 'black') {
        yAxisConfigurations.set(series.yAxisLabel, {
          ...existingEntry,
          color: 'black',
        })
      }
    }
  })

  return yAxisConfigurations
}

export function generateYAxisOptions(
  yAxisConfigurations: yAxisConfigurationMap
): YAXisComponentOption[] {
  const leftYAxesCount = Math.ceil(yAxisConfigurations.size / 2)

  return Array.from(yAxisConfigurations.values()).map((yAxisConfig, index) => {
    const position = index < leftYAxesCount ? 'left' : 'right'
    let offset = index === 0 ? 0 : (index - leftYAxesCount) * 85
    if (position === 'left') offset = -offset

    return {
      name: yAxisConfig.yAxisLabel,
      nameLocation: 'middle',
      nameGap: 60,
      type: 'value',
      position,
      offset,
      min: 'dataMin',
      max: 'dataMax',
      axisLabel: {
        showMaxLabel: false,
        showMinLabel: false,
      },
      axisTick: {
        show: true,
        length: 5,
      },
      splitLine: {
        show: false,
      },
      axisLine: { show: true, lineStyle: { color: yAxisConfig.color } },
    }
  })
}

export function generateSeriesOptions(
  seriesArray: GraphSeries[],
  yAxisConfigurations: yAxisConfigurationMap
): SeriesOption[] {
  return seriesArray.map((series) => ({
    name: series.name,
    type: 'line',
    data: series.data.map((dp) => [dp.date.getTime(), dp.value]),
    yAxisIndex: yAxisConfigurations.get(series.yAxisLabel)?.index,
    itemStyle: {
      color: series.lineColor,
    },
    lineStyle: {
      width: 1,
    },
    sampling: 'lttb',
    showSymbol: false,
  }))
}

export function generateToolboxOptions() {
  const { showSummaryStatistics } = storeToRefs(useDataVisStore())
  return {
    feature: {
      mySummaryStatistics: {
        show: true,
        title: 'Summary Statistics',
        icon: 'path://M3,2 L17,2 L21,6 L21,22 L3,22 L3,2 M17,2 L17,6 L21,6',
        onclick: function () {
          showSummaryStatistics.value = true
        },
      },
      dataZoom: {
        yAxisIndex: 'none',
      },
      restore: {},
      saveAsImage: { name: 'plot_export' },
    },
  }
}

export function generateDataZoomOptions() {
  const { dataZoomStart, dataZoomEnd } = storeToRefs(useDataVisStore())
  return [
    {
      type: 'slider', // Creates a 'brush/context' zoom window
      start: dataZoomStart.value,
      end: dataZoomEnd.value,
    },
    {
      type: 'inside', // For mouse scrolling in the chart
    },
  ]
}

interface CustomOptions {
  addToolbox: boolean
  initializeZoomed: boolean
  addLegend: boolean
}

export const createEChartsOption = (
  seriesArray: GraphSeries[],
  opts: Partial<CustomOptions> = {}
): EChartsOption => {
  const { addToolbox = true, initializeZoomed = true, addLegend = true } = opts

  const yAxisConfigurations = createYAxisConfigurations(seriesArray)
  const yAxisOptions = generateYAxisOptions(yAxisConfigurations)
  const seriesOptions = generateSeriesOptions(seriesArray, yAxisConfigurations)

  const leftYAxesCount = Math.ceil(yAxisConfigurations.size / 2)
  const rightYAxesCount = yAxisConfigurations.size - leftYAxesCount
  let gridRightPadding = 20 + rightYAxesCount * 85
  let gridLeftPadding = leftYAxesCount * 85

  let echartsOption: EChartsOption = {
    grid: {
      bottom: 80,
      right: gridRightPadding,
      top: 50 + 15 * seriesArray.length,
      left: gridLeftPadding,
    },
    tooltip: {
      confine: true,
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        animation: false,
        label: {
          backgroundColor: '#505765',
        },
      },
    },
    xAxis: {
      type: 'time',
      axisLabel: {
        hideOverlap: true,
        formatter: {
          year: '{yyyy}',
          month: '{MMM} {yyyy}',
          day: '{MMM} {d}, {yy}',
          hour: '{HH}:{mm}\n{MMM} {d}, {yy}',
          minute: '{HH}:{mm}\n{MMM} {d}, {yy}',
          second: '{H}:{mm}:{s}\n{MMM} {d}, {yy}',
          millisecond: '{HH}:{mm}:{s}:{S}\n{MMM} {d}, {yy}',
        },
      },
    },
    yAxis: yAxisOptions,
    series: seriesOptions,
    dataZoom: initializeZoomed
      ? generateDataZoomOptions()
      : [
          {
            type: 'slider',
          },
          {
            type: 'inside',
          },
        ],
  }

  if (addToolbox) {
    echartsOption.toolbox = generateToolboxOptions() as {}
  }

  if (addLegend) {
    echartsOption.legend = {
      orient: 'vertical',
      left: 'auto',
    }
  }

  return echartsOption
}

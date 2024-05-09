import {
  DataArray,
  DataPoint,
  Datastream,
  TimeSpacingUnit,
} from '@shared/types'
import { api, getObservationsEndpoint } from '@shared/services/api'

export function subtractHours(timestamp: string, hours: number): string {
  const date = new Date(timestamp)
  date.setHours(date.getHours() - hours)
  return date.toISOString()
}

export const fetchObservationsParallel = async (
  datastream: Datastream,
  startTime: string | null = null,
  endTime: string | null = null
) => {
  const { id, phenomenonBeginTime, phenomenonEndTime, valueCount } = datastream
  if (!phenomenonBeginTime || !phenomenonEndTime) return

  const pageSize = 50_000
  const endpoints: string[] = []
  let skipCount = 0
  while (skipCount < valueCount) {
    endpoints.push(
      getObservationsEndpoint(
        id,
        pageSize,
        startTime ? startTime : phenomenonBeginTime,
        endTime ? endTime : phenomenonEndTime,
        skipCount
      )
    )
    skipCount += pageSize
  }

  try {
    const results = await Promise.all(
      endpoints.map((endpoint) => api.fetchObservations(endpoint))
    )
    return results.reduce((acc, data) => {
      if (data?.value?.length > 0 && data.value[0].dataArray) {
        return acc.concat(data.value[0].dataArray)
      }
      return acc
    }, [])
  } catch (error) {
    console.error('Error fetching data:', error)
    return Promise.reject(error)
  }
}

export function toDataPointArray(dataArray: DataArray) {
  return dataArray.map(([dateString, value]) => ({
    date: new Date(dateString),
    value,
  }))
}

// Function to replace 'no data' values with NaN
export function replaceNoDataValues(data: DataPoint[], noDataValue: number) {
  return data.map((d) => ({
    ...d,
    value: d.value === noDataValue ? NaN : d.value,
  }))
}

export function convertTimeSpacingToMilliseconds(
  timeSpacing: number,
  unit: TimeSpacingUnit
): number {
  const unitToMilliseconds = {
    seconds: 1000,
    minutes: 1000 * 60,
    hours: 1000 * 60 * 60,
    days: 1000 * 60 * 60 * 24,
  }

  return timeSpacing * (unitToMilliseconds[unit] || 0)
}

function calculateTimeDifference(point1: DataPoint, point2: DataPoint): number {
  const time1 = new Date(point1.date).getTime()
  const time2 = new Date(point2.date).getTime()

  return Math.abs(time2 - time1)
}

export function addNaNForGaps(data: DataPoint[], maxGap: number): DataPoint[] {
  const modifiedData: DataPoint[] = []
  data.forEach((point, index) => {
    modifiedData.push(point)
    if (index < data.length - 1) {
      const timeDifference = calculateTimeDifference(point, data[index + 1])
      if (timeDifference > maxGap) {
        modifiedData.push({
          date: new Date(point.date.getTime() + 1),
          value: NaN,
        })
      }
    }
  })
  return modifiedData
}

export function preProcessData(dataArray: DataArray, datastream: Datastream) {
  const { noDataValue, intendedTimeSpacing, intendedTimeSpacingUnits } =
    datastream

  let data = toDataPointArray(dataArray)
  data = replaceNoDataValues(data, noDataValue)

  if (intendedTimeSpacingUnits && intendedTimeSpacing) {
    const maxGap = convertTimeSpacingToMilliseconds(
      intendedTimeSpacing,
      intendedTimeSpacingUnits as TimeSpacingUnit
    )

    data = addNaNForGaps(data, maxGap)
  }
  return data
}

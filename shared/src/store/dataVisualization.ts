import {
  Datastream,
  ObservedProperty,
  ProcessingLevel,
  Thing,
  GraphSeries,
} from '@shared/types'
import {
  SummaryStatistics,
  calculateSummaryStatistics,
} from '@shared/utils/plotting/summaryStatisticUtils'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { EChartsOption } from 'echarts'
import { EChartsColors } from '@shared/utils/materialColors'
import { createEChartsOption } from '@shared/utils/plotting/echarts'
import { useObservationStore } from '@shared/store/observations'

export const useDataVisStore = defineStore('dataVisualization', () => {
  const { fetchGraphSeries } = useObservationStore()

  const things = ref<Thing[]>([])
  const datastreams = ref<Datastream[]>([])
  const observedProperties = ref<ObservedProperty[]>([])
  const processingLevels = ref<ProcessingLevel[]>([])

  const selectedThings = ref<Thing[]>([])
  const selectedDatastreams = ref<Datastream[]>([])
  const selectedObservedPropertyNames = ref<string[]>([])
  const selectedProcessingLevelNames = ref<string[]>([])
  const filterDrawer = ref(false)
  const prevFilterDrawer = ref(false)

  const showSummaryStatistics = ref(false)
  const summaryStatisticsArray = ref<SummaryStatistics[]>([])

  const graphSeriesArray = ref<GraphSeries[]>([])
  const echartsOption = ref<EChartsOption | undefined>()
  const loadingStates = ref(new Map<string, boolean>()) // State to track loading status of individual datasets
  const prevIds = ref<string[]>([])

  const cardHeight = ref(40)
  const tableHeight = ref(30)

  const endDate = ref<Date>(new Date())
  const oneWeek = 7 * 24 * 60 * 60 * 1000
  const beginDate = ref<Date>(new Date(endDate.value.getTime() - oneWeek))
  const selectedDateBtnId = ref(2)
  const dataZoomStart = ref(0)
  const dataZoomEnd = ref(100)

  function resetState() {
    selectedThings.value = []
    selectedDatastreams.value = []
    selectedObservedPropertyNames.value = []
    selectedProcessingLevelNames.value = []
    showSummaryStatistics.value = false
    summaryStatisticsArray.value = []
    endDate.value = new Date()
    beginDate.value = new Date(new Date().getTime() - oneWeek)
    selectedDateBtnId.value = 2
    dataZoomStart.value = 0
    dataZoomEnd.value = 100
  }

  function matchesSelectedObservedProperty(datastream: Datastream) {
    if (selectedObservedPropertyNames.value.length === 0) return true

    const OPName = observedProperties.value.find(
      (op) => op.id === datastream.observedPropertyId
    )?.name
    return (
      OPName !== undefined &&
      selectedObservedPropertyNames.value.includes(OPName)
    )
  }

  function matchesSelectedProcessingLevel(datastream: Datastream) {
    if (selectedProcessingLevelNames.value.length === 0) return true

    const PLName = processingLevels.value.find(
      (pl) => pl.id === datastream.processingLevelId
    )?.definition
    return (
      PLName !== undefined &&
      selectedProcessingLevelNames.value.includes(PLName)
    )
  }

  function matchesSelectedThing(datastream: Datastream) {
    if (selectedThings.value.length === 0) return true

    return (
      selectedThings.value.length === 0 ||
      selectedThings.value.some((thing) => thing.id === datastream.thingId)
    )
  }

  const filteredDatastreams = computed(() => {
    return datastreams.value.filter(
      (datastream) =>
        matchesSelectedThing(datastream) &&
        matchesSelectedObservedProperty(datastream) &&
        matchesSelectedProcessingLevel(datastream)
    )
  })

  const dateOptions = ref([
    {
      id: 0,
      label: 'Last Year',
      calculateBeginDate: () => {
        const now = endDate.value
        return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      },
    },
    {
      id: 1,
      label: 'Last Month',
      calculateBeginDate: () => {
        const now = endDate.value
        return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      },
    },
    {
      id: 2,
      label: 'Last Week',
      calculateBeginDate: () => {
        const now = endDate.value
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
      },
    },
  ])

  const getMostRecentEndTime = () =>
    selectedDatastreams.value.reduce((latest, ds) => {
      const dsEndDate = new Date(ds.phenomenonEndTime!)
      return dsEndDate > latest ? dsEndDate : latest
    }, new Date(0))

  interface SetDateRangeParams {
    begin?: Date
    end?: Date
    update?: boolean
    custom?: boolean
  }

  const setDateRange = ({
    begin,
    end,
    update = true,
    custom = true,
  }: SetDateRangeParams) => {
    dataZoomStart.value = 0
    dataZoomEnd.value = 100
    if (begin) beginDate.value = begin
    if (end) endDate.value = end

    if (custom) selectedDateBtnId.value = -1

    if (update) {
      clearState()
      if (!beginDate || !endDate || !selectedDatastreams.value.length) return
      updateDatasets(selectedDatastreams.value)
    }
  }

  const onDateBtnClick = (selectedId: number) => {
    const selectedOption = dateOptions.value.find(
      (option) => option.id === selectedId
    )
    if (selectedOption) {
      const newEndDate = getMostRecentEndTime()
      const newBeginDate = selectedOption.calculateBeginDate()

      selectedDateBtnId.value = selectedId
      setDateRange({
        begin: newBeginDate,
        end: newEndDate,
        custom: false,
      })
    }
  }

  function updateVisualization() {
    graphSeriesArray.value.forEach((series, index) => {
      series.lineColor = EChartsColors[index % EChartsColors.length]
    })
    summaryStatisticsArray.value = calculateSummaryStatistics(
      graphSeriesArray.value
    )
    echartsOption.value = createEChartsOption(graphSeriesArray.value)
    prevIds.value = graphSeriesArray.value.map((series) => series.id)
  }

  const fetchDatasets = (datastreams: Datastream[]) => {
    datastreams.forEach((ds) => {
      loadingStates.value.set(ds.id, true)
      const begin = beginDate.value.toISOString()
      const end = endDate.value.toISOString()
      fetchGraphSeries(ds, begin, end)
        .then((newSeries) => {
          if (!selectedDatastreams.value.some((sd) => sd.id === ds.id)) return

          graphSeriesArray.value = graphSeriesArray.value.filter(
            (series) => series.id !== ds.id
          )

          graphSeriesArray.value.push(newSeries)
          updateVisualization()
        })
        .catch((error) => {
          console.error(`Failed to fetch dataset ${ds.id}:`, error)
        })
        .finally(() => {
          loadingStates.value.set(ds.id, false)
        })
    })
  }

  const updateDatasets = async (datastreams: Datastream[]) => {
    const currentIds = datastreams.map((ds) => ds.id)
    const newIds = currentIds.filter((id) => !prevIds.value.includes(id))
    const removedIds = prevIds.value.filter((id) => !currentIds.includes(id))

    // Remove old
    if (removedIds.length) {
      graphSeriesArray.value = graphSeriesArray.value.filter(
        (series) => !removedIds.includes(series.id)
      )
      updateVisualization()
    }

    // fetch new
    if (newIds.length)
      fetchDatasets(datastreams.filter((d) => newIds.includes(d.id)))
  }

  // If currently selected datastreams are no longer in filteredDatastreams, deselect them
  watch(
    () => filteredDatastreams.value,
    (newDatastreams) => {
      selectedDatastreams.value = selectedDatastreams.value.filter((ds) =>
        newDatastreams.some((datastream) => datastream.id === ds.id)
      )
    },
    { deep: true }
  )

  const clearState = () => {
    graphSeriesArray.value = []
    prevIds.value = []
    showSummaryStatistics.value = false
    echartsOption.value = undefined
  }

  // Update the time range to the most recent phenomenon end time
  let prevDatastreamIds = ''
  watch(
    () => selectedDatastreams.value,
    (newDs) => {
      const newDatastreamIds = JSON.stringify(newDs.map((ds) => ds.id).sort())

      if (!newDs.length || !beginDate.value || !endDate.value) {
        clearState()
      } else if (newDatastreamIds !== prevDatastreamIds) {
        const oldEnd = endDate.value
        const oldBegin = beginDate.value
        endDate.value = getMostRecentEndTime()
        const selectedOption = dateOptions.value.find(
          (option) => option.id === selectedDateBtnId.value
        )
        if (selectedOption) {
          beginDate.value = selectedOption.calculateBeginDate()
        }
        if (
          oldEnd.getTime() !== endDate.value.getTime() ||
          oldBegin.getTime() !== beginDate.value.getTime()
        )
          clearState()
        updateDatasets(newDs)
      }
      prevDatastreamIds = newDatastreamIds
    },
    { deep: true, immediate: true }
  )

  return {
    things,
    datastreams,
    processingLevels,
    observedProperties,
    selectedThings,
    selectedObservedPropertyNames,
    selectedProcessingLevelNames,
    filteredDatastreams,
    selectedDatastreams,
    beginDate,
    endDate,
    dataZoomStart,
    dataZoomEnd,
    dateOptions,
    graphSeriesArray,
    echartsOption,
    prevIds,
    loadingStates,
    selectedDateBtnId,
    showSummaryStatistics,
    summaryStatisticsArray,
    cardHeight,
    tableHeight,
    filterDrawer,
    prevFilterDrawer,
    matchesSelectedObservedProperty,
    matchesSelectedProcessingLevel,
    matchesSelectedThing,
    setDateRange,
    onDateBtnClick,
    resetState,
  }
})

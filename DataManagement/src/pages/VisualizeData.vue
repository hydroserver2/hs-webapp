<template>
  <FullScreenLoader v-if="loading" />
  <div v-else>
    <DataVisFiltersDrawer />

    <div class="my-4 mx-4">
      <v-expansion-panels v-model="panels">
        <v-expansion-panel title="Data Visualization" v-if="cardHeight">
          <v-expansion-panel-text>
            <DataVisualizationCard :cardHeight="cardHeight" />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <DataVisTimeFilters />

      <v-sheet
        v-if="panels === 0"
        class="resize-handle"
        @mousedown="handleMouseDown"
        color="blue-grey-lighten-2"
        :height="4"
        :elevation="2"
        rounded="xl"
        outlined
      />
      <v-divider v-else />

      <div class="mt-1">
        <DataVisDatasetsTable @copy-state="copyStateToClipboard" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DataVisFiltersDrawer from '@/components/VisualizeData/DataVisFiltersDrawer.vue'
import DataVisDatasetsTable from '@/components/VisualizeData/DataVisDatasetsTable.vue'
import DataVisualizationCard from '@/components/VisualizeData/DataVisualizationCard.vue'
import DataVisTimeFilters from '@/components/VisualizeData/DataVisTimeFilters.vue'
import FullScreenLoader from '@shared/components/base/FullScreenLoader.vue'
import { Snackbar } from '@shared/utils/notifications'
import { api } from '@shared/services/api'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useDataVisStore } from '@/store/dataVisualization'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
const route = useRoute()

const { onDateBtnClick, resetState } = useDataVisStore()
const {
  things,
  selectedThings,
  selectedDatastreams,
  selectedObservedPropertyNames,
  selectedProcessingLevelNames,
  processingLevels,
  observedProperties,
  datastreams,
  beginDate,
  endDate,
  dataZoomStart,
  dataZoomEnd,
  selectedDateBtnId,
  cardHeight,
  tableHeight,
} = storeToRefs(useDataVisStore())

const panels = ref(0)

watch(panels, () => {
  if (panels.value === 0)
    tableHeight.value = Math.max(70 - cardHeight.value, 16)
  else if (panels.value === undefined) tableHeight.value = Math.max(70, 16)
})

let startY = 0
let startHeight = 0

function handleMouseDown(e: MouseEvent) {
  startY = e.clientY
  startHeight = cardHeight.value
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

function handleMouseMove(e: MouseEvent) {
  const diffY = e.clientY - startY
  const diffVh = diffY * (100 / window.innerHeight)
  cardHeight.value = Math.max(startHeight + diffVh, 16) // Minimum height of 16vh
  tableHeight.value = Math.max(70 - cardHeight.value, 16)
}

function handleMouseUp() {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

const generateStateUrl = () => {
  const BASE_URL = `${
    import.meta.env.MODE === 'development'
      ? 'http://127.0.0.1:5173'
      : import.meta.env.VITE_APP_PROXY_BASE_URL
  }/visualize-data/`

  const queryParams = new URLSearchParams()

  const siteIds = selectedThings.value.map((t) => t.id).join(',')
  if (siteIds) queryParams.append('sites', siteIds)

  const datastreamIds = selectedDatastreams.value
    .map((ds) => encodeURIComponent(ds.id))
    .join(',')
  if (datastreamIds) queryParams.append('datastreams', datastreamIds)

  if (selectedProcessingLevelNames.value.length)
    queryParams.append('PLs', selectedProcessingLevelNames.value.join(','))

  if (selectedObservedPropertyNames.value.length)
    queryParams.append('OPs', selectedObservedPropertyNames.value.join(','))

  if (selectedDateBtnId.value < 0) {
    queryParams.append('beginDate', beginDate.value.toISOString())
    queryParams.append('endDate', endDate.value.toISOString())
  } else {
    // 2 is the default so no need to put it in the URL
    if (selectedDateBtnId.value !== 2)
      queryParams.append(
        'selectedDateBtnId',
        selectedDateBtnId.value.toString()
      )
  }

  if (dataZoomStart.value !== 0)
    queryParams.append('dataZoomStart', dataZoomStart.value.toString())
  if (dataZoomEnd.value !== 0 && dataZoomEnd.value !== 100)
    queryParams.append('dataZoomEnd', dataZoomEnd.value.toString())

  return `${BASE_URL}?${queryParams.toString()}`
}

const copyStateToClipboard = async () => {
  try {
    const stateUrl = generateStateUrl()
    await navigator.clipboard.writeText(stateUrl)
    Snackbar.info('Copied URL to clipboard')
  } catch (err) {
    console.error('Failed to copy URL:', err)
  }
}

const parseUrlAndSetState = () => {
  const selectedDateBtnIdParam = (route.query.selectedDateBtnId as string) || ''
  if (selectedDateBtnIdParam !== '') {
    // Convert the string to a number using the unary plus operator
    const btnId = +selectedDateBtnIdParam
    onDateBtnClick(btnId)
  } else {
    const beginDateParam = (route.query.beginDate as string) || ''
    const endDateParam = (route.query.endDate as string) || ''
    if (beginDateParam || endDateParam) {
      selectedDateBtnId.value = -1
      if (beginDateParam) beginDate.value = new Date(beginDateParam)
      if (endDateParam) endDate.value = new Date(endDateParam)
    }
  }

  const datastreamIdString = (route.query.datastreams as string) || ''
  const datastreamIds = datastreamIdString.split(',')
  if (datastreamIds)
    selectedDatastreams.value = datastreams.value.filter((ds) =>
      datastreamIds.includes(ds.id)
    )

  const siteIdString = (route.query.sites as string) || ''
  const siteIds = siteIdString.split(',')
  if (siteIds)
    selectedThings.value = things.value.filter((t) => siteIds.includes(t.id))

  const OPNameString = (route.query.OPs as string) || ''
  const OPNames = OPNameString ? OPNameString.split(',') : []
  if (OPNames.length) selectedObservedPropertyNames.value = OPNames

  const PLNamesString = (route.query.PLs as string) || ''
  const PLNames = PLNamesString ? PLNamesString.split(',') : []
  if (PLNames.length) selectedProcessingLevelNames.value = PLNames

  const start = (route.query.dataZoomStart as string) || ''
  if (start) dataZoomStart.value = +start

  const end = (route.query.dataZoomEnd as string) || ''
  if (end) dataZoomEnd.value = +end
}

const loading = ref(true)

onMounted(async () => {
  const [
    thingsResponse,
    datastreamsResponse,
    processingLevelsResponse,
    observedPropertiesResponse,
  ] = await Promise.all([
    api.fetchThings(),
    api.fetchDatastreams(),
    api.fetchProcessingLevels(),
    api.fetchObservedProperties(),
  ])

  things.value = thingsResponse
  datastreams.value = datastreamsResponse
  processingLevels.value = processingLevelsResponse
  observedProperties.value = observedPropertiesResponse

  parseUrlAndSetState()
  loading.value = false
})

onUnmounted(() => {
  resetState()
})
</script>

<style scoped>
.resize-handle {
  cursor: ns-resize;
}
</style>

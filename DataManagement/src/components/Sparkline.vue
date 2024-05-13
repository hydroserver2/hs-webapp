<template>
  <v-progress-linear v-if="loading" color="secondary" indeterminate />
  <div v-else-if="!loading && obs72.length" @click="handleEmit">
    <v-chart
      :option="chartOption"
      autoresize
      style="height: 100px; width: 300px"
    />
  </div>
  <div v-else-if="!obs72.length">No data for this datastream</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { PropType } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { DataArray, Datastream } from '@shared/types'
import { preProcessData, subtractHours } from '@shared/utils/observationsUtils'
import { useObservationStore } from '@shared/store/observations'
import {
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
} from 'echarts/components'

use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
])

const { fetchObservationsInRange } = useObservationStore()

const props = defineProps({
  datastream: {
    type: Object as PropType<Datastream>,
    required: true,
  },
})

const emit = defineEmits(['openChart'])
const handleEmit = () => {
  emit('openChart')
}

const obs72 = ref<DataArray>([])
const loading = ref(true)

const chartOption = computed(() => {
  const observations = preProcessData(obs72.value, props.datastream)
  if (!observations.length) return {}

  let colors = isStale(props.datastream.phenomenonEndTime)
    ? { line: '#9E9E9E', fill: '#EEEEEE', border: '#BDBDBD' } // Grey, GL4, GL1
    : { line: '#4CAF50', fill: '#E8F5E9', border: '#BDBDBD' } // Green, GrL5, GL1

  return {
    color: [colors.line],
    grid: {
      bottom: 3,
      right: 1,
      top: 3,
      left: 1,
      borderColor: colors.border,
      borderWidth: 2,
      show: true,
    },
    xAxis: {
      type: 'time',
      show: false,
    },
    yAxis: {
      type: 'value',
      min: 'dataMin',
      max: 'dataMax',
      show: false,
    },
    series: [
      {
        type: 'line',
        data: observations.map((dp) => [dp.date.getTime(), dp.value]),
        showSymbol: false,
        areaStyle: {
          color: colors.fill,
          origin: 'start',
        },
      },
    ],
  }
})

function isStale(timestamp: string | null | undefined) {
  if (!timestamp) return true
  let endTime = new Date(timestamp)
  let seventyTwoHoursAgo = new Date(Date.now() - 72 * 60 * 60 * 1000)
  return endTime < seventyTwoHoursAgo
}

const fetchObsLast72Hours = async (ds: Datastream) => {
  const { phenomenonEndTime: endTime } = ds
  if (endTime) {
    const beginTime = subtractHours(endTime, 72)
    return fetchObservationsInRange(ds, beginTime, endTime).catch((error) => {
      console.error('Failed to fetch observations:', error)
      return null
    })
  }
}

onMounted(async () => {
  obs72.value = (await fetchObsLast72Hours(props.datastream)) || []
  loading.value = false
})
</script>

<template>
  <v-card class="elevation-0" :loading="updating">
    <template v-slot:loader="{ isActive }">
      <v-progress-linear color="primary" :active="isActive" indeterminate />
    </template>

    <div v-if="showSummaryStatistics">
      <SummaryStatisticsTable />
    </div>

    <keep-alive>
      <v-card-text v-if="option && !showSummaryStatistics && isDataAvailable">
        <v-chart
          ref="echartsRef"
          :option="option"
          @datazoom="handleDataZoom"
          autoresize
          :style="{ height: `${cardHeight}vh` }"
        />
      </v-card-text>
    </keep-alive>

    <div
      v-if="!isDataAvailable && !showSummaryStatistics"
      :style="{ 'min-height': `${cardHeight}vh` }"
    >
      <v-card-text>
        <v-timeline align="start" density="compact">
          <v-timeline-item size="x-small" dot-color="primary">
            <div>
              <strong> Filter: </strong>
            </div>
            <div>
              Filter the datastream table items with the filter drawer on the
              left and the search bar on the top of the datastreams table.
            </div>
          </v-timeline-item>
          <v-timeline-item size="x-small" dot-color="secondary">
            <div>
              <strong> Adjust the time range: </strong>
            </div>
            <div>
              Adjust the time range to cover the desired period you wish to
              observe.
            </div>
          </v-timeline-item>
          <v-timeline-item size="x-small" dot-color="blue-grey">
            <div>
              <strong> Select up to 5 datastreams: </strong>
            </div>
            <div>
              The plot allows up to 5 datastreams to be shown at once. If two
              datastreams share the same observed property and unit, they'll
              share a y-axis.
            </div>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>

      <v-card-text
        v-if="selectedDatastreams.length && !updating"
        class="text-center"
      >
        <v-alert type="warning" dense>
          No data available for the selected date range. Please select a
          different date range to re-plot.
        </v-alert>
      </v-card-text>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import SummaryStatisticsTable from './SummaryStatisticsTable.vue'
import { useDataVisStore } from '@/store/dataVisualization'
import { ref, watch, computed, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import VChart from 'vue-echarts'
import 'echarts'

const props = defineProps({
  cardHeight: { type: Number, required: true },
})

const {
  showSummaryStatistics,
  dataZoomStart,
  dataZoomEnd,
  graphSeriesArray,
  echartsOption: option,
  loadingStates,
  selectedDatastreams,
} = storeToRefs(useDataVisStore())

const echartsRef = ref<typeof VChart | null>(null)

const updating = computed(() =>
  Array.from(loadingStates.value.values()).some((isLoading) => isLoading)
)

const isDataAvailable = computed(() =>
  graphSeriesArray.value.some((series) => series.data && series.data.length > 0)
)

function handleDataZoom(event: any) {
  let start, end

  if (event.batch && event.batch.length) {
    // Handle scroll wheel events
    start = event.batch[0].start
    end = event.batch[0].end
  } else if (event.start !== undefined && event.end !== undefined) {
    // Handle zoom box drag events
    start = event.start
    end = event.end
  } else {
    console.error('Unexpected event structure for dataZoom:', event)
    return
  }
  dataZoomStart.value = start
  dataZoomEnd.value = end
}

watch([() => props.cardHeight], ([newHeight], [oldHeight]) => {
  if (Math.abs(newHeight - oldHeight) < 0.2) return
  nextTick(() => {
    if (echartsRef.value) echartsRef.value.resize()
  })
})
</script>

<style scoped>
.v-card-text {
  padding: 0;
}
</style>

<template>
  <v-navigation-drawer v-model="drawer" width="400">
    <v-card-title class="d-flex justify-space-between align-start">
      Filters
      <v-icon v-if="drawer" @click="drawer = !drawer">mdi-menu-open</v-icon>
    </v-card-title>

    <v-divider />

    <div class="d-flex justify-end my-4 mx-2">
      <v-btn color="blue-grey-lighten-4" elevation="3" @click="clearFilters"
        >Clear Filters</v-btn
      >
    </div>

    <v-expansion-panels multiple v-model="panels">
      <v-expansion-panel title="Sites">
        <v-expansion-panel-text>
          <v-text-field
            class="pb-1"
            clearable
            @click:clear="searchThing = ''"
            v-model="searchThing"
            prepend-inner-icon="mdi-magnify"
            label="Search"
            dense
            hide-details
          />

          <v-virtual-scroll
            :items="sortedThings"
            :height="sortedThings.length < 6 ? 'auto' : 250"
          >
            <template #default="{ item, index }">
              <v-checkbox
                :key="item.id"
                v-model="selectedThings"
                :label="item.name"
                :value="item"
                hide-details
                density="compact"
              />
            </template>
          </v-virtual-scroll>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Observed Properties">
        <v-expansion-panel-text>
          <v-text-field
            class="pb-1"
            clearable
            @click:clear="searchObservedProperty = ''"
            v-model="searchObservedProperty"
            prepend-inner-icon="mdi-magnify"
            label="Search"
            dense
            hide-details
          />

          <v-virtual-scroll
            :items="sortedObservedPropertyNames"
            :height="sortedObservedPropertyNames.length < 6 ? 'auto' : 250"
          >
            <template #default="{ item }">
              <v-checkbox
                v-model="selectedObservedPropertyNames"
                :label="item"
                :value="item"
                hide-details
                density="compact"
              />
            </template>
          </v-virtual-scroll>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="Processing Levels">
        <v-expansion-panel-text>
          <v-text-field
            class="pb-1"
            clearable
            @click:clear="searchProcessingLevel = ''"
            v-model="searchProcessingLevel"
            prepend-inner-icon="mdi-magnify"
            label="Search"
            dense
            hide-details
          />

          <v-virtual-scroll
            :items="sortedProcessingLevelNames"
            :height="sortedProcessingLevelNames.length < 6 ? 'auto' : 250"
          >
            <template #default="{ item }">
              <v-checkbox
                v-model="selectedProcessingLevelNames"
                :label="item"
                :value="item"
                hide-details
                density="compact"
              />
            </template>
          </v-virtual-scroll>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-navigation-drawer>

  <div class="mt-4 mx-4" v-if="!drawer">
    <v-icon @click="drawer = !drawer">mdi-menu</v-icon>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { useDataVisStore } from '@shared/store/dataVisualization'
import { storeToRefs } from 'pinia'

const {
  matchesSelectedObservedProperty,
  matchesSelectedProcessingLevel,
  matchesSelectedThing,
} = useDataVisStore()
const {
  things,
  datastreams,
  processingLevels,
  observedProperties,
  selectedThings,
  selectedObservedPropertyNames,
  selectedProcessingLevelNames,
} = storeToRefs(useDataVisStore())

const searchThing = ref('')
const searchObservedProperty = ref('')
const searchProcessingLevel = ref('')

// Only show list items that are referenced by at least one datastream
// Then mutually filter the lists by selected filters.
const sortedProcessingLevelNames = computed(() => {
  const filteredPLs = processingLevels.value.filter(
    (pl) =>
      pl.definition
        .toLowerCase()
        .includes(searchProcessingLevel.value.toLowerCase()) &&
      datastreams.value.some(
        (ds) =>
          ds.processingLevelId === pl.id &&
          matchesSelectedThing(ds) &&
          matchesSelectedObservedProperty(ds)
      )
  )
  const names = filteredPLs.map((pl) => pl.definition)
  return [...new Set(names)].sort()
})

const sortedThings = computed(() => {
  return things.value
    .filter(
      (thing) =>
        thing.name.toLowerCase().includes(searchThing.value.toLowerCase()) &&
        datastreams.value.some(
          (ds) =>
            ds.thingId === thing.id &&
            matchesSelectedObservedProperty(ds) &&
            matchesSelectedProcessingLevel(ds)
        )
    )
    .sort((a, b) => a.name.localeCompare(b.name))
})

const sortedObservedPropertyNames = computed(() => {
  const filteredProperties = observedProperties.value.filter(
    (op) =>
      op.name
        .toLowerCase()
        .includes(searchObservedProperty.value.toLowerCase()) &&
      datastreams.value.some(
        (ds) =>
          ds.observedPropertyId === op.id &&
          matchesSelectedThing(ds) &&
          matchesSelectedProcessingLevel(ds)
      )
  )

  const names = filteredProperties.map((pl) => pl.name)
  return [...new Set(names)].sort()
})

// Watchers to handle deselection of hidden items
watch(sortedThings, (newVal, oldVal) => {
  if (newVal.length < oldVal.length) {
    selectedThings.value = selectedThings.value.filter((selectedThing) =>
      newVal.some((thing) => thing.id === selectedThing.id)
    )
  }
})

watch(sortedObservedPropertyNames, (newVal, oldVal) => {
  if (newVal.length < oldVal.length) {
    selectedObservedPropertyNames.value =
      selectedObservedPropertyNames.value.filter((name) =>
        newVal.includes(name)
      )
  }
})

watch(sortedProcessingLevelNames, (newVal, oldVal) => {
  if (newVal.length < oldVal.length) {
    selectedProcessingLevelNames.value =
      selectedProcessingLevelNames.value.filter((name) => newVal.includes(name))
  }
})

const clearFilters = () => {
  selectedThings.value = []
  selectedObservedPropertyNames.value = []
  selectedProcessingLevelNames.value = []

  searchThing.value = ''
  searchObservedProperty.value = ''
  searchProcessingLevel.value = ''
}

const { smAndDown } = useDisplay()
const panels = ref([0, 1, 2])
const drawer = ref(!!smAndDown)
</script>

<style scoped>
:deep(.v-selection-control),
:deep(.v-label) {
  align-items: start;
}
</style>

<template>
  <v-col cols="auto" class="d-flex flex-column justify-space-between">
    <v-row>
      <v-col v-for="item in items" cols="auto" class="px-1">
        <SquareBtn
          color="blue-grey-lighten-1"
          :icon="item.icon"
          :label="item.name"
          btn-width="4rem"
          variant="outlined"
        />
      </v-col>

      <v-col cols="auto" class="px-1">
        <SquareBtn
          color="blue-grey-lighten-1"
          icon="mdi-filter"
          label="Open Filters Drawer"
          btn-width="4rem"
          :variant="filterDrawer ? 'tonal' : 'outlined'"
          @click="updateFilterDrawer"
        />
      </v-col>

      <!-- v-model="selectedQualifyingComments" -->
      <!-- :items="selectableQualifyingComments"  -->
      <v-col cols="auto">
        <v-select
          label="Qualifying Comments"
          item-text="title"
          item-value="key"
          multiple
          item-color="green"
          density="compact"
          variant="solo"
          hide-details
          min-width="14rem"
        >
          <template v-slot:selection="{ item, index }">
            <!-- Leave blank so nothing appears in the v-select box -->
          </template>
        </v-select>
      </v-col>
    </v-row>

    <v-row class="d-flex justify-center align-end pt-0">
      <p>View</p>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
import SquareBtn from '@/components/SquareBtn.vue'
import { useDataVisStore } from '@shared/store/dataVisualization'
import { storeToRefs } from 'pinia'

const { filterDrawer, prevFilterDrawer } = storeToRefs(useDataVisStore())

const updateFilterDrawer = () => {
  filterDrawer.value = !filterDrawer.value
  prevFilterDrawer.value = filterDrawer.value
}

const items = [
  { name: 'Show Legend', icon: 'mdi-map' },
  {
    name: 'Save Tooltip',
    icon: 'mdi-comment',
  },
]
</script>

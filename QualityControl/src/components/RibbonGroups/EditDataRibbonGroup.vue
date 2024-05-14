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

      <v-col cols="auto" class="pr-0">
        <SquareBtn
          color="delete"
          icon="mdi-trash-can-outline"
          label="Delete Points"
          btn-width="4rem"
        />
      </v-col>
      <v-col class="px-1">
        <SquareBtn
          color="green"
          icon="mdi-plus"
          label="Add Point"
          btn-width="4rem"
        />
      </v-col>
    </v-row>

    <v-row class="d-flex justify-center align-end pt-0">
      <p>Edit Data</p>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
import SquareBtn from '@/components/SquareBtn.vue'

const items = [
  { name: 'Qualifying Comments', icon: 'mdi-flag' },
  {
    name: 'Linear Drift Correction',
    icon: 'mdi-chart-sankey',
  },
  {
    name: 'Interpolate',
    icon: 'mdi-chart-bell-curve-cumulative',
  },
  {
    name: 'Change Values',
    icon: 'mdi-pencil',
  },
]
</script>

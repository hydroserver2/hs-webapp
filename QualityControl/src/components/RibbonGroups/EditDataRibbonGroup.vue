<template>
  <v-col cols="auto">
    <v-row>
      <v-col cols="auto">
        <v-btn
          v-for="item in items"
          class="mr-1"
          size="small"
          :prepend-icon="item.icon"
          variant="outlined"
        >
          {{ item.name }}
        </v-btn>
        <!-- <SquareBtn :icon="'mdi-code-json'" :label="'Qualifying Comments'" /> -->
      </v-col>

      <v-col cols="auto">
        <v-btn
          class="mr-1"
          color="delete"
          size="small"
          prepend-icon="mdi-trash-can-outline"
          variant="flat"
        >
          Delete Points
        </v-btn>
        <v-btn
          color="green"
          size="small"
          prepend-icon="mdi-plus"
          variant="flat"
        >
          Add Point
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="d-flex justify-center pt-0">
        <p>Edit Data</p>
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
// import SquareBtn from '@/components/SquareBtn.vue'

const items = [
  { name: 'Qualifying Comments', icon: 'mdi-code-json' },
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

<template>
  <v-col cols="auto" class="d-flex flex-column justify-space-between">
    <v-row>
      <v-col v-for="item in items" cols="auto" class="px-1">
        <SquareBtn
          color="blue-grey-lighten-1"
          :icon="item.icon"
          :label="item.name"
          btn-width="4rem"
        />
      </v-col>
    </v-row>

    <v-row class="d-flex justify-center align-end pt-0">
      <p>Filter Points</p>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
import SquareBtn from '@/components/SquareBtn.vue'

const items = [
  { name: 'Value Thresholds', icon: 'mdi-chart-bell-curve-cumulative' },
  {
    name: 'Rate of Change',
    icon: 'mdi-chart-timeline-variant',
  },
  {
    name: 'Fill Gaps',
    icon: 'mdi-keyboard-space',
  },
  {
    name: 'Persistence',
    icon: 'mdi-dots-horizontal',
  },
]
</script>

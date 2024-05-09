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
      </v-col>
    </v-row>

    <v-row>
      <v-col class="d-flex justify-center pt-0">
        <p>Filter Points</p>
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
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

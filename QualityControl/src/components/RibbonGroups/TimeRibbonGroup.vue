<template>
  <v-col cols="auto" class="d-flex flex-column justify-space-between">
    <v-row>
      <v-col cols="auto">
        <DataVisTimeFilters />
      </v-col>
    </v-row>

    <v-row class="d-flex justify-center align-end pt-0">
      <p>Time Filters</p>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
import DataVisTimeFilters from '@shared/components/VisualizeData/DataVisTimeFilters.vue'
</script>

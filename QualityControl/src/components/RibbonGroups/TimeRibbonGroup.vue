a
<template>
  <v-col cols="auto">
    <v-row>
      <v-col cols="auto">
        <DataVisTimeFilters />
      </v-col>
    </v-row>

    <v-row>
      <v-col class="d-flex justify-center pt-0">
        <p>Time Filters</p>
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
import DataVisTimeFilters from '@shared/components/VisualizeData/DataVisTimeFilters.vue'
</script>

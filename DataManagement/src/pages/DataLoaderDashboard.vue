<template>
  <v-container>
    <h5 class="text-h5 mb-4">Manage Data Loaders</h5>

    <v-toolbar flat color="indigo">
      <v-text-field
        class="mx-2"
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="Search"
        hide-details
      />

      <v-spacer />

      <v-btn-add
        prepend-icon="mdi-download"
        color="white"
        :to="{ name: 'HydroLoader' }"
      >
        Download Streaming Data Loader
      </v-btn-add>
    </v-toolbar>

    <DataLoaderTable :search="search" />
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DataLoaderTable from '@/components/DataLoader/DataLoaderTable.vue'

const search = ref()
</script>

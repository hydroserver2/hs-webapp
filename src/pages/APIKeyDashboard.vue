<template>
  <v-container>
    <h5 class="text-h5 mb-4">Manage API Keys</h5>

    <v-toolbar flat color="teal">
      <v-text-field
        class="mx-2"
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="Search"
        hide-details
      />

      <v-spacer />

      <v-btn-add
        prepend-icon="mdi-plus"
        color="white"
      >
        New API Key
      </v-btn-add>
    </v-toolbar>

    <APIKeyTable :search="search" />
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import APIKeyTable from '@/components/ApiKey/ApiKeyTable.vue'

const search = ref()
</script>

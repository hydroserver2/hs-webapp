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
        <p>History</p>
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
const items = [
  { name: 'Export JSON File', icon: 'mdi-code-json' },
  {
    name: 'Show History',
    icon: 'mdi-history',
  },
]
</script>

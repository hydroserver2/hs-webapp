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
    </v-row>

    <v-row class="d-flex justify-center align-end pt-0">
      <p>History</p>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
import SquareBtn from '@/components/SquareBtn.vue'

const items = [
  { name: 'Export JSON File', icon: 'mdi-code-json' },
  {
    name: 'Show History',
    icon: 'mdi-history',
  },
]
</script>

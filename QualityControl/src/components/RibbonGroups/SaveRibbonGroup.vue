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

      <v-col cols="auto">
        <SquareBtn
          color="primary"
          icon="mdi-content-save"
          label="Save"
          btn-width="4rem"
          variant="flat"
        />
      </v-col>
    </v-row>

    <v-row class="d-flex justify-center align-end pt-0">
      <p>Save to Database</p>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
import SquareBtn from '@/components/SquareBtn.vue'

const items = [
  { name: 'Save For Review', icon: 'mdi-account-multiple' },
  {
    name: 'Save as New',
    icon: 'mdi-content-save-all-outline',
  },
  {
    name: 'Overwrite Existing',
    icon: 'mdi-content-save-edit',
  },
]
</script>

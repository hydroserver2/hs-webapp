<template>
  <v-col cols="auto">
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

      <!-- v-model="selectedQualifyingComments" -->
      <!-- :items="selectableQualifyingComments"  -->
      <v-col cols="auto">
        <v-select
          label="Show Qualifying Comments"
          item-text="title"
          item-value="key"
          multiple
          item-color="green"
          density="compact"
          variant="solo"
          hide-details
          min-width="20rem"
        >
          <template v-slot:selection="{ item, index }">
            <!-- Leave blank so nothing appears in the v-select box -->
          </template>
        </v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="d-flex justify-center pt-0">
        <p>View</p>
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
import SquareBtn from '@/components/SquareBtn.vue'

const items = [
  { name: 'Show Legend', icon: 'mdi-map' },
  {
    name: 'Save Tooltip',
    icon: 'mdi-comment',
  },
]
</script>

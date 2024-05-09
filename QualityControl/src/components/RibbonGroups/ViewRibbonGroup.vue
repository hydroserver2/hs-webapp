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

      <!-- v-model="selectedQualifyingComments" -->
      <!-- :items="selectableQualifyingComments"  -->
      <v-col cols="12">
        <v-select
          label="Show Qualifying Comments"
          item-text="title"
          item-value="key"
          multiple
          item-color="green"
          density="compact"
          variant="solo"
          hide-details
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
const items = [
  { name: 'Show Legend', icon: 'mdi-map' },
  {
    name: 'Save Tooltip',
    icon: 'mdi-comment',
  },
]
</script>

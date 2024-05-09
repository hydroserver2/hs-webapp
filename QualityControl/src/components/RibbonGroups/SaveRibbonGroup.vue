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
          Save For Review
        </v-btn>
      </v-col>

      <v-col cols="auto">
        <v-btn size="small" prepend-icon="mdi-content-save" variant="flat">
          Save
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="d-flex justify-center pt-0">
        <p>Save to Database</p>
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup lang="ts">
const items = [
  { name: 'Save For Review', icon: 'mdi-account-multiple' },
  {
    name: 'Save as New Datastream',
    icon: 'mdi-content-save-all-outline',
  },
  {
    name: 'Overwrite as Existing Datastream',
    icon: 'mdi-content-save-edit',
  },
]
</script>

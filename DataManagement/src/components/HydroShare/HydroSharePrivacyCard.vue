<template>
  <v-card>
    <v-card-title class="text-h5">Update HydroShare Privacy</v-card-title>

    <v-divider />

    <v-card-text>
      This site is linked to a HydroShare resource. Do you also want to update
      the privacy of the HydroServer resource?
    </v-card-text>

    <v-divider />

    <v-card-actions>
      <v-spacer />
      <v-btn-cancel @click="emit('close')">Cancel</v-btn-cancel>
      <v-btn-delete @click="emit('no')">No</v-btn-delete>
      <v-btn-primary @click="emit('yes')">Yes</v-btn-primary>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
const emit = defineEmits(['close', 'yes', 'no'])
</script>

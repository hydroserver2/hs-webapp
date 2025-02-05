<template>
  <v-btn
    v-if="!isConnected && isLoaded"
    color="deep-orange-lighten-1"
    prepend-icon="mdi-link"
    @click="connectHydroShare"
  >
    Connect to HydroShare
  </v-btn>

  <v-btn
    v-else-if="isLoaded"
    color="deep-orange"
    variant="outlined"
    prepend-icon="mdi-close"
    @click="disconnectHydroShare"
  >
    Disconnect from HydroShare
  </v-btn>
</template>

<script setup lang="ts">
import { useHydroShare } from '@/composables/useHydroShare'

const { isConnected, isLoaded, connectHydroShare, disconnectHydroShare } =
  useHydroShare()
</script>

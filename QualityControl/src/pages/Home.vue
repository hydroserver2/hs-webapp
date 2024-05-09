<template>
  <v-container>
    <v-card>
      <v-card-title> Welcome to the QC App! </v-card-title>
      <v-card-text>
        You are {{ isLoggedIn ? '' : 'not' }} logged in</v-card-text
      >
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from '@shared/store/authentication'
import { storeToRefs } from 'pinia'

const { isLoggedIn } = storeToRefs(useAuthStore())
</script>

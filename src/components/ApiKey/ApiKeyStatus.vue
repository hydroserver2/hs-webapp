<template>
  <v-container class="pa-0">
    <v-chip v-if="props.status === 'active'" color="green"> Active </v-chip>
    <v-chip v-if="props.status === 'disabled'" color="orange"> Disabled </v-chip>
    <v-chip v-if="props.status === 'expired'" color="red"> Expired </v-chip>
  </v-container>
</template>

<script setup lang="ts">
const props = defineProps(['status'])
</script>

<style scoped></style>

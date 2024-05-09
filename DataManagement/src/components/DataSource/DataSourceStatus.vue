<template>
  <v-container class="pa-0">
    <v-chip v-if="props.paused === true"> Loading Paused </v-chip>
    <template v-else>
      <v-chip v-if="props.status === 'ok'" color="green"> Up-To-Date </v-chip>
      <v-chip v-if="props.status === 'pending'" color="blue"> Pending </v-chip>
      <v-chip v-if="props.status === 'bad'" color="red">
        Needs Attention
      </v-chip>
      <v-chip v-if="props.status === 'stale'" color="orange">
        Behind Schedule
      </v-chip>
      <v-chip v-if="props.status === 'unknown'" color="gray"> Unknown </v-chip>
    </template>
  </v-container>
</template>

<script setup lang="ts">
const props = defineProps(['status', 'paused'])
</script>

<style scoped></style>

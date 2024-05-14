<template>
  <v-tooltip bottom :openDelay="500">
    <template v-slot:activator="{ props }">
      <v-btn
        elevation="1"
        rounded="lg"
        v-bind="{ ...$attrs, ...props }"
        @click.stop
      />
    </template>
    {{ label }}
  </v-tooltip>
</template>

<script setup lang="ts">
defineProps({
  label: String,
})
</script>

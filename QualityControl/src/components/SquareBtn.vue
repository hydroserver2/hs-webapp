<template>
  <div class="button-container" :style="{ width: btnWidth }">
    <v-btn
      :color="color"
      class="mb-2"
      elevation="1"
      rounded="lg"
      v-bind="$attrs"
    />
    <span class="text-caption label-text">{{ label }}</span>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  label: String,
  btnWidth: {
    type: String,
    default: '200px',
  },
})
</script>

<style scoped>
.button-container {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
}

.label-text {
  text-align: center;
}
</style>

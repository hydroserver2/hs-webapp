<template>
  <v-toolbar color="blue-darken-2">
    <v-autocomplete
      class="mx-2"
      density="compact"
      v-model="formKey"
      :items="keyList"
      label="Key"
      clearable
      @click:clear="clear"
      hide-details
      rounded="xl"
    />

    <v-autocomplete
      class="mr-2"
      density="compact"
      v-model="selectedTagValues"
      :items="valueList"
      label="Value"
      multiple
      clearable
      :disabled="!formKey"
      hide-details
      rounded="xl"
    />

    <v-checkbox
      v-model="currentColor"
      @change="updateColors"
      color="primary"
      label="Show legend"
      :disabled="!formKey"
      hide-details
    />

    <v-btn
      class="mx-2"
      color="white-darken-2"
      @click="clear"
      rounded="xl"
      variant="outlined"
      append-icon="mdi-close"
      >Clear filters</v-btn
    >
  </v-toolbar>
</template>

<script setup lang="ts">
import { useUserTags } from '@/composables/useUserTags'
import { ref, watch } from 'vue'

const { formKey, keyList, valueList } = useUserTags()
const selectedTagValues = ref<string[]>([])

const emit = defineEmits(['filter', 'update:useColors'])
const props = defineProps({
  useColors: Boolean,
})
const currentColor = ref(props.useColors)

const updateColors = () => {
  emit('update:useColors', currentColor.value)
  emitFilteredTags()
}

const emitFilteredTags = () => {
  emit('filter', { key: formKey.value, values: selectedTagValues.value })
}

const clear = () => {
  formKey.value = ''
  selectedTagValues.value = []
}

watch(formKey, () => {
  selectedTagValues.value = []
  emitFilteredTags()
})

watch(selectedTagValues, () => {
  emitFilteredTags()
})
</script>

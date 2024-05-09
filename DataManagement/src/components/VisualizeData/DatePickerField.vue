<template>
  <v-text-field
    :placeholder="placeholder"
    :value="formattedDate"
    readonly
    @click="showDatePicker = true"
    append-inner-icon="mdi-calendar"
    hide-details
    density="compact"
  />

  <v-dialog v-model="showDatePicker" max-width="22rem">
    <v-card>
      <v-card-title class="d-flex pt-4">
        Select {{ placeholder }}
        <v-spacer />
        <v-icon color="grey-darken-1" @click="showDatePicker = false"
          >mdi-close</v-icon
        >
      </v-card-title>
      <v-divider />
      <v-date-picker
        hide-header
        v-model="localDate"
        @update:modelValue="dateSelected"
      />
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Date, required: true },
  placeholder: String,
})
const emit = defineEmits(['update:modelValue'])

const showDatePicker = ref(false)
const localDate = ref<Date>(props.modelValue)

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== localDate.value) {
      localDate.value = newValue
    }
  }
)

const dateSelected = (newDate: Date) => {
  localDate.value = newDate
  emit('update:modelValue', newDate)
  showDatePicker.value = false
}

const formattedDate = computed(() => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Date(localDate.value).toLocaleDateString(undefined, options)
})
</script>

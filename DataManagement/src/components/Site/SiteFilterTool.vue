<template>
  <v-card class="mb-6" elevation="2">
    <v-card-text>
      <v-row>
        <v-col cols="12" md="4" class="align-self-center">
          <v-autocomplete
            density="compact"
            v-model="formKey"
            :items="keyList"
            label="Key"
            clearable
            @click:clear="clear"
            hide-details
          />
        </v-col>
        <v-col cols="12" md="4" class="align-self-center">
          <v-autocomplete
            density="compact"
            v-model="selectedTagValues"
            :items="valueList"
            label="Value"
            multiple
            clearable
            :disabled="!formKey"
            hide-details
          />
        </v-col>
        <v-col cols="12" md="auto" class="align-self-center">
          <v-checkbox
            v-model="currentColor"
            @change="updateColors"
            color="primary"
            label="Show Legend"
            :disabled="!formKey"
            hide-details
          />
        </v-col>
        <v-col cols="auto" class="align-self-center">
          <v-btn-cancel @click="clear">Clear Filters</v-btn-cancel>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
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

watch([formKey, selectedTagValues], emitFilteredTags)
</script>

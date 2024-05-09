<template>
  <v-card>
    <v-card-title> {{ isEdit ? 'Edit' : 'Add' }} Sensor </v-card-title>
    <v-divider />

    <v-form
      @submit.prevent="onSubmit"
      ref="myForm"
      v-model="valid"
      validate-on="blur"
    >
      <v-card-text>
        <v-select
          v-model="item.methodType"
          :items="methodTypes"
          label="Method Type *"
          hide-details
          density="comfortable"
          :rules="rules.required"
          class="mb-4"
        />

        <v-text-field
          v-model="item.methodLink"
          label="Method Link"
          :rules="item.methodLink ? rules.urlFormat : []"
        />

        <v-text-field
          v-model="item.methodCode"
          label="Method Code"
          :rules="rules.name"
        />

        <v-textarea
          v-model="item.description"
          label="Description *"
          rows="1"
          :rules="rules.requiredDescription"
        />

        <v-text-field
          v-if="!isInstrument"
          v-model="item.name"
          label="Name *"
          :rules="rules.requiredName"
        />

        <v-text-field
          v-if="isInstrument"
          v-model="item.manufacturer"
          label="Manufacturer *"
          :rules="rules.requiredName"
        />

        <v-text-field
          v-if="isInstrument"
          v-model="item.model"
          label="Model *"
          :rules="rules.requiredName"
        />

        <v-text-field
          v-if="isInstrument"
          v-model="item.modelLink"
          label="Model Link"
          :rules="item.modelLink ? rules.urlFormat : []"
        />

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn-cancel @click="$emit('close')">Cancel</v-btn-cancel>
          <v-btn-primary type="submit">{{
            isEdit ? 'Update' : 'Save'
          }}</v-btn-primary>
        </v-card-actions>
      </v-card-text>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { api } from '@shared/services/api'
import { VForm } from 'vuetify/components'
import { useFormLogic } from '@/composables/useFormLogic'
import { rules } from '@shared/utils/rules'
import { computed } from 'vue'
import { methodTypes } from '@/vocabularies'
import { Sensor } from '@shared/types'

const props = defineProps({ sensor: Object as () => Sensor })
const emit = defineEmits(['created', 'updated', 'close'])

const { item, isEdit, valid, myForm, uploadItem } = useFormLogic(
  api.fetchSensors,
  api.createSensor,
  api.updateSensor,
  Sensor,
  props.sensor || undefined,
  false
)

const isInstrument = computed(
  () => item.value.methodType === 'Instrument Deployment'
)

async function onSubmit() {
  const { methodType, manufacturer, model } = item.value
  if (methodType === 'Instrument Deployment' && manufacturer && model) {
    item.value.name = `${manufacturer}: ${model}`
  }
  try {
    const newItem = await uploadItem()
    if (!newItem) return
    if (isEdit.value) emit('updated', newItem)
    else emit('created', newItem.id)
  } catch (error) {
    console.error('Error uploading processing level', error)
  }
  emit('close')
}
</script>

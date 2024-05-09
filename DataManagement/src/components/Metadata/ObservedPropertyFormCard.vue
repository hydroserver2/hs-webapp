<template>
  <v-card>
    <v-card-title>
      {{ isEdit ? 'Edit' : 'Add' }} Observed Property
    </v-card-title>
    <v-divider />

    <v-form
      @submit.prevent="onSubmit"
      ref="myForm"
      v-model="valid"
      validate-on="blur"
    >
      <v-card-text>
        <v-combobox
          v-model="item.name"
          :items="OPNames"
          hide-details
          label="Name *"
          :rules="rules.requiredName"
          @update:modelValue="handleNameUpdated"
          class="pb-4"
        />

        <v-textarea
          v-model="item.definition"
          label="Definition *"
          :rules="rules.requiredDescription"
        ></v-textarea>

        <v-textarea
          v-model="item.description"
          label="Description *"
          :rules="rules.requiredDescription"
        ></v-textarea>

        <v-combobox
          :items="OPVariableTypes"
          v-model="item.type"
          label="Variable Type *"
          :rules="rules.required"
        />

        <v-text-field
          v-model="item.code"
          label="Variable Code *"
          :rules="rules.requiredName"
        />
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn-cancel @click="$emit('close')">Cancel</v-btn-cancel>
        <v-btn-primary type="submit">{{
          isEdit ? 'Update' : 'Save'
        }}</v-btn-primary>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { api } from '@shared/services/api'
import { VForm } from 'vuetify/components'
import { useFormLogic } from '@/composables/useFormLogic'
import { rules } from '@shared/utils/rules'
import { OPVariableTypes, OPNameTypes } from '@/vocabularies'
import { ObservedProperty } from '@shared/types'

const OPNames = Object.keys(OPNameTypes)

const props = defineProps({
  observedProperty: Object as () => ObservedProperty,
})
const emit = defineEmits(['created', 'updated', 'close'])

const { item, isEdit, valid, myForm, uploadItem } = useFormLogic(
  api.fetchUnownedObservedProperties,
  api.createObservedProperty,
  api.updateObservedProperty,
  ObservedProperty,
  props.observedProperty || undefined,
  false
)

const handleNameUpdated = () => {
  const name = item.value.name
  if (name && OPNames.includes(name)) {
    item.value.definition = OPNameTypes[name].definition
    item.value.description = OPNameTypes[name].description
  }
}

async function onSubmit() {
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

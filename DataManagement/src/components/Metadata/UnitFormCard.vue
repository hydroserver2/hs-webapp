<template>
  <v-card>
    <v-card-title> {{ isEdit ? 'Edit' : 'Add' }} Unit </v-card-title>
    <v-divider />

    <v-form
      @submit.prevent="onSubmit"
      ref="myForm"
      v-model="valid"
      validate-on="blur"
    >
      <v-card-text v-if="item">
        <v-autocomplete
          v-if="!isEdit"
          v-model="selectedId"
          label="Load a template unit"
          :items="sortedItems"
          item-title="name"
          item-value="id"
        />

        <v-text-field
          v-model="item.name"
          label="Name *"
          :rules="rules.requiredName"
        />
        <v-text-field
          v-model="item.symbol"
          label="Symbol *"
          :rules="rules.required"
        />
        <v-text-field
          v-model="item.definition"
          label="Definition *"
          :rules="rules.requiredDescription"
        />
        <v-text-field
          v-model="item.type"
          label="Unit Type *"
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
import { rules } from '@shared/utils/rules'
import { api } from '@shared/services/api'
import { VForm } from 'vuetify/components'
import { useFormLogic } from '@/composables/useFormLogic'

import { Unit } from '@shared/types'
import { computed } from 'vue'

const props = defineProps({ unit: Object as () => Unit })
const emit = defineEmits(['created', 'updated', 'close'])

const { item, items, selectedId, isEdit, valid, myForm, uploadItem } =
  useFormLogic(
    api.fetchUnownedUnits,
    api.createUnit,
    api.updateUnit,
    Unit,
    props.unit || undefined
  )

async function onSubmit() {
  try {
    const newItem = await uploadItem()
    if (!newItem) return
    if (isEdit.value) emit('updated', newItem)
    else emit('created', newItem.id)
  } catch (error) {
    console.error('Error uploading unit', error)
  }
  emit('close')
}

const sortedItems = computed(() => {
  const unownedUnits = items.value.filter((u) => !u.owner)
  return unownedUnits.sort((a, b) => a.name.localeCompare(b.name))
})
</script>

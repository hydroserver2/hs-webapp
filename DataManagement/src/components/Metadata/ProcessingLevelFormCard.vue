<template>
  <v-card>
    <v-card-title>
      {{ isEdit ? 'Edit' : 'Add' }} Processing Level
    </v-card-title>

    <v-form
      @submit.prevent="onSubmit"
      ref="myForm"
      v-model="valid"
      validate-on="blur"
    >
      <v-card-text>
        <v-autocomplete
          v-if="!isEdit"
          v-model="selectedId"
          label="Load a template processing level"
          :items="sortedItems"
          item-value="id"
          item-title="title"
        />

        <v-text-field
          v-model="item.code"
          label="Code *"
          :rules="rules.requiredCode"
        />

        <v-textarea
          v-model="item.definition"
          label="Definition"
          :rules="rules.maxLength(2000)"
        />

        <v-textarea
          v-model="item.explanation"
          label="Explanation"
          :rules="rules.maxLength(2000)"
        />

        <v-card-actions>
          <v-spacer></v-spacer>
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
import { rules } from '@shared/utils/rules'
import { api } from '@shared/services/api'
import { VForm } from 'vuetify/components'
import { useFormLogic } from '@/composables/useFormLogic'

import { ProcessingLevel } from '@shared/types'
import { computed } from 'vue'

const props = defineProps({ processingLevel: Object as () => ProcessingLevel })
const emit = defineEmits(['created', 'updated', 'close'])

const { item, items, selectedId, isEdit, valid, myForm, uploadItem } =
  useFormLogic(
    api.fetchUnownedProcessingLevels,
    api.createProcessingLevel,
    api.updateProcessingLevel,
    ProcessingLevel,
    props.processingLevel || undefined
  )

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

const sortedItems = computed(() => {
  const unownedItems = items.value.filter((u) => !u.owner)
  return unownedItems.map((pl) => ({
    id: pl.id,
    title: `${pl.code} : ${pl.definition}`,
  }))
})
</script>

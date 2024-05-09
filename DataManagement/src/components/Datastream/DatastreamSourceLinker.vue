<template>
  <v-card flat>
    <v-card-title class="text-h5">
      {{ isEdit ? 'Edit' : 'Create' }} Data Source Link
    </v-card-title>
    <v-divider class="py-2" />

    <v-form
      @submit.prevent="onSubmit"
      ref="myForm"
      v-model="valid"
      validate-on="blur"
    >
      <v-card-text>
        <v-autocomplete
          v-model="item.dataSourceId"
          label="Data source *"
          hint="Select the data source for this datastream."
          :items="dataSources"
          item-title="name"
          item-value="id"
          :rules="rules.required"
        />

        <v-text-field
          class="pt-2"
          v-model="item.dataSourceColumn"
          :label="`Datastream column ${columnRadio}*`"
          hint="Enter the column name/index containing values for this datastream."
          :type="columnRadio === 'index' ? 'number' : 'text'"
          :rules="rules.required"
        />

        <v-radio-group v-model="columnRadio" inline hide-details>
          <v-radio label="Index" value="index" />
          <v-radio label="Name" value="name" />
        </v-radio-group>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn-delete v-if="isEdit" @click="onDelete">
          Delete Link
        </v-btn-delete>
        <v-btn-cancel @click="emit('close')"> Cancel </v-btn-cancel>
        <v-btn-primary @click="onSubmit"> Save </v-btn-primary>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '@shared/services/api'
import { rules } from '@shared/utils/rules'
import { DataSource, Datastream } from '@shared/types'
import { useFormLogic } from '@/composables/useFormLogic'
import { Snackbar } from '@shared/utils/notifications'

const props = defineProps({
  datastream: {
    type: Object as () => Datastream,
    required: true,
  },
})

const emit = defineEmits(['close', 'updated'])

const columnRadio = ref(
  typeof props.datastream?.dataSourceColumn === 'string' ? 'name' : 'index'
)

const hasLink =
  props.datastream?.dataSourceColumn && props.datastream.dataSourceId
    ? true
    : false

const { item, isEdit, valid, myForm } = useFormLogic(
  api.fetchDatastreams,
  api.createDatastream,
  api.updateDatastream,
  Datastream,
  hasLink ? props.datastream : undefined,
  false
)

const dataSources = ref<DataSource[]>([])

async function updateLink(patchBody: {}) {
  emit('close')
  try {
    await api.updateDatastream(patchBody as Datastream)
    Snackbar.success('Updated DataSource link')
    emit('updated', patchBody)
  } catch (e) {
    console.error('Error updating DataSource Link', e)
  }
}

async function onSubmit() {
  await myForm.value?.validate()
  if (!valid.value) return
  updateLink({
    id: props.datastream.id,
    dataSourceId: item.value.dataSourceId,
    dataSourceColumn: item.value.dataSourceColumn,
  })
}

async function onDelete() {
  updateLink({
    id: props.datastream.id,
    dataSourceId: null,
    dataSourceColumn: null,
  })
}

onMounted(async () => {
  dataSources.value = await api.fetchDataSources()
})
</script>

<style scoped></style>

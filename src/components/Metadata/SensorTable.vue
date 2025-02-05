<template>
  <v-data-table-virtual
    :headers="headers"
    :items="sortedItems"
    :search="search"
    :style="{ 'max-height': `200vh` }"
    fixed-header
  >
    <template v-slot:item.actions="{ item }">
      <v-icon @click="openDialog(item, 'edit')"> mdi-pencil </v-icon>
      <v-icon @click="openDialog(item, 'delete')"> mdi-delete </v-icon>
    </template>
  </v-data-table-virtual>

  <v-dialog v-model="openEdit" width="60rem">
    <SensorFormCard
      :sensor="item"
      @close="openEdit = false"
      @updated="onUpdate"
    />
  </v-dialog>

  <v-dialog v-model="openDelete" width="40rem">
    <DeleteMetadataCard
      itemName="sensor"
      :itemID="item.id"
      parameter-name="sensorId"
      @delete="onDelete"
      @close="openDelete = false"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import SensorFormCard from '@/components/Metadata/SensorFormCard.vue'
import DeleteMetadataCard from '@/components/Metadata/DeleteMetadataCard.vue'
import { api } from '@/services/api'
import { Sensor } from '@/types'
import { useTableLogic } from '@/composables/useTableLogic'
import { computed } from 'vue'

const { item, items, openEdit, openDelete, openDialog, onUpdate, onDelete } =
  useTableLogic(api.fetchCurrentUserSensors, api.deleteSensor, Sensor)

const props = defineProps<{ search: string | undefined }>()

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Method Type', key: 'methodType' },
  { title: 'Method Code', key: 'methodCode' },
  { title: 'UUID', key: 'id' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
] as const

const sortedItems = computed(() =>
  items.value.sort((a, b) => a.name.localeCompare(b.name))
)
</script>

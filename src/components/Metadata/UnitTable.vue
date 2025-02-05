<template>
  <v-data-table-virtual
    :headers="UnitHeaders"
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
    <UnitFormCard :unit="item" @close="openEdit = false" @updated="onUpdate" />
  </v-dialog>

  <v-dialog v-model="openDelete" width="40rem">
    <DeleteMetadataCard
      itemName="unit"
      :itemID="item.id"
      parameter-name="unitId"
      @delete="onDelete"
      @close="openDelete = false"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import UnitFormCard from '@/components/Metadata/UnitFormCard.vue'
import DeleteMetadataCard from '@/components/Metadata/DeleteMetadataCard.vue'
import { api } from '@/services/api'
import { Unit } from '@/types'
import { useTableLogic } from '@/composables/useTableLogic'
import { computed } from 'vue'

const { item, items, openEdit, openDelete, openDialog, onUpdate, onDelete } =
  useTableLogic(api.fetchCurrentUserUnits, api.deleteUnit, Unit)

const UnitHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'Type', key: 'type' },
  { title: 'Symbol', key: 'symbol' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
] as const

const props = defineProps<{ search: string | undefined }>()

const sortedItems = computed(() =>
  items.value.sort((a, b) => a.name.localeCompare(b.name))
)
</script>

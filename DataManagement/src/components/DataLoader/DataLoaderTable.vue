<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :search="search"
    hover
    class="elevation-3"
  >
    <template v-slot:item.actions="{ item }">
      <v-icon @click="openDialog(item, 'delete')"> mdi-delete </v-icon>
    </template>
  </v-data-table>

  <v-dialog v-model="openDelete" max-width="500">
    <DeleteDataLoaderCard
      :item-name="item.name"
      @delete="onDelete"
      @close="openDelete = false"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import { DataLoader } from '@shared/types'
import { api } from '@shared/services/api'
import { useTableLogic } from '@/composables/useTableLogic'
import DeleteDataLoaderCard from '@/components/DataLoader/DeleteDataLoaderCard.vue'

defineProps({ search: String })

const { item, items, openDelete, openDialog, onDelete } = useTableLogic(
  api.fetchDataLoaders,
  api.deleteDataLoader,
  DataLoader
)

const headers = [
  {
    title: 'Name',
    key: 'name',
  },
  {
    title: 'Actions',
    align: 'end',
    key: 'actions',
  },
] as const
</script>

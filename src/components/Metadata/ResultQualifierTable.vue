<template>
  <v-data-table-virtual
    :headers="headers"
    :items="items"
    :search="search"
    :style="{ 'max-height': `200vh` }"
    fixed-header
  >
    <template v-slot:item.actions="{ item }">
      <v-icon @click="openDialog(item, 'edit')"> mdi-pencil </v-icon>
      <v-icon @click="openDialog(item, 'delete')"> mdi-delete </v-icon>
    </template></v-data-table-virtual
  >

  <v-dialog v-model="openEdit" width="60rem">
    <ResultQualifierFormCard
      :result-qualifier="item"
      @close="openEdit = false"
      @updated="onUpdate"
    />
  </v-dialog>

  <v-dialog v-model="openDelete" width="40rem">
    <DeleteMetadataCard
      itemName="result qualifier"
      :itemID="item.id"
      parameter-name="resultQualifierId"
      @delete="onDelete"
      @close="openDelete = false"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import { api } from '@/services/api'
import { ResultQualifier } from '@/types'
import { useTableLogic } from '@/composables/useTableLogic'
import DeleteMetadataCard from '@/components/Metadata/DeleteMetadataCard.vue'
import ResultQualifierFormCard from '@/components/Metadata/ResultQualifierFormCard.vue'

const { item, items, openEdit, openDelete, openDialog, onUpdate, onDelete } =
  useTableLogic(
    api.fetchCurrentUserResultQualifiers,
    api.deleteResultQualifier,
    ResultQualifier
  )

const props = defineProps<{ search: string | undefined }>()

const headers = [
  { title: 'Code', key: 'code' },
  { title: 'Description', key: 'description' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
] as const
</script>

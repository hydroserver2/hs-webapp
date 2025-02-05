<template>
  <v-data-table-virtual
    :headers="ProcLevelHeaders"
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
    <ProcessingLevelFormCard
      :processing-level="item"
      @close="openEdit = false"
      @updated="onUpdate"
    />
  </v-dialog>

  <v-dialog v-model="openDelete" width="40rem">
    <DeleteMetadataCard
      itemName="processing level"
      :itemID="item.id"
      parameter-name="processingLevelId"
      @delete="onDelete"
      @close="openDelete = false"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import ProcessingLevelFormCard from '@/components/Metadata/ProcessingLevelFormCard.vue'
import DeleteMetadataCard from '@/components/Metadata/DeleteMetadataCard.vue'
import { api } from '@/services/api'
import { ProcessingLevel } from '@/types'
import { useTableLogic } from '@/composables/useTableLogic'
import { computed } from 'vue'

const { item, items, openEdit, openDelete, openDialog, onUpdate, onDelete } =
  useTableLogic(
    api.fetchCurrentUserProcessingLevels,
    api.deleteProcessingLevel,
    ProcessingLevel
  )

const props = defineProps<{ search: string | undefined }>()

const ProcLevelHeaders = [
  { title: 'Code', key: 'code' },
  { title: 'Definition', key: 'definition' },
  { title: 'Explanation', key: 'explanation' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
] as const

const sortedItems = computed(() =>
  items.value.sort((a, b) => a.code.localeCompare(b.code))
)
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="tableData"
    :search="search"
    :hover="true"
    class="elevation-2"
  >
    <template v-slot:item.status="{ item }">
      <ApiKeyStatus :status="item.status" />
    </template>

    <template v-slot:item.actions="{ item }">
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" icon="mdi-dots-vertical" />
        </template>
        <v-list>
<!--          <v-list-item-->
<!--            title="Edit API Key"-->
<!--            prepend-icon="mdi-pencil"-->
<!--            @click="openDialog(item, 'edit')"-->
<!--          />-->
<!--          <v-list-item-->
<!--            title="Delete API Key"-->
<!--            prepend-icon="mdi-delete"-->
<!--            @click="openDialog(item, 'delete')"-->
<!--          />-->
        </v-list>
      </v-menu>
    </template>
  </v-data-table>

<!--  <v-dialog v-model="openEdit">-->
<!--    <DataSourceForm-->
<!--      :data-source="item"-->
<!--      @close="openEdit = false"-->
<!--      @updated="onUpdate"-->
<!--    />-->
<!--  </v-dialog>-->

<!--  <v-dialog v-model="openDelete" max-width="500">-->
<!--    <DeleteDataSourceCard-->
<!--      :item-name="item.name"-->
<!--      @delete="onDelete"-->
<!--      @close="openDelete = false"-->
<!--    />-->
<!--  </v-dialog>-->
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ApiKey } from '@/types'
import { api } from '@/services/api'
import { computed } from 'vue'
import { formatFieldValue, getStatus } from '@/utils/apiKeyUtils'
import { useTableLogic } from '@/composables/useTableLogic'
import ApiKeyStatus from '@/components/ApiKey/ApiKeyStatus.vue'

defineProps({ search: String })
const apiKeys = ref<ApiKey[]>([])

const { item, items, openEdit, openDelete, openDialog, onDelete, onUpdate } =
  useTableLogic(api.fetchApiKeys, api.deleteApiKey, ApiKey)

const tableData = computed(() =>
  items.value
    .map((d) => ({
      ...d,
      scope: formatFieldValue(d.scope),
      status: getStatus(d)
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
)

const headers = [
  {
    title: 'Name',
    key: 'name',
  },
  {
    title: 'Scope',
    key: 'scope',
  },
  {
    title: 'Status',
    key: 'status',
  },
  {
    title: 'Last Used',
    key: 'lastSynced',
  },
  {
    title: 'Expires',
    key: 'nextSync',
  },
  {
    title: 'Actions',
    key: 'actions',
  },
] as const

onMounted(async () => {
  apiKeys.value = await api.fetchApiKeys()
})
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="tableData"
    :search="search"
    :hover="true"
    class="elevation-2"
  >
    <template v-slot:item.status="{ item }">
      <DataSourceStatus :status="item.status" :paused="item.paused" />
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon
        :icon="item.paused ? 'mdi-play' : 'mdi-pause'"
        @click="togglePaused(item)"
      />

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" icon="mdi-dots-vertical" />
        </template>
        <v-list>
          <v-list-item
            title="Data Source Details"
            prepend-icon="mdi-information"
            :to="{
              name: 'DataSource',
              params: { id: item.id },
            }"
          />
          <v-list-item
            title="Edit Data Source"
            prepend-icon="mdi-pencil"
            @click="openDialog(item, 'edit')"
          />
          <v-list-item
            title="Delete Data Source"
            prepend-icon="mdi-delete"
            @click="openDialog(item, 'delete')"
          />
        </v-list>
      </v-menu>
    </template>
  </v-data-table>

  <v-dialog v-model="openEdit">
    <DataSourceForm
      :data-source="item"
      @close="openEdit = false"
      @updated="onUpdate"
    />
  </v-dialog>

  <v-dialog v-model="openDelete" max-width="500">
    <DeleteDataSourceCard
      :item-name="item.name"
      @delete="onDelete"
      @close="openDelete = false"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DataSourceForm from '@/components/DataSource/DataSourceForm.vue'
import DataSourceStatus from '@/components/DataSource/DataSourceStatus.vue'
import { DataLoader, DataSource } from '@shared/types'
import { api } from '@shared/services/api'
import { computed } from 'vue'
import { getStatus } from '@/utils/dataSourceUtils'
import { useTableLogic } from '@/composables/useTableLogic'
import DeleteDataSourceCard from '@/components/DataSource/DeleteDataSourceCard.vue'

defineProps({ search: String })
const dataLoaders = ref<DataLoader[]>([])

const { item, items, openEdit, openDelete, openDialog, onDelete, onUpdate } =
  useTableLogic(api.fetchDataSources, api.deleteDataSource, DataSource)

const tableData = computed(() =>
  items.value
    .map((d) => ({
      ...d,
      status: getStatus(d),
      dataLoaderName:
        dataLoaders.value.find((dl) => dl.id === d.dataLoaderId)?.name || '',
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
)

async function togglePaused(ds: DataSource) {
  ds.paused = !ds.paused
  await api.updateDataSource(ds)
}

const headers = [
  {
    title: 'Name',
    key: 'name',
  },
  {
    title: 'Data Loader',
    key: 'dataLoaderName',
  },
  {
    title: 'Status',
    key: 'status',
  },
  {
    title: 'Last Synced',
    key: 'lastSynced',
  },
  {
    title: 'Next Sync',
    key: 'nextSync',
  },
  {
    title: 'Actions',
    key: 'actions',
  },
] as const

onMounted(async () => {
  dataLoaders.value = await api.fetchDataLoaders()
})
</script>

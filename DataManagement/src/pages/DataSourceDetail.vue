<template>
  <v-container v-if="dataSource">
    <v-row class="mb-2">
      <v-col cols="auto">
        <h5 class="text-h5">{{ dataSource.name }}</h5>
      </v-col>

      <v-spacer />

      <v-col cols="auto">
        <v-btn-primary class="mr-2" @click="openEdit = true">
          Edit
        </v-btn-primary>
        <v-btn-delete @click="openDelete = true">Delete</v-btn-delete>
      </v-col>
    </v-row>

    <h6 class="text-h6 my-4">Data Source Configuration</h6>

    <v-table class="elevation-2">
      <tbody>
        <tr>
          <td style="width: 220px">ID</td>
          <td>{{ dataSource.id }}</td>
        </tr>
        <tr>
          <td style="width: 220px">Name</td>
          <td>{{ dataSource.name }}</td>
        </tr>
        <tr>
          <td style="width: 220px">Data Loader</td>
          <td>{{ dataLoader?.name }}</td>
        </tr>
        <tr>
          <td style="width: 220px">Local File Path</td>
          <td>{{ dataSource.path }}</td>
        </tr>
        <tr>
          <td style="width: 220px">Header Row</td>
          <td>{{ dataSource.headerRow }}</td>
        </tr>
        <tr>
          <td style="width: 220px">Data Start Row</td>
          <td>{{ dataSource.dataStartRow }}</td>
        </tr>
        <tr>
          <td style="width: 220px">Timestamp Column</td>
          <td>{{ dataSource.timestampColumn }}</td>
        </tr>
        <tr>
          <td style="width: 220px">Timestamp Format</td>
          <td>
            {{ dataSource.timestampFormat }}
          </td>
        </tr>
        <tr>
          <td style="width: 220px">Timezone Offset</td>
          <td>
            {{
              dataSource.timestampOffset ? dataSource.timestampOffset : 'UTC'
            }}
          </td>
        </tr>
      </tbody>
    </v-table>

    <h6 class="text-h6 my-4">Data Source Status</h6>

    <v-table class="elevation-2">
      <tbody>
        <tr>
          <td style="width: 220px">Status</td>
          <td>
            <DataSourceStatus :status="status" :paused="dataSource.paused" />
          </td>
        </tr>
        <tr>
          <td style="width: 220px">Schedule</td>
          <td>{{ scheduleString }}</td>
        </tr>
        <tr>
          <td style="width: 220px">Last Synced</td>
          <td>{{ dataSource.lastSynced }}</td>
        </tr>
        <tr>
          <td style="width: 220px">Last Sync Message</td>
          <td>{{ dataSource.lastSyncMessage }}</td>
        </tr>
        <tr>
          <td style="width: 220px">Next Sync</td>
          <td>{{ dataSource.nextSync }}</td>
        </tr>
      </tbody>
    </v-table>

    <h6 class="text-h6 my-4">Linked Datastreams</h6>

    <v-data-table
      class="elevation-2"
      :headers="linkedDatastreamColumns"
      :items="datastreams"
    />

    <v-btn-cancel
      class="mt-4"
      prependIcon="mdi-arrow-left"
      :to="{ name: 'DataSources' }"
    >
      Back
    </v-btn-cancel>
  </v-container>
  <v-container v-else>Loading...</v-container>

  <v-dialog v-model="openEdit" width="80rem">
    <DataSourceForm
      @close="openEdit = false"
      :dataSource="dataSource"
      @updated="fetchData"
    />
  </v-dialog>

  <v-dialog v-model="openDelete" width="40rem">
    <DeleteDataSourceCard
      @close="openDelete = false"
      :itemName="dataSource.name"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { DataLoader, DataSource, Datastream } from '@shared/types'
import DataSourceForm from '@/components/DataSource/DataSourceForm.vue'
import DataSourceStatus from '@/components/DataSource/DataSourceStatus.vue'
import DeleteDataSourceCard from '@/components/DataSource/DeleteDataSourceCard.vue'
import { api } from '@shared/services/api'
import { computed } from 'vue'
import { getStatus } from '@/utils/dataSourceUtils'

const route = useRoute()
const openEdit = ref(false)
const openDelete = ref(false)
const datastreams = ref<Datastream[]>([])
const dataLoader = ref<DataLoader>(new DataLoader())
const dataSource = ref<DataSource>(new DataSource())

const status = computed(() =>
  dataSource.value ? getStatus(dataSource.value) : 'pending'
)

const scheduleString = computed(() => {
  if (!dataSource.value) return ''
  const ds = dataSource.value
  let string = ''

  if (ds.interval) string += `Every ${ds.interval} ${ds.intervalUnits}`
  else string += `Crontab: ${ds.crontab}`

  if (ds.startTime && ds.endTime)
    string += ` from ${ds.startTime} to ${ds.endTime}`
  else if (ds.startTime) string += ` beginning ${ds.startTime}`
  else if (ds.endTime) string += ` until ${ds.endTime}`

  return string
})

const linkedDatastreamColumns = [
  {
    title: 'ID',
    key: 'name',
  },
  {
    title: 'Name',
    key: 'description',
  },
  {
    title: 'Status',
    key: 'status',
  },
  {
    title: 'Last Loaded Timestamp',
    key: 'phenomenonEndTime',
  },
  {
    title: 'Data Source Column',
    key: 'dataSourceColumn',
  },
] as const

const fetchData = async () => {
  try {
    const [data, source] = await Promise.all([
      api.fetchDatastreams(),
      api.fetchDataSource(route.params.id.toString()),
    ])

    dataSource.value = source
    dataLoader.value = await api.fetchDataLoader(dataSource.value.dataLoaderId)
    datastreams.value = (data as Datastream[]).filter(
      (d) => d.dataSourceId === dataSource.value.id
    )
  } catch (e) {
    console.log('error fetching dataSource', e)
  }
}

onMounted(async () => {
  await fetchData()
})
</script>

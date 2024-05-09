<template>
  <v-row>
    <v-tooltip bottom :openDelay="500" v-if="isOwner">
      <template v-slot:activator="{ props }">
        <v-icon
          :icon="
            datastream.isDataVisible
              ? 'mdi-file-eye-outline'
              : 'mdi-file-remove'
          "
          :color="datastream.isDataVisible ? 'grey' : 'grey-lighten-1'"
          small
          v-bind="props"
          @click="toggleDataVisibility(datastream)"
        />
      </template>
      <span v-if="datastream.isDataVisible"
        >Hide the data for this datastream from guests of your site while
        keeping the metadata public. Owners will still see it
      </span>
      <span v-else>Make the data for this datastream publicly visible</span>
    </v-tooltip>

    <v-tooltip bottom :openDelay="500" v-if="isOwner">
      <template v-slot:activator="{ props }">
        <v-icon
          :icon="datastream.isVisible ? 'mdi-eye' : 'mdi-eye-off'"
          :color="datastream.isVisible ? 'grey' : 'grey-lighten-1'"
          small
          v-bind="props"
          @click="toggleVisibility(datastream)"
        />
      </template>
      <span v-if="datastream.isVisible"
        >Hide this datastream from guests of your site. Owners will still see
        it</span
      >
      <span v-else>Make this datastream publicly visible</span>
    </v-tooltip>

    <v-tooltip
      v-if="!isOwner && !datastream.isDataVisible"
      bottom
      :openDelay="100"
    >
      <template v-slot:activator="{ props }">
        <v-icon v-bind="props" icon="mdi-lock" />
      </template>
      <span>The data for this datastream is private </span>
    </v-tooltip>

    <v-menu v-else>
      <template v-slot:activator="{ props }">
        <v-icon v-bind="props" icon="mdi-dots-vertical" />
      </template>
      <v-list>
        <div v-if="isOwner">
          <v-list-item
            prepend-icon="mdi-link-variant"
            title="Link Data Source"
            @click="openLinker = true"
          />
          <v-list-item
            prepend-icon="mdi-pencil"
            title="Edit Datastream Metadata"
            :to="{
              name: 'DatastreamForm',
              params: { id: thingId, datastreamId: datastream.id },
            }"
          />
          <v-list-item
            prepend-icon="mdi-delete"
            title="Delete Datastream"
            @click="openDelete = true"
          />
        </div>
        <v-list-item
          v-if="datastream.isDataVisible"
          prepend-icon="mdi-chart-line"
          title="Visualize Data"
          :to="{
            name: 'VisualizeData',
            query: { sites: thingId, datastreams: datastream.id },
          }"
        />
        <v-list-item
          v-if="datastream.isDataVisible"
          prepend-icon="mdi-download"
          title="Download Data"
          @click="downloadDatastreamCSV(datastream.id)"
        />
      </v-list>
    </v-menu>
  </v-row>

  <v-dialog v-model="openDelete" width="40rem">
    <v-card>
      <v-card-title>
        <span class="text-h5">Confirm Deletion</span>
      </v-card-title>
      <v-card-text>
        Are you sure you want to permanently delete this datastream and all the
        observations associated with it?
      </v-card-text>
      <v-card-text> <strong>ID:</strong> {{ datastream.id }} </v-card-text>
      <v-card-text>
        Please type <strong> Delete </strong> to confirm deletion:
        <v-form>
          <v-text-field
            v-model="deleteDatastreamInput"
            @keydown.enter.prevent="onDeleteDatastream"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="closeDeleteModal">Cancel</v-btn>
        <v-btn color="delete" @click="onDeleteDatastream">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="openLinker" width="40rem">
    <DatastreamSourceLinker
      :datastream="datastream"
      @close="openLinker = false"
      @updated="handleLinkUpdated"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import { Datastream } from '@shared/types'
import { ref } from 'vue'
import { api } from '@shared/services/api'
import { Snackbar } from '@shared/utils/notifications'
import DatastreamSourceLinker from './DatastreamSourceLinker.vue'
import { downloadDatastreamCSV } from '@/utils/CSVDownloadUtils'

const props = defineProps({
  datastream: {
    type: Object as () => any,
    required: true,
  },
  thingId: {
    type: String,
    required: true,
  },
  isOwner: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['deleted', 'linkUpdated'])
const handleLinkUpdated = (patchBody: {}) => emit('linkUpdated', patchBody)

const openDelete = ref(false)
const openLinker = ref(false)
const deleteDatastreamInput = ref('')

function closeDeleteModal() {
  openDelete.value = false
  deleteDatastreamInput.value = ''
}

async function toggleDataVisibility(datastream: Datastream) {
  datastream.isDataVisible = !datastream.isDataVisible
  if (datastream.isDataVisible) datastream.isVisible = true
  onUpdate({
    id: datastream.id,
    isVisible: datastream.isVisible,
    isDataVisible: datastream.isDataVisible,
  })
}

async function toggleVisibility(datastream: Datastream) {
  datastream.isVisible = !datastream.isVisible
  if (!datastream.isVisible) datastream.isDataVisible = false
  onUpdate({
    id: datastream.id,
    isVisible: datastream.isVisible,
    isDataVisible: datastream.isDataVisible,
  })
}

const onUpdate = async (patchBody: {}) => {
  try {
    await api.updateDatastream(patchBody as Datastream)
  } catch (error) {
    console.error('Error updating datastream', error)
  }
}

async function onDeleteDatastream() {
  if (deleteDatastreamInput.value.toLocaleLowerCase() !== 'delete') {
    Snackbar.error('inputs do not match')
    return
  }

  closeDeleteModal()

  try {
    await api.deleteDatastream(props.datastream.id)
    emit('deleted')
  } catch (error) {
    console.error(`Error deleting datastream`, error)
  }
}
</script>

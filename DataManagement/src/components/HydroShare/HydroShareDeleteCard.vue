<template>
  <v-card>
    <v-card-title class="text-h5">Unlink HydroShare Archival</v-card-title>

    <v-divider />

    <v-card-text>
      Are you sure you want to unlink your site from HydroShare? This action
      will stop any scheduled archival for this site and permanently delete any
      archival configurations you have set for this site. Any datastreams and
      observations in HydroShare or HydroServer will remain unaffected.
    </v-card-text>

    <v-card-text>
      Please type the following text to confirm deletion:
      <strong>Unlink Archive</strong>
      <v-form>
        <v-text-field
          v-model="deleteInput"
          solo
          @keydown.enter.prevent="deleteLink"
        ></v-text-field>
      </v-form>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer />
      <v-btn-cancel @click="cancelDeletion">Cancel</v-btn-cancel>
      <v-btn-delete @click="deleteLink">Delete</v-btn-delete>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { api } from '@shared/services/api'
import { Snackbar } from '@shared/utils/notifications'
import { ref } from 'vue'

const emit = defineEmits(['delete', 'close'])
const props = defineProps({
  thingId: { type: String, required: true },
})
const deleteInput = ref('')

async function deleteLink() {
  if (deleteInput.value.toLowerCase() !== 'unlink archive') {
    Snackbar.error("input doesn't match")
    return
  }
  try {
    emit('close')
    await api.deleteHydroShareArchive(props.thingId)
    Snackbar.info('Your site has been unlinked')
  } catch (error) {
    console.error('Error unlinking site', error)
  }
}

function cancelDeletion() {
  deleteInput.value = ''
  emit('close')
}
</script>

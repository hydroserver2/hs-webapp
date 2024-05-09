<template>
  <v-card>
    <v-card-title> Confirm Delete Data Loader </v-card-title>

    <v-divider class="my-4" />

    <v-card-text>
      Are you sure you want to delete <strong> {{ itemName }} </strong>?
    </v-card-text>
    <v-card-text>
      Note: You should uninstall this data loader instance before deleting it
      here. Deleting this data loader instance will unlink it from all
      associated data sources.
    </v-card-text>

    <v-divider class="my-4" />

    <v-card-actions>
      <v-spacer />
      <v-btn-cancel @click="emit('close')">Cancel</v-btn-cancel>
      <v-btn-delete color="red" @click="onDelete"> Delete </v-btn-delete>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
const emit = defineEmits(['delete', 'close'])
defineProps({ itemName: String })

const onDelete = () => {
  emit('delete')
  emit('close')
}
</script>

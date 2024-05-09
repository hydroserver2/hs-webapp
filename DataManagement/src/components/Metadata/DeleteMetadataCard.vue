<template>
  <v-card v-if="loaded">
    <v-card-title class="text-h5">
      {{
        hasDatastreams
          ? `Cannot delete ${itemName}`
          : `Confirm ${itemName} deletion`
      }}
    </v-card-title>

    <v-divider class="my-4" />

    <v-card-text v-if="hasDatastreams">
      This {{ itemName }} cannot be deleted because it's being referenced by
      some of your datastreams. Before deletion, all of the following
      datastreams need to be deleted or use a different {{ itemName }}:
      <div class="my-4" v-for="(thing, thingId) in thingMap" :key="thingId">
        <router-link :to="`/sites/${thingId}`">
          {{ thing.name }}
        </router-link>
        has the following datastreams using this {{ itemName }}:

        <v-list>
          <v-list-item v-for="id in thing.datastreamIds" :key="id">
            <router-link :to="`/sites/${thingId}/datastreams/form/${id}`">{{
              id
            }}</router-link>
          </v-list-item>
        </v-list>
      </div>
    </v-card-text>
    <v-card-text v-else>
      This {{ itemName }} isn't being used by any datastreams and is safe to
      delete.
    </v-card-text>

    <v-divider class="my-4"></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn-cancel @click="emit('close')">Cancel</v-btn-cancel>
      <v-btn-delete v-if="!hasDatastreams" @click="onDelete"
        >Delete</v-btn-delete
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { Datastream, Thing } from '@shared/types'
import { computed, onMounted, ref } from 'vue'
import { api } from '@shared/services/api'

const things = ref<Thing[]>([])
const datastreams = ref<Datastream[]>([])
const loaded = ref(false)

const emit = defineEmits(['delete', 'close'])
const props = defineProps({
  itemName: String,
  itemID: String,
  parameterName: String,
})

const onDelete = () => {
  emit('delete')
  emit('close')
}

const datastreamsForItem = computed(() => {
  if (!props.itemID || !props.parameterName) return
  return datastreams.value.filter(
    (ds) => ds[props.parameterName as keyof Datastream] === props.itemID
  )
})

const thingMap = computed(() => {
  if (!datastreamsForItem.value) return {}

  return datastreamsForItem.value.reduce((acc: any, datastream) => {
    const thing = things.value.find((t) => t.id === datastream.thingId)
    if (!thing) return acc
    if (!acc[thing.id]) acc[thing.id] = { name: thing.name, datastreamIds: [] }
    acc[thing.id].datastreamIds.push(datastream.id)
    return acc
  }, {})
})

const hasDatastreams = computed(() => {
  return datastreamsForItem.value && datastreamsForItem.value.length > 0
})

onMounted(async () => {
  try {
    const [fetchedThings, fetchedDatastreams] = await Promise.all([
      api.fetchPrimaryOwnedThings(),
      api.fetchPrimaryOwnedDatastreams(),
    ])
    things.value = fetchedThings
    datastreams.value = fetchedDatastreams
    loaded.value = true
  } catch (error) {
    console.error('Error fetching things', error)
  }
})
</script>

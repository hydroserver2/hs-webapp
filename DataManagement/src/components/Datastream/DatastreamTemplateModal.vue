<template>
  <v-card>
    <v-card-title>Use an existing datastream as a template</v-card-title>

    <v-divider class="my-4"></v-divider>

    <v-card-text>
      <v-col cols="12">
        Filter datastreams by site
        <v-select
          v-model="selectedThingId"
          :items="usersThings"
          item-title="name"
          item-value="id"
        >
        </v-select>
      </v-col>
      <v-col cols="12">
        <v-card
          class="my-2"
          v-for="datastream in datastreamsForThing"
          :key="datastream.id"
          @click="datastreamSelected(datastream.id)"
        >
          <v-card-text>
            <p style="font-size: 1.2em">
              <strong class="mr-2">Observed Property:</strong>
              <strong>{{
                observedProperties.find(
                  (pl) => pl.id === datastream.observedPropertyId
                )?.name
              }}</strong>
            </p>
            <p><strong class="mr-2">Identifier:</strong> {{ datastream.id }}</p>
            <p>
              <strong class="mr-2">Processing Level:</strong>
              {{
                processingLevels.find(
                  (pl) => pl.id === datastream.processingLevelId
                )?.code
              }}
            </p>
            <p>
              <strong class="mr-2">Sampled Medium:</strong>
              {{ datastream.sampledMedium }}
            </p>
            <p>
              <strong class="mr-2">Sensor:</strong>
              {{ sensors.find((pl) => pl.id === datastream.sensorId)?.name }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { api } from '@shared/services/api'
import { watch, onMounted, ref, computed } from 'vue'
import { Datastream, Thing } from '@shared/types'
import { useMetadata } from '@/composables/useMetadata'

const { sensors, observedProperties, processingLevels, fetchMetadata } =
  useMetadata()
const datastreamsForThing = ref<Datastream[]>([])
const things = ref<Thing[]>([])
const selectedThingId = ref('')
const usersThings = computed(() => things.value.filter((t) => t.isPrimaryOwner))

const emit = defineEmits(['selectedDatastreamId', 'close'])

watch(
  selectedThingId,
  async (newId) => {
    if (!newId) {
      datastreamsForThing.value = []
      return
    }
    const [datastreams] = await Promise.all([
      api.fetchDatastreamsForThing(newId),
      fetchMetadata(newId),
    ])
    datastreamsForThing.value = datastreams
  },
  { immediate: true }
)

function datastreamSelected(id: string) {
  emit('selectedDatastreamId', id)
  emit('close')
}

onMounted(async () => {
  const [fetchedThings] = await Promise.all([api.fetchThings()])
  things.value = fetchedThings
})
</script>

import { onMounted, computed, ref, ComputedRef } from 'vue'
import { ProcessingLevel, DatastreamMetadata } from '@shared/types'
import { api as defaultApi } from '@shared/services/api'

interface Api {
  fetchMetadataForThing: (id: string) => Promise<DatastreamMetadata>
  fetchMetadataForThingOwner: (id: string) => Promise<DatastreamMetadata>
}

export function useMetadata(thingId?: string | null, api: Api = defaultApi) {
  const metadata = ref<DatastreamMetadata | null>()

  const sensors = computed(() => metadata.value?.sensors || [])

  const units = computed(() => {
    const allUnits = metadata.value?.units || []
    return allUnits.filter((u) => u.type !== 'Time' && u.owner !== null)
  })

  const observedProperties = computed(
    () => metadata.value?.observedProperties || []
  )

  const processingLevels: ComputedRef<ProcessingLevel[]> = computed(
    () => metadata.value?.processingLevels || []
  )

  const formattedProcessingLevels = computed(
    () =>
      processingLevels.value?.map((pl) => ({
        id: pl.id,
        title: `${pl.code} : ${pl.definition}`,
      })) || []
  )

  const fetchMetadata = async (id: string) => {
    try {
      metadata.value = await api.fetchMetadataForThing(id)
    } catch (error) {
      console.error('Error fetching metadata', error)
    }
  }

  onMounted(async () => {
    if (thingId) await fetchMetadata(thingId)
  })

  return {
    sensors,
    units,
    observedProperties,
    processingLevels,
    formattedProcessingLevels,
    fetchMetadata,
  }
}

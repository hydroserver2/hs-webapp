import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useMetadata } from '@/composables/useMetadata'
import { DatastreamMetadata } from '@shared/types'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import unitFixtures from '@/utils/test/fixtures/unitFixtures'
import sensorFixtures from '@/utils/test/fixtures/sensorFixtures'
import processingLevelFixtures from '@/utils/test/fixtures/processingLevelFixtures'
import observedPropertyFixtures from '@/utils/test/fixtures/observedPropertyFixtures'

const metadataMock: DatastreamMetadata = {
  units: unitFixtures,
  sensors: sensorFixtures,
  processingLevels: processingLevelFixtures,
  observedProperties: observedPropertyFixtures,
}

const metadataMock2 = JSON.parse(JSON.stringify(metadataMock))
metadataMock2.sensors[0].name = 'MetadataMock2'

interface Api {
  fetchMetadataForThing: (id: string) => Promise<DatastreamMetadata>
  fetchMetadataForThingOwner: (id: string) => Promise<DatastreamMetadata>
}

const api: Api = {
  fetchMetadataForThing: (id: string) => {
    return Promise.resolve(metadataMock)
  },
  fetchMetadataForThingOwner: (id: string) => {
    return Promise.resolve(metadataMock2)
  },
}

let defaultThingId: string | null = 'thing1'
// onMounted won't work outside of the context of script setup, therefore
// wrap composable with dummy component
const createDummyComponent = ({
  thingId = defaultThingId as string | null,
} = {}) =>
  defineComponent({
    setup() {
      return useMetadata(thingId, api)
    },
    template: '<div>{{sensors}}</div>',
  })

describe('useMetadata', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('fetches linked metadata related to a thing', async () => {
    const wrapper = mount(createDummyComponent())
    await flushPromises()
    expect(wrapper.vm.sensors.length).toBe(sensorFixtures.length)
    expect(wrapper.vm.units.length).toBe(unitFixtures.length)
    expect(wrapper.vm.processingLevels.length).toBe(
      processingLevelFixtures.length
    )
    expect(wrapper.vm.observedProperties.length).toBe(
      observedPropertyFixtures.length
    )
  })

  it('formats processing levels correctly', async () => {
    const wrapper = mount(createDummyComponent())
    await flushPromises()
    const expected = processingLevelFixtures.map((pl) => ({
      id: pl.id,
      title: `${pl.code} : ${pl.definition}`,
    }))
    expect(wrapper.vm.formattedProcessingLevels).toEqual(expected)
  })

  it('updates metadata correctly when fetchMetadata is called directly', async () => {
    const wrapper = mount(createDummyComponent({ thingId: null }))
    await flushPromises()
    expect(wrapper.vm.sensors).toEqual([])

    await wrapper.vm.fetchMetadata(defaultThingId!)
    expect(wrapper.vm.sensors).toEqual(sensorFixtures)
  })
})

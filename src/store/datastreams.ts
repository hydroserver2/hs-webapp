import { defineStore } from 'pinia'
import { Datastream } from '@/types'
import { api } from '@/services/apiMethods'
import { ENDPOINTS } from '@/constants'

export const useDatastreamStore = defineStore('datastreams', {
  state: () => ({
    datastreams: {} as Record<string, Datastream[]>,
    loaded: false,
    fetching: false,
    loadedUsersDatastreams: false,
  }),
  getters: {
    getDatastreamsByParameter:
      (state) =>
      (parameter_name: keyof Datastream, parameter_id: string | number) => {
        const datastreams = Object.values(state.datastreams).flat()
        return datastreams.filter((ds) => ds[parameter_name] === parameter_id)
      },
  },
  actions: {
    async fetchDatastreams(reload = false) {
      // if (this.datastreams && !reload) return
      try {
        const data = await api.fetch(ENDPOINTS.DATASTREAMS)
        let newDatastreams = this.groupDatastreamsByThingId(data)
        this.$patch({ datastreams: newDatastreams })
        this.loaded = true
      } catch (error) {
        console.error('Error fetching datastreams from DB', error)
      }
    },
    async fetchUsersDatastreams(reload = false) {
      try {
        if (this.fetching || (this.loadedUsersDatastreams && !reload)) return
        this.fetching = true
        const data = await api.fetch(ENDPOINTS.DATASTREAMS.FOR_USER)
        let datastreamMap = this.groupDatastreamsByThingId(data)

        // Replace the existing datastreams with the new set for each thingId
        this.$patch((state) => {
          Object.keys(datastreamMap).forEach((thingId) => {
            state.datastreams[thingId] = datastreamMap[thingId]
          })
        })

        this.loadedUsersDatastreams = true
      } catch (error) {
        console.error('Error fetching datastreams from DB', error)
      } finally {
        this.fetching = false
      }
    },
    groupDatastreamsByThingId(datastreams: Datastream[]) {
      const grouped: Record<string, Datastream[]> = {}
      datastreams.forEach((datastream: Datastream) => {
        if (!grouped[datastream.thingId]) {
          grouped[datastream.thingId] = []
        }
        grouped[datastream.thingId].push(datastream)
      })
      return grouped
    },
    async fetchDatastreamsByThingId(id: string, reload = false) {
      if (this.fetching) return
      this.fetching = true
      try {
        const data = await api.fetch(ENDPOINTS.DATASTREAMS.FOR_THING(id))
        this.datastreams[id] = data
        return data
      } catch (error) {
        console.error(`Error fetching datastreams by thingID`, error)
      } finally {
        this.fetching = false
      }
    },
    async updateDatastream(datastream: Datastream) {
      try {
        const data = await api.patch(
          `${ENDPOINTS.DATASTREAMS}/${datastream.id}`,
          datastream,
          this.getDatastreamById(datastream.id)
        )
        const datastreamsForThing = this.datastreams[data.thingId]
        const index = datastreamsForThing.findIndex((ds) => ds.id === data.id)
        if (index !== -1 && data) datastreamsForThing[index] = data
      } catch (error) {
        console.error('Error updating datastream', error)
      }
    },
    async createDatastream(newDatastream: Datastream) {
      try {
        const data = await api.post(ENDPOINTS.DATASTREAMS, newDatastream)
        if (!this.datastreams[newDatastream.thingId]) {
          this.datastreams[newDatastream.thingId] = []
        }
        this.datastreams[newDatastream.thingId].push(data)
      } catch (error) {
        console.error('Error creating datastream', error)
      }
    },
    async deleteDatastream(id: string, thingId: string) {
      try {
        await api.delete(`${ENDPOINTS.DATASTREAMS}/${id}`)

        const datastreams = this.datastreams[thingId].filter(
          (datastream) => datastream.id !== id
        )
        this.$patch({
          datastreams: { ...this.datastreams, [thingId]: datastreams },
        })
      } catch (error) {
        console.error(`Error deleting datastream with id ${id}`, error)
      }
    },
    getDatastreamForThingById(
      thingId: string,
      datastreamId: string
    ): Datastream | null {
      const thingDatastreams = this.datastreams[thingId]
      if (thingDatastreams) {
        const datastream = thingDatastreams.find((ds) => ds.id === datastreamId)
        return datastream ? datastream : null
      }
      return null
    },
    getDatastreamById(datastreamId: string): Datastream | null {
      for (const thingId in this.datastreams) {
        const thingDatastreams = this.datastreams[thingId]
        const datastream = thingDatastreams.find((ds) => ds.id === datastreamId)
        if (datastream) {
          return datastream
        }
      }
      return null
    },
    // TODO: This shouldn't be in the store
    async downloadDatastream(id: string) {
      try {
        const data = await api.fetch(ENDPOINTS.DATASTREAMS.CSV(id))
        // Create a Blob from the received data
        const blob = new Blob([data], { type: 'text/csv' })

        // Create a download link element
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = `datastream_${id}.csv`

        // Append the link to the document and trigger a click event
        document.body.appendChild(link)
        link.click()

        // Clean up by removing the link
        document.body.removeChild(link)
      } catch (error) {
        console.error('Error downloading datastream CSV', error)
      }
    },
  },
})

import { ENDPOINTS } from '@/constants'
import { defineStore } from 'pinia'
import { api } from '@/utils/api/apiMethods'

interface LinkDataSourceForm {
  formLoaded: boolean
  datastreamId?: string
  dataSources: any[]
  linkedDataSource?: any | null
  selectedDataSource?: any | null
  linkedColumn?: string | number
  selectedColumn?: string | number
}

export const useSiteLinkDataSourceFormStore = defineStore(
  'site-link-data-source-form-store',
  {
    state: (): LinkDataSourceForm => ({
      formLoaded: false,
      dataSources: [],
    }),
    getters: {
      savable(state) {
        return (
          state.formLoaded &&
          ((state.linkedDataSource || {}).name !== state.selectedDataSource ||
            state.linkedColumn !== state.selectedColumn)
        )
      },
    },
    actions: {
      async fetchDatastreams(thingId: string, datastreamId: string) {
        const response = await api.fetch(
          ENDPOINTS.DATASTREAMS.FOR_THING(thingId)
        )
        return response.data.filter((ds: any) => ds.id === datastreamId)[0]
      },
      async fetchDataSources() {
        const dataSources = await api.fetch(ENDPOINTS.DATA_SOURCES)
        this.dataSources = dataSources.data
      },
      fillForm(datastreamId: string, dataSourceId: string, column: any) {
        let dataSource = this.dataSources.filter(
          (ds) => ds.id === dataSourceId
        )[0]
        this.datastreamId = datastreamId
        this.linkedColumn = column
        this.selectedColumn = column
        this.linkedDataSource = dataSource
        this.selectedDataSource = (dataSource || {}).name || null
      },
      async saveDataSource() {
        let datastreamBody = {
          data_source_id:
            (
              this.dataSources.filter(
                (ds) => ds.name === this.selectedDataSource
              )[0] || {}
            ).id || null,
          data_source_column: this.selectedColumn,
        }

        return await api.patch(
          `${ENDPOINTS.DATASTREAMS}/patch/${this.datastreamId}`,
          datastreamBody
        )
      },
    },
  }
)

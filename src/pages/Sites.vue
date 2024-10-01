<template>
  <div class="map-container flex-shrink-0">
    <GoogleMap
      v-if="ownedThings"
      :colorKey="useColors ? filterCriteria.key : ''"
      :things="filteredThings"
      useBounds
    />
  </div>

  <div class="my-4 mx-6">
    <v-row class="my-2">
      <v-col cols="auto">
        <h5 class="text-h5">Your registered sites</h5>
      </v-col>
    </v-row>

    <v-card class="mb-1" elevation="2">
      <KeepAlive>
        <SiteFilterToolbar
          v-if="showFilter"
          :useColors="useColors"
          @update:useColors="updateColors"
          @filter="handleFilter"
        />
      </KeepAlive>
    </v-card>

    <v-card>
      <v-toolbar flat color="blue-darken-2">
        <v-text-field
          :disabled="!ownedThings?.length"
          class="mx-2"
          clearable
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search"
          hide-details
          density="compact"
          rounded="xl"
        />

        <v-spacer />

        <v-btn
          :disabled="!ownedThings?.length"
          class="mr-2"
          @click="showFilter = !showFilter"
          prependIcon="mdi-filter"
          variant="outlined"
          rounded="xl"
          >Filter Sites</v-btn
        >

        <v-btn-add class="mr-2" @click="showSiteForm = true" color="white">
          Register a new site
        </v-btn-add>
      </v-toolbar>
      <v-data-table-virtual
        :headers="headers"
        :items="coloredThings"
        :sort-by="[{ key: 'samplingFeatureCode' }]"
        :search="search"
        multi-sort
        item-value="id"
        class="elevation-3 owned-sites-table"
        @click:row="onRowClick"
        color="primary"
        :hover="coloredThings?.length > 0 && sitesLoaded"
        :style="{ 'max-height': `200vh` }"
        fixed-header
        :loading="!sitesLoaded"
        loading-text="Loading sites..."
      >
        <template v-slot:no-data>
          <div class="text-center pa-4" v-if="ownedThings.length === 0">
            <v-icon size="48" color="grey lighten-1">mdi-radio-tower</v-icon>
            <h4 class="mt-2">You have not registered any sites</h4>
            <p class="mb-4">
              Click the "Register a new site" button to start managing your
              data.
            </p>
          </div>

          <!-- Check if filters result in no matching sites -->
          <div
            class="text-center pa-4"
            v-else-if="ownedThings.length > 0 && coloredThings.length === 0"
          >
            <v-icon size="48" color="grey lighten-1"
              >mdi-filter-remove-outline</v-icon
            >
            <h4 class="mt-2">No sites match your filters</h4>
            <p class="mb-4">
              Try adjusting your search keywords or filter criteria to find
              sites.
            </p>
          </div>
        </template>
        <template v-slot:item.tagValue="{ item }">
          <template v-for="(tag, index) in item.tags">
            <v-chip
              :color="item.color?.background"
              v-if="tag.key === filterCriteria.key"
            >
              {{ item.tagValue }}
            </v-chip>
          </template>
        </template>
      </v-data-table-virtual>
    </v-card>
  </div>

  <v-dialog v-model="showSiteForm" width="60rem">
    <SiteForm @close="showSiteForm = false" @site-created="loadThings" />
  </v-dialog>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import GoogleMap from '@/components/GoogleMap.vue'
import SiteForm from '@/components/Site/SiteForm.vue'
import SiteFilterToolbar from '@/components/Site/SiteFilterToolbar.vue'
import { api } from '@/services/api'
import { Thing } from '@/types'
import { addColorToMarkers } from '@/utils/googleMaps/markers'
import { ThingWithColor } from '@/types'

const ownedThings = ref<Thing[]>([])
const useColors = ref(true)
const isFiltered = ref(false)
const sitesLoaded = ref(false)
const filterCriteria = ref({ key: '', values: [] as string[] })
const search = ref()

const matchesFilterCriteria = (thing: Thing, key: string, values: string[]) => {
  if (values.length > 0)
    return thing.tags.some(
      (tag) => tag.key === key && values.includes(tag.value)
    )

  return thing.tags.some((tag) => tag.key === key)
}

const matchesSearchCriteria = (thing: Thing) => {
  if (!search.value) return true
  const searchLower = search.value.toLowerCase()
  return (
    thing.samplingFeatureCode?.toLowerCase().includes(searchLower) ||
    thing.name?.toLowerCase().includes(searchLower) ||
    thing.siteType?.toLowerCase().includes(searchLower)
  )
}

const filteredThings = computed(() => {
  const { key, values } = filterCriteria.value
  const hasKey = !!key

  isFiltered.value = hasKey

  return ownedThings.value.filter((thing) => {
    return (
      matchesSearchCriteria(thing) &&
      (!hasKey || matchesFilterCriteria(thing, key, values))
    )
  })
})

const coloredThings = computed<ThingWithColor[]>(() =>
  addColorToMarkers(filteredThings.value, filterCriteria.value.key)
)

const showSiteForm = ref(false)
const showFilter = ref(false)
const router = useRouter()

const headers = computed(() => {
  const baseHeaders = [
    { title: 'Site code', key: 'samplingFeatureCode' },
    { title: 'Site name', key: 'name' },
    { title: 'Site type', key: 'siteType' },
  ]

  if (isFiltered.value && useColors.value) {
    baseHeaders.push({ title: 'Additional metadata', key: 'tagValue' })
  }

  return baseHeaders
})

const updateColors = (newColor: boolean) => {
  useColors.value = newColor
}

const handleFilter = (criteria: { key: string; values: string[] }) => {
  filterCriteria.value = criteria
}

const onRowClick = (event: Event, item: any) => {
  router.push({ name: 'SiteDetails', params: { id: item.item.id } })
}

const loadThings = async () => {
  ownedThings.value = await api.fetchOwnedThings()
  sitesLoaded.value = true
}

onMounted(async () => loadThings())
</script>

<style scoped>
.map-container {
  /* The legend won't appear without a relative position */
  position: relative;
  height: 33rem;
}
</style>

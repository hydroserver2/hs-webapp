<template>
  <div class="d-flex fill-height">
    <BrowseFilterTool :things="things" @filter="updateFilteredThings" />
    <GoogleMap :things="filteredThings" useMarkerClusterer />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Thing } from '@shared/types'
import { api } from '@shared/services/api'
import GoogleMap from '@/components/GoogleMap.vue'
import BrowseFilterTool from '@/components/Browse/BrowseFilterTool.vue'

const things = ref<Thing[]>([])
const filteredThings = ref<Thing[]>([])

const updateFilteredThings = (updatedThings: Thing[]) => {
  filteredThings.value = updatedThings
}

onMounted(async () => {
  things.value = await api.fetchThings()
  filteredThings.value = things.value
})
</script>

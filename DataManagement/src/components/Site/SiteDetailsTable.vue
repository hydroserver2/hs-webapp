<template>
  <v-data-table class="elevation-2">
    <tbody>
      <tr v-for="property in thingProperties" :key="property.label">
        <td><i :class="property.icon"></i></td>
        <td>{{ property.label }}</td>
        <td>
          {{ property.value }}
        </td>
      </tr>

      <tr>
        <td><i :class="tagProperty.icon"></i></td>
        <td>{{ tagProperty.label }}</td>
        <td>
          <v-chip
            v-for="(tag, index) in tagProperty.value"
            rounded="true"
            :color="materialColors[index % materialColors.length]"
            :key="tag.id"
            class="ma-1"
          >
            {{ tag.key }}:
            <span v-if="isUrl(tag.value)">
              <a :href="tag.value" target="_blank">{{ tag.value }}</a>
            </span>
            <span v-else>{{ tag.value }}</span>
          </v-chip>
        </td>
      </tr>
    </tbody>
    <template v-slot:bottom></template>
  </v-data-table>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useThingStore } from '@/store/thing'
import { materialColors } from '@/utils/materialColors'
import { useTagStore } from '@/store/tags'
import { api } from '@shared/services/api'

const { thing } = storeToRefs(useThingStore())
const { tags } = storeToRefs(useTagStore())
const props = defineProps({
  thingId: {
    type: String,
    required: true,
  },
})

const isUrl = (value: string): boolean => {
  try {
    new URL(value)
    return true
  } catch (_) {
    return false
  }
}

const thingProperties = computed(() => {
  return thing.value
    ? [
        { icon: 'fas fa-id-badge', label: 'ID', value: thing.value.id },
        {
          icon: 'fas fa-barcode',
          label: 'Site Code',
          value: thing.value.samplingFeatureCode,
        },
        { icon: 'fas fa-map', label: 'Latitude', value: thing.value.latitude },
        {
          icon: 'fas fa-map',
          label: 'Longitude',
          value: thing.value.longitude,
        },
        {
          icon: 'fas fa-mountain',
          label: 'Elevation',
          value: thing.value.elevation_m,
        },
        {
          icon: 'fas fa-file-alt',
          label: 'Description',
          value: thing.value.description,
        },
        {
          icon: 'fas fa-map-pin',
          label: 'Site Type',
          value: thing.value.siteType,
        },
        {
          icon: 'fas fa-flag-usa',
          label: 'State/Province/Region',
          value: thing.value.state,
        },
        {
          icon: 'fas fa-flag-usa',
          label: 'County/District',
          value: thing.value.county,
        },
        {
          icon: 'fas fa-flag-usa',
          label: 'Country',
          value: thing.value.country,
        },
        {
          icon: thing.value.isPrivate ? 'fas fa-lock' : 'fas fa-globe',
          label: 'Privacy',
          value: thing.value.isPrivate ? 'Private' : 'Public',
        },
        {
          icon: 'fas fa-user',
          label: 'Site Owners',
          value: thing.value.owners
            .map(
              (o) =>
                `${o.firstName} ${o.lastName} (${
                  o.organizationName ? o.organizationName : 'No Organization'
                })`
            )
            .join(', '),
        },
      ]
    : []
})

const tagProperty = computed(() => {
  return {
    icon: 'fas fa-tags',
    label: 'Additional Metadata',
    value: tags.value || [],
  }
})

onMounted(async () => {
  try {
    tags.value = await api.fetchSiteTags(props.thingId)
  } catch (error) {
    console.error('Error fetching thing', error)
  }
})
</script>

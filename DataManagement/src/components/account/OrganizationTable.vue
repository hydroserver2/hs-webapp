<template>
  <v-data-table
    v-if="user.organization"
    density="compact"
    class="elevation-3 my-6 rounded-lg"
  >
    <template v-slot:top>
      <v-toolbar color="blue-grey">
        <h5 class="text-h5 ml-4">Organization Information</h5>
      </v-toolbar>
    </template>
    <tbody>
      <tr v-for="property in organizationInfo" :key="property?.label">
        <td><i :class="property?.icon"></i></td>
        <td>
          <strong>{{ property?.label }}</strong>
        </td>
        <td>{{ property?.value }}</td>
      </tr>
    </tbody>
    <template v-slot:bottom></template>
  </v-data-table>
</template>

<script setup lang="ts">
import { useUserStore } from '@shared/store/user'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const { user } = storeToRefs(useUserStore())

const organizationInfo = computed(() => {
  if (!user.value.organization) return []

  return [
    {
      icon: 'fas fa-building',
      label: 'Name',
      value: user.value.organization.name,
    },
    {
      icon: 'fas fa-code',
      label: 'Code',
      value: user.value.organization.code,
    },
    {
      icon: 'fas fa-external-link-alt',
      label: 'Link',
      value: user.value.organization.link,
    },
    {
      icon: 'fas fa-industry',
      label: 'Type',
      value: user.value.organization.type,
    },
    {
      icon: 'fas fa-file-alt',
      label: 'Description',
      value: user.value.organization.description,
    },
  ].filter(Boolean)
})
</script>

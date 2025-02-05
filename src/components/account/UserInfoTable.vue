<template>
  <v-data-table
    :items="userInformation"
    :items-per-page="-1"
    hide-default-header
    hide-default-footer
    density="compact"
    class="elevation-3 my-6 rounded-lg"
  >
    <template v-slot:top>
      <v-toolbar color="secondary" rounded="t-lg">
        <h5 class="text-h5 ml-4">User information</h5>
      </v-toolbar>
    </template>
    <template v-slot:item.icon="{ item }">
      <v-icon :icon="item?.icon"></v-icon>
    </template>
    <template v-slot:item.label="{ item }">
      <strong>{{ item?.label }}</strong>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { api } from '@/services/api'
import { useHydroShare } from '@/composables/useHydroShare'

const { user } = storeToRefs(useUserStore())
const { isConnected: isHydroShareConnected, isHydroShareConnectionEnabled } =
  useHydroShare()

onMounted(async () => {
  try {
    user.value = await api.fetchUser()
  } catch (error) {
    console.error('Error fetching user', error)
  }
})

const userInformation = computed(() => {
  if (!user.value) return []

  return [
    {
      icon: 'mdi-account',
      label: 'Name',
      value: `${user.value.firstName} ${user.value.middleName || ''} ${
        user.value.lastName
      }`,
    },
    { icon: 'mdi-email', label: 'Email', value: user.value.email },
    {
      icon: 'mdi-map-marker',
      label: 'Address',
      value: user.value.address,
    },
    { icon: 'mdi-phone', label: 'Phone', value: user.value.phone },
    { icon: 'mdi-card-account-details', label: 'Type', value: user.value.type },
    { icon: 'mdi-link', label: 'Link', value: user.value.link },
    isHydroShareConnectionEnabled.value
      ? {
          icon: 'mdi-database',
          label: 'HydroShare account',
          value:
            isHydroShareConnected.value === true
              ? 'Connected'
              : 'Not Connected',
        }
      : null,
  ].filter(Boolean)
})
</script>

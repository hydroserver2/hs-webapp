<template>
  <v-toolbar color="blue-grey-lighten-1" density="compact">
    <v-tabs v-model="ribbonTabs" color="white">
      <v-tab v-for="ribbon in ribbons">
        {{ ribbon.name }}
      </v-tab>
    </v-tabs>

    <v-spacer />

    <v-list-item prepend-icon="mdi-logout" @click.prevent="onLogout">
      Logout
    </v-list-item>
  </v-toolbar>

  <v-window v-model="ribbonTabs">
    <!-- Tabs -->
    <v-window-item v-for="(ribbon, index) in ribbons" :key="index">
      <v-card color="blue-grey-darken-1" variant="outlined" rounded="false">
        <v-card-item>
          <v-row dense>
            <!-- Ribbon Groups -->
            <template v-for="group in ribbon.groups" cols="flex">
              <component :is="group" />
              <v-col cols="auto" class="px-3">
                <v-divider vertical thickness="2" />
              </v-col>
            </template>
          </v-row>
        </v-card-item>
      </v-card>
    </v-window-item>
  </v-window>
</template>

<script setup lang="ts">
import SaveRibbonGroup from '@/components/RibbonGroups/SaveRibbonGroup.vue'
import ViewRibbonGroup from '@/components/RibbonGroups/ViewRibbonGroup.vue'
import TimeRibbonGroup from '@/components/RibbonGroups/TimeRibbonGroup.vue'
import HistoryRibbonGroup from '@/components/RibbonGroups/HistoryRibbonGroup.vue'
import EditDataRibbonGroup from '@/components/RibbonGroups/EditDataRibbonGroup.vue'
import FilterPointsRibbonGroup from '@/components/RibbonGroups/FilterPointsRibbonGroup.vue'
import { useAuthStore } from '@shared/store/authentication'
import { Snackbar } from '@shared/utils/notifications'
import { ref, markRaw } from 'vue'

const { logout } = useAuthStore()

const ribbonTabs = ref(0)
const ribbons = ref([
  {
    name: 'File',
    groups: [markRaw(SaveRibbonGroup)],
  },
  {
    name: 'Plot',
    groups: [markRaw(ViewRibbonGroup), markRaw(TimeRibbonGroup)],
  },
  {
    name: 'Edit',
    groups: [
      markRaw(HistoryRibbonGroup),
      markRaw(FilterPointsRibbonGroup),
      markRaw(EditDataRibbonGroup),
    ],
  },
])

function onLogout() {
  logout()
  Snackbar.info('You have logged out')
}
</script>

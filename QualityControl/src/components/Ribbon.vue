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
      <v-card variant="outlined" rounded="false">
        <v-card-item>
          <v-row dense>
            <!-- Ribbon Groups -->
            <template v-for="group in ribbon.groups" cols="flex">
              <component :is="group" />
              <v-col cols="auto">
                <v-divider vertical />
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
import { useAuthStore } from '@shared/store/authentication'
import { Snackbar } from '@shared/utils/notifications'
import { ref } from 'vue'

const { logout } = useAuthStore()

const ribbonTabs = ref(0)
const ribbons = ref([
  {
    name: 'File',
    groups: [SaveRibbonGroup],
  },
  {
    name: 'Plot',
    groups: [{ title: 'group 1' }, { title: 'group 2' }, { title: 'group 3' }],
  },
  {
    name: 'Edit',
    groups: [{ title: 'group 1' }, { title: 'group 2' }, { title: 'group 3' }],
  },
])

function onLogout() {
  logout()
  Snackbar.info('You have logged out')
}
</script>

<style scoped>
.button-with-icon {
  display: flex;
  flex-direction: column; /* Aligns icon above the text */
  align-items: center; /* Centers the content */
  text-align: center; /* Ensures text is centered */
}
</style>

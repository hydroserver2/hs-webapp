<template>
  <v-app-bar app elevation="2">
    <router-link :to="{ path: `/` }">
      <v-img class="mx-4" :src="appLogo" alt="HydroServer home" width="10rem" />
    </router-link>

    <template v-if="mdAndDown" v-slot:append>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    </template>

    <template v-if="!mdAndDown">
      <div v-for="path of paths" :key="path.label">
        <v-btn v-if="!path.menu" v-bind="path.attrs" @click="path.onClick">
          {{ path.label }}
        </v-btn>

        <v-menu v-else>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props">
              {{ path.label }}
              <v-icon right small>mdi-menu-down</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="menuItem of path.menu"
              v-bind="menuItem.attrs"
              :title="menuItem.label"
            />
          </v-list>
        </v-menu>
      </div>

      <v-spacer />

      <template v-if="isLoggedIn">
        <v-btn elevation="2" rounded>
          <v-icon>mdi-account-circle</v-icon>
          <v-icon>mdi-menu-down</v-icon>

          <v-menu bottom left activator="parent">
            <v-list class="pa-0">
              <v-list-item
                prepend-icon="mdi-account-circle"
                :to="{ path: '/profile' }"
                title="Account"
              />

              <v-divider />

              <v-list-item
                prepend-icon="mdi-logout"
                @click="onLogout"
                title="Log Out"
              />
            </v-list>
          </v-menu>
        </v-btn>
      </template>

      <template v-else>
        <v-btn prepend-icon="mdi-login" to="/Login">Log In</v-btn>
        <v-btn
          v-if="disableAccountCreation !== 'true'"
          prepend-icon="mdi-account-plus-outline"
          to="/sign-up"
          >Sign Up</v-btn
        >
      </template>
    </template>
  </v-app-bar>

  <v-navigation-drawer
    v-if="mdAndDown"
    temporary
    v-model="drawer"
    location="right"
  >
    <v-list density="compact" nav>
      <div v-for="path of paths">
        <v-list-item
          v-if="path.attrs"
          v-bind="path.attrs"
          :title="path.label"
          :prepend-icon="path.icon"
          :value="path.attrs.to || path.attrs.href"
          @click="path.onClick"
        />
        <div v-else>
          <v-list-item
            v-for="menuItem of path.menu"
            v-bind="menuItem.attrs"
            :title="menuItem.label"
            :prepend-icon="menuItem.icon"
            :value="menuItem.attrs.to || menuItem.attrs.href"
          />
        </div>
      </div>
    </v-list>

    <v-divider />

    <v-list density="compact" nav>
      <template v-if="isLoggedIn">
        <v-list-item to="/profile" prepend-icon="mdi-account-circle"
          >Account</v-list-item
        >
        <v-list-item prepend-icon="mdi-logout" @click.prevent="logout"
          >Logout</v-list-item
        >
      </template>

      <template v-else>
        <v-list-item prepend-icon="mdi-login" to="/Login">Login</v-list-item>
        <v-list-item
          v-if="disableAccountCreation !== 'true'"
          prepend-icon="mdi-account-plus-outline"
          to="/sign-up"
          >Sign Up</v-list-item
        >
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import appLogo from '@/assets/hydroserver-icon-min.png'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { useAuthStore } from '@shared/store/authentication'
import { Snackbar } from '@shared/utils/notifications'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useDataVisStore } from '@/store/dataVisualization'

const { resetState } = useDataVisStore()
const { logout } = useAuthStore()
const { isLoggedIn } = storeToRefs(useAuthStore())
const { mdAndDown } = useDisplay()

const drawer = ref(false)
const disableAccountCreation =
  import.meta.env.VITE_APP_DISABLE_ACCOUNT_CREATION || 'false'

const paths: {
  attrs?: { to?: string; href?: string }
  label: string
  icon?: string
  menu?: any[]
  onClick?: () => void
}[] = [
  {
    attrs: { to: '/browse' },
    label: 'Browse Monitoring Sites',
    icon: 'mdi-layers-search',
  },
  {
    attrs: { to: '/sites' },
    label: 'My Sites',
    icon: 'mdi-map-marker-multiple',
  },
  {
    attrs: { to: '/visualize-data' },
    label: 'Visualize Data',
    icon: 'mdi-chart-line',
    onClick: () => resetState(),
  },
  {
    label: 'Data Management',
    menu: [
      {
        attrs: { to: '/Metadata' },
        label: 'Manage Metadata',
        icon: 'mdi-database-cog',
      },
      {
        attrs: { to: '/data-sources' },
        label: 'Manage Data Sources',
        icon: 'mdi-file-chart',
      },
      {
        attrs: { to: '/data-loaders' },
        label: 'Manage Data Loaders',
        icon: 'mdi-file-upload',
      },
    ],
  },
  {
    attrs: { to: '/contact' },
    label: 'Contact Us',
    icon: 'mdi-email',
  },
]

function onLogout() {
  logout()
  Snackbar.info('You have logged out')
}
</script>

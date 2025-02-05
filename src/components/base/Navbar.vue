<template>
  <v-app-bar app elevation="2" density="default">
    <router-link v-if="navbarLogo.route" :to="navbarLogo.route">
      <v-img :src="navbarLogo.src" alt="Logo" :width="navbarLogo.width" />
    </router-link>
    <a
      v-else-if="navbarLogo.link"
      :href="navbarLogo.link"
      :target="navbarLogo.target || '_self'"
    >
      <v-img :src="navbarLogo.src" alt="Logo" :width="navbarLogo.width" />
    </a>

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

      <template v-if="isAuthenticated">
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
                title="Log out"
              />
            </v-list>
          </v-menu>
        </v-btn>
      </template>

      <template v-else>
        <v-btn prepend-icon="mdi-login" to="/Login">Log in</v-btn>
        <v-btn
          v-if="signupEnabled"
          prepend-icon="mdi-account-plus-outline"
          to="/sign-up"
          >Sign up</v-btn
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
      <template v-if="isAuthenticated">
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
          v-if="signupEnabled"
          prepend-icon="mdi-account-plus-outline"
          to="/sign-up"
          >Sign up</v-list-item
        >
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { Snackbar } from '@/utils/notifications'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useDataVisStore } from '@/store/dataVisualization'
import { navbarLogo } from '@/config/navbarConfig'
import { useAuthStore } from '@/store/authentication'

const { logout } = useAuthStore()
const { signupEnabled, isAuthenticated } = storeToRefs(useAuthStore())
const { resetState } = useDataVisStore()
const { mdAndDown } = useDisplay()

const drawer = ref(false)

const paths: {
  attrs?: { to?: string; href?: string }
  label: string
  icon?: string
  menu?: any[]
  onClick?: () => void
}[] = [
  {
    attrs: { to: '/browse' },
    label: 'Browse monitoring sites',
    icon: 'mdi-layers-search',
  },
  {
    attrs: { to: '/sites' },
    label: 'Your sites',
    icon: 'mdi-map-marker-multiple',
  },
  {
    attrs: { to: '/visualize-data' },
    label: 'Visualize data',
    icon: 'mdi-chart-line',
    onClick: () => resetState(),
  },
  {
    label: 'Data management',
    menu: [
      {
        attrs: { to: '/Metadata' },
        label: 'Manage metadata',
        icon: 'mdi-database-cog',
      },
      {
        attrs: { to: '/data-sources' },
        label: 'Manage data sources',
        icon: 'mdi-file-chart',
      },
      {
        attrs: { to: '/data-loaders' },
        label: 'Manage data loaders',
        icon: 'mdi-file-upload',
      },
    ],
  },
  {
    attrs: { to: '/about' },
    label: 'About',
    icon: 'mdi-information',
  },
]

function onLogout() {
  logout()
  Snackbar.info('You have logged out')
}
</script>

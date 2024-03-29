<template>
  <v-app-bar app elevation="2">
    <template v-if="mdAndDown" v-slot:append>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </template>

    <router-link :to="{ path: `/` }" class="logo">
      <v-img class="mx-4" :src="appLogo" alt="HydroServer home" width="10rem" />
    </router-link>

    <template v-if="!mdAndDown">
      <div v-for="path of paths" :key="path.name">
        <v-btn
          v-if="!path.menu"
          v-bind="path.attrs"
          :id="`navbar-nav-${path.label.replaceAll(/[\/\s]/g, ``)}`"
          :class="path.isActive && path.isActive() ? 'primary' : ''"
          :rounded="false"
          density="default"
          @click="
            path.isExternal ? openInNewTab($event, path.attrs?.href) : null
          "
        >
          {{ path.label }}
        </v-btn>
        <v-menu
          v-else
          :id="`navbar-nav-${path.label.replaceAll(/[\/\s]/g, ``)}`"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              :elevation="0"
              :rounded="false"
              density="default"
            >
              {{ path.label }}
              <v-icon right small>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="menuItem of path.menu" v-bind="menuItem.attrs">
              <v-list-item-title>
                {{ menuItem.label }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <v-spacer></v-spacer>

      <template v-if="isLoggedIn">
        <v-btn
          elevation="2"
          rounded
          class="account-logout-button"
          aria-label="Account Actions"
        >
          <v-icon>mdi-account-circle</v-icon>
          <v-icon>mdi-menu-down</v-icon>

          <v-menu bottom left activator="parent">
            <v-list class="pa-0">
              <v-list-item
                :to="{ path: '/profile' }"
                active-class="primary white--text"
              >
                <template v-slot:prepend
                  ><v-icon>mdi-account-circle</v-icon></template
                >

                <v-list-item-title>Account</v-list-item-title>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item id="navbar-logout" @click="onLogout">
                <template v-slot:prepend><v-icon>mdi-logout</v-icon></template>
                <v-list-item-title>Log Out</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </template>

      <template v-else>
        <v-btn
          class="navbar-login-button"
          prepend-icon="mdi-login"
          to="/Login"
          :rounded="false"
          density="default"
          >Log In</v-btn
        >
        <v-btn
          class="signup-btn"
          prepend-icon="mdi-account-plus-outline"
          to="/sign-up"
          v-if="disableAccountCreation !== 'true'"
          :rounded="false"
          density="default"
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
          :class="path.isActive && path.isActive() ? 'primary' : ''"
        ></v-list-item>
        <div v-else>
          <v-list-item
            v-for="menuItem of path.menu"
            v-bind="menuItem.attrs"
            :title="menuItem.label"
            :prepend-icon="menuItem.icon"
            :value="menuItem.attrs.to || menuItem.attrs.href"
            :class="menuItem.isActive && menuItem.isActive() ? 'primary' : ''"
          ></v-list-item>
        </div>
      </div>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <template v-if="isLoggedIn">
        <v-list-item to="/profile" prepend-icon="mdi-account-circle"
          >Profile</v-list-item
        >
        <v-list-item prepend-icon="mdi-logout" @click.prevent="logout"
          >Logout</v-list-item
        >
      </template>

      <template v-else>
        <v-list-item prepend-icon="mdi-login" to="/Login">Login</v-list-item>
        <v-list-item prepend-icon="mdi-account-plus-outline" to="/sign-up" v-if="disableAccountCreation !== 'true'"
          >Sign Up</v-list-item
        >
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/authentication'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import appLogo from '@/assets/hydroserver-icon-min.png'
import { Snackbar } from '@/utils/notifications'

const { logout } = useAuthStore()
const { isLoggedIn } = storeToRefs(useAuthStore())
const { mdAndDown } = useDisplay()
const drawer = ref(false)
const disableAccountCreation = import.meta.env.VITE_APP_DISABLE_ACCOUNT_CREATION || 'false'

const paths: {
  name: string
  attrs?: { to?: string; href?: string }
  label: string
  icon?: string
  menu?: any[]
  isExternal?: boolean
  isActive?: () => boolean
}[] = [
  // {
  //   name: 'home',
  //   attrs: { to: '/' },
  //   label: 'Home',
  //   icon: 'mdi-home',
  // },
  {
    name: 'browse',
    attrs: { to: '/browse' },
    label: 'Browse Monitoring Sites',
    icon: 'mdi-layers-search',
  },
  {
    name: 'mySites',
    attrs: { to: '/sites' },
    label: 'My Sites',
    icon: 'mdi-map-marker-multiple',
  },
  {
    name: 'visualizeData',
    attrs: { to: '/time-series-analyst' },
    label: 'Visualize Data',
    icon: 'mdi-chart-line',
  },
  {
    name: 'management',
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
      {
        attrs: { to: '/api-keys' },
        label: 'Manage API Keys',
        icon: 'mdi-key-chain'
      }
    ],
  },
  // {
  //   name: 'docs',
  //   attrs: { href: 'https://hydroserver2.github.io/docs/' },
  //   label: 'Docs',
  //   icon: 'mdi-file-document',
  //   isExternal: true,
  // },
  {
    name: 'contact us',
    attrs: { to: '/contact' },
    label: 'Contact Us',
    icon: 'mdi-email',
  },
]

function onLogout() {
  logout()
  Snackbar.info('You have logged out')
}
function openInNewTab(event: MouseEvent, href: string | undefined) {
  event.preventDefault()
  if (href) window.open(href, '_blank')
}
</script>

<style scoped lang="scss"></style>

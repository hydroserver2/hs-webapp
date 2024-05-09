<template>
  <v-app>
    <Navbar v-if="!route.meta.hideNavBar" />

    <v-main :class="`is-full-screen:${route.meta.isFullScreen} flex-grow-1`">
      <router-view />
    </v-main>

    <Footer v-if="!route.meta.hideFooter" class="flex-grow-0" />
    <Notifications />
    <link
      href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900"
      rel="stylesheet"
    />
  </v-app>
</template>

<script setup lang="ts">
import Navbar from '@/components/base/Navbar.vue'
import Footer from '@/components/base/Footer.vue'
import Notifications from '@shared/components/base/Notifications.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped lang="scss">
.v-main.is-full-screen {
  height: 100vh;
}
</style>

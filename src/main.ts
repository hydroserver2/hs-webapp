import '@/styles/global.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import vuetify from '@/plugins/vuetify'
import { useAuthStore } from '@/store/authentication'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

async function initializeApp() {
  app.use(pinia)

  // The session must be initialized before the router because some of the routes
  // depend on the session state for access control - and after the Pinia plugin
  // is installed because the function is kept in a Pinia store.
  const { initializeSession } = useAuthStore()
  await initializeSession()

  app.use(router)
  app.use(vuetify)
  app.mount('#app')
}

initializeApp()

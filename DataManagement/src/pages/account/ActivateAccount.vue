<template>
  <v-container class="d-flex align-center justify-center my-8">
    <div v-if="isActivating">Verifying your email address...</div>
    <div v-if="!isActivating && !wasActivated">
      Your email could not be verified.
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from '@shared/store/authentication'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@shared/services/api'

import router from '@/router/router'
import { useUserStore } from '@shared/store/user'
import { Snackbar } from '@shared/utils/notifications'

const { setTokens } = useAuthStore()
const { setUser } = useUserStore()
const route = useRoute()
const isActivating = ref(true)
const wasActivated = ref(false)

onMounted(async () => {
  try {
    const uid = (route.query.uid as string) || ''
    const token = (route.query.token as string) || ''
    const data = await api.activateAccount(uid, token)

    if (!data.user.isVerified) return false
    setUser(data.user)
    setTokens(data.access, data.refresh)
    wasActivated.value = true
    Snackbar.success('Your HydroServer account has been activated.')
    await router.push({ name: 'Sites' })
  } catch (e) {
    console.error('Error activating account', e)
    wasActivated.value = false
  } finally {
    isActivating.value = false
  }
})
</script>

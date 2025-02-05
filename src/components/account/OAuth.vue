<template>
  <v-row justify="center" v-if="oAuthProviders.length > 0">
    <v-col cols="2">
      <v-divider class="mt-3" />
    </v-col>
    <v-col cols="auto" class="text-center"> OR </v-col>
    <v-col cols="2">
      <v-divider class="mt-3" />
    </v-col>
  </v-row>

  <v-row v-for="provider in filteredOAuthProviders" justify="center">
    <v-col cols="12" sm="8" md="6">
      <v-btn
        @click="signupOrLoginWithOAuth(provider.id)"
        variant="outlined"
        color="primary"
        :rounded="false"
        block
        class="py-4"
      >
        <v-img
          :src="provider.iconLink"
          class="mr-1"
          width="100%"
          max-width="1.5rem"
          :alt="`${provider.name} icon`"
        />
        Continue with {{ provider.name }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { api } from '@/services/api'
import { useAuthStore } from '@/store/authentication'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const { oAuthProviders } = storeToRefs(useAuthStore())

const filteredOAuthProviders = computed(() =>
  oAuthProviders.value.filter((provider) => provider.signupEnabled)
)

const signupOrLoginWithOAuth = (providerId: string) => {
  const callbackUrl = `${import.meta.env.VITE_APP_PROXY_BASE_URL}/Sites`
  api.providerRedirect(providerId, callbackUrl, 'login')
}
</script>

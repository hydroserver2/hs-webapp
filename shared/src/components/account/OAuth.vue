<template>
  <div
    v-if="!disableAccountCreation && (googleOauthEnabled || orcidOauthEnabled)"
  >
    <v-row justify="center">
      <v-col cols="2">
        <v-divider class="mt-3" />
      </v-col>
      <v-col cols="auto" class="text-center"> OR </v-col>
      <v-col cols="2">
        <v-divider class="mt-3" />
      </v-col>
    </v-row>

    <v-row justify="center" v-if="googleOauthEnabled">
      <v-col cols="12" sm="8" md="6">
        <v-btn
          @click="OAuthLogin(OAuthProvider.google)"
          variant="outlined"
          color="primary"
          :rounded="false"
          block
          class="py-4"
        >
          <v-img
            :src="googleImg"
            class="mr-1"
            width="100%"
            max-width="1.5rem"
            alt="SensorThings Database Schema"
          ></v-img>
          Continue with Google
        </v-btn>
      </v-col>
    </v-row>

    <v-row justify="center" v-if="orcidOauthEnabled">
      <v-col cols="12" sm="8" md="6">
        <v-btn
          @click="OAuthLogin(OAuthProvider.orcid)"
          variant="outlined"
          color="primary"
          outlined
          :rounded="false"
          block
          class="py-4"
        >
          <template v-slot:prepend>
            <v-icon
              color="#afd253"
              size="1.5rem"
              class="mb-1 fa-brands fa-orcid"
            ></v-icon>
          </template>
          Continue with ORCID
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { OAuthProvider } from '@shared/types'
import googleImg from '@shared/assets/google.png'
import { OAUTH_ENDPOINT } from '@shared/services/api'

const OAuthLogin = async (provider: OAuthProvider) => {
  window.location.href = OAUTH_ENDPOINT(provider)
}

const disableAccountCreation =
  import.meta.env.VITE_APP_DISABLE_ACCOUNT_CREATION === 'true'
const googleOauthEnabled =
  import.meta.env.VITE_APP_GOOGLE_OAUTH_ENABLED === 'true'
const orcidOauthEnabled =
  import.meta.env.VITE_APP_ORCID_OAUTH_ENABLED === 'true'
</script>

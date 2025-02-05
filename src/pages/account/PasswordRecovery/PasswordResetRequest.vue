<template>
  <v-container class="d-flex align-center justify-center py-8 fill-height">
    <v-card width="40rem" v-if="!resetEmailSent">
      <v-card-title class="mb-4"> Reset Password </v-card-title>

      <v-card-text class="pb-0">
        Forgot your password? Enter your email address below, and we'll email
        instructions for setting a new one.
      </v-card-text>

      <v-card-text v-if="!resetEmailSent">
        <v-form @submit.prevent="submitForm">
          <v-text-field
            class="mb-4"
            v-model="email"
            label="Email"
            required
            type="email"
          ></v-text-field>

          <v-btn-primary type="submit" color="primary">Submit</v-btn-primary>
        </v-form>
      </v-card-text>
    </v-card>
    <v-card v-else width="40rem">
      <v-alert type="success">
        An email has been sent to your address. Please check your email to reset
        your password.
      </v-alert>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { api } from '@/services/api'
import { Snackbar } from '@/utils/notifications'

const email = ref('')
const resetEmailSent = ref(false)

const submitForm = async () => {
  try {
    resetEmailSent.value = await api.requestPasswordReset(email.value)
  } catch (error) {
    console.error('Error requesting password reset', error)
    if ((error as Error).message === '404') {
      Snackbar.warn('No account was found for the email you specified')
    }
  }
}
</script>

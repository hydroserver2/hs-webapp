<template>
  <v-container>
    <AccountForm
      :has-cancel-button="false"
      :is-edit="true"
      :is-complete-signup="true"
    >
      <template v-slot:header>
        <v-card-title align="center" class="mb-2 signup-title">
          Successfully authenticated!
        </v-card-title>
        <v-card-text align="center" class="my-2">
          Just a few more details and your account will be all set.
        </v-card-text>
      </template>
    </AccountForm>
  </v-container>
</template>

<script setup lang="ts">
import AccountForm from '@/components/account/AccountForm.vue'
</script>

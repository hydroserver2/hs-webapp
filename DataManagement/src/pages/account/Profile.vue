<template>
  <v-container>
    <UserInfoTable />
    <OrganizationTable />

    <v-row class="mb-8">
      <v-col v-if="hydroShareOauthEnabled === 'true'">
        <HydroShareConnectionButton />
      </v-col>

      <v-spacer />

      <v-col cols="auto">
        <v-btn-secondary prepend-icon="mdi-pencil" @click="openForm = true">
          Edit account
        </v-btn-secondary>
      </v-col>
      <v-col cols="auto">
        <v-btn-delete prepend-icon="mdi-delete" @click="openDelete = true">
          Delete Account</v-btn-delete
        >
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="openForm" width="40rem">
    <AccountForm @close="openForm = false" :is-edit="true" />
  </v-dialog>

  <v-dialog v-model="openDelete" width="40rem">
    <DeleteAccountCard @close="openDelete = false" />
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AccountForm from '@/components/account/AccountForm.vue'
import UserInfoTable from '@/components/account/UserInfoTable.vue'
import OrganizationTable from '@/components/account/OrganizationTable.vue'
import DeleteAccountCard from '@/components/account/DeleteAccountCard.vue'
import HydroShareConnectionButton from '@/components/HydroShare/HydroShareConnectionButton.vue'

const openDelete = ref(false)
const openForm = ref(false)

const hydroShareOauthEnabled =
  import.meta.env.VITE_APP_HYDROSHARE_OAUTH_ENABLED || 'false'
</script>

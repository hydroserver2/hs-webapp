<template>
  <v-card>
    <slot name="header">
      <v-card-title>Edit Profile</v-card-title>
    </slot>

    <v-divider class="my-4" />

    <v-card-text>
      <v-form
        ref="myForm"
        v-model="valid"
        validate-on="blur"
        @submit.prevent="onSubmit"
      >
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="userForm.firstName"
              label="First Name *"
              :rules="rules.requiredAndMaxLength150"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="userForm.middleName"
              label="Middle Name"
              :rules="rules.maxLength(50)"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="userForm.lastName"
              label="Last Name *"
              :rules="rules.requiredAndMaxLength150"
            />
          </v-col>

          <v-col cols="12" v-if="(inProviderSignupFlow && isEdit) || !isEdit">
            <v-text-field
              v-model="userForm.email"
              label="Email *"
              :rules="rules.email"
            />
          </v-col>

          <v-col v-if="!isEdit" cols="12" md="6">
            <v-text-field
              type="password"
              v-model="userForm.password"
              label="Password *"
              :rules="rules.password"
            />
          </v-col>
          <v-col v-if="!isEdit" cols="12" md="6">
            <v-text-field
              type="password"
              v-model="confirmPassword"
              label="Confirm Password *"
              :rules="rules.passwordMatch(userForm.password)"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              v-model="userForm.phone"
              v-maska:[phoneMask]
              label="Phone Number"
              :rules="rules.phoneNumber"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-combobox
              v-model="userForm.type"
              label="User Type *"
              :items="userTypes"
              :rules="rules.required"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="userForm.address"
              label="Address"
              :rules="rules.maxLength(255)"
            />
          </v-col>

          <v-col>
            <v-text-field
              v-model="userForm.link"
              label="User's Link (URL)"
              :rules="userForm.link ? rules.urlFormat : []"
            />
          </v-col>
        </v-row>

        <v-switch
          v-model="showOrg"
          hide-details
          label="Affiliated with an Organization"
          color="primary"
        />

        <v-row v-if="userForm.organization && showOrg">
          <v-col cols="12" sm="8">
            <v-text-field
              v-model="userForm.organization.name"
              label="Organization Name *"
              :rules="rules.requiredAndMaxLength500"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="userForm.organization.code"
              label="Organization Code *"
              :rules="rules.requiredAndMaxLength200"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-combobox
              :items="organizationTypes"
              v-model="userForm.organization.type"
              label="Organization Type *"
              :rules="rules.requiredAndMaxLength255"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="userForm.organization.link"
              label="Organization Link"
              :rules="userForm.organization.link ? rules.urlFormat : []"
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="userForm.organization.description"
              label="Organization Description"
              :rules="
                userForm.organization.description ? rules.maxLength(2000) : []
              "
            />
          </v-col>
        </v-row>

        <v-card-text v-if="hadOrgInitially && !showOrg">
          <v-alert type="warning" dense>
            Warning: Disabling organization affiliation will permanently remove
            its data from your profile. However, you can re-enter details later
            to affiliate with an organization again. Click the Cancel button if
            you do not want to remove your organization information.
          </v-alert>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn-cancel v-if="hasCancelButton" @click="emit('close')">
            Cancel
          </v-btn-cancel>
          <v-btn-primary type="submit">
            {{ isEdit ? 'Save' : 'Create User' }}
          </v-btn-primary>
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { rules } from '@/utils/rules'
import { reactive, ref, onMounted, watch } from 'vue'
import { userTypes, organizationTypes } from '@/config/vocabularies'
import { VForm } from 'vuetify/components'
import { vMaska } from 'maska'
import { Organization, User } from '@/types'
import { useUserStore } from '@/store/user'
import { Snackbar } from '@/utils/notifications'
import { api } from '@/services/api'
import { storeToRefs } from 'pinia'
import router from '@/router/router'
import { useAuthStore } from '@/store/authentication'

const props = defineProps({
  hasCancelButton: { type: Boolean, required: false, default: true },
  isEdit: Boolean,
  isCompleteSignup: { type: Boolean, required: false, default: false },
})

const { login, setSession } = useAuthStore()
const { inProviderSignupFlow, inEmailVerificationFlow, unverifiedEmail } =
  storeToRefs(useAuthStore())
const { user } = storeToRefs(useUserStore())

let userForm = reactive<User>(
  props.isEdit ? JSON.parse(JSON.stringify(user.value)) : new User()
)

const phoneMask = { mask: '(###) ###-####' }
const valid = ref(false)
const myForm = ref<VForm>()
const showOrg = ref(!!userForm.organization)
const hadOrgInitially = ref<boolean>(!!userForm.organization)
const tempOrganization = ref<Organization | null>(null)
const confirmPassword = ref('')

watch(showOrg, (newVal) => {
  if (newVal) {
    if (tempOrganization.value) {
      userForm.organization = JSON.parse(JSON.stringify(tempOrganization.value))
      tempOrganization.value = null
    } else if (!userForm.organization) {
      userForm.organization = new Organization()
    }
  } else {
    if (userForm.organization) {
      tempOrganization.value = JSON.parse(JSON.stringify(userForm.organization))
      userForm.organization = null
    }
  }
})

const emit = defineEmits(['close'])

async function createUser() {
  try {
    const sessionResponse = await api.signup(userForm)
    setSession(sessionResponse)

    if (inEmailVerificationFlow.value) {
      unverifiedEmail.value = userForm.email
      await router.push({ name: 'VerifyEmail' })
    } else {
      Snackbar.success('Account created.')
      await router.push({ name: 'Sites' })
    }
  } catch (error) {
    console.error('Error creating user', error)
    if ((error as Error).message === '409') {
      Snackbar.warn('A user with this email already exists.')
    }
  }
}

async function completeSignup() {
  try {
    const providerResponse = await api.providerSignup(userForm)
    setSession(providerResponse)
    await login()
  } catch (error) {
    console.error('Error creating user', error)
  }
}

const updateUser = async () => {
  try {
    userForm = await api.updateUser(userForm, user.value!)
    if (userForm !== undefined) user.value = userForm
  } catch (error) {
    console.error('Error updating user', error)
  }
  Snackbar.success('Your changes have been saved.')
  emit('close')
}

const onSubmit = async () => {
  await myForm.value?.validate()
  if (!valid.value) return
  if (props.isCompleteSignup) completeSignup()
  else if (props.isEdit) updateUser()
  else createUser()
}

onMounted(async () => {
  if (props.isEdit) await myForm.value?.validate()
})
</script>

import { defineStore, storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { OAuthProvider, User } from '@/types'
import { api } from '@/services/api'
import { Snackbar } from '@/utils/notifications'
import router from '@/router/router'
import Storage from '@/utils/storage'
import { useUserStore } from './user'

export interface AllAuthFlowItem {
  id: string
  providers?: string[]
}

export const emailStorage = new Storage<string>('unverifiedEmail')

export const useAuthStore = defineStore('authentication', () => {
  /**
   * Persist the state of unverified email since it won't be saved in the db
   * during the verify_email flow. Used on the VerifyEmail.vue page for
   * re-emailing the verification code to the user upon request.
   */
  const unverifiedEmail = ref(emailStorage.get() || '')
  watch(unverifiedEmail, (newEmail) => {
    emailStorage.set(newEmail)
  })

  const isAuthenticated = ref(false)
  const sessionExpiresAt = ref<number | null>(null)

  const flows = ref<AllAuthFlowItem[]>([])
  const flowIds = computed(() => flows.value.map((flow) => flow.id))

  const inEmailVerificationFlow = computed(() =>
    flowIds.value.includes('verify_email')
  )
  const inPasswordResetFlow = computed(() =>
    flowIds.value.includes('password_reset')
  )
  const inProviderSignupFlow = computed(() =>
    flowIds.value.includes('provider_signup')
  )

  /**
   * Determines if signing up on the website is available at all.
   * Some organizations will want an admin signing up for their users
   * to be the only way to create an account.
   *
   * Not to be confused with `oAuthProviders.signupEnabled` that tells us if
   * that particular OAuth service can be used to create an account.
   */
  const signupEnabled = ref(false)

  /**
   * An array of OAuth providers that the user can use to authenticate.
   * In some cases, such as with HydroShare, this allows connecting to the provider
   * for data archival instead of direct authentication.
   *
   * This array determines which login with OAuth buttons are available on the login and signup pages.
   */
  const oAuthProviders = ref<OAuthProvider[]>([])

  const login = async () => {
    try {
      Snackbar.success('You have logged in!')
      await router.push({ name: 'Sites' })
    } catch (e) {
      console.log('Failed to fetch user info')
    }
  }

  let loggingOut = false
  async function logout() {
    if (loggingOut) return
    try {
      loggingOut = true
      const response = await api.logout()
      setSession(response)
      await router.push({ name: 'Login' })
    } catch (error) {
      console.error('Error logging out.', error)
    } finally {
      loggingOut = false
    }
  }

  /**
   * Fetches the session variables if there are any and any allowed OAuth methods
   * for this instance of HydroServer.
   */
  async function initializeSession() {
    const [authMethodsResponse, sessionResponse] = await Promise.all([
      api.fetchAuthMethods(),
      api.fetchSession(),
    ])
    oAuthProviders.value = authMethodsResponse.providers
    signupEnabled.value = authMethodsResponse.hydroserverSignupEnabled
    setSession(sessionResponse)
  }

  function setSession(apiResponse: any) {
    const { user } = storeToRefs(useUserStore())

    isAuthenticated.value = apiResponse?.meta?.is_authenticated
    sessionExpiresAt.value = apiResponse?.meta?.session_expires_at
    flows.value = apiResponse?.data?.flows || []
    user.value = apiResponse?.data?.account || new User()
  }

  function checkSessionExpiration() {
    if (
      isAuthenticated.value &&
      sessionExpiresAt.value &&
      Date.now() >= sessionExpiresAt.value
    ) {
      Snackbar.info('Session expired. Please log in again.')
      logout()
    }
  }

  // Check if the session has expired when the user switches to this tab
  // and/or when the browser comes into focus
  window.addEventListener('focus', () => {
    console.log('handleFocus')
    checkSessionExpiration()
  })
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      console.log('handleVisibilityChange')
      checkSessionExpiration()
    }
  })

  return {
    oAuthProviders,
    signupEnabled,
    isAuthenticated,
    inProviderSignupFlow,
    inEmailVerificationFlow,
    flows,
    unverifiedEmail,
    checkSessionExpiration,
    login,
    logout,
    initializeSession,
    setSession,
  }
})

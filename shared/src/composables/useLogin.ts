import { onMounted, ref } from 'vue'
import { Snackbar } from '@shared/utils/notifications'
import { api } from '@shared/services/api'
import { useAuthStore } from '@shared/store/authentication'
import { getOrCreateRouter } from '@shared/router'
import { useUserStore } from '@shared/store/user'
import { useRoute } from 'vue-router'

export function useLogin({ redirectRoute }: { redirectRoute: string }) {
  const { setTokens } = useAuthStore()
  const { setUser } = useUserStore()
  const router = getOrCreateRouter()
  const route = useRoute()

  const email = ref('')
  const password = ref('')
  const form = ref(null)
  const valid = ref(false)
  const loaded = ref(false)

  const login = async (accessToken: string, refreshToken: string) => {
    try {
      setTokens(accessToken, refreshToken)
      const user = await api.fetchUser()
      setUser(user)
      Snackbar.success('You have logged in!')
      await router.push({ name: redirectRoute })
    } catch (e) {
      console.log('Failed to fetch user info')
    }
  }

  const formLogin = async () => {
    if (!valid) return

    try {
      const tokens = await api.login(email.value, password.value)
      login(tokens.access, tokens.refresh)
    } catch (error) {
      console.error('Error logging in.', error)
      if ((error as Error).message === '401') {
        Snackbar.warn('No active account found with the given credentials.')
      }
    }
  }

  const tryOAuthLogin = async () => {
    const accessToken = (route.query.t as string) || ''
    const refreshToken = (route.query.rt as string) || ''
    if (accessToken && refreshToken) await login(accessToken, refreshToken)
  }

  onMounted(async () => {
    await tryOAuthLogin()
    loaded.value = true
  })

  return { email, password, form, valid, loaded, login, formLogin }
}

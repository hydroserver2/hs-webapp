import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getOrCreateRouter } from '../router'
import jwtDecode from 'jwt-decode'

interface JWTPayload {
  exp: number
}

export const useAuthStore = defineStore(
  'authentication',
  () => {
    const accessToken = ref('')
    const refreshToken = ref('')
    const isLoggedIn = computed(() => !!accessToken.value)

    function setTokens(access: string, refresh: string) {
      accessToken.value = access
      refreshToken.value = refresh
    }

    async function logout() {
      try {
        setTokens('', '')
        localStorage.clear()
        const r = getOrCreateRouter()
        r.push({ name: 'Login' })
      } catch (error) {
        console.error('Error logging out.', error)
      }
    }

    function isRefreshTokenExpired() {
      if (!isLoggedIn.value || !refreshToken.value) return false
      try {
        const decodedToken = jwtDecode(refreshToken.value) as JWTPayload
        const currentTime = Date.now() / 1000
        return decodedToken.exp < currentTime
      } catch (e) {
        console.error('Invalid refresh token:', e)
        return true
      }
    }

    return {
      accessToken,
      refreshToken,
      isLoggedIn,
      setTokens,
      logout,
      isRefreshTokenExpired,
    }
  },
  {
    persist: true,
  }
)

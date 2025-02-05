import { api } from '@/services/api'
import { useAuthStore } from '@/store/authentication'
import { Snackbar } from '@/utils/notifications'
import { storeToRefs } from 'pinia'
import { ref, computed, onMounted } from 'vue'

interface ConnectedProvider {
  provider: {
    id: string
    name: string
    flows?: any[]
    client_id?: string
  }
  uid: string
  display?: string
}

export function useHydroShare() {
  const { oAuthProviders } = storeToRefs(useAuthStore())

  const connectedProviders = ref([])
  const isLoaded = ref(false)

  const hydroShareProvider = computed<ConnectedProvider | null>(
    () =>
      connectedProviders.value.find(
        (item: any) => item.provider.id === 'hydroshare'
      ) || null
  )

  const isConnected = computed(() => !!hydroShareProvider.value)

  const isHydroShareConnectionEnabled = computed(() =>
    oAuthProviders.value.some((p) => p.id === 'hydroshare' && p.connectEnabled)
  )

  async function connectHydroShare() {
    const callbackUrl = `${import.meta.env.VITE_APP_PROXY_BASE_URL}/profile`
    api.providerRedirect('hydroshare', callbackUrl, 'connect')
  }

  async function disconnectHydroShare() {
    try {
      if (!hydroShareProvider.value) {
        Snackbar.error('Cannot disconnect: no HydroShare provider found.')
        return
      }

      const providerResponse = await api.deleteProvider(
        'hydroshare',
        hydroShareProvider.value.uid
      )

      connectedProviders.value = providerResponse.data
      Snackbar.info('Your HydroShare account has been disconnected.')
    } catch (error) {
      console.error('Error disconnecting HydroShare account', error)
      Snackbar.error('Error disconnecting HydroShare account')
    }
  }

  onMounted(async () => {
    try {
      const connectedProvidersResponse = await api.fetchConnectedProviders()
      connectedProviders.value = connectedProvidersResponse.data
      isLoaded.value = true
    } catch (error) {
      console.error('Error fetching 3rd party providers', error)
    }
  })

  return {
    isLoaded,
    isConnected,
    isHydroShareConnectionEnabled,
    connectHydroShare,
    disconnectHydroShare,
  }
}

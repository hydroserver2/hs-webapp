import { useAuthStore } from '../store/authentication'
import { JWT_REFRESH } from './api'

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve()
  })
  failedQueue = []
}

export async function handle401(
  method: Function,
  endpoint: string,
  options: any
) {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject })
    })
      .then(() => method(endpoint, options))
      .catch((err) => Promise.reject(err))
  }

  options._retry = true
  isRefreshing = true

  const { logout } = useAuthStore()
  try {
    await refreshAccessToken()
    processQueue(null)
    return method(endpoint, options)
  } catch (error) {
    processQueue(error)
    console.log('Session Expired. Logging out')
    await logout()
    return Promise.reject(error)
  } finally {
    isRefreshing = false
  }
}

async function refreshAccessToken() {
  const { refreshToken, setTokens } = useAuthStore()
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh: refreshToken,
    }),
  }
  const response = await fetch(JWT_REFRESH, options)

  if (response.ok) {
    const data = await response.json()
    setTokens(data.access, data.refresh)
    console.log('access token successfully refreshed')
  } else {
    throw new Error('Session Expired')
  }
}

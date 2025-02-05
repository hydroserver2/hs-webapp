import router from '@/router/router'
import { useAuthStore } from '@/store/authentication'
import { Snackbar } from '@/utils/notifications'
import { storeToRefs } from 'pinia'

export async function responseInterceptor(response: Response): Promise<any> {
  if (response.headers.get('Content-Length') === '0') return null
  const contentType = response.headers.get('content-type') || ''

  if (response.ok) {
    if (contentType?.includes('application/json')) return await response.json()
    else if (contentType?.includes('text/csv')) return await response.blob()
  }

  let errorBody: any = null
  if (contentType.includes('application/json')) {
    try {
      errorBody = await response.json()
    } catch (err) {
      console.error('Failed to parse error JSON:', err)
    }
  }

  // Django AllAuth doesn't consider 401 responses errors.
  // Pass the response to the calling component to handle the AllAuth 'flows'.
  console.log('errorBody', errorBody)
  if (response.status === 401) return errorBody

  console.error('API Response Not OK:', errorBody)
  throw new Error(`${response.status}`)
}

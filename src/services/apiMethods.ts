import { requestInterceptor } from '@/services/requestInterceptor'
import { responseInterceptor } from '@/services/responseInterceptor'
import { Snackbar } from '@/utils/notifications'
import { createPatchObject } from '@/services/createPatchObject'

async function interceptedFetch(endpoint: string, options: any) {
  const opts = requestInterceptor(options)
  try {
    const response = await fetch(endpoint, opts)
    return await responseInterceptor(response)
  } catch (error: any) {
    if (error instanceof TypeError)
      Snackbar.error('Network error. Please check your connection.')
    throw error
  }
}

export const apiMethods = {
  async fetch(endpoint: string, options: any = {}): Promise<any> {
    options.method = 'GET'
    return await interceptedFetch(endpoint, options)
  },
  async patch(
    endpoint: string,
    body: any,
    originalBody: any = null,
    options: any = {}
  ): Promise<any> {
    options.method = 'PATCH'
    options.body = originalBody ? createPatchObject(originalBody, body) : body
    if (Object.keys(options.body).length === 0) return
    return await interceptedFetch(endpoint, options)
  },
  async post(
    endpoint: string,
    body: any = undefined,
    options: any = {}
  ): Promise<any> {
    options.method = 'POST'
    options.body = body
    return await interceptedFetch(endpoint, options)
  },
  async put(
    endpoint: string,
    body: any = undefined,
    options: any = {}
  ): Promise<any> {
    options.method = 'PUT'
    options.body = body
    return await interceptedFetch(endpoint, options)
  },
  async delete(
    endpoint: string,
    body: any = undefined,
    options: any = {}
  ): Promise<any> {
    options.method = 'DELETE'
    options.body = body
    return await interceptedFetch(endpoint, options)
  },
}

import { getCSRFToken } from './getCSRFToken'

/**
 * Intercepts and enhances a request options object.
 *
 * - Adds Django AllAuth 'sessionid' to all requests
 * - Adds CSRF Token to non-GET requests
 * - If a body is present and it's an object, the body is stringified.
 *
 * @param {any} options - The original request options object.
 *
 * @returns {any} The enhanced request options with possible modified headers and body.
 */
export function requestInterceptor(options: any) {
  let headers = options.headers ? { ...options.headers } : {}

  let body: string | undefined = undefined
  if (options.body !== undefined) {
    body =
      typeof options.body === 'string' || options.body instanceof FormData
        ? options.body
        : JSON.stringify(options.body)
  }

  // If non-GET, add CSRF token and JSON headers (unless body is FormData, etc.)
  const method = (options.method || 'GET').toUpperCase()
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    headers['X-CSRFToken'] = getCSRFToken() || ''
  }

  return {
    ...options,
    headers: headers,
    body: body,
    credentials: 'include',
  }
}

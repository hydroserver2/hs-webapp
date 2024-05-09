import { requestInterceptor } from '../requestInterceptor'
import { describe, it, expect } from 'vitest'

describe('requestInterceptor', () => {
  it('adds Authorization header when accessToken is provided', () => {
    const result = requestInterceptor({}, 'test_token')
    expect(result.headers['Authorization']).toBe('Bearer test_token')
  })

  it('keeps string body as is', () => {
    const options = { body: 'test_string' }
    const result = requestInterceptor(options, '')
    expect(result.body).toBe('test_string')
  })

  it('stringifies object body', () => {
    const options = { body: { test: 'value' } }
    const result = requestInterceptor(options, '')
    expect(result.body).toBe('{"test":"value"}')
  })

  it('Preserves unmodified options while updating header and body', () => {
    const options = {
      headers: {
        'Existing-Header': 'Existing-Value',
        Authorization: 'Bearer existing_token',
      },
      body: { key: 'value' },
      method: 'GET',
      credentials: 'include',
    }

    const accessToken = 'new_token'
    const result = requestInterceptor(options, accessToken)

    // Checking modified properties
    expect(result.headers['Authorization']).toBe(`Bearer ${accessToken}`)
    expect(result.body).toBe(JSON.stringify(options.body))

    // Checking properties that shouldn't be changed
    expect(result.headers['Existing-Header']).toBe('Existing-Value')
    expect(result.method).toBe('GET')
    expect(result.credentials).toBe('include')
  })
})

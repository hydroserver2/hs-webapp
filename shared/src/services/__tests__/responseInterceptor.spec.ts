import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest'
import { responseInterceptor, parseResponseBody } from '../responseInterceptor'

const originalConsoleError = console.error

beforeEach(() => {
  // Override console.error with a mock function so console doesn't get cluttered
  console.error = vi.fn()
})

afterEach(() => {
  // Restore the original console.error after each test
  console.error = originalConsoleError
})

describe('parseResponseBody', () => {
  it('returns null for responses with Content-Length of 0', async () => {
    const mockResponse = new Response(null, {
      headers: { 'Content-Length': '0' },
    })
    const result = await parseResponseBody(mockResponse)
    expect(result).toBeNull()
  })

  it('parses JSON response correctly', async () => {
    const mockJson = { key: 'value' }
    const mockResponse = new Response(JSON.stringify(mockJson), {
      headers: { 'Content-Type': 'application/json' },
    })
    const result = await parseResponseBody(mockResponse)
    expect(result).toEqual(mockJson)
  })

  it('returns a blob for CSV responses', async () => {
    const mockCsv = 'header1,header2\nvalue1,value2'
    const mockResponse = new Response(mockCsv, {
      headers: { 'Content-Type': 'text/csv' },
    })
    const result = await parseResponseBody(mockResponse)
    expect(result).toBeInstanceOf(Object)
  })

  it('throws an error for non-OK responses', async () => {
    const mockErrorResponse = new Response(
      JSON.stringify({ error: 'Something went wrong' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    )
    await expect(parseResponseBody(mockErrorResponse)).rejects.toThrow('400')
  })

  it('handles parsing errors gracefully and returns null', async () => {
    const mockResponse = {
      ok: true,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: () => Promise.reject(new Error('Failed to parse')),
    }
    const consoleErrorSpy = vi.spyOn(console, 'error')
    const result = await parseResponseBody(mockResponse as unknown as Response)
    expect(consoleErrorSpy).toHaveBeenCalled()
    expect(result).toBeNull()
    consoleErrorSpy.mockRestore()
  })

  describe('responseInterceptor', () => {
    it('processes a 200 status code response correctly', async () => {
      const mockJsonResponse = { success: true, data: 'Some data' }
      const mockResponse = new Response(JSON.stringify(mockJsonResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })

      const method = () => {}
      const endpoint = 'test/endpoint'
      const options = {}

      const result = await responseInterceptor(
        mockResponse,
        method,
        endpoint,
        options
      )

      expect(result).toEqual(mockJsonResponse)
    })
  })
})

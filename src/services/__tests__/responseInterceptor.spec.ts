import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest'
import { responseInterceptor } from '@/services/responseInterceptor'

const originalConsoleError = console.error

beforeEach(() => {
  // Override console.error with a mock function so console doesn't get cluttered
  console.error = vi.fn()
})

afterEach(() => {
  // Restore the original console.error after each test
  console.error = originalConsoleError
})

describe('responseInterceptor', () => {
  it('processes a 200 status code response correctly', async () => {
    const mockJsonResponse = { success: true, data: 'Some data' }
    const mockResponse = new Response(JSON.stringify(mockJsonResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

    const result = await responseInterceptor(mockResponse)
    expect(result).toEqual(mockJsonResponse)
  })

  it('returns null if the Content-Length is 0', async () => {
    const mockResponse = new Response('', {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': '0',
      },
    })

    const result = await responseInterceptor(mockResponse)
    expect(result).toBeNull()
  })

  it('returns a Blob for CSV content', async () => {
    const csvData = 'id,name\n1,John\n2,Jane'
    const mockResponse = new Response(csvData, {
      status: 200,
      headers: { 'Content-Type': 'text/csv' },
    })

    const result = await responseInterceptor(mockResponse)
    const textContent = await (result as Blob).text()
    expect(textContent).toBe(csvData)
  })

  it('returns errorBody for 401 status code without throwing', async () => {
    const errorJson = { error: 'Unauthorized' }
    const mockResponse = new Response(JSON.stringify(errorJson), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })

    const result = await responseInterceptor(mockResponse)
    expect(result).toEqual(errorJson)
    expect(console.error).not.toHaveBeenCalled()
  })

  it('throws an error for non-401 status codes, logs null if non-JSON', async () => {
    const mockResponse = new Response('Error occurred', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    })

    await expect(responseInterceptor(mockResponse)).rejects.toThrow('500')
    expect(console.error).toHaveBeenCalledWith('API Response Not OK:', null)
  })
})

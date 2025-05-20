import { parseApiError } from '@/utils/error-handler'
import { getCurrentUserAccessToken } from '@/utils/supabase'

/**
 * API Client for making HTTP requests
 * Handles authentication and error handling consistently
 */
class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = import.meta.env.VITE_BASE_API_URL || ''
  }

  /**
   * Get authentication headers for API requests
   */
  private async getAuthHeaders(): Promise<HeadersInit> {
    const accessToken = await getCurrentUserAccessToken()
    return {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: '*/*',
    }
  }

  /**
   * Make a GET request to the API
   * @param endpoint - API endpoint
   * @returns Promise with the response data
   */
  async get<T>(endpoint: string): Promise<T> {
    const headers = await this.getAuthHeaders()

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      throw await parseApiError(response)
    }

    return response.json() as Promise<T>
  }

  /**
   * Make a POST request to the API
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @returns Promise with the response data
   */
  async post<T>(endpoint: string, data: any): Promise<T> {
    const headers = await this.getAuthHeaders()

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw await parseApiError(response)
    }

    return response.json() as Promise<T>
  }

  /**
   * Make a PUT request to the API
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @returns Promise with the response data
   */
  async put<T>(endpoint: string, data: any): Promise<T> {
    const headers = await this.getAuthHeaders()

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw await parseApiError(response)
    }

    return response.json() as Promise<T>
  }

  /**
   * Make a DELETE request to the API
   * @param endpoint - API endpoint
   * @returns Promise with boolean indicating success
   */
  async delete(endpoint: string): Promise<boolean> {
    const headers = await this.getAuthHeaders()

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers,
    })

    if (!response.ok) {
      throw await parseApiError(response)
    }

    return true
  }

  /**
   * Make a streaming request to the API
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @returns Promise with the fetch response for streaming
   */
  async stream(endpoint: string, data: any): Promise<Response> {
    const accessToken = await getCurrentUserAccessToken()
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      Authorization: `Bearer ${accessToken}`,
    }

    return fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
  }
}

// Export a singleton instance
export const apiClient = new ApiClient()

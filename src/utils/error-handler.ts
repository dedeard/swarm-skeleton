/**
 * Error Handler Utility
 * Provides consistent error handling throughout the application
 */

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Authentication Error class
 */
export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

/**
 * Handle API errors consistently
 * @param error - The error object
 * @param fallbackMessage - Fallback message if error doesn't have a message
 */
export function handleApiError(error: unknown, fallbackMessage = 'An unexpected error occurred'): string {
  // Log the error for debugging
  console.error('API Error:', error)

  // Return appropriate error message
  if (error instanceof ApiError) {
    return `Error (${error.status}): ${error.message}`
  } else if (error instanceof Error) {
    return error.message
  } else {
    return fallbackMessage
  }
}

/**
 * Parse error from API response
 * @param response - Fetch Response object
 * @returns Promise that resolves to ApiError
 */
export async function parseApiError(response: Response): Promise<ApiError> {
  let errorMessage: string

  try {
    // Try to parse error as JSON
    const errorData = await response.json()
    errorMessage = errorData.message || errorData.error || `Error ${response.status}: ${response.statusText}`
  } catch (e) {
    // If JSON parsing fails, use status text
    errorMessage = `Error ${response.status}: ${response.statusText}`
  }

  return new ApiError(errorMessage, response.status)
}

/**
 * Check if error is an authentication error
 * @param error - The error to check
 * @returns Boolean indicating if it's an auth error
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 401 || error.status === 403
  }
  return false
}

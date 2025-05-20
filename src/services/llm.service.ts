import { apiClient } from './api-client'

/**
 * LLM Service
 * Handles all LLM-related API requests
 */

/**
 * Interface for LLM response
 */
export interface LLMResponse {
  available_models: string[]
}

/**
 * Get all available LLM models
 * @returns Promise with available models
 */
export const getLLMs = async (): Promise<LLMResponse> => {
  return apiClient.get<LLMResponse>('/get-llms')
}

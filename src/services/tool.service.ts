import { ITool } from '@/types/tool'
import { apiClient } from './api-client'

/**
 * Tool Service
 * Handles all tool-related API requests
 */

/**
 * Get all tools
 * @returns Promise with array of tools
 */
export const getTools = async (): Promise<ITool[]> => {
  return apiClient.get<ITool[]>('/tools')
}

/**
 * Get a specific tool by ID
 * @param toolId - ID of the tool to retrieve
 * @returns Promise with tool data
 */
export const getTool = async (toolId: string): Promise<ITool> => {
  return apiClient.get<ITool>(`/tools/${toolId}`)
}

/**
 * Create a new tool
 * @param payload - Tool data to create
 * @returns Promise with the created tool
 */
export const createTool = async (payload: Partial<ITool>): Promise<ITool> => {
  return apiClient.post<ITool>('/tools', payload)
}

/**
 * Update an existing tool
 * @param toolId - ID of the tool to update
 * @param payload - Updated tool data
 * @returns Promise with the updated tool
 */
export const updateTool = async (toolId: string, payload: Partial<ITool>): Promise<ITool> => {
  return apiClient.put<ITool>(`/tools/${toolId}`, payload)
}

/**
 * Delete a tool
 * @param toolId - ID of the tool to delete
 * @returns Promise with boolean indicating success
 */
export const deleteTool = async (toolId: string): Promise<boolean> => {
  return apiClient.delete(`/tools/${toolId}`)
}

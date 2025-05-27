import {
  IAgent,
  IAgentLog,
  IAgentPayload,
  IAutofillResponse,
  IAvailableFieldInfo,
  IKeywordsResponse,
  IMultiAgentParseData,
} from '@/types/agent'
import { ITool } from '@/types/tool'
import { apiClient } from './api-client'

/**
 * Agent Service
 * Handles all agent-related API requests
 */

/**
 * Get all agents
 * @returns Promise with array of agents
 */
export const getAgents = async (): Promise<IAgent[]> => {
  return apiClient.get<IAgent[]>('/agents')
}

/**
 * Get a specific agent by ID
 * @param agentId - ID of the agent to retrieve
 * @returns Promise with agent data
 */
export const getAgent = async (agentId: string): Promise<IAgent> => {
  return apiClient.get<IAgent>(`/agents/${agentId}`)
}

/**
 * Create a new agent
 * @param payload - Agent data to create
 * @returns Promise with the created agent
 */
export const createAgent = async (payload: IAgentPayload): Promise<IAgent> => {
  return apiClient.post<IAgent>('/agents', payload)
}

/**
 * Update an existing agent
 * @param agentId - ID of the agent to update
 * @param payload - Updated agent data
 * @returns Promise with the updated agent
 */
export const updateAgent = async (agentId: string, payload: IAgentPayload): Promise<IAgent> => {
  return apiClient.put<IAgent>(`/agents/${agentId}`, payload)
}

/**
 * Delete an agent
 * @param agentId - ID of the agent to delete
 * @returns Promise with boolean indicating success
 */
export const deleteAgent = async (agentId: string): Promise<boolean> => {
  return apiClient.delete(`/agents/${agentId}`)
}

/**
 * Invoke an agent with streaming response
 * @param agentId - ID of the agent to invoke
 * @param payload - Data to send to the agent
 * @returns Promise with fetch response for streaming
 */
export const invokeStream = async (agentId: string, payload: any): Promise<Response> => {
  return apiClient.stream(`/agent-invoke/${agentId}/invoke-stream`, payload)
}

/**
 * Get logs for a specific agent
 * @param agentId - ID of the agent to get logs for
 * @returns Promise with agent logs
 */
export const getAgentLogs = async (agentId: string): Promise<IAgentLog> => {
  return apiClient.get<IAgentLog>(`/agent-logs/${agentId}`)
}

/**
 * Invoke an agent with streaming response for field autofill
 * @param payload - Data to send to the agent for field autofill
 * @returns Promise with fetch response for streaming
 */
export const invokeAutofillAgentStyle = async (payload: any): Promise<Response> => {
  return apiClient.stream(`/agent-field-autofill/invoke`, payload)
}

/**
 * Get agent by name
 * @param name - Name of the agent to retrieve
 * @returns Promise with agent data
 */
export const parseUserInputStream = async (payload: any): Promise<Response> => {
  return apiClient.stream(`/user-input/parse-stream`, payload)
}

// src/services/agent.service.ts (Additions/Modifications)
// ... (existing imports and functions)
// import { IAvailableFieldInfo, ITool, IMultiAgentParseData, IKeywordsResponse, IAutofillResponse } from '@/types/agentCreator'; // Adjust path

/**
 * Get available tools for agent creation
 * @param companyId - Optional company ID to filter tools
 * @returns Promise with array of tools
 */
export const getAvailableCreatorTools = async (companyId?: string): Promise<ITool[]> => {
  const endpoint = companyId ? `/tools?company_id=${companyId}` : '/tools'
  return apiClient.get<ITool[]>(endpoint)
}

/**
 * Get field metadata for agent creation
 * @returns Promise with field metadata
 */
export const getAgentFieldMetadata = async (): Promise<IAvailableFieldInfo> => {
  // The JS code tries '/user-input/field-metadata' first.
  // This implementation assumes a single endpoint or you can replicate the fallback.
  try {
    return await apiClient.get<IAvailableFieldInfo>('/user-input/field-metadata')
  } catch (error) {
    console.warn('Failed to fetch consolidated field metadata, attempting fallback or returning empty.', error)
    // Implement fallback if necessary, or return a default structure
    return { fields: [], descriptions: {} }
  }
}

/**
 * Parse user input for multi-agent creation
 * @param payload - User input, model settings, existing data
 * @returns Promise with parsed multi-agent data
 */
export const parseMultiAgentInput = async (payload: {
  user_input: string
  model_name: string
  temperature: number
  existing_data?: Partial<IAgentPayload>
}): Promise<IMultiAgentParseData> => {
  return apiClient.post<IMultiAgentParseData>('/user-input/parse-multi-agent', payload)
}

/**
 * Autofill an agent field (e.g., tools, or MCPHub recommendations)
 * @param payload - Field name, JSON field data, existing value, etc.
 * @returns Promise with autofill response
 */
export const autofillAgentField = async (payload: {
  field_name: string
  json_field: any // e.g., { keywords: string[], agent_name?: string, description?: string }
  existing_field_value?: string | string[]
  available_tools?: ITool[] // May not be needed if backend fetches all
  return_tool_ids?: boolean
}): Promise<IAutofillResponse> => {
  return apiClient.post<IAutofillResponse>('/agent-creator-autofill/invoke', payload)
}

/**
 * Extract keywords from agent name and description
 * @param payload - Agent name, description, model settings
 * @returns Promise with extracted keywords
 */
export const extractAgentKeywords = async (payload: {
  agent_name: string
  description: string
  model_name: string
  temperature: number
}): Promise<IKeywordsResponse> => {
  return apiClient.post<IKeywordsResponse>('/user-input/extract-keywords', payload)
}

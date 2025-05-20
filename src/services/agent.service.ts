import { IAgent, IAgentLog, IAgentPayload } from '@/types/agent'
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

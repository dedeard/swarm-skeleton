import { createAgent, deleteAgent, getAgent, getAgents, updateAgent } from '@/services/agent.service'
import { IAgent, IAgentPayload } from '@/types/agent'
import { mountStoreDevtool } from '@/utils/mount-store-devtool'
import { create } from 'zustand'

interface AgentState {
  // State
  agents: IAgent[]
  agentsLoaded: boolean

  // Actions
  fetchAgents: () => Promise<void>
  fetchAgentById: (agentId: string) => Promise<IAgent | undefined>
  addAgent: (payload: IAgentPayload) => Promise<void>
  editAgent: (agentId: string, payload: IAgentPayload) => Promise<void>
  removeAgent: (agentId: string) => Promise<void>
}

export const useAgentStore = create<AgentState>()((set) => ({
  // Initial state
  agents: [],
  agentsLoaded: false,

  // Actions
  fetchAgents: async () => {
    try {
      const agents = await getAgents()
      set({ agents, agentsLoaded: true })
    } catch (error) {
      console.error('Failed to fetch agents:', error)
    }
  },

  fetchAgentById: async (agentId: string) => {
    try {
      return await getAgent(agentId)
    } catch (error) {
      console.error(`Failed to fetch agent ${agentId}:`, error)
      return undefined
    }
  },

  addAgent: async (payload: IAgentPayload) => {
    try {
      const newAgent = await createAgent(payload)
      set((state) => ({
        agents: [...state.agents, newAgent],
      }))
    } catch (error) {
      console.error('Failed to create agent:', error)
    }
  },

  editAgent: async (agentId: string, payload: IAgentPayload) => {
    try {
      const updatedAgent = await updateAgent(agentId, payload)
      set((state) => ({
        agents: state.agents.map((agent) => (agent.agent_id === agentId ? updatedAgent : agent)),
      }))
    } catch (error) {
      console.error(`Failed to update agent ${agentId}:`, error)
    }
  },

  removeAgent: async (agentId: string) => {
    try {
      await deleteAgent(agentId)
      set((state) => ({
        agents: state.agents.filter((agent) => agent.agent_id !== agentId),
      }))
    } catch (error) {
      console.error(`Failed to delete agent ${agentId}:`, error)
    }
  },
}))

if (import.meta.env.DEV) {
  mountStoreDevtool('agent.store', useAgentStore)
}

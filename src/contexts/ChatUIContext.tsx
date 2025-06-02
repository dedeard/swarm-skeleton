import { useAgentStore } from '@/store/agent.store'
import { IAgent } from '@/types/agent'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

// Define the maximum number of concurrently open agents
const MAX_OPEN_AGENTS = 4

interface ChatUIContextType {
  agents: IAgent[]
  activeIndex?: number
  active?: IAgent
  closeByIndex: (index: number) => void
}

const ChatUIContext = createContext<ChatUIContextType | undefined>(undefined)

export const ChatUIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const agentStore = useAgentStore()
  const [agents, setAgents] = useState<IAgent[]>([])
  const [activeIndex, setActiveIndex] = useState<number>()
  const [searchParam] = useSearchParams()
  const navigate = useNavigate()

  const agentId = searchParam.get('agent')

  // Effect to sync agents with the URL search parameter
  useEffect(() => {
    // Check if the agent is already in the active list. If so, just set it as active.
    const existingAgentIndex = agents.findIndex((agent) => agent.agent_id === agentId)
    if (existingAgentIndex !== -1) {
      if (activeIndex !== existingAgentIndex) {
        setActiveIndex(existingAgentIndex)
      }
      return
    }

    // Find the agent from the global store to add it to the active list.
    const agentToAdd = agentStore.agents.find((agent: IAgent) => agent.agent_id === agentId)
    if (agentToAdd) {
      setAgents((prevAgents) => {
        let nextAgents = [...prevAgents]

        // *** NEW: Enforce the maximum agent limit ***
        // If the list is full, remove the oldest agent (the one at the beginning of the array).
        if (nextAgents.length >= MAX_OPEN_AGENTS) {
          nextAgents.shift() // Removes the first element from the array
        }

        // Add the new agent to the end of the list.
        nextAgents.push(agentToAdd)

        // Set the newly added agent as the active one.
        setActiveIndex(nextAgents.length - 1)

        return nextAgents
      })
    }
    // Optional: Handle case where agentId from URL is not found in the store
    // else { navigate('/') }
  }, [agents, activeIndex, agentStore.agents, agentId])

  const active = useMemo(() => {
    return activeIndex !== undefined ? agents[activeIndex] : undefined
  }, [agents, activeIndex])

  const closeByIndex = (indexToClose: number) => {
    const nextAgents = agents.filter((_, index) => index !== indexToClose)
    const closingAgent = agents[indexToClose]

    if (nextAgents.length === 0) {
      setActiveIndex(undefined)
      navigate('/')
      setAgents([])
      return
    }

    if (closingAgent.agent_id === active?.agent_id) {
      const newActiveIndex = Math.max(0, indexToClose - 1)
      const newActiveAgent = nextAgents[newActiveIndex]
      setActiveIndex(newActiveIndex)
      navigate(`/?agent=${newActiveAgent.agent_id}`)
    } else {
      const currentActiveId = active?.agent_id
      const newActiveIndex = nextAgents.findIndex((agent) => agent.agent_id === currentActiveId)
      setActiveIndex(newActiveIndex)
    }

    setAgents(nextAgents)
  }

  return <ChatUIContext.Provider value={{ agents, activeIndex, active, closeByIndex }}>{children}</ChatUIContext.Provider>
}

export const useChatUIContext = () => {
  const context = useContext(ChatUIContext)
  if (!context) {
    throw new Error('useChatUIContext must be used within a ChatProvider')
  }
  return context
}

import { getAgentLogs } from '@/services/agent.service'
import { useAgentStore } from '@/store/agent.store'
import { useToolStore } from '@/store/tool.store'
import { IAgent, IAgentLog, IChatMessage, IThreadPreview } from '@/types/agent'
import { getMessagesByThreadId, getThreadListPreview } from '@/utils/agent-log-extractor'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

interface ChatContextType {
  agent: IAgent | null
  messages: IChatMessage[]
  threads: IThreadPreview[]
  threadId: string
  loading: boolean
  refresh: (agentId: string, threadId?: string) => Promise<void>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const agentStore = useAgentStore()
  const toolStore = useToolStore()
  const [agent, setAgent] = useState<IAgent | null>(null)
  const [messages, setMessages] = useState<IChatMessage[]>([])
  const [threads, setThreads] = useState<IThreadPreview[]>([])
  const [threadId, setThreadId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [searchParams] = useSearchParams()
  const prevAgentIdRef = useRef<string | null>(null)

  const refresh = async (agentId: string, threadIdParam?: string) => {
    setLoading(true)
    let agentLog: IAgentLog | null = null
    let threadIdValue = threadIdParam || crypto.randomUUID()

    if (agentId) {
      try {
        agentLog = await getAgentLogs(agentId)
      } catch (error) {
        console.error(`Failed to fetch agent logs for agentId: ${agentId}`, error)
      }
    }

    const threadsList: IThreadPreview[] = agentLog ? getThreadListPreview(agentLog) : []
    const messagesList = (agentLog && threadIdValue && getMessagesByThreadId(agentLog, threadIdValue)) || []

    const dataFetchPromises = []
    if (!agentStore.agentsLoaded || agentStore.agents.length === 0) {
      dataFetchPromises.push(agentStore.fetchAgents())
    }
    if (!toolStore.toolsLoaded || toolStore.tools.length === 0) {
      dataFetchPromises.push(toolStore.fetchTools())
    }

    if (dataFetchPromises.length > 0) {
      try {
        await Promise.all(dataFetchPromises)
      } catch (error) {
        console.error('Failed to fetch initial store data:', error)
      }
    }

    const currentAgents = useAgentStore.getState().agents
    const selectedAgent = currentAgents.find((a) => a.agent_id === agentId) || null

    setAgent(selectedAgent)
    setMessages(messagesList)
    setThreads(threadsList)
    setThreadId(threadIdValue)
    setLoading(false)
  }

  useEffect(() => {
    const currentAgentId = searchParams.get('agent') || ''
    const threadIdParam = searchParams.get('thread') || undefined

    if (currentAgentId && currentAgentId !== prevAgentIdRef.current) {
      refresh(currentAgentId, threadIdParam)
      prevAgentIdRef.current = currentAgentId
    } else if (!currentAgentId && prevAgentIdRef.current) {
      setAgent(null)
      setMessages([])
      setThreads([])
      setThreadId('')
      prevAgentIdRef.current = null
    }
  }, [searchParams])

  return <ChatContext.Provider value={{ agent, messages, threads, threadId, loading, refresh }}>{children}</ChatContext.Provider>
}

export const useChatContext = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}

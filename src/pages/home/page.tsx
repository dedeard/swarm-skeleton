import { getAgentLogs } from '@/services/agent.service'
import { useAgentStore } from '@/store/agent.store'
import { useToolStore } from '@/store/tool.store'
import { IAgent, IAgentLog, IChatMessage, IThreadPreview } from '@/types/agent'
import { getMessagesByThreadId, getThreadListPreview } from '@/utils/agent-log-extractor'
import React from 'react'
import { LoaderFunction, Outlet, useLoaderData } from 'react-router-dom'
import ChatWrapper from './components/ChatWrapper'
import Navbar from './components/Navbar'

export interface ChatPageData {
  agent?: IAgent
  threads: IThreadPreview[]
  messages: IChatMessage[]
  threadId: string
}

export const ChatPage: React.FC = () => {
  const props = useLoaderData() as ChatPageData

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-50"
        style={{
          backgroundImage: `
      radial-gradient(circle at 20% 80%, rgba(0, 90, 45, 0.2) 0%, transparent 60%),
      radial-gradient(circle at 80% 20%, rgba(0, 60, 30, 0.15) 0%, transparent 70%)`,
        }}
      />

      <Outlet />
      <Navbar />

      <ChatWrapper {...props} />
    </>
  )
}

export const loader: LoaderFunction = async (loaderContext) => {
  const url = new URL(loaderContext.request.url)
  const agentId = url.searchParams.get('agent') || ''
  const threadId = url.searchParams.get('thread') || crypto.randomUUID()

  const agentStore = useAgentStore.getState()
  const toolStore = useToolStore.getState()

  let agentLog: IAgentLog | null = null
  if (agentId) {
    try {
      agentLog = await getAgentLogs(agentId)
    } catch (error) {
      console.error(`Failed to fetch agent logs for agentId: ${agentId}`, error)
    }
  }

  const threads: IThreadPreview[] = agentLog ? getThreadListPreview(agentLog) : []
  const messages = (agentLog && threadId && getMessagesByThreadId(agentLog, threadId)) || []

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
  const selectedAgent = currentAgents.find((a) => a.agent_id === agentId)

  return { agent: selectedAgent || null, messages, threads, threadId }
}

export const Component = ChatPage

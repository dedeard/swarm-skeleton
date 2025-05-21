import { getAgentLogs, invokeStream } from '@/services/agent.service'
import { useAgentStore } from '@/store/agent.store'
import { IAgent, IAgentLog, IChatMessage, IThreadPreview } from '@/types/agent' // Ensure IChatMessage role type supports 'agent'
import { getMessagesByThreadId, getThreadListPreview } from '@/utils/agent-log-extractor'
import { parseSSEMessage } from '@/utils/parseSSEMessage'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

interface ChatContextType {
  agent: IAgent | null
  agentLog: IAgentLog | null
  historicalMessages: IChatMessage[]
  threads: IThreadPreview[]
  activeThreadId: string
  loading: boolean // For agent/log fetching

  localChats: IChatMessage[]
  streamMessage: string
  status: string
  isSendingMessage: boolean
  handleSendMessage: (message: string) => Promise<void>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const agentStore = useAgentStore()

  const [agent, setAgent] = useState<IAgent | null>(null)
  const [agentLog, setAgentLog] = useState<IAgentLog | null>(null)
  const [historicalMessages, setHistoricalMessages] = useState<IChatMessage[]>([])
  const [threads, setThreads] = useState<IThreadPreview[]>([])
  const [activeThreadId, setActiveThreadId] = useState<string>('')
  const [loadingAgent, setLoadingAgent] = useState<boolean>(false)
  const [loadingMessagesOrThread, setLoadingMessagesOrThread] = useState<boolean>(false)

  const [streamMessage, setStreamMessage] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false)
  const [localChats, setLocalChats] = useState<IChatMessage[]>([])

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const currentAgentIdFromUrl = searchParams.get('agent') || ''
  const currentThreadIdFromUrl = searchParams.get('thread')

  useEffect(() => {
    if (!currentAgentIdFromUrl) {
      setAgent(null)
      setAgentLog(null)
      setThreads([])
      setHistoricalMessages([])
      setLocalChats([])
      setActiveThreadId('')
      setLoadingAgent(false)
      setLoadingMessagesOrThread(false)
      return
    }

    const fetchAgentBaseData = async () => {
      setLoadingAgent(true)
      setAgent(null)
      setAgentLog(null)
      // setThreads([]) // Retain optimistic threads until new log data is confirmed
      setHistoricalMessages([])
      setLocalChats([])
      setActiveThreadId('')

      try {
        await agentStore.fetchAgents()
        const foundAgent = agentStore.agents.find((a) => a.agent_id === currentAgentIdFromUrl)

        if (foundAgent) {
          setAgent(foundAgent)
          const fetchedLog = await getAgentLogs(currentAgentIdFromUrl)
          setAgentLog(fetchedLog)
          const newThreadsFromLog = fetchedLog ? getThreadListPreview(fetchedLog) : []
          setThreads(newThreadsFromLog.reverse()) // This will overwrite optimistic if not yet in log
        } else {
          setAgent(null)
          setAgentLog(null)
          setThreads([])
        }
      } catch {
        setAgent(null)
        setAgentLog(null)
        setThreads([])
      } finally {
        setLoadingAgent(false)
      }
    }

    fetchAgentBaseData()
  }, [currentAgentIdFromUrl, agentStore])

  useEffect(() => {
    if (loadingAgent || !currentAgentIdFromUrl) {
      if (!currentAgentIdFromUrl && !loadingAgent) {
        setActiveThreadId('')
        setHistoricalMessages([])
        setLocalChats([])
      }
      setLoadingMessagesOrThread(false)
      return
    }

    if (!agentLog && currentAgentIdFromUrl) {
      setLoadingMessagesOrThread(true)
      return
    }

    if (currentThreadIdFromUrl) {
      setLoadingMessagesOrThread(true)

      if (activeThreadId !== currentThreadIdFromUrl) {
        setActiveThreadId(currentThreadIdFromUrl)
      }

      const specifiedThreadExistsInKnownLogs = threads.some((t) => t.thread_id === currentThreadIdFromUrl)
      let messagesForThread: IChatMessage[] = []

      if (specifiedThreadExistsInKnownLogs && agentLog) {
        messagesForThread = getMessagesByThreadId(agentLog, currentThreadIdFromUrl) || []
      } else if (agentLog === null && !specifiedThreadExistsInKnownLogs && threads.some((t) => t.thread_id === currentThreadIdFromUrl)) {
        messagesForThread = []
      }

      setHistoricalMessages(messagesForThread)
      setLocalChats(messagesForThread)
      setLoadingMessagesOrThread(false)
    } else {
      setLoadingMessagesOrThread(true)
      const newClientGeneratedUUID = crypto.randomUUID()
      navigate(`?agent=${currentAgentIdFromUrl}&thread=${newClientGeneratedUUID}`, { replace: true })
    }
  }, [loadingAgent, currentAgentIdFromUrl, currentThreadIdFromUrl, threads, agentLog, navigate, activeThreadId])

  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || !agent) {
        if (!agent) setStatus('Error: Agent not loaded.')
        return
      }
      if (!activeThreadId) {
        setStatus('Error: No active thread selected or identified.')
        return
      }

      setIsSendingMessage(true)
      setStatus('Processing...')
      const userMessage: IChatMessage = { role: 'user', content: message, timestamp: new Date().toISOString() }

      const isNewThread = !threads.some((t) => t.thread_id === activeThreadId)
      if (isNewThread) {
        const newThreadPreview: IThreadPreview = {
          thread_id: activeThreadId,
          message_count: 1,
          first_message_timestamp: userMessage.timestamp,
          last_message_timestamp: userMessage.timestamp,
          first_message_snippet: userMessage.content.substring(0, 100),
          last_message_snippet: userMessage.content.substring(0, 100),
        }
        setThreads((prevThreads) => [newThreadPreview, ...prevThreads])
      }

      await new Promise((resolve) => setTimeout(resolve, 100))

      setLocalChats((prevChats) => [...prevChats, userMessage])

      setStreamMessage('')
      let finalAnswerHasBeenReceived = false

      const requestPayload = {
        input: { messages: message, context: 'info' },
        config: { configurable: { thread_id: activeThreadId } },
        metadata: {
          model_name: 'anthropic/claude-3.5-sonnet',
          reset_memory: false,
          load_from_json: true,
          agent_style: agent.agent_style || 'default',
        },
        agent_config: agent,
      }

      try {
        const response = await invokeStream(agent.agent_id, requestPayload)

        if (!response.ok || !response.body) {
          const errorText = await response.text()
          const errorMessageContent = `Sorry, I encountered an error: ${response.statusText || 'Failed to connect'}. Details: ${errorText}`
          setStatus(`Error: ${response.statusText || 'Failed to connect'}`)
          setLocalChats((prevChats) => [...prevChats, { role: 'agent', content: errorMessageContent, timestamp: new Date().toISOString() }])
          setIsSendingMessage(false)
          return
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let accumulatedStream = ''

        while (true) {
          const { value: chunk, done: readerDone } = await reader.read()
          if (readerDone) {
            break
          }

          accumulatedStream += decoder.decode(chunk, { stream: true })
          const sseEventObject = parseSSEMessage(accumulatedStream)
          const eventsToProcess = Array.isArray(sseEventObject) ? sseEventObject : sseEventObject ? [sseEventObject] : []

          for (const eventData of eventsToProcess) {
            if (eventData && eventData.event === 'status' && eventData.data) {
              setStatus(eventData.data.status || '')
              if (eventData.data.status === 'Agent Execution End') {
                setStreamMessage((currentStream) => {
                  if (currentStream.trim()) {
                    setLocalChats((prev) => [...prev, { role: 'agent', content: currentStream, timestamp: new Date().toISOString() }])
                  }
                  return ''
                })
                finalAnswerHasBeenReceived = true
              }
            } else if (eventData && eventData.event === 'token' && eventData.data) {
              if (!finalAnswerHasBeenReceived) {
                setStatus('Responding...')
                setStreamMessage((prev) => prev + eventData.data.token)
              }
            }
          }
          if (eventsToProcess.length > 0 && accumulatedStream.includes('\n\n')) {
            accumulatedStream = accumulatedStream.substring(accumulatedStream.lastIndexOf('\n\n') + 2)
          }
        }

        if (!finalAnswerHasBeenReceived && streamMessage.trim()) {
          setLocalChats((prev) => [...prev, { role: 'agent', content: streamMessage, timestamp: new Date().toISOString() }])
          setStatus('Response complete (stream ended).')
        } else if (finalAnswerHasBeenReceived) {
          setStatus('Response complete.')
        }
      } catch (error) {
        const errorMessageText = error instanceof Error ? error.message : 'An unknown error occurred during streaming.'
        setStatus(`Error: ${errorMessageText}`)
        setLocalChats((prevChats) => [
          ...prevChats,
          { role: 'agent', content: `Sorry, an unexpected error occurred: ${errorMessageText}`, timestamp: new Date().toISOString() },
        ])
      } finally {
        setIsSendingMessage(false)
        if (!finalAnswerHasBeenReceived) {
          setStreamMessage('')
        }
      }
    },
    [agent, activeThreadId, streamMessage, threads],
  )

  const combinedLoading = loadingAgent || loadingMessagesOrThread

  return (
    <ChatContext.Provider
      value={{
        agent,
        agentLog,
        historicalMessages,
        threads,
        activeThreadId,
        loading: combinedLoading,
        localChats,
        streamMessage,
        status,
        isSendingMessage,
        handleSendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}

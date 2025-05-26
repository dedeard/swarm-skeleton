import { DEFAULT_LLM } from '@/config/constants'
import { getAgentLogs, invokeStream } from '@/services/agent.service'
import { useAgentStore } from '@/store/agent.store'
import { IAgent, IAgentLog, IChatMessage, IThreadPreview } from '@/types/agent'
import { getMessagesByThreadId, getThreadListPreview } from '@/utils/agent-log-extractor'
import { parseSSEMessage } from '@/utils/parseSSEMessage'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

interface ChatContextType {
  agent?: IAgent
  agentLog?: IAgentLog | null
  historicalMessages: IChatMessage[]
  threads: IThreadPreview[]
  activeThreadId: string
  loading: boolean

  localChats: IChatMessage[]
  streamMessage: string
  status: string
  isSendingMessage: boolean
  handleSendMessage: (message: string) => Promise<void>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const agentStore = useAgentStore()

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

  const agent = useMemo(
    () => agentStore.agents.find((a) => a.agent_id === currentAgentIdFromUrl),
    [currentAgentIdFromUrl, agentStore.agents],
  )

  useEffect(() => {
    if (!currentAgentIdFromUrl) {
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
      setAgentLog(null)

      try {
        if (agentStore.agents.length === 0) {
          await agentStore.fetchAgents()
        }
        const foundAgent = agentStore.agents.find((a) => a.agent_id === currentAgentIdFromUrl)

        if (foundAgent) {
          const fetchedLog = await getAgentLogs(currentAgentIdFromUrl)
          setAgentLog(fetchedLog) // This can be null if no logs or error
          const newThreadsFromLog = fetchedLog ? getThreadListPreview(fetchedLog) : []
          setThreads(newThreadsFromLog.reverse()) // Results in [] if fetchedLog is null
        } else {
          setAgentLog(null)
          setThreads([])
        }
      } catch (error) {
        console.error('Error fetching agent base data:', error)
        setAgentLog(null)
        setThreads([])
      } finally {
        setLoadingAgent(false)
      }
    }

    fetchAgentBaseData()
  }, [currentAgentIdFromUrl, agentStore])

  useEffect(() => {
    if (!currentAgentIdFromUrl) {
      setLoadingMessagesOrThread(false)
      return
    }

    if (loadingAgent) {
      setLoadingMessagesOrThread(true)
      return
    }
    if (currentThreadIdFromUrl) {
      setLoadingMessagesOrThread(true)

      if (activeThreadId !== currentThreadIdFromUrl) {
        setActiveThreadId(currentThreadIdFromUrl)
      }

      let messagesForThread: IChatMessage[] = []
      if (agentLog) {
        messagesForThread = getMessagesByThreadId(agentLog, currentThreadIdFromUrl) || []
      }
      setHistoricalMessages(messagesForThread)
      setLocalChats(messagesForThread)
      setLoadingMessagesOrThread(false)
    } else {
      setLoadingMessagesOrThread(true)
      const newClientGeneratedUUID = uuidv4()
      setHistoricalMessages([])
      setLocalChats([])
      navigate(`?agent=${currentAgentIdFromUrl}&thread=${newClientGeneratedUUID}`, { replace: true })
    }
  }, [
    currentAgentIdFromUrl,
    currentThreadIdFromUrl,
    loadingAgent,
    agentLog, // Crucial: if this is null, historical messages for any thread become [].
    navigate,
    activeThreadId, // Included because it's read and set.
  ])

  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || !agent) {
        if (!agent) setStatus('Error: Agent not loaded.')
        return
      }
      if (!activeThreadId) {
        setStatus('Error: No active thread. Cannot send message.')
        console.error('handleSendMessage called with no activeThreadId. Agent:', agent)
        return
      }

      setIsSendingMessage(true)
      setStatus('Processing...')
      const userMessage: IChatMessage = { role: 'user', content: message, timestamp: new Date().toISOString() }

      const isNewThreadInUIList = !threads.some((t) => t.thread_id === activeThreadId)
      if (isNewThreadInUIList) {
        const newThreadPreview: IThreadPreview = {
          thread_id: activeThreadId,
          message_count: 1, // Starts with the user's message
          first_message_timestamp: userMessage.timestamp,
          last_message_timestamp: userMessage.timestamp,
          first_message_snippet: userMessage.content.substring(0, 100),
          last_message_snippet: userMessage.content.substring(0, 100),
        }
        setThreads((prevThreads) => [newThreadPreview, ...prevThreads])
      }

      setLocalChats((prevChats) => [...prevChats, userMessage])

      let currentAgentResponseAccumulator = ''
      setStreamMessage('') // Clear previous stream display for the new response
      let finalAnswerHasBeenReceived = false

      const requestPayload = {
        input: { messages: message, context: 'info' }, // Only the current message
        config: { configurable: { thread_id: activeThreadId } }, // Backend uses this for history
        metadata: {
          model_name: DEFAULT_LLM, // Use agent specific model or default
          reset_memory: false, // Backend should manage memory based on thread_id
          load_from_json: true, // Backend should manage history loading based on thread_id
          agent_style: agent.agent_style || 'default',
        },
        agent_config: agent, // Full agent config
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
        let accumulatedSSEBuffer = '' // Buffer for potentially incomplete SSE messages

        while (true) {
          const { value: chunk, done: readerDone } = await reader.read()
          if (readerDone) break

          accumulatedSSEBuffer += decoder.decode(chunk, { stream: true })

          // Process all complete SSE messages in the buffer
          let lastProcessedIndex = -1
          let nextEventIndex = accumulatedSSEBuffer.indexOf('\n\n')

          while (nextEventIndex !== -1) {
            const rawSseMessage = accumulatedSSEBuffer.substring(0, nextEventIndex)
            const eventData = parseSSEMessage(rawSseMessage) // Assuming parseSSEMessage handles a single event string

            if (eventData && eventData.event === 'status' && eventData.data) {
              setStatus(eventData.data.status || '')
              if (eventData.data.status === 'Agent Execution End') {
                finalAnswerHasBeenReceived = true
              }
            } else if (eventData && eventData.event === 'token' && eventData.data) {
              if (!finalAnswerHasBeenReceived) {
                setStatus('Responding...')
                currentAgentResponseAccumulator += eventData.data.token
                setStreamMessage(currentAgentResponseAccumulator)
              }
            }
            lastProcessedIndex = nextEventIndex + 2 // Move past '\n\n'
            nextEventIndex = accumulatedSSEBuffer.indexOf('\n\n', lastProcessedIndex)
          }

          if (lastProcessedIndex !== -1) {
            accumulatedSSEBuffer = accumulatedSSEBuffer.substring(lastProcessedIndex)
          }
        }

        // After stream ends, add the fully accumulated agent message to localChats
        if (currentAgentResponseAccumulator.trim()) {
          setLocalChats((prev) => [
            ...prev,
            { role: 'agent', content: currentAgentResponseAccumulator, timestamp: new Date().toISOString() },
          ])
        }
        setStreamMessage('') // Clear live display area

        if (finalAnswerHasBeenReceived) {
          setStatus('Response complete.')
        } else if (currentAgentResponseAccumulator.trim()) {
          // Stream ended without an "Agent Execution End" status, but we got content
          setStatus('Response stream ended.')
        } else {
          // No content and no explicit end
          setStatus('No response received from agent.')
        }
      } catch (error) {
        const errorMessageText = error instanceof Error ? error.message : 'An unknown error occurred.'
        setStatus(`Error: ${errorMessageText}`)
        // Add any partially streamed message before the error
        if (currentAgentResponseAccumulator.trim()) {
          setLocalChats((prevChats) => [
            ...prevChats,
            { role: 'agent', content: currentAgentResponseAccumulator, timestamp: new Date().toISOString() },
          ])
        }
        setLocalChats((prevChats) => [
          ...prevChats,
          { role: 'agent', content: `Streaming error: ${errorMessageText}`, timestamp: new Date().toISOString() },
        ])
        setStreamMessage('') // Clear stream display on error
      } finally {
        setIsSendingMessage(false)
      }
    },
    [agent, activeThreadId, threads, navigate, agentStore], // Added agentStore as it's used indirectly via agent.default_model
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

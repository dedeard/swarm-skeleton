import ChatMessagesList from '@/components/features/chat/ChatMessagesList'
import ChatInputBar from '@/pages/home/ChatInputBar'
import { invokeStream } from '@/services/chat.service'
import { useAgentStore } from '@/store/agent.store'
import { useLLMStore } from '@/store/llm.store'
import { useToolStore } from '@/store/tool.store'
import { IAgent } from '@/types/agent'
import { IChat } from '@/types/chat'
import { parseSSEMessage } from '@/utils/parseSSEMessage'
import React, { useEffect, useRef, useState } from 'react'
import { LoaderFunction, Outlet, useLoaderData } from 'react-router-dom'
import Navbar from './components/Navbar'

export const ChatPage: React.FC = () => {
  const { agent } = useLoaderData() as { agent: IAgent }
  const [selectedModel, setSelectedModel] = useState('')
  const [streamMessage, setStreamMessage] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [chats, setChats] = useState<IChat[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chats])

  const handleChat = async (message: string) => {
    let finalAnswerReceived = false // Initialize the variable here
    if (!message.trim() || !agent) {
      if (!agent) setStatus('Error: Agent not loaded.')
      return
    }

    setLoading(true)
    setStatus('Processing...')
    const userMessage: IChat = { role: 'user', content: message, timestamp: Date.now() }
    setChats((prevChats) => [...prevChats, userMessage])
    setStreamMessage('')

    const data = {
      input: {
        messages: message,
        context: 'info',
      },
      config: {
        configurable: {
          thread_id: '2',
        },
      },
      metadata: {
        model_name: selectedModel,
        reset_memory: false,
        load_from_json: true,
        agent_style: agent.agent_style,
      },
      agent_config: agent,
    }

    try {
      const response = await invokeStream(agent.agent_id, data)

      if (!response.ok) {
        const errorText = await response.text()
        const errorMessage = `Sorry, I encountered an error: ${response.statusText || 'Failed to connect'}. Details: ${errorText}`
        setStatus(`Error: ${response.statusText || 'Failed to connect'}`)
        setChats((prevChats) => [...prevChats, { role: 'assistant', content: errorMessage, timestamp: Date.now() }])
        setLoading(false)
        return
      }

      const reader = response.body?.getReader()
      if (!reader) {
        setStatus('Error: Could not read response stream.')
        setLoading(false)
        return
      }

      const decoder = new TextDecoder()
      let finalAnswerReceived = false

      while (true) {
        const { value: chunk, done: readerDone } = await reader.read()
        if (readerDone) {
          break
        }

        const decodedChunk = decoder.decode(chunk, { stream: true })
        const parsedMessages = parseSSEMessage(decodedChunk)
        const messagesToProcess = Array.isArray(parsedMessages) ? parsedMessages : [parsedMessages]

        for (const parsedData of messagesToProcess) {
          if (parsedData.event === 'status') {
            setStatus(parsedData.data.status || '')

            if (parsedData.data.status === 'Agent Execution End') {
              setStreamMessage((prev) => {
                setChats((prevChats) => [...prevChats, { role: 'assistant', content: prev, timestamp: Date.now() }])
                return ''
              })
              finalAnswerReceived = true
            }
          } else if (parsedData.event === 'token') {
            if (!finalAnswerReceived) {
              setStatus('Responding...')
              setStreamMessage((prev) => prev + parsedData.data.token)
            }
          }
        }
      }

      if (!finalAnswerReceived && streamMessage.trim() !== '') {
        setChats((prevChats) => [...prevChats, { role: 'assistant', content: streamMessage, timestamp: Date.now() }])
        setStatus('Response complete (stream ended).')
      } else if (finalAnswerReceived) {
        setStatus('Response complete.')
      }
    } catch (error) {
      console.error('Chat stream error:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during streaming.'
      setStatus(`Error: ${errorMessage}`)
      setChats((prevChats) => [
        ...prevChats,
        { role: 'assistant', content: `Sorry, an unexpected error occurred: ${errorMessage}`, timestamp: Date.now() },
      ])
    } finally {
      setLoading(false)
      if (!finalAnswerReceived) setStreamMessage('')
    }
  }

  return (
    <>
      <Outlet />
      <Navbar />
      <div className="flex min-h-screen flex-col bg-white dark:bg-neutral-950">
        <div className="container mx-auto max-w-2xl flex-grow space-y-4 overflow-y-auto px-3 pb-36 pt-20">
          <ChatMessagesList chats={chats} streamMessage={streamMessage} loading={loading} status={status} messagesEndRef={messagesEndRef} />
        </div>
        <div className="fixed bottom-0 left-0 right-0 border-t bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="container mx-auto p-3">
            <ChatInputBar isLoading={loading} onSendMessage={handleChat} selectedModel={selectedModel} onSelectedModel={setSelectedModel} />
          </div>
        </div>
      </div>
    </>
  )
}

export const loader: LoaderFunction = async (ctx) => {
  const agentId = new URL(ctx.request.url).searchParams.get('agent') || ''
  const agentStore = useAgentStore.getState()
  const toolStore = useToolStore.getState()
  const llmStore = useLLMStore.getState()

  const promises = [
    (!agentStore.agentsLoaded || agentStore.agents.length === 0) && agentStore.fetchAgents(),
    (!toolStore.toolsLoaded || toolStore.tools.length === 0) && toolStore.fetchTools(),
    (!llmStore.LLMloaded || llmStore.models.length === 0) && llmStore.fetchLLMs(),
  ].filter(Boolean)

  if (promises.length > 0) {
    await Promise.all(promises)
  }

  const finalAgents = useAgentStore.getState().agents
  const agent = finalAgents.find((a) => a.agent_id === agentId)

  return { agent: agent || null }
}

export const Component = ChatPage

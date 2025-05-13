import MarkdownRenderer from '@/components/features/chat/MarkdownRenderer'
import ChatInputBar from '@/pages/home/ChatInputBar'
import { invokeStream } from '@/services/chat.service'
import { useAgentStore } from '@/store/agent.store'
import { useAuthStore } from '@/store/auth.store'
import { useLLMStore } from '@/store/llm.store'
import { useToolStore } from '@/store/tool.store'
import { IAgent } from '@/types/agent'
import { parseSSEMessage } from '@/utils/parseSSEMessage'
import { Spinner } from '@heroui/spinner'
import React, { useEffect, useRef, useState } from 'react'
import { LoaderFunction, Outlet, useLoaderData } from 'react-router-dom'
import Navbar from './components/Navbar'

interface IChat {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

export const Component: React.FC = () => {
  const { agent } = useLoaderData() as { agent: IAgent }
  const { user } = useAuthStore.getState()
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
  }, [chats, streamMessage])

  const handleChat = async (message: string) => {
    if (!message.trim()) return

    setLoading(true)
    setStatus('Processing...')
    setChats((prevChats) => [...prevChats, { role: 'user', content: message, timestamp: Date.now() }])
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
        setStatus('Error: Could not read response.')
        setLoading(false)
        return
      }

      const decoder = new TextDecoder()
      let accumulatedAssistantMessage = ''
      let finalAnswerReceived = false
      let chunk
      let readerDone

      while (!readerDone) {
        ;({ value: chunk, done: readerDone } = await reader.read())

        const decodedChunk = decoder.decode(chunk, { stream: true })
        const parsedMessages = parseSSEMessage(decodedChunk)
        const messagesToProcess = Array.isArray(parsedMessages) ? parsedMessages : [parsedMessages]

        for (const parsedData of messagesToProcess) {
          if (parsedData.event === 'status') {
            setStatus(parsedData.data.status!)

            if (parsedData.data.final_answer) {
              setStreamMessage('')
              const finalAnswer = parsedData.data.final_answer
              setChats((prevChats) => {
                const lastChat = prevChats[prevChats.length - 1]
                if (lastChat?.role === 'assistant' && lastChat.content === finalAnswer) {
                  return prevChats
                }
                return [...prevChats, { role: 'assistant', content: finalAnswer, timestamp: Date.now() }]
              })

              accumulatedAssistantMessage = finalAnswer
              finalAnswerReceived = true
            }
          } else if (parsedData.event === 'token') {
            if (!finalAnswerReceived) {
              accumulatedAssistantMessage += parsedData.data.token
              setStreamMessage((prev) => prev + parsedData.data.token)
            }
          }
        }

        if (finalAnswerReceived) break
      }

      if (!finalAnswerReceived && accumulatedAssistantMessage.trim() !== '') {
        setChats((prevChats) => {
          const lastChat = prevChats[prevChats.length - 1]
          if (lastChat?.role === 'assistant' && lastChat.content === accumulatedAssistantMessage) {
            return prevChats
          }
          return [...prevChats, { role: 'assistant', content: accumulatedAssistantMessage, timestamp: Date.now() }]
        })
        setStatus('Response complete.')
      }

      setStreamMessage('')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setStatus(`Error: ${errorMessage}`)
      setChats((prevChats) => [
        ...prevChats,
        {
          role: 'assistant',
          content: `Sorry, an unexpected error occurred: ${errorMessage}`,
          timestamp: Date.now(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Outlet />
      <Navbar />
      <div className="flex min-h-screen flex-col">
        <div className="flex-grow space-y-4 overflow-y-auto px-4 pb-36 pt-20">
          <div className="mx-auto w-full max-w-3xl py-4">
            {chats.map((chat, index) => (
              <div
                key={`${chat.timestamp}-${index}`}
                className={`mb-3 flex w-full ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="max-w-[75%] sm:max-w-[70%] md:max-w-[65%]">
                  <div
                    className={`px-4 py-2 ${
                      chat.role === 'user'
                        ? 'rounded-xl bg-primary-600 text-white shadow-md dark:bg-primary-700'
                        : 'text-gray-800 dark:text-gray-100'
                    }`}
                    style={{ wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}
                  >
                    <MarkdownRenderer markdown={chat.content} />
                  </div>
                  <div className={`text-xs ${chat.role === 'user' ? 'text-right' : 'text-left'} mt-1 text-gray-500 dark:text-gray-400`}>
                    {new Date(chat.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-2 flex h-6 items-center">
              {loading && <Spinner size="sm" />}
              {status && <span className="text-sm text-gray-600 dark:text-gray-400">{status}</span>}
            </div>
            {!!streamMessage && (
              <div className="mb-3 flex w-full justify-start">
                <div className="max-w-[75%] sm:max-w-[70%] md:max-w-[65%]">
                  <div
                    className="px-4 py-2 text-gray-800 dark:text-gray-100"
                    style={{ wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}
                  >
                    <MarkdownRenderer markdown={streamMessage} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 backdrop-blur">
          <div className="mx-auto max-w-2xl p-4">
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

  await Promise.all(promises)
  const finalAgents = useAgentStore.getState().agents
  const agent = finalAgents.find((a) => a.agent_id === agentId)

  return { agent: agent || null }
}

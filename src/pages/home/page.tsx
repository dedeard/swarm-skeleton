import ChatInputBar from '@/pages/home/ChatInputBar'
import { invokeStream } from '@/services/chat.service'
import { useAgentStore } from '@/store/agent.store'
import { useAuthStore } from '@/store/auth.store'
import { useLLMStore } from '@/store/llm.store'
import { useToolStore } from '@/store/tool.store'
import { IAgent } from '@/types/agent'
import { parseSSEMessage } from '@/utils/parseSSEMessage'
import { Spinner } from '@heroui/spinner'
import { useEffect, useRef, useState } from 'react'
import { LoaderFunction, Outlet, useLoaderData } from 'react-router-dom'
import Navbar from './components/Navbar'

const LoaderIcon = () => (
  <svg className="h-5 w-5 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
)

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
    setChats((oldChats) => [...oldChats, { role: 'user', content: message, timestamp: Date.now() }])
    setStreamMessage('')

    const data = {
      input: {
        messages: message,
        context: 'info',
      },
      config: {
        configurable: {
          thread_id: '1',
        },
      },
      metadata: {
        model_name: selectedModel,
        reset_memory: false,
        load_from_json: true,
        agent_style: '',
      },
      agent_config: {
        ...agent,
        // user_id: user?.id || '9489c4d4-b30c-41df-a3d7-0062e2848343',
        user_id: '9489c4d4-b30c-41df-a3d7-0062e2848343',
      },
    }

    let accumulatedAssistantMessage = ''

    try {
      const response = await invokeStream(agent.agent_id, data)

      if (!response.ok) {
        const errorText = await response.text()
        setStatus(`Error: ${response.statusText || 'Failed to connect'}`)
        setChats((prevChats) => [
          ...prevChats,
          {
            role: 'assistant',
            content: `Sorry, I encountered an error: ${response.statusText || 'Failed to connect'}. Details: ${errorText}`,
            timestamp: Date.now(),
          },
        ])
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
      let done = false

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone
        const chunk = decoder.decode(value, { stream: true })
        const parsedMessages = parseSSEMessage(chunk)
        const messagesToProcess = Array.isArray(parsedMessages) ? parsedMessages : [parsedMessages]

        for (const parsedData of messagesToProcess) {
          if (parsedData.event === 'status') {
            setStatus(parsedData.data.status!)
            if (parsedData.data.final_answer) {
              if (accumulatedAssistantMessage.trim() === '' || parsedData.data.final_answer !== accumulatedAssistantMessage) {
                setStreamMessage('')
                setChats((prevChats) => {
                  const lastChat = prevChats[prevChats.length - 1]
                  if (lastChat && lastChat.role === 'assistant' && lastChat.content === parsedData.data.final_answer) {
                    return prevChats
                  }
                  return [...prevChats, { role: 'assistant', content: parsedData.data.final_answer!, timestamp: Date.now() }]
                })
                accumulatedAssistantMessage = parsedData.data.final_answer!
              }
              setStatus('Done')
            }
          } else if (parsedData.event === 'token') {
            setStreamMessage((prev) => prev + parsedData.data.token)
            accumulatedAssistantMessage += parsedData.data.token
          } else if (parsedData.event === 'end') {
            if (accumulatedAssistantMessage.trim() !== '') {
              setChats((prevChats) => {
                const lastChat = prevChats[prevChats.length - 1]
                if (lastChat && lastChat.role === 'assistant' && lastChat.content === accumulatedAssistantMessage) {
                  return prevChats
                }
                return [...prevChats, { role: 'assistant', content: accumulatedAssistantMessage, timestamp: Date.now() }]
              })
            }
            setStreamMessage('')
            setStatus('Finished Streaming')
            done = true
            break
          } else if (parsedData.event === 'error') {
            const errorContent = `Stream Error: ${parsedData.data.error || 'Unknown stream error'}`
            setStatus(`Error: ${parsedData.data.error || 'An error occurred during streaming.'}`)
            setChats((prevChats) => [...prevChats, { role: 'assistant', content: errorContent, timestamp: Date.now() }])
            accumulatedAssistantMessage = ''
            setStreamMessage('')
            done = true
            break
          }
        }
      }

      if (done) {
        if (accumulatedAssistantMessage.trim() !== '') {
          setChats((prevChats) => {
            const lastChat = prevChats[prevChats.length - 1]
            if (lastChat && lastChat.role === 'assistant' && lastChat.content === accumulatedAssistantMessage) {
              return prevChats
            }
            return [...prevChats, { role: 'assistant', content: accumulatedAssistantMessage, timestamp: Date.now() }]
          })
        }
        setStreamMessage('')
      }
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`)
      setChats((prevChats) => [
        ...prevChats,
        {
          role: 'assistant',
          content: `Sorry, an unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
      <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-900">
        <div className="flex-grow space-y-4 overflow-y-auto px-4 pb-36 pt-20">
          <div className="mx-auto w-full max-w-3xl">
            {chats.map((chat, index) => (
              <div
                key={`${chat.timestamp}-${index}`}
                className={`mb-3 flex w-full ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="max-w-[75%] sm:max-w-[70%] md:max-w-[65%]">
                  <div
                    className={`px-4 py-2 ${
                      chat.role === 'user'
                        ? 'rounded-xl bg-blue-600 text-white shadow-md dark:bg-blue-700'
                        : 'text-gray-800 dark:text-gray-100'
                    }`}
                    style={{ wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}
                  >
                    {chat.content}
                  </div>
                  <div className={`text-xs ${chat.role === 'user' ? 'text-right' : 'text-left'} mt-1 text-gray-500 dark:text-gray-400`}>
                    {new Date(chat.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-2 flex h-6 items-center">
              {loading && <Spinner size="sm" />}
              {status && !loading && <span className="text-sm text-gray-600 dark:text-gray-400">{status}</span>}
              {status && loading && <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{status}</span>}
            </div>
            {!!streamMessage && (
              <div className="mb-3 flex w-full justify-start">
                <div className="max-w-[75%] sm:max-w-[70%] md:max-w-[65%]">
                  <div
                    className="px-4 py-2 text-gray-800 dark:text-gray-100"
                    style={{ wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}
                  >
                    {streamMessage}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto max-w-2xl p-4">
            <ChatInputBar onSendMessage={handleChat} selectedModel={selectedModel} onSelectedModel={setSelectedModel} />
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
  const promises = []

  if (!agentStore.agentsLoaded || agentStore.agents.length === 0) {
    promises.push(agentStore.fetchAgents())
  }
  if (!toolStore.toolsLoaded || toolStore.tools.length === 0) {
    promises.push(toolStore.fetchTools())
  }
  if (!llmStore.LLMloaded || llmStore.models.length === 0) {
    promises.push(llmStore.fetchLLMs())
  }

  await Promise.all(promises)
  const finalAgents = useAgentStore.getState().agents
  const agent = finalAgents.find((a) => a.agent_id === agentId)

  if (!agent) {
    return { agent: null }
  }
  return { agent }
}

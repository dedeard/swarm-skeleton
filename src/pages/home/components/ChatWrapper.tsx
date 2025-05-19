import ChatInputBar from '@/components/features/chat/ChatInputBar'
import ChatMessagesList from '@/components/features/chat/ChatMessagesList'
import { invokeStream } from '@/services/agent.service'
import { IChatMessage } from '@/types/agent'
import { parseSSEMessage } from '@/utils/parseSSEMessage'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ChatPageData } from '../page'
import ChatSidebar from './ChatSidebar'

const ChatWrapper: React.FC<ChatPageData> = ({ agent, threads, threadId, messages }) => {
  const [streamMessage, setStreamMessage] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [chats, setChats] = useState<IChatMessage[]>([])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [chats, scrollToBottom])

  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || !agent) {
        if (!agent) setStatus('Error: Agent not loaded.')
        return
      }

      setIsLoading(true)
      setStatus('Processing...')
      const userMessage: IChatMessage = { role: 'user', content: message, timestamp: new Date().toISOString() }
      setChats((prevChats) => [...prevChats, userMessage])
      setStreamMessage('')
      let finalAnswerHasBeenReceived = false

      const requestPayload = {
        input: {
          messages: message,
          context: 'info',
        },
        config: {
          configurable: {
            thread_id: threadId,
          },
        },
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
          setChats((prevChats) => [...prevChats, { role: 'assistant', content: errorMessageContent, timestamp: new Date().toISOString() }])
          setIsLoading(false)
          return
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { value: chunk, done: readerDone } = await reader.read()
          if (readerDone) {
            break
          }

          const decodedChunk = decoder.decode(chunk, { stream: true })
          const sseEvents = parseSSEMessage(decodedChunk)
          const eventsToProcess = Array.isArray(sseEvents) ? sseEvents : [sseEvents]

          for (const eventData of eventsToProcess) {
            if (eventData.event === 'status' && eventData.data) {
              setStatus(eventData.data.status || '')
              if (eventData.data.status === 'Agent Execution End') {
                setStreamMessage((currentStream) => {
                  if (currentStream.trim()) {
                    setChats((prev) => [...prev, { role: 'assistant', content: currentStream, timestamp: new Date().toISOString() }])
                    console.log('called')
                  }
                  return ''
                })
                finalAnswerHasBeenReceived = true
              }
            } else if (eventData.event === 'token' && eventData.data) {
              if (!finalAnswerHasBeenReceived) {
                setStatus('Responding...')
                setStreamMessage((prev) => prev + eventData.data.token)
              }
            }
          }
        }

        if (!finalAnswerHasBeenReceived && streamMessage.trim()) {
          setChats((prev) => [...prev, { role: 'assistant', content: streamMessage, timestamp: new Date().toISOString() }])
          setStatus('Response complete (stream ended).')
        } else if (finalAnswerHasBeenReceived) {
          setStatus('Response complete.')
        }
      } catch (error) {
        console.error('Chat stream error:', error)
        const errorMessageText = error instanceof Error ? error.message : 'An unknown error occurred during streaming.'
        setStatus(`Error: ${errorMessageText}`)
        setChats((prevChats) => [
          ...prevChats,
          { role: 'assistant', content: `Sorry, an unexpected error occurred: ${errorMessageText}`, timestamp: new Date().toISOString() },
        ])
      } finally {
        setIsLoading(false)
        if (!finalAnswerHasBeenReceived) {
          setStreamMessage('')
        }
      }
    },
    [agent, threadId, streamMessage],
  )

  useEffect(() => {
    if (Array.isArray(messages) && agent?.agent_id && threadId) {
      setChats(messages)
    }
  }, [Array.isArray(messages), threadId, agent?.agent_id])

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <ChatSidebar agent={agent} threads={threads} />
        <main className="mx-auto flex w-full max-w-2xl flex-grow flex-row space-x-4 overflow-y-auto px-3 pb-36 pt-20">
          <section className="flex-1">
            <div className="container">
              <ChatMessagesList
                chats={chats}
                streamMessage={streamMessage}
                loading={isLoading}
                status={status}
                messagesEndRef={messagesEndRef}
              />
            </div>
          </section>
        </main>
        <footer className="fixed bottom-0 left-[300px] right-0 border-t bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="container mx-auto p-3">
            <ChatInputBar isLoading={isLoading} onSendMessage={handleSendMessage} />
          </div>
        </footer>
      </div>
    </>
  )
}

export default ChatWrapper

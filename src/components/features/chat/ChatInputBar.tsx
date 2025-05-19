import { Globe, Lightbulb, Loader2, Mic, Plus, Send } from 'lucide-react'
import React from 'react'

interface ChatInputBarProps {
  onSendMessage?: (message: string) => void
  disabled?: boolean
  isLoading?: boolean
}

const ChatInputBar: React.FC<ChatInputBarProps> = ({ onSendMessage, disabled, isLoading }) => {
  const [inputValue, setInputValue] = React.useState('')

  const isSendDisabled = disabled || isLoading || !inputValue.trim()
  const isInputDisabled = disabled || isLoading

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value)
    event.target.style.height = 'auto'
    event.target.style.height = `${event.target.scrollHeight}px`
  }

  const handleSend = () => {
    if (!isSendDisabled) {
      onSendMessage?.(inputValue)
      setInputValue('')
      const textarea = document.getElementById('chat-textarea') as HTMLTextAreaElement
      if (textarea) {
        textarea.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <div className="mx-auto w-full max-w-2xl rounded-3xl bg-gray-100 p-3 font-sans shadow-lg transition-colors duration-150 dark:bg-neutral-800">
        <textarea
          id="chat-textarea"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={isLoading ? 'Sending...' : 'Ask anything...'}
          className="custom-scrollbar w-full resize-none overflow-y-auto bg-transparent px-1 py-2 text-sm text-gray-800 placeholder-gray-400 transition-colors duration-150 focus:outline-none dark:text-neutral-200 dark:placeholder-neutral-500 sm:text-base"
          rows={1}
          style={{ lineHeight: '1.5rem' }}
          disabled={isInputDisabled}
        />
        <div className="flex items-end">
          <div className="mr-2 flex flex-wrap items-center space-x-1 pt-1.5 sm:mr-3 sm:space-x-2">
            <button
              aria-label="Add"
              className="rounded-full p-2 text-gray-500 transition-colors duration-150 hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
              disabled={isInputDisabled}
            >
              <Plus size={22} strokeWidth={1.5} />
            </button>
            <button
              aria-label="Browse"
              className="rounded-full p-2 text-gray-500 transition-colors duration-150 hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
              disabled={isInputDisabled}
            >
              <Globe size={22} strokeWidth={1.5} />
            </button>
            <button
              aria-label="Ideas"
              className="hidden rounded-full p-2 text-gray-500 transition-colors duration-150 hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white sm:inline-flex"
              disabled={isInputDisabled}
            >
              <Lightbulb size={22} strokeWidth={1.5} />
            </button>
          </div>
          <div className="ml-auto flex items-end space-x-2">
            <button
              aria-label="Voice input"
              className="mb-0.5 rounded-full p-2 text-gray-500 transition-colors duration-150 hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
              disabled={isInputDisabled}
            >
              <Mic size={22} strokeWidth={1.5} />
            </button>
            <button
              aria-label={isLoading ? 'Sending message' : 'Send message'}
              onClick={handleSend}
              disabled={isSendDisabled}
              className={`flex items-center justify-center rounded-full p-2.5 text-white transition-colors duration-150 sm:p-3 ${
                isLoading
                  ? 'cursor-wait bg-blue-400 dark:bg-blue-600'
                  : isSendDisabled
                    ? 'cursor-not-allowed bg-gray-300 dark:bg-neutral-600'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-offset-neutral-800'
              }`}
            >
              {isLoading ? <Loader2 size={20} strokeWidth={2} className="animate-spin" /> : <Send size={20} strokeWidth={2} />}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatInputBar

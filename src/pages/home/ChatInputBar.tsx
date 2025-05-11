import { Globe, Lightbulb, Mic, Plus, Send } from 'lucide-react'
import React from 'react'
import { LLMmenu } from './components/LLMmenu'

interface ChatInputBarProps {
  selectedModel: string
  onSendMessage?: (message: string) => void
  onSelectedModel: (model: string) => void
  disabled?: boolean
}

const ChatInputBar: React.FC<ChatInputBarProps> = ({ onSendMessage, selectedModel, onSelectedModel, disabled }) => {
  const [inputValue, setInputValue] = React.useState('')

  const isSendDisabled = disabled || !selectedModel || !inputValue.trim()

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
      <div className="mx-auto w-full max-w-2xl rounded-3xl bg-neutral-800 p-3 font-sans shadow-lg">
        <textarea
          id="chat-textarea"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={selectedModel ? 'Ask anything...' : 'Please select a model first'}
          className="custom-scrollbar w-full resize-none overflow-y-auto bg-transparent px-1 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none sm:text-base"
          rows={1}
          style={{ lineHeight: '1.5rem' }}
          disabled={disabled || !selectedModel}
        />
        <div className="flex items-end">
          <div className="mr-2 flex flex-wrap items-center space-x-1 pt-1.5 sm:mr-3 sm:space-x-2">
            <button
              aria-label="Add"
              className="rounded-full p-2 text-neutral-400 transition-colors duration-150 hover:bg-neutral-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={disabled}
            >
              <Plus size={22} strokeWidth={1.5} />
            </button>
            <button
              aria-label="Browse"
              className="rounded-full p-2 text-neutral-400 transition-colors duration-150 hover:bg-neutral-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={disabled}
            >
              <Globe size={22} strokeWidth={1.5} />
            </button>
            <button
              aria-label="Ideas"
              className="hidden rounded-full p-2 text-neutral-400 transition-colors duration-150 hover:bg-neutral-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 sm:inline-flex"
              disabled={disabled}
            >
              <Lightbulb size={22} strokeWidth={1.5} />
            </button>

            <LLMmenu selected={selectedModel} onSelected={onSelectedModel} />
          </div>
          <div className="ml-auto flex items-end space-x-2">
            <button
              aria-label="Voice input"
              className="mb-0.5 rounded-full p-2 text-neutral-400 transition-colors duration-150 hover:bg-neutral-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={disabled || !selectedModel}
            >
              <Mic size={22} strokeWidth={1.5} />
            </button>
            <button
              aria-label="Send message"
              onClick={handleSend}
              disabled={isSendDisabled}
              className={`rounded-full p-2.5 text-neutral-800 transition-colors duration-150 sm:p-3 ${
                isSendDisabled
                  ? 'cursor-not-allowed bg-neutral-500'
                  : 'bg-white hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-800'
              }`}
            >
              <Send size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatInputBar

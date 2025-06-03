import { useChatContext } from '@/contexts/ChatContext'
import { useChatUIContext } from '@/contexts/ChatUIContext'
import { cn } from '@heroui/theme'
import { HomeIcon, MicIcon, SendIcon, UploadIcon, XIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ActionButton from './ActionButton'
import ChatTextArea from './ChatTextArea'
import SubmitButton from './SubmitButton'
import { suggestions } from './suggestions'

const ChatInterface: React.FC = () => {
  const { localChats, isSendingMessage, handleSendMessage } = useChatContext()
  const chatUiStore = useChatUIContext()
  const [isFocus, setIsFocus] = useState(false)

  const [inputValue, setInputValue] = useState('')

  const isSendDisabled = !inputValue.trim()

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleSend = () => {
    const trimmedValue = inputValue.trim()
    if (!isSendDisabled && trimmedValue) {
      handleSendMessage(trimmedValue)
      setInputValue('')
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  const handleChangeFocus = async (isFocus: boolean) => {
    setIsFocus(isFocus)
  }

  const tabsExists = !!chatUiStore.agents.length

  return (
    <div className="px-3">
      <div className="relative top-px mx-auto flex w-full max-w-2xl items-end space-x-1">
        {!!tabsExists && (
          <Link
            to="/"
            className={cn(
              'block rounded-t border border-primary-500/30 bg-black px-3 py-2 text-sm font-semibold uppercase',
              !chatUiStore.active && 'bg-primary-600 text-white',
            )}
          >
            Swarm
          </Link>
        )}
        {chatUiStore.agents.map((agent, i) => (
          <div key={i} className="relative">
            <Link
              to={`/?agent=${agent.agent_id}`}
              className={cn(
                'flex max-w-32 items-center gap-1 rounded-t border border-primary-500/30 px-2 py-1 pr-6 text-xs',
                chatUiStore.activeIndex === i ? 'bg-primary-600' : 'bg-black hover:bg-primary-500/5',
              )}
            >
              <div className="w-4">
                <HomeIcon className="block" size={12} />
              </div>
              <span className="block truncate">{agent.agent_name}</span>
            </Link>
            <button
              onClick={() => chatUiStore.closeByIndex(i)}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 cursor-pointer text-xs hover:text-red-600"
            >
              <XIcon size={12} />
            </button>
          </div>
        ))}
      </div>
      <div
        className={cn(
          !tabsExists && 'rounded-tl-medium',
          'mx-auto flex w-full max-w-2xl flex-col rounded-tr-medium border border-b-0 border-primary-500/30 bg-black pt-3',
        )}
      >
        {isFocus && !inputValue.trim().length && !localChats.length && (
          <div className="grid grid-cols-1 gap-2 p-3 pt-0 md:grid-cols-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onMouseDown={() => handleSuggestionClick(suggestion)}
                className="block w-full rounded-full border border-primary-500/50 bg-primary-500/5 p-2 text-center text-xs transition-colors hover:bg-primary-500/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div className="relative rounded-medium bg-transparent shadow-lg">
          <div className="flex w-full items-end px-3 pt-0">
            <div className="flex h-[50px] items-center gap-3">
              <ActionButton
                ariaLabel="Upload file"
                icon={<UploadIcon size={22} strokeWidth={2} />}
                iconColorClass="text-primary-500"
                hoverIconColorClass="hover:text-primary-600"
              />
            </div>
            <ChatTextArea
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Message SWARM"
              isLoading={isSendingMessage}
              onFocusChange={handleChangeFocus}
            />
            <div className="flex h-[50px] items-center gap-3">
              <ActionButton
                ariaLabel="Voice input"
                icon={<MicIcon size={22} strokeWidth={2} />}
                iconColorClass="text-primary-500"
                hoverIconColorClass="hover:text-primary-600"
              />
              <SubmitButton onClick={handleSend} disabled={isSendDisabled} isLoading={isSendingMessage} SendIcon={SendIcon} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface

import { Loader2Icon, MicIcon, SendIcon, UploadIcon } from 'lucide-react'
import React, { useState } from 'react'
import ActionButton from './ActionButton'
import ChatTextArea from './ChatTextArea'
import SubmitButton from './SubmitButton'
import { suggestions } from './suggestions'

interface ChatInterfaceProps {
  onSendMessage?: (message: string) => void
  disabled?: boolean
  isLoading?: boolean
  showSuggestion?: boolean
  placeholder?: string
  onUploadFile?: () => void
  onVoiceInput?: () => void
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onSendMessage,
  disabled,
  isLoading,
  placeholder = 'Message SWARM',
  showSuggestion,
  onUploadFile,
  onVoiceInput,
}) => {
  const [inputValue, setInputValue] = useState('')

  const isEffectivelyDisabled = disabled || isLoading
  const isSendDisabled = isEffectivelyDisabled || !inputValue.trim()

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value)
  }

  const handleSend = () => {
    const trimmedValue = inputValue.trim()
    if (!isSendDisabled && onSendMessage && trimmedValue) {
      onSendMessage(trimmedValue)
      setInputValue('')
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (!isEffectivelyDisabled) {
      setInputValue(suggestion)
    }
  }

  return (
    <div className="border-t bg-neutral-100 p-3 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
        {!inputValue.trim().length && showSuggestion && (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isEffectivelyDisabled}
                className="block w-full rounded-full border border-primary-500/50 bg-primary-500/5 p-2 text-center text-xs transition-colors hover:bg-primary-500/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-end space-x-2 rounded-2xl border-2 border-primary-600 bg-transparent p-2 shadow-lg">
          {onUploadFile && (
            <ActionButton
              ariaLabel="Upload file"
              icon={<UploadIcon size={22} strokeWidth={2} />}
              onClick={onUploadFile}
              disabled={isEffectivelyDisabled}
              iconColorClass="text-primary-500"
              hoverIconColorClass="hover:text-primary-600"
            />
          )}
          <ChatTextArea
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isEffectivelyDisabled}
            isLoading={isLoading}
          />
          {onVoiceInput && (
            <ActionButton
              ariaLabel="Voice input"
              icon={<MicIcon size={22} strokeWidth={2} />}
              onClick={onVoiceInput}
              disabled={isEffectivelyDisabled}
              iconColorClass="text-primary-500"
              hoverIconColorClass="hover:text-primary-600"
            />
          )}
          <SubmitButton
            onClick={handleSend}
            disabled={isSendDisabled}
            isLoading={isLoading}
            LoadingIcon={Loader2Icon}
            SendIcon={SendIcon}
          />
        </div>
      </div>
    </div>
  )
}

export default ChatInterface

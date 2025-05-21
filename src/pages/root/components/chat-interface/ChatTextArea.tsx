import React, { useEffect, useRef } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'

interface ChatTextAreaProps {
  value: string
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void
  placeholder: string
  disabled?: boolean
  isLoading?: boolean
}

export const ChatTextArea: React.FC<ChatTextAreaProps> = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
  disabled,
  isLoading,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const scrollHeight = textareaRef.current.scrollHeight
      const minHeight = 34
      textareaRef.current.style.height = `${Math.max(scrollHeight, minHeight)}px`
    }
  }, [value])

  return (
    <div className="relative max-h-28 min-h-[34px] flex-grow">
      <PerfectScrollbar
        options={{
          suppressScrollX: true,
        }}
        className="flex h-full max-h-28 w-full items-center"
      >
        <textarea
          ref={textareaRef}
          id="chat-textarea"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={isLoading ? 'Sending...' : placeholder}
          className="min-h-[34px] w-full resize-none bg-transparent text-base text-gray-100 placeholder:text-neutral-400 focus:outline-none"
          rows={1}
          style={{ lineHeight: '1.625rem' }}
          disabled={disabled}
        />
      </PerfectScrollbar>
    </div>
  )
}

export default ChatTextArea
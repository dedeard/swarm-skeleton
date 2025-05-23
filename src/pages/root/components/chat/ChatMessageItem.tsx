import { IChatMessage } from '@/types/agent'
import { cn } from '@heroui/react'
import React, { memo, useMemo } from 'react'
import MarkdownRenderer from './MarkdownRenderer'

interface ChatMessageItemProps {
  chat: IChatMessage
  className?: string
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = memo(({ chat, className }) => {
  const isUser = chat.role === 'user'

  const formattedTime = useMemo(() => {
    return new Date(chat.timestamp).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    })
  }, [chat.timestamp])

  const containerClasses = cn('mb-3 flex w-full', isUser ? 'justify-end' : 'justify-start', className)

  const bubbleClasses = cn(
    'whitespace-pre-wrap break-words px-4 py-2',
    isUser ? 'rounded-xl bg-primary-600 text-white shadow-md dark:bg-primary-700' : 'text-gray-800 dark:text-gray-100',
  )

  const timestampClasses = cn('mt-1 text-xs text-gray-500 dark:text-gray-400', isUser ? 'text-right' : 'text-left')

  return (
    <div className={containerClasses}>
      <div className="max-w-[80%]">
        <div className={bubbleClasses} role="article" aria-label={`${isUser ? 'User' : 'Assistant'} message`}>
          <MarkdownRenderer content={chat.content} />
        </div>
        <div className={timestampClasses}>
          <time dateTime={chat.timestamp} title={new Date(chat.timestamp).toLocaleString()}>
            {formattedTime}
          </time>
        </div>
      </div>
    </div>
  )
})

ChatMessageItem.displayName = 'ChatMessageItem'

export default ChatMessageItem

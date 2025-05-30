import { MarkdownRenderer } from '@/components/ChatMarkdown'
import { IChatMessage } from '@/types/agent'
import { addToast, cn } from '@heroui/react'
import { CheckIcon, ClipboardIcon } from 'lucide-react'
import React, { memo, useMemo, useState } from 'react'

interface ChatMessageItemProps {
  chat: IChatMessage
  className?: string
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = memo(({ chat, className }) => {
  const isUser = chat.role === 'user'
  const [isCopied, setIsCopied] = useState(false)

  const formattedTime = useMemo(() => {
    return new Date(chat.timestamp).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    })
  }, [chat.timestamp])

  const handleCopy = () => {
    // Do nothing if there's no content or clipboard API is not available
    if (!chat.content) {
      addToast({
        title: 'Cannot Copy',
        description: 'There is no content to copy.',
        color: 'warning', // Use 'warning' for non-critical issues like empty content
      })
      return
    }
    if (!navigator.clipboard) {
      addToast({
        title: 'Copy Not Supported',
        description: 'Your browser does not support clipboard operations.',
        color: 'danger',
      })
      return
    }

    navigator.clipboard.writeText(chat.content).then(
      () => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000) // Reset icon after 2 seconds
        addToast({
          title: 'Copied!', // Informative title
          description: 'Message copied to clipboard.', // Clear description
          color: 'success', // Correct color for success
        })
      },
      (err) => {
        console.error('Failed to copy message: ', err) // Log error for debugging
        addToast({
          title: 'Copy Failed', // Informative error title
          description: 'Could not copy message. Please try again.', // User-friendly error message
          color: 'danger', // Correct color for error
        })
      },
    )
  }

  return (
    <div className={cn('mb-6 flex w-full', isUser ? 'justify-end' : 'justify-start', className)}>
      <div className="w-10/12">
        <div
          className={cn(
            'relative whitespace-pre-wrap break-words p-3',
            isUser && 'rounded-medium border border-primary-500/50 bg-primary-500/10',
            !isUser && 'rounded-medium border border-primary-500/40 bg-white dark:bg-black',
          )}
          role="article"
          aria-label={`${isUser ? 'User' : 'Assistant'} message`}
        >
          <MarkdownRenderer content={chat.content} />
          <div
            className={cn(
              'mt-1 text-[10px] text-gray-500 dark:text-gray-400',
              isUser ? 'text-right' : 'flex items-start justify-between text-left',
            )}
          >
            <time className="block" dateTime={chat.timestamp} title={new Date(chat.timestamp).toLocaleString()}>
              {formattedTime}
            </time>

            {!isUser && (
              <button
                onClick={handleCopy}
                disabled={isCopied}
                aria-label={isCopied ? 'Copied to clipboard' : 'Copy message'}
                className={cn(
                  'transition-all duration-200 focus:outline-none',
                  isCopied
                    ? 'text-green-500' // Green checkmark when copied
                    : 'text-neutral-400 hover:!text-primary-500 focus:opacity-100 dark:text-neutral-500', // Appears on hover
                )}
              >
                {isCopied ? <CheckIcon size={16} /> : <ClipboardIcon size={16} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

ChatMessageItem.displayName = 'ChatMessageItem'

export default ChatMessageItem

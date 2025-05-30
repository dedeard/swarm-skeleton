import { MarkdownRenderer } from '@/components/ChatMarkdown'
import { cn } from '@heroui/react'
import React, { memo } from 'react'

interface StreamingMessageDisplayProps {
  streamMessage: string
  className?: string
}

const StreamingMessageDisplay: React.FC<StreamingMessageDisplayProps> = memo(({ streamMessage, className }) => {
  if (!streamMessage) return null

  return (
    <div className={cn('mb-3 flex w-full justify-start', className)}>
      <div
        className="w-10/12 whitespace-pre-wrap break-words rounded-medium border border-primary-500/40 bg-white px-4 py-2 text-gray-800 dark:bg-black dark:text-gray-100"
        role="log"
        aria-live="polite"
        aria-label="Streaming message"
      >
        <MarkdownRenderer content={streamMessage} />
      </div>
    </div>
  )
})

StreamingMessageDisplay.displayName = 'StreamingMessageDisplay'

export default StreamingMessageDisplay

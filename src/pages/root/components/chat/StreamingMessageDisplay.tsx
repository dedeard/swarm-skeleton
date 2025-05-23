import React from 'react'
import MarkdownRenderer from './MarkdownRenderer'

interface StreamingMessageDisplayProps {
  streamMessage: string
}

const StreamingMessageDisplay: React.FC<StreamingMessageDisplayProps> = ({ streamMessage }) => {
  if (!streamMessage) return null

  return (
    <div className="mb-3 flex w-full justify-start">
      <div
        className="px-4 py-2 text-gray-800 dark:text-gray-100"
        style={{ wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}
      >
        <MarkdownRenderer content={streamMessage} />
      </div>
    </div>
  )
}

export default StreamingMessageDisplay

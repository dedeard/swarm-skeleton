import { Spinner } from '@heroui/spinner'
import React from 'react'

interface ChatStatusIndicatorProps {
  loading: boolean
  status: string
}

const ChatStatusIndicator: React.FC<ChatStatusIndicatorProps> = ({ loading, status }) => {
  if (!loading && !status) return null

  return (
    <div className="mt-2 flex h-6 items-center space-x-2">
      {loading && <Spinner size="sm" />}
      {status && <span className="text-sm text-gray-600 dark:text-gray-400">{status}</span>}
    </div>
  )
}

export default ChatStatusIndicator

import { Spinner } from '@heroui/spinner'
import React from 'react'

interface ChatStatusIndicatorProps {
  loading: boolean
  status: string
}

const ChatStatusIndicator: React.FC<ChatStatusIndicatorProps> = ({ loading, status }) => {
  return (
    <div className="my-2 flex items-center space-x-3">
      {loading && <Spinner size="sm" className="block" />}
      {status && <span className="text-sm text-gray-600 dark:text-gray-400">{status}</span>}
    </div>
  )
}

export default ChatStatusIndicator

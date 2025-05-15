import MarkdownRenderer from '@/components/features/chat/MarkdownRenderer' // Assuming this path is correct
import { IChat } from '@/types/chat' // Or your actual path to IChat
import React from 'react'

interface ChatMessageItemProps {
  chat: IChat
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ chat }) => {
  const isUser = chat.role === 'user'
  const alignment = isUser ? 'justify-end' : 'justify-start'
  const bubbleStyles = isUser ? 'rounded-xl bg-primary-600 text-white shadow-md dark:bg-primary-700' : 'text-gray-800 dark:text-gray-100' // Assistant might need its own bubble style if not just plain text

  return (
    <div className={`mb-3 flex w-full ${alignment}`}>
      <div className="">
        <div className={`px-4 py-2 ${bubbleStyles}`} style={{ wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
          <MarkdownRenderer content={chat.content} />
        </div>
        <div className={`text-xs ${isUser ? 'text-right' : 'text-left'} mt-1 text-gray-500 dark:text-gray-400`}>
          {new Date(chat.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}

export default ChatMessageItem

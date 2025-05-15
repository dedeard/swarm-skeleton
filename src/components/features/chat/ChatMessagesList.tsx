import { IChat } from '@/types/chat'
import React from 'react'
import ChatMessageItem from './ChatMessageItem'
import ChatStatusIndicator from './ChatStatusIndicator'
import StreamingMessageDisplay from './StreamingMessageDisplay'

interface ChatMessagesListProps {
  chats: IChat[]
  streamMessage: string
  loading: boolean
  status: string
  messagesEndRef: React.RefObject<HTMLDivElement>
}

const ChatMessagesList: React.FC<ChatMessagesListProps> = ({ chats, streamMessage, loading, status, messagesEndRef }) => {
  return (
    <div className="mx-auto w-full max-w-3xl py-4">
      {chats.map((chat, index) => (
        <ChatMessageItem key={`${chat.timestamp}-${index}-${chat.role}`} chat={chat} />
      ))}
      <ChatStatusIndicator loading={loading} status={status} />
      <StreamingMessageDisplay streamMessage={streamMessage} />
      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatMessagesList

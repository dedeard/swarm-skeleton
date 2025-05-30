import { useChatContext } from '@/contexts/ChatContext'
import React from 'react'
import ChatMessageItem from './ChatMessageItem'
import ChatPlaceholder from './ChatPlaceholder'
import ChatStatusIndicator from './ChatStatusIndicator'
import StreamingMessageDisplay from './StreamingMessageDisplay'

interface ChatMessagesListProps {
  messagesEndRef?: React.RefObject<HTMLDivElement>
}

const ChatMessagesList: React.FC<ChatMessagesListProps> = ({ messagesEndRef }) => {
  const { localChats: chats, isSendingMessage, status, streamMessage } = useChatContext()
  return (
    <div className="w-full p-3">
      {!chats.length && <ChatPlaceholder />}
      <div className="mx-auto w-full max-w-2xl">
        {chats.map((chat, index) => (
          <ChatMessageItem key={`${chat.timestamp}-${index}-${chat.role}`} chat={chat} />
        ))}
        {isSendingMessage && <ChatStatusIndicator loading={isSendingMessage} status={status} />}
        <StreamingMessageDisplay streamMessage={streamMessage} />
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

export default ChatMessagesList

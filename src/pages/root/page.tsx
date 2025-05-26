import { ChatProvider } from '@/contexts/ChatContext'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Chat from './components/Chat'

export const Component: React.FC = () => {
  return (
    <>
      <ChatProvider>
        <Outlet />
        <Chat />
      </ChatProvider>
    </>
  )
}

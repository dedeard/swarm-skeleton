import EnhancedAuth from '@/components/features/auth/EnhancedAuth'
import { useChatContext } from '@/contexts/ChatContext'
import { useLayoutContext } from '@/contexts/LayoutContext'
import Navbar from '@/pages/root/components/Navbar'
import React from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import ChatInterface from './chat-interface/ChatInterface'
import ChatMessagesList from './chat/ChatMessagesList'
import Message from './Message'
import MainSidebar from './sidebar/MainSidebar'

const Chat: React.FC<React.PropsWithChildren> = () => {
  const { sidebarOpen } = useLayoutContext()
  const { localChats } = useChatContext()

  return (
    <div className="flex h-screen w-screen overflow-hidden text-neutral-700 dark:text-neutral-200">
      <div className="pointer-events-none fixed inset-0 bg-white dark:bg-black" />
      {sidebarOpen && <MainSidebar />}
      <div className="relative z-10 flex flex-1 flex-col">
        <Navbar />
        <PerfectScrollbar className="h-full flex-1 overflow-hidden">
          {!localChats.length && (
            <section className="mx-auto max-w-2xl px-3 py-8">
              <Message />
              <EnhancedAuth skipable />
            </section>
          )}
          <section className="flex-1">
            <ChatMessagesList />
          </section>
        </PerfectScrollbar>
        <ChatInterface />
      </div>
    </div>
  )
}

export default Chat

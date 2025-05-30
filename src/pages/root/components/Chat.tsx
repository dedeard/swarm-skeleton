import { useLayoutContext } from '@/contexts/LayoutContext'
import Navbar from '@/pages/root/components/Navbar'
import React from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import ChatInterface from './chat-interface/ChatInterface'
import ChatMessagesList from './chat/ChatMessagesList'
import MainSidebar from './sidebar/MainSidebar'

const Chat: React.FC<React.PropsWithChildren> = () => {
  const { sidebarOpen } = useLayoutContext()

  return (
    <div className="flex h-screen w-screen overflow-hidden text-neutral-700 dark:text-neutral-200">
      <div className="pointer-events-none fixed inset-0 bg-white dark:bg-neutral-900" />
      {sidebarOpen && <MainSidebar />}
      <div className="relative z-10 flex flex-1 flex-col">
        <Navbar />
        <PerfectScrollbar className="h-full flex-1 overflow-hidden">
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

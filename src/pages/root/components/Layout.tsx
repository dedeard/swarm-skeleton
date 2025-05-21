import { useChatContext } from '@/contexts/ChatContext'
import { useLayoutContext } from '@/contexts/LayoutContext'
import React from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import ChatInterface from './chat-interface/ChatInterface'
import ChatMessagesList from './chat/ChatMessagesList'
import Navbar from './navbar/Navbar'
import MainSidebar from './sidebar/MainSidebar'

const Layout: React.FC<React.PropsWithChildren> = () => {
  const { sidebarOpen } = useLayoutContext()

  const { localChats: messages, isSendingMessage, handleSendMessage, streamMessage, status } = useChatContext()

  return (
    <div className="flex h-screen w-screen overflow-hidden text-neutral-700 dark:text-neutral-200">
      <div className="pointer-events-none fixed inset-0 bg-white dark:bg-neutral-900" />
      {sidebarOpen && <MainSidebar />}
      <div className="relative z-10 flex flex-1 flex-col">
        <Navbar />
        <PerfectScrollbar className="h-full flex-1 overflow-hidden">
          <section className="flex-1">
            <div className="container">
              <ChatMessagesList chats={messages} streamMessage={streamMessage} status={status} />
            </div>
          </section>
        </PerfectScrollbar>
        <ChatInterface isLoading={isSendingMessage} showSuggestion={messages.length === 0} onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}

export default Layout

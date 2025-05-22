import { useChatContext } from '@/contexts/ChatContext'
import { useLayoutContext } from '@/contexts/LayoutContext'
import React from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useSearchParams } from 'react-router-dom'
import Conversations from './Conversations'
import NoAgentSelected from './NoAgentSelected'
import SidebarHeader from './SidebarHeader'
import SidebarLinks from './SidebarLinks'

const MainSidebar: React.FC = () => {
  const { toggleSidebar } = useLayoutContext()
  const { loading, threads, agent } = useChatContext()
  const [searchParams] = useSearchParams()
  const agentId = searchParams.get('agent')

  return (
    <>
      <div className="absolute z-50 h-full w-64 bg-neutral-100 dark:bg-neutral-950 md:relative">
        <SidebarHeader agent={agent} toggleSidebar={toggleSidebar} />
        <PerfectScrollbar className="h-[calc(100vh-4rem)] p-3">
          <div className="flex flex-col gap-3">
            <SidebarLinks />
            {!agentId && <NoAgentSelected />}
            {!!agentId && <Conversations loading={loading} threads={threads} agent={agent} />}
          </div>
        </PerfectScrollbar>
      </div>
      <div className="absolute inset-0 z-40 bg-white opacity-80 dark:bg-neutral-900 md:hidden" aria-hidden="true"></div>
    </>
  )
}

export default MainSidebar

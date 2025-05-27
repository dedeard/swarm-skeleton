import React from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import AgentCreatorPage from '../components/AgentCreator'

export const Component: React.FC = () => {
  return (
    <div className="absolute left-0 z-10 flex h-screen max-h-screen w-full flex-1 flex-col bg-white dark:bg-neutral-950 lg:static lg:w-[calc(100vw-400px)] lg:max-w-3xl">
      <PerfectScrollbar>
        <AgentCreatorPage />
      </PerfectScrollbar>
    </div>
  )
}

Component.displayName = 'GeneratorPage'

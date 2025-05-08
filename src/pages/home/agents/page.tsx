import Agents from '@/components/features/agents'
import { useAgentStore } from '@/store/agent.store'
import React from 'react'
import { LoaderFunction, Outlet } from 'react-router-dom'

export const Component: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 top-0 z-[100] flex">
      <Agents />
      <Outlet />
    </div>
  )
}

export const loader: LoaderFunction = async () => {
  const isLoaded = useAgentStore.getState().agentsLoaded

  if (!isLoaded) await useAgentStore.getState().fetchAgents()

  return {}
}

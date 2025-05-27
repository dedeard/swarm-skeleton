import React from 'react'
import { Outlet } from 'react-router-dom'
import Agents from './components/Agents'

export const Component: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-[30] flex lg:right-auto">
      <Agents />
      <Outlet />
    </div>
  )
}

Component.displayName = 'AgentsPage'

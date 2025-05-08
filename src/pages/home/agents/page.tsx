import Agents from '@/components/features/agents'
import React from 'react'
import { Outlet } from 'react-router-dom'

export const Component: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 top-0 z-[100] flex">
      <Agents />
      <Outlet />
    </div>
  )
}

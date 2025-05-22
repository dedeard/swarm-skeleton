import React from 'react'
import { Outlet } from 'react-router-dom'
import Tools from './components/Tools'

export const Component: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-[60] flex lg:right-auto">
      <Tools />
      <Outlet />
    </div>
  )
}

import { useLayoutContext } from '@/contexts/LayoutContext'
import React from 'react'
import Navbar from './navbar/Navbar'
import MainSidebar from './sidebar/MainSidebar'

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { sidebarOpen } = useLayoutContext()
  return (
    <div className="flex h-screen w-screen overflow-hidden text-neutral-700 dark:text-neutral-200">
      <div className="pointer-events-none fixed inset-0 bg-white dark:bg-neutral-900" />
      {sidebarOpen && <MainSidebar />}
      <div className="relative z-10 flex-1">
        <Navbar />
        <div></div>
        {children}
      </div>
    </div>
  )
}

export default Layout

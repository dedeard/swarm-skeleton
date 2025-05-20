import { useIsMobile } from '@/hooks/useWindowSize'
import React, { createContext, useContext, useState } from 'react'

interface LayoutContextType {
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isMobile = useIsMobile()

  const toggleSidebar = () => setSidebarOpen((prev) => !prev)

  return (
    <LayoutContext.Provider value={{ sidebarOpen: isMobile ? !sidebarOpen : sidebarOpen, toggleSidebar, setSidebarOpen }}>
      {children}
    </LayoutContext.Provider>
  )
}

export const useLayoutContext = () => {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error('useLayoutContext must be used within a LayoutProvider')
  }
  return context
}

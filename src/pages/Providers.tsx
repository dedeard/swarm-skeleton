import type { NavigateOptions } from 'react-router-dom'

import { LayoutProvider } from '@/contexts/LayoutContext'
import { ToastProvider } from '@heroui/react'
import { HeroUIProvider } from '@heroui/system'
import { ThemeProvider } from 'next-themes'
import { Outlet, useHref, useNavigate } from 'react-router-dom'

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NavigateOptions
  }
}

export function Providers() {
  const navigate = useNavigate()

  return (
    <ThemeProvider attribute="class">
      <HeroUIProvider navigate={navigate} useHref={useHref}>
        <LayoutProvider>
          <ToastProvider placement="top-right" regionProps={{ className: 'z-[99999]' }} />
          <Outlet />
        </LayoutProvider>
      </HeroUIProvider>
    </ThemeProvider>
  )
}

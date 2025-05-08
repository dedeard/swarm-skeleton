import type { NavigateOptions } from 'react-router-dom'

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
        <Outlet />
      </HeroUIProvider>
    </ThemeProvider>
  )
}

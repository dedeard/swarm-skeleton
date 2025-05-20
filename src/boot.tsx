import { Spinner } from '@heroui/spinner'
import { useEffect, useState } from 'react'
import { UI } from './config/constants'
import { useAuthStore } from './store/auth.store'

/**
 * Boot Component
 * Handles application initialization and loading state
 */
const Boot: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  const authLoading = useAuthStore((s) => s.loading)
  const initialize = useAuthStore((s) => s.initialize)

  // Initialize auth store when component mounts
  useEffect(() => {
    setIsMounted(true)
    initialize()

    return () => setIsMounted(false)
  }, [initialize])

  // Handle loading state with minimum display time
  useEffect(() => {
    if (!authLoading && isMounted) {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, UI.LOADING_DELAY)

      return () => clearTimeout(timer)
    }
  }, [authLoading, isMounted])

  // Show loading spinner while initializing
  if (isLoading) {
    return (
      <div
        aria-busy="true"
        aria-label="Loading application"
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-white transition-opacity duration-500 ease-out"
      >
        <Spinner color="success" className="scale-125" size="lg" />
      </div>
    )
  }

  return <>{children}</>
}

export default Boot

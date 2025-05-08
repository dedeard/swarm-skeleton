import { Spinner } from '@heroui/spinner'
import { useEffect, useState } from 'react'
import { twJoin } from 'tailwind-merge'
import { useAuthStore } from './store/auth.store'

const Boot: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const authLoading = useAuthStore((s) => s.loading)
  const initialize = useAuthStore((s) => s.initialize)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    initialize() // Inisialisasi auth store saat komponen mount
    return () => setIsMounted(false)
  }, [initialize])

  useEffect(() => {
    if (!authLoading && isMounted) {
      // Minimum loading time
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [authLoading, isMounted])

  if (isLoading) {
    return (
      <div
        aria-busy="true"
        aria-label="Loading application"
        className={twJoin('fixed inset-0 z-[99999] flex items-center justify-center bg-white', 'transition-opacity duration-500 ease-out')}
      >
        <Spinner color="success" className="scale-125" size="lg" />
      </div>
    )
  }

  return <>{children}</>
}

export default Boot

import { AUTH } from '@/config/constants'
import { useAuthStore } from '@/store/auth.store'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

/**
 * AuthChecker Component Props
 */
interface AuthCheckerProps {
  guest?: boolean
  private?: boolean
  children?: React.ReactNode
}

/**
 * AuthChecker Component
 * Handles route protection based on authentication state
 */
const AuthChecker: React.FC<AuthCheckerProps> = ({ guest, private: isPrivate }) => {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const navigate = useNavigate()

  // Handle route protection based on auth state
  useEffect(() => {
    if (loading) return

    if (isPrivate && !user) {
      // Redirect to login if trying to access private route without authentication
      navigate(AUTH.ROUTES.LOGIN, { replace: true })
    }

    if (guest && user) {
      // Redirect to home if trying to access guest route while authenticated
      navigate(AUTH.ROUTES.HOME, { replace: true })
    }
  }, [user, loading, isPrivate, guest, navigate])

  // Show loading state
  if (loading) {
    return <div>Loading...</div>
  }

  // Handle route rendering based on auth requirements
  if (isPrivate) {
    return user ? <Outlet /> : null
  }

  if (guest) {
    return !user ? <Outlet /> : null
  }

  // Public route
  return <Outlet />
}

export default AuthChecker

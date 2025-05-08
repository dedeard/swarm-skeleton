import { useAuthStore } from '@/store/auth.store'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const AuthChecker: React.FC<{
  guest?: boolean
  private?: boolean
  children?: React.ReactNode
}> = (props) => {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return

    if (props.private && !user) {
      navigate('/auth', { replace: true })
    }

    if (props.guest && user) {
      navigate('/', { replace: true })
    }
  }, [user, loading, props.private, props.guest, navigate])

  if (loading) {
    return <div>Loading...</div>
  }

  if (props.private) {
    return user ? <Outlet /> : null
  }

  if (props.guest) {
    return !user ? <Outlet /> : null
  }

  return <Outlet />
}

export default AuthChecker

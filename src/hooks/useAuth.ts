import { useAuthStore } from '@/store/auth.store'
import { Provider } from '@supabase/supabase-js'
import { useCallback } from 'react'

/**
 * Custom hook for authentication
 * Provides simplified access to auth state and actions
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const session = useAuthStore((s) => s.session)
  const loading = useAuthStore((s) => s.loading)
  const lastAuthedUser = useAuthStore((s) => s.lastAuthedUser)

  const signInWithProvider = useAuthStore((s) => s.signInWithProvider)
  const signOut = useAuthStore((s) => s.signOut)

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = !!user

  /**
   * Sign in with Google
   */
  const signInWithGoogle = useCallback(() => {
    return signInWithProvider('google')
  }, [signInWithProvider])

  /**
   * Sign in with GitHub
   */
  const signInWithGithub = useCallback(() => {
    return signInWithProvider('github')
  }, [signInWithProvider])

  /**
   * Sign in with a specific provider
   */
  const signInWith = useCallback(
    (provider: Provider) => {
      return signInWithProvider(provider)
    },
    [signInWithProvider],
  )

  return {
    // State
    user,
    session,
    loading,
    lastAuthedUser,
    isAuthenticated,

    // Actions
    signInWith,
    signInWithGoogle,
    signInWithGithub,
    signOut,
  }
}

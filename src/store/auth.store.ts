import { AUTH, ENV } from '@/config/constants'
import { mountStoreDevtool } from '@/utils/mount-store-devtool'
import { supabase } from '@/utils/supabase'
import { Provider, Session, User } from '@supabase/supabase-js'
import { create } from 'zustand'

/**
 * Authentication Store State Interface
 */
interface AuthState {
  // State
  user: User | null
  session: Session | null
  loading: boolean
  lastAuthedUser: User | null

  // Actions
  signInWithProvider: (provider: Provider) => Promise<void>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
}

/**
 * Authentication Store
 * Manages user authentication state and actions
 */
export const useAuthStore = create<AuthState>()((set) => ({
  // Initial state
  user: null,
  session: null,
  loading: true,
  lastAuthedUser: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(AUTH.STORAGE_KEYS.LAST_USER) || 'null') : null,

  /**
   * Initialize authentication state
   * Sets up auth state and listeners
   */
  initialize: async () => {
    // Get current session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    set({
      session,
      user: session?.user ?? null,
      loading: false,
    })

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session?.user ?? null,
        loading: false,
      })

      // Store last authenticated user
      if (session?.user) {
        set({ lastAuthedUser: session.user })
        localStorage.setItem(AUTH.STORAGE_KEYS.LAST_USER, JSON.stringify(session.user))
      }
    })

    // Cleanup listener on unload
    window.addEventListener('beforeunload', () => {
      subscription.unsubscribe()
    })
  },

  /**
   * Sign in with OAuth provider
   * @param provider - OAuth provider (Google, GitHub, etc.)
   */
  signInWithProvider: async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        redirectTo: window.location.origin,
      },
    })

    if (error) {
      console.error('Error signing in with provider:', error)
      throw error
    }
  },

  /**
   * Sign out the current user
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
      throw error
    }
  },
}))

// Mount store devtools in development environment
if (ENV.IS_DEV) {
  mountStoreDevtool('auth.store', useAuthStore)
}

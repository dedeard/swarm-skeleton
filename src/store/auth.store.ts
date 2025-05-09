import { mountStoreDevtool } from '@/utils/mount-store-devtool'
import { supabase } from '@/utils/supabase'
import { Provider, Session, User } from '@supabase/supabase-js'
import { create } from 'zustand'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  lastAuthedUser: User | null
  signInWithProvider: (provider: Provider) => Promise<void>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  session: null,
  loading: true,
  lastAuthedUser: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('lastAuthedUser') || 'null') : null,

  initialize: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    set({
      session,
      user: session?.user ?? null,
      loading: false,
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session?.user ?? null,
        loading: false,
      })

      if (session?.user) {
        set({ lastAuthedUser: session.user })
        localStorage.setItem('lastAuthedUser', JSON.stringify(session.user))
      }
    })

    // Cleanup listener on unload
    window.addEventListener('beforeunload', () => {
      subscription.unsubscribe()
    })
  },

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

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
      throw error
    }
  },
}))

if (import.meta.env.DEV) {
  mountStoreDevtool('auth.store', useAuthStore)
}

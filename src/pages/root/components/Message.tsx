import SwarmTextGradient from '@/components/ui/SwarmTextGradient'
import { useAuthStore } from '@/store/auth.store'
import React, { useMemo } from 'react'

const Message: React.FC = () => {
  const { user } = useAuthStore()

  const greeting = useMemo(() => {
    const hours = new Date().getHours()

    if (hours < 12) {
      return 'Good morning'
    } else if (hours < 18) {
      return 'Good afternoon'
    } else {
      return 'Good evening'
    }
  }, [])

  return (
    <div className="mb-8 rounded-lg border border-primary-500/20 p-6 hover:border-primary-500/50">
      <h1 className="text-2xl font-semibold leading-tight">
        {greeting}, <SwarmTextGradient>{user?.user_metadata?.full_name || 'there'}</SwarmTextGradient>! Let's make your life easier and set
        your agents to work.
      </h1>
    </div>
  )
}

export default Message

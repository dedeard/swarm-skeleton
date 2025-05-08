import SwarmTextGradient from '@/components/ui/SwarmTextGradient'
import { useAuthStore } from '@/store/auth.store'
import React from 'react'

const Message: React.FC = () => {
  const { lastAuthedUser } = useAuthStore()

  if (lastAuthedUser) {
    return (
      <h1 className="text-3xl leading-tight sm:text-4xl">
        Welcome back to <SwarmTextGradient>SWARM</SwarmTextGradient>, login to continue.
      </h1>
    )
  }

  return (
    <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
      Welcome to <SwarmTextGradient>SWARM</SwarmTextGradient>, create and use AI agents to solve real world problems
    </h1>
  )
}

export default Message

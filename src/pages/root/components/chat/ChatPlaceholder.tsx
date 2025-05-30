import { useChatContext } from '@/contexts/ChatContext'
import { Button } from '@heroui/button'
import { MessageCircleIcon, UserCogIcon } from 'lucide-react' // Added UserCogIcon for the new state
import React from 'react'
import { Link } from 'react-router-dom'

const ChatPlaceholder: React.FC = () => {
  const { localChats, agent } = useChatContext()

  // State 1: No agent has been selected yet. This is the first requirement.
  if (!agent) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <UserCogIcon size={64} strokeWidth={1} className="mb-6 text-gray-500" />
        <h2 className="mb-2 text-xl font-medium">No Agent Selected</h2>
        <p className="mb-6 text-sm text-gray-400">Please select an agent from the list to begin a conversation.</p>

        <Button as={Link} to="/agents" color="success" variant="flat" size="sm">
          Select an Agent
        </Button>
      </div>
    )
  }

  // If there are messages, the placeholder shouldn't be visible at all.
  if (localChats.length > 0) {
    return null
  }

  // State 2: An agent is selected, but the conversation hasn't started.
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <MessageCircleIcon size={64} strokeWidth={1} className="mb-6 text-gray-500" />
      <h2 className="mb-2 text-xl font-medium">No messages yet</h2>
      <p className="text-sm text-gray-400">Start a conversation by typing a message below.</p>
    </div>
  )
}

export default ChatPlaceholder

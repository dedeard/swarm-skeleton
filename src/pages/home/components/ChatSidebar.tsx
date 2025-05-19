import Threads from '@/components/features/chat/AgentThereads'
import { IAgent, IThreadPreview } from '@/types/agent'
import { Button } from '@heroui/button'
import { UserPlus } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import AgentDetailCard from './AgentDetailCard'

const ChatSidebar: React.FC<{ agent?: IAgent; threads: IThreadPreview[] }> = ({ agent, threads }) => {
  return (
    <div className="fixed h-screen w-[300px] border-r bg-white pt-[64px] dark:border-neutral-700 dark:bg-neutral-800 print:hidden">
      {!agent && (
        <div className="dark:bg-neutral-750 flex flex-col items-center justify-center p-6 text-center dark:border-neutral-700">
          <UserPlus className="mb-4 h-12 w-12 text-green-500" strokeWidth={1.5} />
          <h3 className="text-md mb-2 font-semibold text-neutral-700 dark:text-neutral-200">No Agent Selected</h3>
          <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">Please select an agent to begin your conversation.</p>
          <Button as={Link} to="/agents" startContent={<UserPlus size={16} />} variant="flat" size="sm" color="success">
            Select Agent
          </Button>
        </div>
      )}

      {agent && <AgentDetailCard agent={agent} />}

      <div>
        <Threads threads={threads} />
      </div>
    </div>
  )
}

export default ChatSidebar

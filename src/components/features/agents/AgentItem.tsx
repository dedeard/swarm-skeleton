import { IAgent } from '@/types/agent'
import { Button } from '@heroui/button'
import { DotIcon, HomeIcon, PenIcon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { AgentUsageChart } from './AgentUsageChart'

const AgentItem: React.FC<{ agent: IAgent }> = ({ agent }) => {
  return (
    <div className="flex items-start gap-3 rounded border border-primary-500/20 p-3">
      <div className="shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary-500/20 text-primary-500">
          <HomeIcon size={18} />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-1">
          <span className="block h-3 w-3 rounded-full bg-primary-500"></span>
          <span className="block text-[10px] font-semibold dark:text-neutral-300">Agent Category</span>
        </div>
        <div className="truncate text-sm font-medium">{agent.agent_name}</div>
        <div className="truncate text-xs opacity-75">{agent.description}</div>

        <div className="flex items-center text-[10px] opacity-60">
          <span className="block">Used 78 times</span>
          <DotIcon size={18} />
          <span className="block">Last used 1 day ago</span>
        </div>

        <div className="flex gap-1">
          <span className="block border border-neutral-500/20 bg-neutral-500/10 px-1 text-[10px] text-neutral-500">LLM: Claude 3</span>
          <span className="block border border-neutral-500/20 bg-neutral-500/10 px-1 text-[10px] text-neutral-500">
            Tools: {agent.tools.length}
          </span>
        </div>

        <div className="mt-3 flex gap-3">
          <Button as={Link} to={`/?agent=${agent.agent_id}`} variant="flat" size="sm" color="success">
            Chat
          </Button>
          <Button
            as={Link}
            to={`/agents/${agent.agent_id}/edit`}
            variant="light"
            size="sm"
            color="secondary"
            startContent={<PenIcon size={10} />}
          >
            Edit
          </Button>
        </div>
      </div>

      <div className="shrink-0">
        <AgentUsageChart color="#10b981" />
      </div>
    </div>
  )
}

export default AgentItem

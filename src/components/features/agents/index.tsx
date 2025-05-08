import { useAgentStore } from '@/store/agent.store'
import { Button } from '@heroui/button'
import { Input, Select, SelectItem } from '@heroui/react'
import { ListIcon, PlusIcon, XIcon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import AgentItem from './AgentItem'
import { animals } from './dummy-agents'

const Agents: React.FC = () => {
  const { agents } = useAgentStore()

  return (
    <div className="flex h-screen max-h-screen w-full flex-col border-r border-primary-500/20 bg-white dark:bg-neutral-950 lg:w-[400px]">
      <div className="flex items-center justify-between px-3 py-4">
        <span className="block text-lg">Agents ({agents.length})</span>
        <div className="flex items-center gap-3">
          <Button as={Link} to="/agents/create" isIconOnly size="sm" variant="light" radius="full" color="success">
            <PlusIcon size={20} />
          </Button>
          <Button as={Link} isIconOnly size="sm" to="/" variant="light" radius="full">
            <XIcon size={20} />
          </Button>
        </div>
      </div>
      <div className="px-3">
        <div>
          <Input type="text" placeholder="Search Agents..." variant="bordered" color="success" />
        </div>
        <div className="flex items-end gap-3 py-3">
          <div className="flex-1">
            <span className="text-xs">Filter by category:</span>
            <Select placeholder="Select categories" size="sm" className="max-w-sm" selectionMode="multiple">
              {animals.map((animal) => (
                <SelectItem key={animal.key}>{animal.label}</SelectItem>
              ))}
            </Select>
          </div>
          <Button isIconOnly size="sm">
            <ListIcon size={14} />
          </Button>
        </div>
      </div>

      <div className="grid h-[calc(100%-164px)] w-full grid-cols-1 gap-3 overflow-y-auto px-4">
        {agents.map((agent, i) => (
          <AgentItem key={i} agent={agent} />
        ))}
      </div>
    </div>
  )
}

export default Agents

import { useAgentStore } from '@/store/agent.store'
import { Button, Input } from '@heroui/react'
import { PlusIcon, XIcon } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AgentItem from './AgentItem'

const Agents: React.FC = () => {
  const { agents } = useAgentStore()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredAgents = useMemo(() => {
    if (!searchTerm.trim()) return agents
    return agents.filter((agent) => agent.agent_name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [agents, searchTerm])

  return (
    <div className="flex h-screen max-h-screen w-full flex-col border-r border-primary-500/20 bg-white dark:bg-neutral-950 lg:w-[400px]">
      <div className="flex items-center justify-between p-3">
        <span className="block text-lg">Agents ({filteredAgents.length})</span>
        <div className="flex items-center gap-3">
          <Button as={Link} to="/agents/create" isIconOnly size="sm" variant="light" radius="full" color="success">
            <PlusIcon size={20} />
          </Button>
          <Button as={Link} isIconOnly size="sm" to="/" variant="light" radius="full">
            <XIcon size={20} />
          </Button>
        </div>
      </div>

      <div className="px-3 pb-3">
        <Input
          type="text"
          placeholder="Search Agents..."
          variant="bordered"
          color="success"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* <div className="flex items-end gap-3 py-3">
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
        </div> */}
      </div>

      <div className="grid h-[calc(100%-108px)] w-full grid-cols-1 gap-3 overflow-y-auto px-3">
        {filteredAgents.map((agent, i) => (
          <AgentItem key={i} agent={agent} />
        ))}
      </div>
    </div>
  )
}

export default Agents

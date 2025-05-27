import useDynamicUrl from '@/hooks/use-dynamic-url'
import { useApi } from '@/hooks/useApi'
import { useAgentStore } from '@/store/agent.store'
import { Button, Input } from '@heroui/react'
import { PlusIcon, SparklesIcon, XIcon } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Link } from 'react-router-dom'
import AgentItem from './AgentItem'
import AgentItemSkeleton from './AgentItemSkeleton'

const Agents: React.FC = () => {
  const { agents, fetchAgents } = useAgentStore()
  const [searchTerm, setSearchTerm] = useState('')

  const { loading } = useApi(fetchAgents)

  const filteredAgents = useMemo(() => {
    if (!searchTerm.trim()) return agents
    return agents.filter((agent) => agent.agent_name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [agents, searchTerm])

  const url = useDynamicUrl('/')

  return (
    <div className="flex h-screen max-h-screen w-full flex-col border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 lg:w-[400px]">
      <div className="flex items-center justify-between p-3">
        <span className="block text-lg">Agents ({filteredAgents.length})</span>
        <div className="flex items-center gap-3">
          <Button
            as={Link}
            to="/agents/generator"
            isIconOnly
            size="sm"
            variant="light"
            radius="full"
            color="primary" // Changed color for distinction
            title="Auto-generate Agent from Prompt"
          >
            <SparklesIcon size={20} />
          </Button>
          <Button as={Link} to="/agents/create" isIconOnly size="sm" variant="light" radius="full" color="success">
            <PlusIcon size={20} />
          </Button>
          <Button as={Link} isIconOnly size="sm" to={url} variant="light" radius="full">
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
      </div>

      <PerfectScrollbar className="h-[calc(100%-108px)] w-full p-3">
        <div className="grid w-full grid-cols-1 gap-3">
          {loading && (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <AgentItemSkeleton key={i} />
              ))}
            </>
          )}
          {!loading && filteredAgents.map((agent, i) => <AgentItem key={i} agent={agent} />)}
        </div>
      </PerfectScrollbar>
    </div>
  )
}

export default Agents

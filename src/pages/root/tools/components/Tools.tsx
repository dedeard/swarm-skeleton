import useDynamicUrl from '@/hooks/use-dynamic-url'
import { useApi } from '@/hooks/useApi'
import { useToolStore } from '@/store/tool.store'
import { Button, Input, Spinner } from '@heroui/react'
import { PlusIcon, XIcon } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Link } from 'react-router-dom'
import ToolItem from './ToolItem'

const Tools: React.FC = () => {
  const { tools, fetchTools } = useToolStore()
  const [searchTerm, setSearchTerm] = useState('')

  const { loading } = useApi(fetchTools)

  const filteredTools = useMemo(() => {
    if (!searchTerm.trim()) return tools
    return tools.filter((tool) => tool.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [tools, searchTerm])

  const url = useDynamicUrl('/')

  return (
    <div className="flex h-screen max-h-screen w-full flex-col border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 lg:w-[400px]">
      <div className="flex items-center justify-between p-3">
        <span className="block text-lg">Tools ({filteredTools.length})</span>
        <div className="flex items-center gap-3">
          <Button as={Link} to="/tools/create" isIconOnly size="sm" variant="light" radius="full" color="success">
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
          placeholder="Search Tools..."
          variant="bordered"
          color="success"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <PerfectScrollbar className="h-[calc(100%-108px)] w-full p-3">
        <div className="grid w-full grid-cols-1 gap-3">
          {loading && (
            <div className="h-full w-full items-center justify-center">
              <Spinner size="lg" />
            </div>
          )}
          {!loading && filteredTools.map((tool, i) => <ToolItem key={i} tool={tool} />)}
        </div>
      </PerfectScrollbar>
    </div>
  )
}

export default Tools

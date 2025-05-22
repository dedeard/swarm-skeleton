import { ITool } from '@/types/tool'
import { Button } from '@heroui/button'
import { Trash2Icon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const ToolItem: React.FC<{ tool: ITool }> = ({ tool }) => {
  return (
    <div className="rounded border p-3 dark:border-neutral-800">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="truncate text-sm font-medium">{tool.name}</div>
        <div className="truncate text-xs opacity-75">{tool.description}</div>
      </div>
      <div className="mt-3 flex gap-3">
        <Button as={Link} to={`/?agent=${tool.tool_id}`} variant="flat" size="sm" color="success">
          Edit
        </Button>
        <Button
          as={Link}
          to={`/agents/${tool.tool_id}/edit`}
          variant="light"
          size="sm"
          color="danger"
          startContent={<Trash2Icon size={10} />}
        >
          Delete
        </Button>
      </div>
    </div>
  )
}

export default ToolItem

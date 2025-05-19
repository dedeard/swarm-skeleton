import { useToolStore } from '@/store/tool.store'
import React from 'react'

const ToolCard: React.FC<{ toolId: string }> = ({ toolId }) => {
  const tool = useToolStore((s) => s.tools.find((tool) => tool.tool_id === toolId))
  return (
    <div className="block py-2">
      <div className="font-semibold">{tool?.name}</div>
      <div className="text-xs">{tool?.description}</div>
    </div>
  )
}

export default ToolCard

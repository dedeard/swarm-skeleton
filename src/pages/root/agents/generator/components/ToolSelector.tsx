import { ITool } from '@/types/tool'
import { Button, Checkbox, CheckboxGroup, Chip, Input } from '@heroui/react'
import { Search } from 'lucide-react'
import React from 'react'

interface ToolSelectorProps {
  selectedTools: string[]
  onSelectionChange: (tools: string[]) => void
  searchTerm: string
  onSearchTermChange: (term: string) => void
  allAvailableTools: ITool[]
}

const ToolSelector: React.FC<ToolSelectorProps> = ({
  selectedTools,
  onSelectionChange,
  searchTerm,
  onSearchTermChange,
  allAvailableTools,
}) => {
  const getFilteredTools = (currentSearchTerm: string) =>
    (allAvailableTools || []).filter(
      (tool) =>
        tool.name.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
        (tool.description && tool.description.toLowerCase().includes(currentSearchTerm.toLowerCase())),
    )

  const filteredTools = getFilteredTools(searchTerm)

  return (
    <div className="mt-4 rounded-lg border bg-content2 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-lg font-semibold">Available Tools</h4>
        <Chip color="success" variant="flat">
          {selectedTools.length} selected
        </Chip>
      </div>
      <Input
        isClearable
        placeholder="Search tools..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        className="mb-3"
        startContent={<Search />}
      />
      <CheckboxGroup value={selectedTools} onChange={onSelectionChange} className="max-h-60 overflow-y-auto pr-2">
        {filteredTools.map((tool) => (
          <Checkbox key={tool.tool_id} value={tool.tool_id} classNames={{ label: 'w-full' }}>
            <div className="w-full">
              <div className="flex items-center justify-between">
                <span className="font-medium">{tool.name}</span>
                <Chip
                  size="sm"
                  color={tool.on_status === 'Online' ? 'success' : tool.on_status === 'Predefined' ? 'secondary' : 'warning'}
                  variant="flat"
                >
                  {tool.on_status}
                </Chip>
              </div>
              <p className="mt-1 text-xs text-foreground-500">{tool.description}</p>
            </div>
          </Checkbox>
        ))}
        {allAvailableTools && allAvailableTools.length > 0 && filteredTools.length === 0 && (
          <p className="text-sm text-foreground-500">No tools match your search.</p>
        )}
        {(!allAvailableTools || allAvailableTools.length === 0) && (
          <p className="text-sm text-foreground-500">No tools available (dummy data).</p>
        )}
      </CheckboxGroup>
      <div className="mt-3 flex gap-2">
        <Button
          size="sm"
          variant="flat"
          onClick={() => onSelectionChange(filteredTools.map((t) => t.tool_id))}
          disabled={filteredTools.length === 0}
        >
          Select All Visible
        </Button>
        <Button size="sm" variant="flat" onClick={() => onSelectionChange([])} disabled={selectedTools.length === 0}>
          Deselect All
        </Button>
      </div>
    </div>
  )
}

export default ToolSelector

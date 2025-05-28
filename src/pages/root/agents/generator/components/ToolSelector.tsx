import { ITool } from '@/types/tool'
import { Button, Checkbox, CheckboxGroup, Chip, Input } from '@heroui/react' // Or your specific HeroUI component paths
import { Search } from 'lucide-react'
import React from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar' // Import PerfectScrollbar

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
    <div className="mt-4 rounded-lg border border-divider bg-content2 p-4 shadow-sm">
      {/* Header Section */}
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-xl font-semibold text-foreground">Available Tools</h4>
        <Chip color="success" variant="flat" size="sm">
          {selectedTools.length} selected
        </Chip>
      </div>

      {/* Search Input */}
      <Input
        isClearable
        aria-label="Search tools"
        placeholder="Search by name or description..."
        value={searchTerm}
        onValueChange={onSearchTermChange}
        className="mb-4"
        startContent={<Search className="text-default-400" size={20} />}
        variant="bordered"
      />

      {/* Tool List Section with PerfectScrollbar */}
      <div className="mb-4 max-h-72">
        <PerfectScrollbar
          options={{ wheelPropagation: false }} // Optional: customize scrollbar behavior
          style={{ maxHeight: 'inherit', paddingRight: '8px' }} // Use inherit for maxHeight, add padding for scrollbar if needed
        >
          <CheckboxGroup
            aria-label="Tool selection"
            value={selectedTools}
            onChange={onSelectionChange}
            classNames={{
              wrapper: 'gap-5', // Add gap between checkboxes
            }}
          >
            {filteredTools.map((tool) => (
              <Checkbox
                key={tool.tool_id}
                value={tool.tool_id}
                classNames={{
                  base: 'w-full max-w-full p-3 rounded-lg border border-divider hover:bg-content3 transition-background',
                  label: 'w-full',
                }}
              >
                <div className="flex w-full items-start justify-between gap-2">
                  <div className="flex-grow">
                    <span className="font-medium text-foreground">{tool.name}</span>
                    {tool.description && <p className="mt-1 line-clamp-2 text-xs text-foreground-500">{tool.description}</p>}
                  </div>
                  <Chip
                    size="sm"
                    color={tool.on_status === 'Online' ? 'success' : tool.on_status === 'Predefined' ? 'secondary' : 'warning'}
                    variant="flat"
                    className="mt-1 shrink-0"
                  >
                    {tool.on_status}
                  </Chip>
                </div>
              </Checkbox>
            ))}
          </CheckboxGroup>

          {/* Conditional Messages */}
          {allAvailableTools && allAvailableTools.length > 0 && filteredTools.length === 0 && (
            <p className="py-4 text-center text-sm text-foreground-500">No tools match your search.</p>
          )}
          {(!allAvailableTools || allAvailableTools.length === 0) && (
            <p className="py-4 text-center text-sm text-foreground-500">No tools available.</p>
          )}
        </PerfectScrollbar>
      </div>

      {/* Action Buttons Section */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button
          size="sm"
          variant="flat"
          color="primary"
          onPress={() => onSelectionChange(filteredTools.map((t) => t.tool_id))}
          disabled={filteredTools.length === 0}
          className="w-full sm:w-auto"
        >
          Select All Visible ({filteredTools.length})
        </Button>
        <Button
          size="sm"
          variant="flat"
          color="danger"
          onPress={() => onSelectionChange([])}
          disabled={selectedTools.length === 0}
          className="w-full sm:w-auto"
        >
          Deselect All ({selectedTools.length})
        </Button>
      </div>
    </div>
  )
}

export default ToolSelector

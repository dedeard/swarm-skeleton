import { IAgentPayload } from '@/types/agent'
import { ITool } from '@/types/tool'
import { Card, CardBody, CardHeader, Chip } from '@heroui/react'
import React from 'react'
import ToolSelector from './ToolSelector'

interface SingleAgentPreviewProps {
  extractedAgentData: Partial<IAgentPayload>
  toolSearchTerm: string
  onToolSearchTermChange: (term: string) => void
  onToolSelectionChange: (tools: string[]) => void
  availableTools: ITool[]
}

const SingleAgentPreview: React.FC<SingleAgentPreviewProps> = ({
  extractedAgentData,
  toolSearchTerm,
  onToolSearchTermChange,
  onToolSelectionChange,
  availableTools,
}) => {
  if (
    !extractedAgentData.agent_name &&
    !extractedAgentData.description &&
    (!extractedAgentData.tools || extractedAgentData.tools.length === 0)
  ) {
    return null
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <h3 className="text-xl font-semibold">Agent Preview</h3>
      </CardHeader>
      <CardBody className="space-y-3">
        <div>
          <strong>Name:</strong> {extractedAgentData.agent_name || <span className="text-warning-500">Not set</span>}
        </div>
        <div>
          <strong>Description:</strong> {extractedAgentData.description || <span className="text-warning-500">Not set</span>}
        </div>
        <div>
          <strong>Style:</strong> {extractedAgentData.agent_style || <span className="text-foreground-500">Default</span>}
        </div>
        <div>
          <strong>Status:</strong>{' '}
          <Chip color={extractedAgentData.on_status ? 'success' : 'danger'}>{extractedAgentData.on_status ? 'Active' : 'Inactive'}</Chip>
        </div>
        <div>
          <strong>Keywords:</strong>
          {extractedAgentData.keywords && extractedAgentData.keywords.length > 0 ? (
            extractedAgentData.keywords.map((k) => (
              <Chip key={k} size="sm" variant="flat" className="mb-1 mr-1">
                {k}
              </Chip>
            ))
          ) : (
            <span className="text-foreground-500">None</span>
          )}
        </div>
        <ToolSelector
          selectedTools={extractedAgentData.tools || []}
          onSelectionChange={onToolSelectionChange}
          searchTerm={toolSearchTerm}
          onSearchTermChange={onToolSearchTermChange}
          allAvailableTools={availableTools}
        />
      </CardBody>
    </Card>
  )
}

export default SingleAgentPreview

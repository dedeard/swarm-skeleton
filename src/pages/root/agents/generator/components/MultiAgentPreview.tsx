import { IAgentVariation, IMultiAgentParseData } from '@/types/agent'
import { ITool } from '@/types/tool'
import { Card, CardBody, CardHeader, Chip } from '@heroui/react'
import React from 'react'
import ToolSelector from './ToolSelector'

interface MultiAgentPreviewProps {
  multiAgentParseResponse: IMultiAgentParseData | null
  multiToolSearchTerms: Record<number, string>
  onMultiToolSearchTermChange: (index: number, term: string) => void
  onToolSelectionChange: (agentIndex: number, tools: string[]) => void
  availableTools: ITool[]
}

const MultiAgentPreview: React.FC<MultiAgentPreviewProps> = ({
  multiAgentParseResponse,
  multiToolSearchTerms,
  onMultiToolSearchTermChange,
  onToolSelectionChange,
  availableTools,
}) => {
  if (!multiAgentParseResponse) return null

  const { common_attributes, agent_variations } = multiAgentParseResponse

  return (
    <div className="mt-4 space-y-6">
      <Card shadow="none" className="border dark:border-neutral-800">
        <CardHeader>
          <h3 className="text-xl font-semibold">Common Attributes</h3>
        </CardHeader>
        <CardBody className="space-y-2">
          <div>
            <strong>Name (base):</strong> {common_attributes.agent_name || <span className="text-foreground-500">N/A</span>}
          </div>
          <div>
            <strong>Description (base):</strong> {common_attributes.description || <span className="text-foreground-500">N/A</span>}
          </div>
          <div>
            <strong>Style (base):</strong> {common_attributes.agent_style || <span className="text-foreground-500">Default</span>}
          </div>
          <div>
            <strong>Status (base):</strong>{' '}
            <Chip color={common_attributes.on_status ? 'success' : 'danger'}>{common_attributes.on_status ? 'Active' : 'Inactive'}</Chip>
          </div>
          <div>
            <strong>Keywords (common):</strong>
            {common_attributes.keywords && common_attributes.keywords.length > 0 ? (
              common_attributes.keywords.map((k) => (
                <Chip key={k} size="sm" variant="flat" className="mb-1 mr-1">
                  {k}
                </Chip>
              ))
            ) : (
              <span className="text-foreground-500">None</span>
            )}
          </div>
        </CardBody>
      </Card>
      <h3 className="text-xl font-semibold">Agent Variations ({agent_variations.length})</h3>
      {agent_variations.map((variation: IAgentVariation, index: number) => (
        <Card key={index} shadow="none" className="mb-4 border dark:border-neutral-800">
          <CardHeader>
            <h4 className="text-lg font-semibold">
              Agent Variation {index + 1}:{' '}
              {variation.agent_name || common_attributes.agent_name || <span className="text-warning-500">Unnamed</span>}
            </h4>
          </CardHeader>
          <CardBody className="space-y-2">
            <div>
              <strong>Name:</strong>{' '}
              {variation.agent_name || <span className="text-foreground-500">(Uses common: {common_attributes.agent_name || 'N/A'})</span>}
            </div>
            <div>
              <strong>Description:</strong>{' '}
              {variation.description || (
                <span className="text-foreground-500">(Uses common: {common_attributes.description || 'N/A'})</span>
              )}
            </div>
            <div>
              <strong>Style:</strong>{' '}
              {variation.agent_style || (
                <span className="text-foreground-500">(Uses common: {common_attributes.agent_style || 'Default'})</span>
              )}
            </div>
            <div>
              <strong>Keywords:</strong>
              {variation.keywords && variation.keywords.length > 0 ? (
                variation.keywords.map((k: string) => (
                  <Chip key={k} size="sm" variant="flat" color="secondary" className="mb-1 mr-1">
                    {k}
                  </Chip>
                ))
              ) : common_attributes.keywords && common_attributes.keywords.length > 0 ? (
                <>
                  <span className="mr-1 text-foreground-500">(Inherits common)</span>
                  {common_attributes.keywords.map((k: string) => (
                    <Chip key={k} size="sm" variant="flat" className="mb-1 mr-1">
                      {k}
                    </Chip>
                  ))}
                </>
              ) : (
                <span className="text-foreground-500">None</span>
              )}
            </div>
            <ToolSelector
              selectedTools={variation.tools || []}
              onSelectionChange={(newTools) => onToolSelectionChange(index, newTools)}
              searchTerm={multiToolSearchTerms[index] || ''}
              onSearchTermChange={(term) => onMultiToolSearchTermChange(index, term)}
              allAvailableTools={availableTools}
            />
          </CardBody>
        </Card>
      ))}
    </div>
  )
}

export default MultiAgentPreview

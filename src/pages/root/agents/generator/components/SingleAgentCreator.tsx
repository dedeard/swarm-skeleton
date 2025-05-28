import { IAgentPayload, IChatMessage, IMCPHubToolRecommendation } from '@/types/agent'
import { ITool } from '@/types/tool'
import { Button } from '@heroui/react'
import { CheckCircle, Trash2 } from 'lucide-react'
import React from 'react'
import AgentDescriptionForm from './AgentDescriptionForm'
import MCPHubRecommendations from './MCPHubRecommendations'
import ProcessingLog from './ProcessingLog'
import SingleAgentPreview from './SingleAgentPreview'

interface SingleAgentCreatorProps {
  // State
  userInput: string
  extractedAgentData: Partial<IAgentPayload>
  mcphubRecommendations: IMCPHubToolRecommendation[]
  chatMessages: IChatMessage[]
  isProcessing: boolean
  isToolsAutofilling: boolean
  toolSearchTerm: string
  availableTools: ITool[]

  // Actions
  setUserInput: (input: string) => void
  setToolSearchTerm: (term: string) => void
  handleProcessUserInput: () => void
  handleCreateAgent: () => void
  handleReset: () => void
  handleToolSelectionChange: (tools: string[]) => void
  canCreate: () => boolean
}

const SingleAgentCreator: React.FC<SingleAgentCreatorProps> = ({
  userInput,
  extractedAgentData,
  mcphubRecommendations,
  chatMessages,
  isProcessing,
  toolSearchTerm,
  availableTools,
  setUserInput,
  setToolSearchTerm,
  handleProcessUserInput,
  handleCreateAgent,
  handleReset,
  handleToolSelectionChange,
  canCreate,
}) => {
  const hasExtractedData =
    extractedAgentData.agent_name || extractedAgentData.description || (extractedAgentData.tools && extractedAgentData.tools.length > 0)

  return (
    <div className="space-y-6">
      <AgentDescriptionForm
        userInput={userInput}
        onUserInputChange={setUserInput}
        onSubmit={handleProcessUserInput}
        isProcessing={isProcessing}
        isMultiAgent={false}
      />

      <ProcessingLog chatMessages={chatMessages} />

      {hasExtractedData && (
        <SingleAgentPreview
          extractedAgentData={extractedAgentData}
          toolSearchTerm={toolSearchTerm}
          onToolSearchTermChange={setToolSearchTerm}
          onToolSelectionChange={handleToolSelectionChange}
          availableTools={availableTools}
        />
      )}

      {(mcphubRecommendations || []).length > 0 && <MCPHubRecommendations recommendations={mcphubRecommendations} />}

      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button
          color="success"
          variant="solid"
          onClick={handleCreateAgent}
          disabled={!canCreate()}
          startContent={<CheckCircle />}
          className="w-full min-w-[150px] sm:w-auto"
        >
          Create Agent
        </Button>
        <Button color="danger" variant="ghost" onClick={handleReset} startContent={<Trash2 />} className="w-full sm:w-auto">
          Reset
        </Button>
      </div>
    </div>
  )
}

export default SingleAgentCreator

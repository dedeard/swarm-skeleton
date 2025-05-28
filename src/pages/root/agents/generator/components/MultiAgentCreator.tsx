import { IChatMessage, IMultiAgentParseData } from '@/types/agent'
import { ITool } from '@/types/tool'
import { Button, Card, CardBody } from '@heroui/react'
import { CheckCircle, Trash2 } from 'lucide-react'
import React from 'react'
import AgentDescriptionForm from './AgentDescriptionForm'
import MultiAgentPreview from './MultiAgentPreview'
import ProcessingLog from './ProcessingLog'

interface MultiAgentCreatorProps {
  // State
  userInput: string
  multiAgentParseResponse: IMultiAgentParseData | null
  chatMessages: IChatMessage[]
  isProcessing: boolean
  isToolsAutofilling: boolean
  multiToolSearchTerms: Record<number, string>
  availableTools: ITool[]

  // Actions
  setUserInput: (input: string) => void
  setMultiToolSearchTerm: (index: number, term: string) => void
  handleProcessUserInput: () => void
  handleCreateAgents: () => void
  handleReset: () => void
  handleToolSelectionChange: (agentIndex: number, tools: string[]) => void
  canCreate: () => boolean
}

const MultiAgentCreator: React.FC<MultiAgentCreatorProps> = ({
  userInput,
  multiAgentParseResponse,
  chatMessages,
  isProcessing,
  multiToolSearchTerms,
  availableTools,
  setUserInput,
  setMultiToolSearchTerm,
  handleProcessUserInput,
  handleCreateAgents,
  handleReset,
  handleToolSelectionChange,
  canCreate,
}) => {
  const hasMultiAgentData = multiAgentParseResponse !== null

  return (
    <div className="space-y-6">
      <Card>
        <CardBody className="p-6">
          <AgentDescriptionForm
            userInput={userInput}
            onUserInputChange={setUserInput}
            onSubmit={handleProcessUserInput}
            isProcessing={isProcessing}
            isMultiAgent={true}
          />
        </CardBody>
      </Card>

      {hasMultiAgentData && (
        <MultiAgentPreview
          multiAgentParseResponse={multiAgentParseResponse}
          multiToolSearchTerms={multiToolSearchTerms}
          onMultiToolSearchTermChange={setMultiToolSearchTerm}
          onToolSelectionChange={handleToolSelectionChange}
          availableTools={availableTools}
        />
      )}

      <ProcessingLog chatMessages={chatMessages} />

      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button
          color="success"
          variant="solid"
          onClick={handleCreateAgents}
          disabled={!canCreate()}
          startContent={<CheckCircle />}
          className="w-full min-w-[150px] sm:w-auto"
        >
          Create Agents
        </Button>
        <Button color="danger" variant="ghost" onClick={handleReset} startContent={<Trash2 />} className="w-full sm:w-auto">
          Reset
        </Button>
      </div>
    </div>
  )
}

export default MultiAgentCreator

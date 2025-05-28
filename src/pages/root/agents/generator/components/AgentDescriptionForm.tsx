import { Button, Textarea } from '@heroui/react'
import { Sparkles } from 'lucide-react'
import React from 'react'

interface AgentDescriptionFormProps {
  userInput: string
  onUserInputChange: (input: string) => void
  onSubmit: () => void
  isProcessing: boolean
  isMultiAgent?: boolean
}

const AgentDescriptionForm: React.FC<AgentDescriptionFormProps> = ({
  userInput,
  onUserInputChange,
  onSubmit,
  isProcessing,
  isMultiAgent = false,
}) => {
  return (
    <div className="space-y-4">
      <Textarea
        label="Provide a detailed description of the agent you want to create..."
        placeholder={
          isMultiAgent
            ? 'e.g., Create three agents: a task manager that organizes my daily activities, a data analyst that helps with statistical problems, and a creative writer that assists with content creation'
            : 'e.g., Make me an agent that can manage my tasks and help solve statistical problems in a friendly manner'
        }
        value={userInput}
        onValueChange={onUserInputChange}
        minRows={4}
        maxRows={8}
        description={
          isMultiAgent
            ? 'Tip: Clearly describe multiple agents and how they differ from each other.'
            : 'Be as detailed as possible for better extraction.'
        }
      />
      <div className="flex justify-end">
        <Button
          color="success"
          variant="faded"
          disabled={!userInput.trim() || isProcessing}
          startContent={<Sparkles />}
          onPress={onSubmit}
          isLoading={isProcessing}
        >
          Parse
        </Button>
      </div>
    </div>
  )
}

export default AgentDescriptionForm

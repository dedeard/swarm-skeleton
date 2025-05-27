import { IAgentPayload, IAvailableFieldInfo, IChatMessage, IMCPHubToolRecommendation, IMultiAgentParseData } from '@/types/agent' // Assuming ITool is in agent.d.ts or similar
import { ITool } from '@/types/tool'
import { Button, Card, CardBody, CardHeader, Switch, Textarea, useDisclosure } from '@heroui/react'
import { CheckCircle, ClipboardList, FilePlus, Info, Sparkles, Trash2, Users } from 'lucide-react' // Ensure these are imported
import React, { useCallback, useState } from 'react'
import AgentFieldDescriptionsModal from './AgentFieldDescriptionsModal' // Import the new modal component
import MCPHubRecommendations from './MCPHubRecommendations'
import MultiAgentPreview from './MultiAgentPreview'
import SingleAgentPreview from './SingleAgentPreview'

const generateId = () => Math.random().toString(36).substr(2, 9)

// Dummy Data
const dummyAgentData: Partial<IAgentPayload> = {
  agent_name: 'Dummy Agent',
  description: 'This is a dummy agent for UI display purposes.',
  agent_style: 'Friendly',
  on_status: true,
  tools: ['tool1', 'tool2'],
  keywords: ['dummy', 'example', 'ui'],
  company_id: 'dummy_company_id',
}

const dummyMultiAgentParseResponse: IMultiAgentParseData = {
  has_multi_agent: true,
  agent_count: 2,
  common_attributes: {
    agent_name: 'Common Dummy Base',
    description: 'Common description for dummy agents.',
    agent_style: 'Neutral',
    on_status: true,
    tools: ['tool_common_1'],
    keywords: ['common', 'base'],
  },
  agent_variations: [
    {
      agent_name: 'Dummy Variation 1',
      description: 'Description for dummy variation 1.',
      tools: ['tool_var1_1', 'tool_var1_2'],
      keywords: ['variation1', 'dummy'],
    },
    {
      agent_name: 'Dummy Variation 2',
      description: 'Description for dummy variation 2.',
      tools: ['tool_var2_1'],
      keywords: ['variation2', 'example'],
    },
  ],
  need_more_info: false,
  missing_info: '',
}

const dummyAvailableFieldsInfo: IAvailableFieldInfo = {
  fields: ['agent_name', 'description', 'agent_style', 'tools', 'keywords'],
  descriptions: {
    agent_name: 'The name of the agent.',
    description: 'A brief description of what the agent does.',
    agent_style: 'The personality or style of the agent.',
    tools: 'A list of tools the agent can use.',
    keywords: 'Keywords associated with the agent.',
  },
}

const dummyMCPHubRecommendations: IMCPHubToolRecommendation[] = [
  { name: 'Dummy Rec Tool 1', description: 'A highly recommended dummy tool.', url: '#' },
  { name: 'Dummy Rec Tool 2', description: 'Another great dummy tool for your consideration.', url: '#' },
]

const dummyAvailableTools: ITool[] = [
  {
    tool_id: 'tool1',
    name: 'Dummy Tool Alpha',
    description: 'Alpha dummy tool description.',
    on_status: 'Online',
    versions: [], // Add versions property
  },
  {
    tool_id: 'tool2',
    name: 'Dummy Tool Beta',
    description: 'Beta dummy tool description.',
    on_status: 'Predefined',
    versions: [], // Add versions property
  },
  {
    tool_id: 'tool_common_1',
    name: 'Common Dummy Tool',
    description: 'A common tool for all dummies.',
    on_status: 'Online',
    versions: [], // Add versions property
  },
  {
    tool_id: 'tool_var1_1',
    name: 'Variation 1 Tool A',
    description: 'Tool A for variation 1.',
    on_status: 'Offline',
    versions: [], // Add versions property
  },
  {
    tool_id: 'tool_var1_2',
    name: 'Variation 1 Tool B',
    description: 'Tool B for variation 1.',
    on_status: 'Online',
    versions: [], // Add versions property
  },
  {
    tool_id: 'tool_var2_1',
    name: 'Variation 2 Tool X',
    description: 'Tool X for variation 2.',
    on_status: 'Predefined',
    versions: [], // Add versions property
  },
]

interface AgentCreatorState {
  userInput: string
  isMultiAgentMode: boolean
  extractedAgentData: Partial<IAgentPayload>
  multiAgentParseResponse: IMultiAgentParseData | null

  availableFieldsInfo: IAvailableFieldInfo | null

  mcphubRecommendations: IMCPHubToolRecommendation[]

  chatMessages: IChatMessage[]
  currentCompanyId?: string
}

const AgentCreator: React.FC = () => {
  const availableToolsFromStore = dummyAvailableTools // Use dummy tools

  const [state, setState] = useState<AgentCreatorState>({
    userInput: 'Create a helpful assistant agent.',
    isMultiAgentMode: false,
    extractedAgentData: { ...dummyAgentData },
    multiAgentParseResponse: null, // Set to dummyMultiAgentParseResponse when isMultiAgentMode is true initially if needed
    availableFieldsInfo: { ...dummyAvailableFieldsInfo },
    mcphubRecommendations: [...dummyMCPHubRecommendations],
    chatMessages: [
      { id: generateId(), role: 'user', content: 'Initial dummy user message.', timestamp: new Date().toISOString() },
      { id: generateId(), role: 'agent', content: 'Initial dummy agent response.', timestamp: new Date().toISOString() },
    ],
  })

  const { isOpen: isFieldHelpModalOpen, onOpen: onFieldHelpModalOpen, onClose: onFieldHelpModalClose } = useDisclosure()
  const [toolSearchTerm, setToolSearchTerm] = useState('')
  const [multiToolSearchTerms, setMultiToolSearchTerms] = useState<Record<number, string>>({})

  const addChatMessage = useCallback((role: IChatMessage['role'], content: string) => {
    setState((prev) => ({
      ...prev,
      chatMessages: [...prev.chatMessages, { id: generateId(), role, content, timestamp: new Date().toISOString() }],
    }))
  }, [])

  const handleProcessUserInput = async () => {
    // Simplified: Just add chat messages and toggle display based on mode
    addChatMessage('user', state.userInput)
    addChatMessage('agent', 'Processing your request (dummy)...')

    if (state.isMultiAgentMode) {
      setState((prev) => ({ ...prev, multiAgentParseResponse: { ...dummyMultiAgentParseResponse } }))
      addChatMessage('agent', `Detected ${dummyMultiAgentParseResponse.agent_count} agents (dummy).`)
    } else {
      setState((prev) => ({
        ...prev,
        extractedAgentData: { ...dummyAgentData, agent_name: 'Processed Dummy Agent', description: state.userInput },
      }))
      addChatMessage(
        'agent',
        `Extracted agent details (dummy). Name: ${dummyAgentData.agent_name}. Tools suggested: ${dummyAgentData.tools?.length}.`,
      )
    }
    // setState((prev) => ({ ...prev, userInput: '' })) // Keep user input for demo or clear as preferred
  }

  const handleCreateAgents = async () => {
    addChatMessage('agent', 'Attempting to create agent(s) (dummy)...')
    let createdCount = 0
    let totalToCreate = 0

    if (state.isMultiAgentMode && state.multiAgentParseResponse) {
      totalToCreate = state.multiAgentParseResponse.agent_variations.length
      createdCount = totalToCreate // Assume all created for dummy
    } else if (!state.isMultiAgentMode && state.extractedAgentData.agent_name) {
      totalToCreate = 1
      createdCount = 1 // Assume created for dummy
    }

    if (createdCount > 0) {
      // addToast({ title: `Successfully created ${createdCount}/${totalToCreate} agent(s)! (dummy)`, color: 'success' })
      console.log(`Successfully created ${createdCount}/${totalToCreate} agent(s)! (dummy)`)
    } else {
      // addToast({ title: `No agents to create. (dummy)`, color: 'primary' })
      console.log(`No agents to create. (dummy)`)
    }
    addChatMessage('agent', `Created ${createdCount}/${totalToCreate} agent(s) (dummy).`)
    handleReset()
  }

  const canCreate = (): boolean => {
    if (state.isMultiAgentMode) {
      return !!(
        state.multiAgentParseResponse &&
        state.multiAgentParseResponse.agent_variations.length > 0 &&
        state.multiAgentParseResponse.agent_variations.some(
          (v) =>
            (v.agent_name && v.description) ||
            (state.multiAgentParseResponse?.common_attributes.agent_name && state.multiAgentParseResponse?.common_attributes.description),
        )
      )
    }
    return !!(state.extractedAgentData.agent_name && state.extractedAgentData.description)
  }

  const handleReset = () => {
    setState((prev) => ({
      ...prev,
      userInput: '',
      extractedAgentData: { on_status: true, tools: [], ...dummyAgentData }, // Reset to dummy
      multiAgentParseResponse: null, // Or dummyMultiAgentParseResponse if preferred on reset for multi-mode
      mcphubRecommendations: [...dummyMCPHubRecommendations], // Reset to dummy
      chatMessages: prev.chatMessages.some((msg) => msg.content === 'Form has been reset.')
        ? prev.chatMessages
        : [...prev.chatMessages, { id: generateId(), role: 'agent', content: 'Form has been reset.', timestamp: new Date().toISOString() }],
    }))
    setToolSearchTerm('')
    setMultiToolSearchTerms({})
  }

  const handleToolSelectionChange = (agentIndex: number | null, newSelectedTools: string[]) => {
    if (state.isMultiAgentMode && state.multiAgentParseResponse && agentIndex !== null) {
      const updatedVariations = state.multiAgentParseResponse.agent_variations.map((v, i) =>
        i === agentIndex ? { ...v, tools: newSelectedTools } : v,
      )
      setState((prev) => ({
        ...prev,
        multiAgentParseResponse: { ...prev.multiAgentParseResponse!, agent_variations: updatedVariations },
      }))
    } else {
      setState((prev) => ({
        ...prev,
        extractedAgentData: { ...prev.extractedAgentData, tools: newSelectedTools },
      }))
    }
  }

  return (
    <div className="container mx-auto max-w-5xl space-y-6 p-4">
      <header className="text-center">
        <h1 className="mb-2 text-3xl font-bold">Agent Creator</h1>
        <p className="text-foreground-600">Describe your agent, and we'll help you set it up.</p>
      </header>

      <Card>
        <CardBody className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Agent Description</h2>
            <div className="flex items-center gap-3">
              <Switch
                isSelected={state.isMultiAgentMode}
                onValueChange={(val) => {
                  addChatMessage('agent', `Switched to ${val ? 'Multi-Agent' : 'Single-Agent'} mode.`)
                  setState((prev) => ({
                    ...prev,
                    isMultiAgentMode: val,
                    extractedAgentData: { on_status: true, tools: [], ...(val ? {} : dummyAgentData) }, // Clear or set dummy
                    multiAgentParseResponse: val ? dummyMultiAgentParseResponse : null, // Set or clear dummy
                    userInput: '', // Clear user input on mode switch
                    mcphubRecommendations: [...dummyMCPHubRecommendations], // Reset recs
                  }))
                }}
                size="lg"
                startContent={<FilePlus />}
                endContent={<Users />}
              >
                Multi-Agent Mode
              </Switch>
              <Button isIconOnly variant="light" onPress={onFieldHelpModalOpen} title="Field Help">
                <Info size={20} />
              </Button>
            </div>
          </div>

          <Textarea
            label={
              state.isMultiAgentMode
                ? 'Describe common attributes and variations for multiple agents...'
                : 'Describe the single agent you want to create...'
            }
            placeholder="e.g., A customer support agent that can answer questions about product X and escalate complex issues. It should use the FAQ tool and the ticketing tool."
            value={state.userInput}
            onValueChange={(val) => setState((prev) => ({ ...prev, userInput: val }))}
            minRows={5}
            maxRows={10}
            className="mb-4"
            description={
              state.isMultiAgentMode
                ? 'Tip: Clearly separate descriptions for different agent types or define commonalities first.'
                : 'Be as detailed as possible for better extraction.'
            }
          />
          <div className="flex justify-end gap-3">
            <Button
              color="primary"
              onClick={handleProcessUserInput}
              disabled={!state.userInput.trim()} // Only disable if no input
              startContent={<Sparkles />}
            >
              Extract & Autofill (Dummy)
            </Button>
          </div>
        </CardBody>
      </Card>

      {!state.isMultiAgentMode &&
        (state.extractedAgentData.agent_name ||
          state.extractedAgentData.description ||
          (state.extractedAgentData.tools && state.extractedAgentData.tools.length > 0)) && (
          <SingleAgentPreview
            extractedAgentData={state.extractedAgentData}
            toolSearchTerm={toolSearchTerm}
            onToolSearchTermChange={setToolSearchTerm}
            onToolSelectionChange={(newTools) => handleToolSelectionChange(null, newTools)}
            availableTools={availableToolsFromStore}
          />
        )}
      {state.isMultiAgentMode && state.multiAgentParseResponse && (
        <MultiAgentPreview
          multiAgentParseResponse={state.multiAgentParseResponse}
          multiToolSearchTerms={multiToolSearchTerms}
          onMultiToolSearchTermChange={(index, term) => setMultiToolSearchTerms((prev) => ({ ...prev, [index]: term }))}
          onToolSelectionChange={handleToolSelectionChange}
          availableTools={availableToolsFromStore}
        />
      )}

      {((!state.isMultiAgentMode && state.extractedAgentData.keywords && state.extractedAgentData.keywords.length > 0) ||
        (state.isMultiAgentMode &&
          state.multiAgentParseResponse &&
          ((state.multiAgentParseResponse.common_attributes.keywords &&
            state.multiAgentParseResponse.common_attributes.keywords.length > 0) ||
            state.multiAgentParseResponse.agent_variations.some((v) => v.keywords && v.keywords.length > 0)))) &&
        state.mcphubRecommendations.length > 0 && <MCPHubRecommendations recommendations={state.mcphubRecommendations} />}

      {state.chatMessages.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <h3 className="flex items-center gap-2 text-xl font-semibold">
              <ClipboardList /> Processing Log
            </h3>
          </CardHeader>
          <CardBody className="max-h-60 space-y-2 overflow-y-auto pr-2">
            {state.chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-md p-2 text-sm ${msg.role === 'user' ? 'bg-primary-50 text-primary-700' : 'bg-content2 text-foreground-700'}`}
              >
                <span className="font-semibold capitalize">{msg.role}: </span>
                {msg.content}
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button
          color="success"
          variant="solid"
          onClick={handleCreateAgents}
          disabled={!canCreate()}
          startContent={<CheckCircle />}
          className="w-full min-w-[150px] sm:w-auto"
        >
          Create Agent(s) (Dummy)
        </Button>
        <Button color="danger" variant="ghost" onClick={handleReset} startContent={<Trash2 />} className="w-full sm:w-auto">
          Reset Form
        </Button>
      </div>

      <AgentFieldDescriptionsModal
        isOpen={isFieldHelpModalOpen}
        onClose={onFieldHelpModalClose}
        availableFieldsInfo={state.availableFieldsInfo}
      />
    </div>
  )
}

export default AgentCreator

import {
  autofillAgentField,
  createAgent,
  extractAgentKeywords,
  getAgentFieldMetadata,
  parseMultiAgentInput,
  parseUserInputStream,
} from '@/services/agent.service'
import { useToolStore } from '@/store/tool.store'
import { IAgentPayload, IAvailableFieldInfo, IChatMessage, IMCPHubToolRecommendation, IMultiAgentParseData } from '@/types/agent'
import { Button, Card, CardBody, CardHeader, Switch, Textarea, useDisclosure } from '@heroui/react'
import { CheckCircle, ClipboardList, FilePlus, Info, Sparkles, Trash2, Users } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import AgentFieldDescriptionsModal from './AgentFieldDescriptionsModal'
import MCPHubRecommendations from './MCPHubRecommendations'
import MultiAgentPreview from './MultiAgentPreview'
import SingleAgentPreview from './SingleAgentPreview'

const generateId = () => Math.random().toString(36).substr(2, 9)

// Default model settings (matching the example)
const DEFAULT_MODEL = 'openai/gpt-4o-mini'
const DEFAULT_TEMPERATURE = 0

interface AgentCreatorState {
  userInput: string
  isMultiAgentMode: boolean
  extractedAgentData: Partial<IAgentPayload>
  multiAgentParseResponse: IMultiAgentParseData | null
  availableFieldsInfo: IAvailableFieldInfo | null
  mcphubRecommendations: IMCPHubToolRecommendation[]
  chatMessages: IChatMessage[]
  isProcessing: boolean
  isToolsAutofilling: boolean
}

const AgentCreator: React.FC = () => {
  const { tools: availableToolsFromStore, fetchTools } = useToolStore()
  const [isToolsLoading, setIsToolsLoading] = useState(true)

  const [state, setState] = useState<AgentCreatorState>({
    userInput: '',
    isMultiAgentMode: false,
    extractedAgentData: { on_status: true, tools: [] },
    multiAgentParseResponse: null,
    availableFieldsInfo: null,
    mcphubRecommendations: [],
    chatMessages: [],
    isProcessing: false,
    isToolsAutofilling: false,
  })

  const { isOpen: isFieldHelpModalOpen, onOpen: onFieldHelpModalOpen, onClose: onFieldHelpModalClose } = useDisclosure()
  const [toolSearchTerm, setToolSearchTerm] = useState('')
  const [multiToolSearchTerms, setMultiToolSearchTerms] = useState<Record<number, string>>({})

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Load tools
        await fetchTools()

        // Load field metadata
        const fieldMetadata = await getAgentFieldMetadata()
        setState((prev) => ({ ...prev, availableFieldsInfo: fieldMetadata }))

        // Add welcome message
        addChatMessage('assistant', 'Give me a detailed description of an agent you would like to make.')
      } catch (error) {
        console.error('Failed to initialize agent creator:', error)
        addChatMessage('assistant', 'There was an error loading the Agent Creator. Please try refreshing the page.')
      } finally {
        setIsToolsLoading(false)
      }
    }

    initializeData()
  }, [fetchTools])

  const addChatMessage = useCallback((role: IChatMessage['role'], content: string) => {
    setState((prev) => ({
      ...prev,
      chatMessages: [...prev.chatMessages, { id: generateId(), role, content, timestamp: new Date().toISOString() }],
    }))
  }, [])

  const processStreamEvent = (eventData: string, accumulatedFields: Record<string, any>) => {
    const lines = eventData.split('\n')
    let eventType = ''
    let data = ''

    for (const line of lines) {
      if (line.startsWith('event:')) {
        eventType = line.substring(6).trim()
      } else if (line.startsWith('data:')) {
        data = line.substring(5).trim()
      }
    }

    if (!data || data === '[DONE]') return false

    try {
      const jsonData = JSON.parse(data)

      if (eventType === 'field_update') {
        for (const [field, value] of Object.entries(jsonData)) {
          accumulatedFields[field] = value

          // Update state in real-time
          setState((prev) => ({
            ...prev,
            extractedAgentData: {
              ...prev.extractedAgentData,
              [field]: field === 'tools' ? (Array.isArray(value) ? value : []) : value,
              on_status: true, // Always set to true
            },
          }))
        }
        return true
      }
    } catch (error) {
      console.error('Error processing stream event:', error)
    }

    return false
  }

  const handleProcessUserInput = async () => {
    if (state.isProcessing || !state.userInput.trim()) return

    addChatMessage('user', state.userInput)

    setState((prev) => ({ ...prev, isProcessing: true }))

    try {
      if (state.isMultiAgentMode) {
        // Handle multi-agent parsing
        const multiAgentResponse = await parseMultiAgentInput({
          user_input: state.userInput,
          model_name: DEFAULT_MODEL,
          temperature: DEFAULT_TEMPERATURE,
          existing_data: Object.keys(state.extractedAgentData).length > 0 ? state.extractedAgentData : undefined,
        })

        if (multiAgentResponse.need_more_info) {
          addChatMessage(
            'assistant',
            `I need more information about the agents you want to create. ${multiAgentResponse.missing_info || 'Please provide details about each agent and how they differ.'}`,
          )
          return
        }

        if (!multiAgentResponse.has_multi_agent) {
          addChatMessage('assistant', "I couldn't detect multiple agents in your description. Switching to single agent mode.")
          setState((prev) => ({ ...prev, isMultiAgentMode: false }))
          return
        }

        setState((prev) => ({
          ...prev,
          multiAgentParseResponse: multiAgentResponse,
          extractedAgentData: { ...prev.extractedAgentData, ...multiAgentResponse.common_attributes },
        }))

        // Extract keywords for all agents
        await extractKeywordsForAllAgents(multiAgentResponse)

        // Autofill tools for all agents
        await autofillToolsForMultiAgent(multiAgentResponse)

        addChatMessage(
          'assistant',
          `I've detected ${multiAgentResponse.agent_count} agents in your description. You can review the details and create the agents when ready.`,
        )
      } else {
        // Handle single agent streaming parsing
        const response = await parseUserInputStream({
          user_input: state.userInput,
          model_name: DEFAULT_MODEL,
          temperature: DEFAULT_TEMPERATURE,
          existing_field_values: Object.keys(state.extractedAgentData).length > 0 ? state.extractedAgentData : undefined,
        })

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        const accumulatedFields: Record<string, any> = {}
        let fieldUpdateReceived = false

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })

            let eventEnd = buffer.indexOf('\n\n')
            while (eventEnd > -1) {
              const eventData = buffer.substring(0, eventEnd)
              buffer = buffer.substring(eventEnd + 2)

              if (processStreamEvent(eventData, accumulatedFields)) {
                fieldUpdateReceived = true
              }

              eventEnd = buffer.indexOf('\n\n')
            }
          }
        }

        if (!fieldUpdateReceived) {
          addChatMessage(
            'assistant',
            "I couldn't extract any information from your description. Please provide more specific details about what you want the agent to do.",
          )
          return
        }

        // Extract keywords if we have name and description
        if (state.extractedAgentData.agent_name && state.extractedAgentData.description) {
          try {
            const keywordsResponse = await extractAgentKeywords({
              agent_name: state.extractedAgentData.agent_name,
              description: state.extractedAgentData.description,
              model_name: DEFAULT_MODEL,
              temperature: DEFAULT_TEMPERATURE,
            })

            setState((prev) => ({
              ...prev,
              extractedAgentData: { ...prev.extractedAgentData, keywords: keywordsResponse.keywords },
            }))
          } catch (error) {
            console.warn('Error extracting keywords:', error)
          }
        }

        // Autofill tools
        await autofillTools()

        // Load MCPHub recommendations
        await loadMCPHubRecommendations()

        addChatMessage(
          'assistant',
          "I've extracted the agent details from your description. You can review and modify them before creating the agent.",
        )
      }
    } catch (error) {
      console.error('Error processing user input:', error)
      addChatMessage('assistant', "I'm sorry, I encountered an error processing your request. Please try again.")
    } finally {
      setState((prev) => ({ ...prev, isProcessing: false }))
    }
  }

  const extractKeywordsForAllAgents = async (multiAgentResponse: IMultiAgentParseData) => {
    try {
      // Extract common keywords if needed
      if (multiAgentResponse.common_attributes?.agent_name && multiAgentResponse.common_attributes?.description) {
        const commonKeywords = await extractAgentKeywords({
          agent_name: multiAgentResponse.common_attributes.agent_name,
          description: multiAgentResponse.common_attributes.description,
          model_name: DEFAULT_MODEL,
          temperature: DEFAULT_TEMPERATURE,
        })
        multiAgentResponse.common_attributes.keywords = commonKeywords.keywords
      }

      // Extract keywords for variations
      if (multiAgentResponse.agent_variations) {
        await Promise.all(
          multiAgentResponse.agent_variations.map(async (agent) => {
            if (agent.agent_name && agent.description) {
              const keywords = await extractAgentKeywords({
                agent_name: agent.agent_name,
                description: agent.description,
                model_name: DEFAULT_MODEL,
                temperature: DEFAULT_TEMPERATURE,
              })
              agent.keywords = keywords.keywords
            } else {
              agent.keywords = multiAgentResponse.common_attributes?.keywords || ['automation', 'helper', 'assistant']
            }
          }),
        )
      }

      setState((prev) => ({ ...prev, multiAgentParseResponse: multiAgentResponse }))
    } catch (error) {
      console.warn('Error extracting keywords for multi-agent:', error)
    }
  }

  const autofillTools = async () => {
    if (!state.extractedAgentData.agent_name && !state.extractedAgentData.description) return

    setState((prev) => ({ ...prev, isToolsAutofilling: true }))

    try {
      const toolsResponse = await autofillAgentField({
        field_name: 'tools',
        json_field: {
          agent_name: state.extractedAgentData.agent_name || '',
          description: state.extractedAgentData.description || '',
          keywords: state.extractedAgentData.keywords || [],
        },
        existing_field_value: '',
        return_tool_ids: true,
      })

      const suggestedTools = Array.isArray(toolsResponse.autofilled_value) ? toolsResponse.autofilled_value : []

      setState((prev) => ({
        ...prev,
        extractedAgentData: { ...prev.extractedAgentData, tools: suggestedTools },
      }))
    } catch (error) {
      console.warn('Error autofilling tools:', error)
    } finally {
      setState((prev) => ({ ...prev, isToolsAutofilling: false }))
    }
  }

  const autofillToolsForMultiAgent = async (multiAgentResponse: IMultiAgentParseData) => {
    setState((prev) => ({ ...prev, isToolsAutofilling: true }))

    try {
      for (let i = 0; i < multiAgentResponse.agent_variations.length; i++) {
        const agent = multiAgentResponse.agent_variations[i]

        if (!agent.agent_name && !agent.description) continue

        const agentKeywords =
          agent.keywords && agent.keywords.length > 0 ? agent.keywords : multiAgentResponse.common_attributes.keywords || []

        const toolsResponse = await autofillAgentField({
          field_name: 'tools',
          json_field: {
            agent_name: agent.agent_name || multiAgentResponse.common_attributes.agent_name || '',
            description: agent.description || multiAgentResponse.common_attributes.description || '',
            keywords: agentKeywords,
          },
          existing_field_value: '',
          return_tool_ids: true,
        })

        const suggestedTools = Array.isArray(toolsResponse.autofilled_value) ? toolsResponse.autofilled_value : []

        multiAgentResponse.agent_variations[i].tools = suggestedTools
      }

      setState((prev) => ({ ...prev, multiAgentParseResponse: multiAgentResponse }))
    } catch (error) {
      console.warn('Error autofilling tools for multi-agent:', error)
    } finally {
      setState((prev) => ({ ...prev, isToolsAutofilling: false }))
    }
  }

  const loadMCPHubRecommendations = async () => {
    try {
      const keywords = state.extractedAgentData.keywords || []

      const mcpResponse = await autofillAgentField({
        field_name: 'mcphub_recommended_tools',
        json_field: { keywords },
        existing_field_value: '',
        return_tool_ids: false,
      })

      let recommendations: IMCPHubToolRecommendation[] = []

      if (typeof mcpResponse.autofilled_value === 'string') {
        try {
          recommendations = JSON.parse(mcpResponse.autofilled_value)
        } catch (e) {
          console.warn('Error parsing MCPHub JSON:', e)
        }
      } else if (Array.isArray(mcpResponse.autofilled_value)) {
        recommendations = mcpResponse.autofilled_value
      }

      setState((prev) => ({ ...prev, mcphubRecommendations: recommendations }))
    } catch (error) {
      console.warn('Error loading MCPHub recommendations:', error)
    }
  }

  const handleCreateAgents = async () => {
    addChatMessage('assistant', 'Creating agent(s)...')

    try {
      if (state.isMultiAgentMode && state.multiAgentParseResponse) {
        // Create multiple agents
        const agents = prepareMultiAgentDataForCreation()
        const results: Array<{ success: boolean; name: string; error?: string }> = []

        for (const agentData of agents) {
          try {
            await createAgent(agentData)
            results.push({ success: true, name: agentData.agent_name })
          } catch (error) {
            console.error('Error creating agent:', error)
            results.push({
              success: false,
              name: agentData.agent_name,
              error: error instanceof Error ? error.message : 'Unknown error',
            })
          }
        }

        const successCount = results.filter((r) => r.success).length
        let message = `Created ${successCount} out of ${agents.length} agents:\n\n`
        results.forEach((result, index) => {
          message += `${index + 1}. ${result.name}: ${result.success ? '✅ Success' : '❌ Failed'}\n`
        })

        addChatMessage('assistant', message)

        if (successCount > 0) {
          setTimeout(() => handleReset(), 3000)
        }
      } else {
        // Create single agent
        const agentData = prepareSingleAgentDataForCreation()
        await createAgent(agentData)

        addChatMessage(
          'assistant',
          `Great! I've created your agent "${agentData.agent_name}" with ${agentData.tools.length} tools. You can now find it in the Agents list.`,
        )
        setTimeout(() => handleReset(), 3000)
      }
    } catch (error) {
      console.error('Error creating agent(s):', error)
      addChatMessage('assistant', 'There was an error creating your agent. Please try again.')
    }
  }

  const prepareSingleAgentDataForCreation = (): IAgentPayload => {
    return {
      agent_name: state.extractedAgentData.agent_name || '',
      description: state.extractedAgentData.description || '',
      agent_style: state.extractedAgentData.agent_style || 'Default',
      on_status: state.extractedAgentData.on_status !== false,
      tools: state.extractedAgentData.tools || [],
      company_id: state.extractedAgentData.company_id || '',
      keywords: state.extractedAgentData.keywords || [],
    }
  }

  const prepareMultiAgentDataForCreation = (): IAgentPayload[] => {
    if (!state.multiAgentParseResponse) return []

    return state.multiAgentParseResponse.agent_variations.map((variation) => {
      const commonAttrs = state.multiAgentParseResponse!.common_attributes

      return {
        agent_name: variation.agent_name || commonAttrs.agent_name || '',
        description: variation.description || commonAttrs.description || '',
        agent_style: variation.agent_style || commonAttrs.agent_style || 'Default',
        on_status: variation.on_status !== false,
        tools: variation.tools || [],
        company_id: variation.company_id || commonAttrs.company_id || '',
        keywords: variation.keywords || commonAttrs.keywords || [],
      }
    })
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
      extractedAgentData: { on_status: true, tools: [] },
      multiAgentParseResponse: null,
      mcphubRecommendations: [],
      chatMessages: [
        ...prev.chatMessages,
        {
          id: generateId(),
          role: 'assistant',
          content: 'Form has been reset.',
          timestamp: new Date().toISOString(),
        },
      ],
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
        <p className="text-foreground-600">Describe your agent in detail and our AI will extract the necessary information</p>
      </header>

      <Card>
        <CardBody className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Agent Description</h2>
            <div className="flex items-center gap-3">
              <Switch
                isSelected={state.isMultiAgentMode}
                onValueChange={(val) => {
                  addChatMessage('assistant', `Switched to ${val ? 'Multi-Agent' : 'Single-Agent'} mode.`)
                  setState((prev) => ({
                    ...prev,
                    isMultiAgentMode: val,
                    extractedAgentData: { on_status: true, tools: [] },
                    multiAgentParseResponse: null,
                    userInput: '',
                    mcphubRecommendations: [],
                  }))
                }}
                size="lg"
                startContent={<FilePlus />}
                endContent={<Users />}
              >
                Multi-Agent Creation
              </Switch>
              <Button isIconOnly variant="light" onPress={onFieldHelpModalOpen} title="Available Fields">
                <Info size={20} />
              </Button>
            </div>
          </div>

          <Textarea
            label="Provide a detailed description of the agent you want to create..."
            placeholder="e.g., Make me an agent that can manage my tasks and help solve statistical problems in a friendly manner"
            value={state.userInput}
            onValueChange={(val) => setState((prev) => ({ ...prev, userInput: val }))}
            minRows={4}
            maxRows={8}
            className="mb-4"
            description={
              state.isMultiAgentMode
                ? 'Tip: Clearly describe multiple agents and how they differ from each other.'
                : 'Be as detailed as possible for better extraction.'
            }
          />
          <div className="flex justify-end gap-3">
            <Button
              color="success"
              variant="faded"
              disabled={!state.userInput.trim() || state.isProcessing}
              startContent={<Sparkles />}
              onPress={handleProcessUserInput}
              isLoading={state.isProcessing}
            >
              Parse
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
            {state.chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`rounded-md p-2 text-sm ${
                  msg.role === 'user' ? 'bg-primary-50 text-primary-700' : 'bg-content2 text-foreground-700'
                }`}
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
          Create Agent(s)
        </Button>
        <Button color="danger" variant="ghost" onClick={handleReset} startContent={<Trash2 />} className="w-full sm:w-auto">
          Reset
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

const AgentCreatorPage: React.FC = () => {
  return <AgentCreator />
}

export default AgentCreatorPage

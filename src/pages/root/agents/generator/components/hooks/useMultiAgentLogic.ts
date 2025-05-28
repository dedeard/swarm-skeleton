import { autofillAgentField, extractAgentKeywords, parseMultiAgentInput } from '@/services/agent.service'
import { useAgentStore } from '@/store/agent.store'
import { useToolStore } from '@/store/tool.store'
import { IAgentPayload, IChatMessage, IMCPHubToolRecommendation, IMultiAgentParseData } from '@/types/agent'
import { useCallback, useState } from 'react'

// Default model settings
const DEFAULT_MODEL = 'openai/gpt-4o-mini'
const DEFAULT_TEMPERATURE = 0

interface MultiAgentState {
  userInput: string
  multiAgentParseResponse: IMultiAgentParseData | null
  mcphubRecommendations: IMCPHubToolRecommendation[]
  chatMessages: IChatMessage[]
  isProcessing: boolean
  isToolsAutofilling: boolean
  multiToolSearchTerms: Record<number, string>
}

export const useMultiAgentLogic = () => {
  const { tools: availableToolsFromStore } = useToolStore()
  const agentStore = useAgentStore()

  const [state, setState] = useState<MultiAgentState>({
    userInput: '',
    multiAgentParseResponse: null,
    mcphubRecommendations: [],
    chatMessages: [],
    isProcessing: false,
    isToolsAutofilling: false,
    multiToolSearchTerms: {},
  })

  const addChatMessage = useCallback((role: IChatMessage['role'], content: string) => {
    setState((prev) => ({
      ...prev,
      chatMessages: [...prev.chatMessages, { role, content, timestamp: new Date().toISOString() }],
    }))
  }, [])

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

  const loadMCPHubRecommendations = async (keywords?: string[]) => {
    try {
      const keywordsToUse = keywords || state.multiAgentParseResponse?.common_attributes?.keywords || []

      const mcpResponse = await autofillAgentField({
        field_name: 'mcphub_recommended_tools',
        json_field: { keywords: keywordsToUse },
        existing_field_value: '',
        return_tool_ids: false,
        available_tools: [],
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
          available_tools: [],
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

  const handleProcessUserInput = async () => {
    if (state.isProcessing || !state.userInput.trim()) return

    addChatMessage('user', state.userInput)
    setState((prev) => ({ ...prev, isProcessing: true }))

    try {
      // Handle multi-agent parsing
      const multiAgentResponse = await parseMultiAgentInput({
        user_input: state.userInput,
        model_name: DEFAULT_MODEL,
        temperature: DEFAULT_TEMPERATURE,
        existing_data: state.multiAgentParseResponse ? state.multiAgentParseResponse.common_attributes : undefined,
      })

      if (multiAgentResponse.need_more_info) {
        addChatMessage(
          'assistant',
          `I need more information about the agents you want to create. ${multiAgentResponse.missing_info || 'Please provide details about each agent and how they differ.'}`,
        )
        return
      }

      if (!multiAgentResponse.has_multi_agent) {
        addChatMessage('assistant', "I couldn't detect multiple agents in your description. Please describe multiple distinct agents.")
        return
      }

      setState((prev) => ({
        ...prev,
        multiAgentParseResponse: multiAgentResponse,
      }))

      // Extract keywords for all agents
      await extractKeywordsForAllAgents(multiAgentResponse)

      // Autofill tools for all agents
      await autofillToolsForMultiAgent(multiAgentResponse)

      // Load MCPHub recommendations based on common keywords
      await loadMCPHubRecommendations(multiAgentResponse.common_attributes?.keywords)

      addChatMessage(
        'assistant',
        `I've detected ${multiAgentResponse.agent_count} agents in your description. You can review the details and create the agents when ready.`,
      )
    } catch (error) {
      console.error('Error processing user input:', error)
      addChatMessage('assistant', "I'm sorry, I encountered an error processing your request. Please try again.")
    } finally {
      setState((prev) => ({ ...prev, isProcessing: false }))
    }
  }

  const handleCreateAgents = async () => {
    addChatMessage('assistant', 'Creating agent(s)...')

    try {
      if (!state.multiAgentParseResponse) return

      // Create multiple agents
      const agents = prepareMultiAgentDataForCreation()
      const results = await Promise.all(
        agents.map(async (agentData) => {
          try {
            await agentStore.addAgent(agentData)
            return { success: true, name: agentData.agent_name }
          } catch (error) {
            console.error('Error creating agent:', error)
            return {
              success: false,
              name: agentData.agent_name,
              error: error instanceof Error ? error.message : 'Unknown error',
            }
          }
        }),
      )

      const successCount = results.filter((r) => r.success).length
      let message = `Created ${successCount} out of ${agents.length} agents:\n\n`
      results.forEach((result, index) => {
        message += `${index + 1}. ${result.name}: ${result.success ? '✅ Success' : '❌ Failed'}\n`
      })

      addChatMessage('assistant', message)

      if (successCount > 0) {
        setTimeout(() => handleReset(), 3000)
      }
    } catch (error) {
      console.error('Error creating agent(s):', error)
      addChatMessage('assistant', 'There was an error creating your agents. Please try again.')
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
        keywords: variation.keywords || commonAttrs.keywords || [],
      }
    })
  }

  const canCreate = (): boolean => {
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

  const handleReset = () => {
    setState((prev) => ({
      ...prev,
      userInput: '',
      multiAgentParseResponse: null,
      mcphubRecommendations: [],
      chatMessages: [
        ...prev.chatMessages,
        {
          role: 'assistant',
          content: 'Form has been reset.',
          timestamp: new Date().toISOString(),
        },
      ],
      multiToolSearchTerms: {},
    }))
  }

  const handleToolSelectionChange = (agentIndex: number, newSelectedTools: string[]) => {
    if (!state.multiAgentParseResponse) return

    const updatedVariations = state.multiAgentParseResponse.agent_variations.map((v, i) =>
      i === agentIndex ? { ...v, tools: newSelectedTools } : v,
    )
    setState((prev) => ({
      ...prev,
      multiAgentParseResponse: { ...prev.multiAgentParseResponse!, agent_variations: updatedVariations },
    }))
  }

  const setUserInput = (input: string) => {
    setState((prev) => ({ ...prev, userInput: input }))
  }

  const setMultiToolSearchTerm = (index: number, term: string) => {
    setState((prev) => ({
      ...prev,
      multiToolSearchTerms: { ...prev.multiToolSearchTerms, [index]: term },
    }))
  }

  const initializeWithWelcomeMessage = () => {
    addChatMessage('assistant', 'Describe multiple agents you would like to create and how they differ from each other.')
  }

  return {
    // State
    userInput: state.userInput,
    multiAgentParseResponse: state.multiAgentParseResponse,
    mcphubRecommendations: state.mcphubRecommendations,
    chatMessages: state.chatMessages,
    isProcessing: state.isProcessing,
    isToolsAutofilling: state.isToolsAutofilling,
    multiToolSearchTerms: state.multiToolSearchTerms,
    availableTools: availableToolsFromStore,

    // Actions
    setUserInput,
    setMultiToolSearchTerm,
    handleProcessUserInput,
    handleCreateAgents,
    handleReset,
    handleToolSelectionChange,
    loadMCPHubRecommendations,
    canCreate,
    initializeWithWelcomeMessage,
  }
}

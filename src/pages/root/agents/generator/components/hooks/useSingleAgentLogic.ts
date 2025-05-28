import { autofillAgentField, extractAgentKeywords, parseUserInputStream } from '@/services/agent.service'
import { useAgentStore } from '@/store/agent.store'
import { useToolStore } from '@/store/tool.store'
import { IAgentPayload, IChatMessage, IMCPHubToolRecommendation } from '@/types/agent'
import { useCallback, useState } from 'react'

// Default model settings
const DEFAULT_MODEL = 'openai/gpt-4o-mini'
const DEFAULT_TEMPERATURE = 0

interface SingleAgentState {
  userInput: string
  extractedAgentData: Partial<IAgentPayload & { keywords?: string[] }>
  mcphubRecommendations: IMCPHubToolRecommendation[]
  chatMessages: IChatMessage[]
  isProcessing: boolean
  isToolsAutofilling: boolean
  toolSearchTerm: string
}

export const useSingleAgentLogic = () => {
  const { tools: availableToolsFromStore } = useToolStore()
  const agentStore = useAgentStore()

  const [state, setState] = useState<SingleAgentState>({
    userInput: '',
    extractedAgentData: { on_status: true, tools: [] },
    mcphubRecommendations: [],
    chatMessages: [],
    isProcessing: false,
    isToolsAutofilling: false,
    toolSearchTerm: '',
  })

  const addChatMessage = useCallback((role: IChatMessage['role'], content: string) => {
    setState((prev) => ({
      ...prev,
      chatMessages: [...prev.chatMessages, { role, content, timestamp: new Date().toISOString() }],
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

  const extractKeywords = async (agentData?: Partial<IAgentPayload>) => {
    const dataToUse = agentData || state.extractedAgentData
    if (!dataToUse.agent_name || !dataToUse.description) return

    try {
      const keywordsResponse = await extractAgentKeywords({
        agent_name: dataToUse.agent_name,
        description: dataToUse.description,
        model_name: DEFAULT_MODEL,
        temperature: DEFAULT_TEMPERATURE,
      })

      setState((prev) => ({
        ...prev,
        extractedAgentData: { ...prev.extractedAgentData, keywords: keywordsResponse.keywords },
      }))

      return keywordsResponse.keywords
    } catch (error) {
      console.warn('Error extracting keywords:', error)
    }
  }

  const autofillTools = async (agentData?: Partial<IAgentPayload>) => {
    const dataToUse = agentData || state.extractedAgentData
    if (!dataToUse.agent_name && !dataToUse.description) return

    setState((prev) => ({ ...prev, isToolsAutofilling: true }))

    try {
      const toolsResponse = await autofillAgentField({
        field_name: 'tools',
        available_tools: [],
        json_field: {
          agent_name: dataToUse.agent_name || '',
          description: dataToUse.description || '',
          ...dataToUse,
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

  const loadMCPHubRecommendations = async (keywords?: string[]) => {
    try {
      const keywordsToUse = keywords || state.extractedAgentData.keywords || []

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

  const handleProcessUserInput = async () => {
    if (state.isProcessing || !state.userInput.trim()) return

    addChatMessage('user', state.userInput)
    setState((prev) => ({ ...prev, isProcessing: true }))

    try {
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

      // Ensure we have the latest accumulated data
      const finalAgentData = {
        ...state.extractedAgentData,
        ...accumulatedFields,
        on_status: true,
        tools: Array.isArray(accumulatedFields.tools) ? accumulatedFields.tools : [],
      }

      // Autofill tools with accumulated data
      await autofillTools(finalAgentData)

      // Extract keywords with accumulated data
      const extractedKeywords = await extractKeywords(finalAgentData)

      // Load MCPHub recommendations with extracted keywords
      await loadMCPHubRecommendations(extractedKeywords)

      addChatMessage(
        'assistant',
        "I've extracted the agent details from your description. You can review and modify them before creating the agent.",
      )
    } catch (error) {
      console.error('Error processing user input:', error)
      addChatMessage('assistant', "I'm sorry, I encountered an error processing your request. Please try again.")
    } finally {
      setState((prev) => ({ ...prev, isProcessing: false }))
    }
  }

  const handleCreateAgent = async () => {
    addChatMessage('assistant', 'Creating agent...')

    try {
      const agentData = prepareSingleAgentDataForCreation()
      await agentStore.addAgent(agentData)

      addChatMessage(
        'assistant',
        `Great! I've created your agent "${agentData.agent_name}" with ${agentData.tools.length} tools. You can now find it in the Agents list.`,
      )
      setTimeout(() => handleReset(), 3000)
    } catch (error) {
      console.error('Error creating agent:', error)
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
    }
  }

  const canCreate = (): boolean => {
    return !!(state.extractedAgentData.agent_name && state.extractedAgentData.description)
  }

  const handleReset = () => {
    setState((prev) => ({
      ...prev,
      userInput: '',
      extractedAgentData: { on_status: true, tools: [] },
      mcphubRecommendations: [],
      chatMessages: [
        ...prev.chatMessages,
        {
          role: 'assistant',
          content: 'Form has been reset.',
          timestamp: new Date().toISOString(),
        },
      ],
      toolSearchTerm: '',
    }))
  }

  const handleToolSelectionChange = (newSelectedTools: string[]) => {
    setState((prev) => ({
      ...prev,
      extractedAgentData: { ...prev.extractedAgentData, tools: newSelectedTools },
    }))
  }

  const setUserInput = (input: string) => {
    setState((prev) => ({ ...prev, userInput: input }))
  }

  const setToolSearchTerm = (term: string) => {
    setState((prev) => ({ ...prev, toolSearchTerm: term }))
  }

  const initializeWithWelcomeMessage = () => {
    addChatMessage('assistant', 'Give me a detailed description of an agent you would like to make.')
  }

  return {
    // State
    userInput: state.userInput,
    extractedAgentData: state.extractedAgentData,
    mcphubRecommendations: state.mcphubRecommendations,
    chatMessages: state.chatMessages,
    isProcessing: state.isProcessing,
    isToolsAutofilling: state.isToolsAutofilling,
    toolSearchTerm: state.toolSearchTerm,
    availableTools: availableToolsFromStore,

    // Actions
    setUserInput,
    setToolSearchTerm,
    handleProcessUserInput,
    handleCreateAgent,
    handleReset,
    handleToolSelectionChange,
    canCreate,
    initializeWithWelcomeMessage,
  }
}

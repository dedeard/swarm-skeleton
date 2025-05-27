export interface IAgent {
  agent_id: string
  agent_name: string
  description: string
  agent_style?: string
  on_status: boolean
  tools: Array<string>
  user_id: string
  company_id?: string
  created_at: string
}

export interface IAgentPayload {
  agent_name: string
  description: string
  agent_style: string
  on_status: boolean
  tools: Array<string>
  company_id: string
  keywords?: string[] // Added keywords
}

export type IChatRole = 'user' | 'assistant' | 'system' | string

export interface IChatMessage {
  role: IChatRole
  content: string
  timestamp: string
}

export interface IChatHistory {
  thread_id: string // Converted from threadId
  messages: IChatMessage[]
}

export interface IAgentLog {
  agent_id: string // Converted from agentId
  input_token: number // Converted from inputToken
  output_token: number // Converted from outputToken
  embedding_token: number // Converted from embeddingToken
  pricing: string
  chat_history: IChatHistory[] // Converted from chatHistory
  model_protocol: string // Converted from modelProtocol
  model_temperature: string // Converted from modelTemperature
  media_input: boolean // Converted from mediaInput
  media_output: boolean // Converted from mediaOutput
  use_memory: boolean // Converted from useMemory
  use_tool: boolean // Converted from useTool
  agent_log_id: number // Converted from agentLogId
  date: string
}

export interface IThreadPreview {
  thread_id: string // Converted from threadId
  message_count: number // Converted from messageCount
  first_message_timestamp?: string // Converted from firstMessageTimestamp
  last_message_timestamp?: string // Converted from lastMessageTimestamp
  first_message_snippet?: string // Converted from firstMessageSnippet
  last_message_snippet?: string // Converted from lastMessageSnippet
}

export interface IFieldMetadata {
  name: string
  description: string
}

export interface IAvailableFieldInfo {
  fields: string[]
  descriptions: Record<string, string>
}

export interface IAgentVariation extends Partial<IAgentPayload> {
  agent_name: string // For clarity, let's expect agent_name
  tools: string[]
  keywords?: string[]
}

export interface IMultiAgentParseData {
  common_attributes: Partial<IAgentPayload> & { keywords?: string[] } // Added keywords
  agent_variations: IAgentVariation[]
  agent_count: number
  need_more_info?: boolean
  missing_info?: string
  has_multi_agent?: boolean
}

export interface IAutofillResponse {
  field_name: string
  autofilled_value: any // string | string[] depending on the field
  reasoning?: string
}

export interface IKeywordsResponse {
  keywords: string[]
}

export interface IChatMessage {
  id: string // Add an ID for React keys
  role: 'user' | 'assistant' | 'system' | string
  content: string
  timestamp: string
}

// For MCPHub recommendations if the structure is defined
export interface IMCPHubToolRecommendation {
  name: string
  description: string
  url?: string
  // any other relevant fields
}

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

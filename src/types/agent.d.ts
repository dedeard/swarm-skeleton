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

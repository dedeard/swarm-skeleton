export interface IChat {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

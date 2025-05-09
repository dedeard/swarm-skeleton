import { getLLMs } from '@/services/llm.service'
import { mountStoreDevtool } from '@/utils/mount-store-devtool'
import { create } from 'zustand'

interface LLMState {
  // State
  models: string[]
  LLMloaded: boolean

  // Actions
  fetchLLMs: () => Promise<void>
}

export const useLLMStore = create<LLMState>()((set) => ({
  // Initial state
  models: [],
  LLMloaded: false,

  // Actions
  fetchLLMs: async () => {
    try {
      const { available_models } = await getLLMs()
      set({ models: available_models, LLMloaded: true })
    } catch (error) {
      console.error('Failed to fetch LLMs:', error)
    }
  },
}))

if (import.meta.env.DEV) {
  mountStoreDevtool('llm.store', useLLMStore)
}

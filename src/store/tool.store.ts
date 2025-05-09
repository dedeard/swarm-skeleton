import { createTool, deleteTool, getTool, getTools, updateTool } from '@/services/tool.service'
import { ITool, IToolPayload } from '@/types/tool'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface ToolState {
  // State
  tools: ITool[]
  toolsLoaded: boolean

  // Actions
  fetchTools: () => Promise<void>
  fetchToolById: (toolId: string) => Promise<ITool | undefined>
  addTool: (payload: Partial<IToolPayload>) => Promise<void>
  editTool: (toolId: string, payload: Partial<IToolPayload>) => Promise<void>
  removeTool: (toolId: string) => Promise<void>
}

export const useToolStore = create<ToolState>()(
  devtools(
    (set) => ({
      // Initial state
      tools: [],
      toolsLoaded: false,

      // Actions
      fetchTools: async () => {
        try {
          const tools = await getTools()
          set({ tools, toolsLoaded: true })
        } catch (error) {
          console.error('Failed to fetch tools:', error)
        }
      },

      fetchToolById: async (toolId: string) => {
        try {
          return await getTool(toolId)
        } catch (error) {
          console.error(`Failed to fetch tool ${toolId}:`, error)
          return undefined
        }
      },

      addTool: async (payload: Partial<IToolPayload>) => {
        try {
          const newTool = await createTool(payload)
          set((state) => ({
            tools: [...state.tools, newTool],
          }))
        } catch (error) {
          console.error('Failed to create tool:', error)
        }
      },

      editTool: async (toolId: string, payload: Partial<IToolPayload>) => {
        try {
          const updatedTool = await updateTool(toolId, payload)
          set((state) => ({
            tools: state.tools.map((tool) => (tool.tool_id === toolId ? updatedTool : tool)),
          }))
        } catch (error) {
          console.error(`Failed to update tool ${toolId}:`, error)
        }
      },

      removeTool: async (toolId: string) => {
        try {
          await deleteTool(toolId)
          set((state) => ({
            tools: state.tools.filter((tool) => tool.tool_id !== toolId),
          }))
        } catch (error) {
          console.error(`Failed to delete tool ${toolId}:`, error)
        }
      },
    }),
    { name: 'tool-store' },
  ),
)

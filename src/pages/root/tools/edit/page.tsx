import { useToolStore } from '@/store/tool.store'
import { ITool } from '@/types/tool'
import React from 'react'
import { LoaderFunction, useLoaderData } from 'react-router-dom'
import ToolForm from '../components/ToolForm'

export const Component: React.FC = () => {
  // @ts-expect-error
  const tool = useLoaderData().tool as ITool
  return <ToolForm tool={tool} />
}

export const loader: LoaderFunction = async ({ params }) => {
  // Ensure toolId exists
  const toolId = params.toolId
  if (!toolId) {
    throw new Response('Tool ID is required', { status: 400 })
  }

  try {
    // Get tool store state
    const toolStore = useToolStore.getState()

    // Try to find tool in local cache first
    let tool = toolStore.tools.find((tool) => tool.tool_id === toolId)

    // If not in cache, fetch from API
    if (!tool) {
      tool = await toolStore.fetchToolById(toolId)

      // If still no tool found after API call
      if (!tool) {
        throw new Response(`Tool with ID ${toolId} not found`, { status: 404 })
      }
    }

    return { tool, success: true }
  } catch (error) {
    console.error(`Failed to load tool ${toolId}:`, error)

    // throw 404
    throw new Response(`Tool with ID ${toolId} not found`, { status: 404 })
  }
}

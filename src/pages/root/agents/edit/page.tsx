import AgentForm from '@/pages/root/agents/components/AgentForm'
import { useAgentStore } from '@/store/agent.store'
import { IAgent } from '@/types/agent'
import React from 'react'
import { LoaderFunction, useLoaderData } from 'react-router-dom'

export const Component: React.FC = () => {
  // @ts-expect-error
  const agent = useLoaderData().agent as IAgent
  return <AgentForm agent={agent} />
}

export const loader: LoaderFunction = async ({ params }) => {
  // Ensure agentId exists
  const agentId = params.agentId
  if (!agentId) {
    throw new Response('Agent ID is required', { status: 400 })
  }

  try {
    // Get agent store state
    const agentStore = useAgentStore.getState()

    // Try to find agent in local cache first
    let agent = agentStore.agents.find((agent) => agent.agent_id === agentId)

    // If not in cache, fetch from API
    if (!agent) {
      agent = await agentStore.fetchAgentById(agentId)

      // If still no agent found after API call
      if (!agent) {
        throw new Response(`Agent with ID ${agentId} not found`, { status: 404 })
      }
    }

    return { agent, success: true }
  } catch (error) {
    console.error(`Failed to load agent ${agentId}:`, error)

    // throw 404
    throw new Response(`Agent with ID ${agentId} not found`, { status: 404 })
  }
}

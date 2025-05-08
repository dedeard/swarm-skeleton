import { IAgent, IAgentPayload } from '@/types/agent'
import { getCurrentUserAccessToken } from '@/utils/supabase'

export const getAgents = async () => {
  const access_token = await getCurrentUserAccessToken()

  const resp = await fetch(import.meta.env.VITE_BASE_API_URL + '/agents', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
      accept: '*/*',
    },
  })

  if (!resp.ok) {
    const errorBody = await resp.text()
    console.error(`Error fetching agents: ${resp.status} ${resp.statusText}`, errorBody)
    throw new Error(`Failed to fetch agents: ${resp.statusText}`)
  }

  const data: IAgent[] = await resp.json()

  return data
}

export const getAgent = async (agentId: string) => {
  const access_token = await getCurrentUserAccessToken()

  const resp = await fetch(import.meta.env.VITE_BASE_API_URL + `/agents/${agentId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
      accept: '*/*',
    },
  })

  if (!resp.ok) {
    const errorBody = await resp.text()
    console.error(`Error fetching agent: ${resp.status} ${resp.statusText}`, errorBody)
    throw new Error(`Failed to fetch agent: ${resp.statusText}`)
  }

  const data: IAgent = await resp.json()

  return data
}

export const createAgent = async (payload: IAgentPayload) => {
  const access_token = await getCurrentUserAccessToken()

  const resp = await fetch(import.meta.env.VITE_BASE_API_URL + '/agents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${access_token}`,
      accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!resp.ok) {
    const errorBody = await resp.text()
    console.error(`Error creating agent: ${resp.status} ${resp.statusText}`, errorBody)
    throw new Error(`Failed to create agent: ${resp.statusText}`)
  }

  const data: IAgent = await resp.json()

  return data
}

export const updateAgent = async (agentId: string, payload: IAgentPayload) => {
  const access_token = await getCurrentUserAccessToken()

  const resp = await fetch(import.meta.env.VITE_BASE_API_URL + `/agents/${agentId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${access_token}`,
      accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!resp.ok) {
    const errorBody = await resp.text()
    console.error(`Error updating agent: ${resp.status} ${resp.statusText}`, errorBody)
    throw new Error(`Failed to update agent: ${resp.statusText}`)
  }

  const data: IAgent = await resp.json()

  return data
}

export const deleteAgent = async (agentId: string) => {
  const access_token = await getCurrentUserAccessToken()

  const resp = await fetch(import.meta.env.VITE_BASE_API_URL + `/agents/${agentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${access_token}`,
      accept: '*/*',
    },
  })

  if (!resp.ok) {
    const errorBody = await resp.text()
    console.error(`Error deleting agent: ${resp.status} ${resp.statusText}`, errorBody)
    throw new Error(`Failed to delete agent: ${resp.statusText}`)
  }

  return true
}

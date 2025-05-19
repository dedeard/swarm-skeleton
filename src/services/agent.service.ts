import { IAgent, IAgentLog, IAgentPayload } from '@/types/agent'
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

export const invokeStream = async (agentId: string, payload: any) => {
  const access_token = await getCurrentUserAccessToken()
  const url = new URL(`${import.meta.env.VITE_BASE_API_URL}/agent-invoke/${agentId}/invoke-stream`)

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'text/event-stream',
    Authorization: `Bearer ${access_token}`,
  }

  return fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload),
  })
}

export const getAgentLogs = async (agentId: string) => {
  const access_token = await getCurrentUserAccessToken()

  const resp = await fetch(import.meta.env.VITE_BASE_API_URL + `/agent-logs/${agentId}`, {
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

  const data: IAgentLog = await resp.json()

  return data
}

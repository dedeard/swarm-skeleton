import { ITool } from '@/types/tool'
import { getCurrentUserAccessToken } from '@/utils/supabase'

export const getTools = async (): Promise<ITool[]> => {
  const access_token = await getCurrentUserAccessToken()

  const resp = await fetch(import.meta.env.VITE_BASE_API_URL + '/tools', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
      accept: '*/*',
    },
  })

  if (!resp.ok) {
    const errorBody = await resp.text()
    console.error(`Error fetching tools: ${resp.status} ${resp.statusText}`, errorBody)
    throw new Error(`Failed to fetch tools: ${resp.statusText}`)
  }

  const data: ITool[] = await resp.json()
  return data
}

export const getTool = async (toolId: string): Promise<ITool> => {
  const access_token = await getCurrentUserAccessToken()

  const resp = await fetch(import.meta.env.VITE_BASE_API_URL + `/tools/${toolId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
      accept: '*/*',
    },
  })

  if (!resp.ok) {
    const errorBody = await resp.text()
    console.error(`Error fetching tool: ${resp.status} ${resp.statusText}`, errorBody)
    throw new Error(`Failed to fetch tool: ${resp.statusText}`)
  }

  const data: ITool = await resp.json()
  return data
}

export const createTool = async (payload: Partial<ITool>): Promise<ITool> => {
  const access_token = await getCurrentUserAccessToken()

  const resp = await fetch(import.meta.env.VITE_BASE_API_URL + '/tools', {
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
    console.error(`Error creating tool: ${resp.status} ${resp.statusText}`, errorBody)
    throw new Error(`Failed to create tool: ${resp.statusText}`)
  }

  const data: ITool = await resp.json()
  return data
}

export const updateTool = async (toolId: string, payload: Partial<ITool>): Promise<ITool> => {
  const access_token = await getCurrentUserAccessToken()

  const resp = await fetch(import.meta.env.VITE_BASE_API_URL + `/tools/${toolId}`, {
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
    console.error(`Error updating tool: ${resp.status} ${resp.statusText}`, errorBody)
    throw new Error(`Failed to update tool: ${resp.statusText}`)
  }

  const data: ITool = await resp.json()
  return data
}

export const deleteTool = async (toolId: string): Promise<boolean> => {
  const access_token = await getCurrentUserAccessToken()

  const resp = await fetch(import.meta.env.VITE_BASE_API_URL + `/tools/${toolId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${access_token}`,
      accept: '*/*',
    },
  })

  if (!resp.ok) {
    const errorBody = await resp.text()
    console.error(`Error deleting tool: ${resp.status} ${resp.statusText}`, errorBody)
    throw new Error(`Failed to delete tool: ${resp.statusText}`)
  }

  return true
}

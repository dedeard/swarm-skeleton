import { getCurrentUserAccessToken } from '@/utils/supabase'

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

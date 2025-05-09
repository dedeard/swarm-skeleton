import { getCurrentUserAccessToken } from '@/utils/supabase'

export const getLLMs = async () => {
  const access_token = await getCurrentUserAccessToken()

  const resp = await fetch(import.meta.env.VITE_BASE_API_URL + '/get-llms', {
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

  const data = await resp.json()

  return data as {
    available_models: string[]
  }
}

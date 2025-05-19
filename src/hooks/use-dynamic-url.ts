import { useLocation } from 'react-router-dom'

const useDynamicUrl = (basePath: string) => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const agentId = queryParams.get('agent')
  const threadId = queryParams.get('thread')

  let url

  if (agentId && threadId) {
    const newQuery = new URLSearchParams()
    newQuery.set('agent', agentId)
    newQuery.set('thread', threadId)
    url = `${basePath}?${newQuery.toString()}`
  } else if (agentId && !threadId) {
    const newQuery = new URLSearchParams()
    newQuery.set('agent', agentId)
    url = `${basePath}?${newQuery.toString()}`
  } else {
    url = basePath
  }

  return url
}

export default useDynamicUrl

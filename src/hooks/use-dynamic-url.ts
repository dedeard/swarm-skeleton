import { useLocation } from 'react-router-dom'

const useDynamicUrl = (basePath: string, excludes?: string[]) => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // Get original values from the current URL's query parameters
  const originalAgentId = queryParams.get('agent')
  const originalThreadId = queryParams.get('thread')

  // Determine the effective agentId and threadId after considering the excludes list.
  // If 'agent' is in excludes or not present in queryParams, effectiveAgentId will be null.
  const effectiveAgentId = excludes?.includes('agent') || !originalAgentId ? null : originalAgentId

  // If 'thread' is in excludes or not present in queryParams, effectiveThreadId will be null.
  const effectiveThreadId = excludes?.includes('thread') || !originalThreadId ? null : originalThreadId

  let url: string

  if (effectiveAgentId && effectiveThreadId) {
    // Both agentId and threadId are present (and not excluded)
    const newQuery = new URLSearchParams()
    newQuery.set('agent', effectiveAgentId)
    newQuery.set('thread', effectiveThreadId)
    url = `${basePath}?${newQuery.toString()}`
  } else if (effectiveAgentId) {
    // Only agentId is present (and not excluded), or threadId was excluded/not present
    const newQuery = new URLSearchParams()
    newQuery.set('agent', effectiveAgentId)
    url = `${basePath}?${newQuery.toString()}`
  } else {
    // This block is reached if:
    // 1. effectiveAgentId is null (meaning originalAgentId was not present or was excluded).
    //    In this case, following the original logic, threadId is not added either, even if present and not excluded.
    // 2. Neither effectiveAgentId nor effectiveThreadId are present.
    url = basePath
  }

  return url
}

export default useDynamicUrl

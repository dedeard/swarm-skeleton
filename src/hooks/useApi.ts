import { useCallback, useEffect, useState } from 'react'

/**
 * Custom hook for API data fetching
 * @param fetchFn - Function that returns a promise with data
 * @param dependencies - Array of dependencies to trigger refetch
 * @returns Object with data, loading state, error, and refetch function
 */
export function useApi<T>(fetchFn: () => Promise<T>, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await fetchFn()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'))
      console.error('API Error:', err)
    } finally {
      setLoading(false)
    }
  }, [fetchFn])

  useEffect(() => {
    fetchData()
  }, [...dependencies, fetchData])

  const refetch = useCallback(() => {
    return fetchData()
  }, [fetchData])

  return { data, loading, error, refetch }
}

/**
 * Custom hook for API mutations (create, update, delete)
 * @returns Object with mutate function, loading state, and error
 */
export function useApiMutation<T, P>(mutateFn: (params: P) => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const mutate = useCallback(
    async (params: P) => {
      setLoading(true)
      setError(null)

      try {
        const result = await mutateFn(params)
        setData(result)
        return result
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error('An unknown error occurred')
        setError(errorObj)
        console.error('API Mutation Error:', err)
        throw errorObj
      } finally {
        setLoading(false)
      }
    },
    [mutateFn],
  )

  return { mutate, data, loading, error }
}

import { useEffect, useRef, useState } from 'react'
import { useClient } from 'sanity'

const API_VERSION = '2024-01-01'

/**
 * Fetches a GROQ query and keeps the result fresh by refetching whenever a
 * matching document is mutated. Sanity Studio doesn't ship a ready-made
 * "listening query" hook in this version, so this wraps `client.fetch` +
 * `client.listen` directly — refetch-on-mutation rather than diffing
 * individual mutation events, which is simpler and correct for the list/
 * detail sizes the Kitchen tool works with.
 */
export function useLiveQuery<T>(query: string, params: Record<string, unknown> = {}): {
  data: T | undefined
  loading: boolean
  refetch: () => void
} {
  const client = useClient({ apiVersion: API_VERSION })
  const [data, setData] = useState<T | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const paramsKey = JSON.stringify(params)
  const refetchToken = useRef(0)

  function refetch() {
    refetchToken.current += 1
    setLoading(true)
    client.fetch<T>(query, params).then(setData).finally(() => setLoading(false))
  }

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    client.fetch<T>(query, params).then((result) => {
      if (!cancelled) {
        setData(result)
        setLoading(false)
      }
    })

    const sub = client.listen(query, params).subscribe(() => {
      if (cancelled) return
      client.fetch<T>(query, params).then((result) => {
        if (!cancelled) setData(result)
      })
    })

    return () => {
      cancelled = true
      sub.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, query, paramsKey])

  return { data, loading, refetch }
}

import { useEffect, useState } from 'react'

const QUERY = '(max-width: 780px)'

/** Matches the same ~breakpoint the live site's own CSS media queries use. No CSS modules exist in Kitchen (everything is inline styles), so this is the mechanism for responsive layout here instead of `@media`. */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => (typeof window === 'undefined' ? false : window.matchMedia(QUERY).matches))

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const onChange = () => setIsMobile(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isMobile
}

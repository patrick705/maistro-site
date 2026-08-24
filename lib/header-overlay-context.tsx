'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface HeaderOverlayState {
  overlay: boolean
  setOverlay: (on: boolean) => void
}

const HeaderOverlayContext = createContext<HeaderOverlayState | null>(null)

export function HeaderOverlayProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState(false)
  return <HeaderOverlayContext.Provider value={{ overlay, setOverlay }}>{children}</HeaderOverlayContext.Provider>
}

export function useHeaderOverlay() {
  const ctx = useContext(HeaderOverlayContext)
  if (!ctx) throw new Error('useHeaderOverlay must be used within a HeaderOverlayProvider')
  return ctx
}

/** Lets a page's leading block put the nav in transparent-overlay mode, restoring the solid nav on unmount/navigation. */
export function useRequestHeaderOverlay(enabled: boolean) {
  const { setOverlay } = useHeaderOverlay()
  useEffect(() => {
    setOverlay(enabled)
    return () => setOverlay(false)
  }, [enabled, setOverlay])
}

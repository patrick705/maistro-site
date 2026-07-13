'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

interface DemoModalState {
  isOpen: boolean
  open: () => void
  close: () => void
}

const DemoModalContext = createContext<DemoModalState | null>(null)

export function DemoModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  return <DemoModalContext.Provider value={{ isOpen, open, close }}>{children}</DemoModalContext.Provider>
}

export function useDemoModal() {
  const ctx = useContext(DemoModalContext)
  if (!ctx) throw new Error('useDemoModal must be used within a DemoModalProvider')
  return ctx
}

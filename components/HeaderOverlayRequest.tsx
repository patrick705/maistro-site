'use client'

import { useRequestHeaderOverlay } from '@/lib/header-overlay-context'

/** Renders nothing — just a hook-carrying leaf so a server component (PageBuilder) can flip the nav to overlay mode. */
export function HeaderOverlayRequest({ enabled }: { enabled: boolean }) {
  useRequestHeaderOverlay(enabled)
  return null
}

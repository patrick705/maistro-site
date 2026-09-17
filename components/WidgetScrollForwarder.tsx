'use client'

import { useEffect } from 'react'

const MESSAGE_SOURCE = 'maistro-widget-scroll'

/**
 * Full-viewport Custom HTML widgets (Home, Home 3, Product 2, etc.) run in
 * their own iframe — a separate browsing context, so once a visitor's mouse
 * is over one, further wheel input never reaches this page at all; browsers
 * don't chain scroll across an iframe boundary the way they do for ordinary
 * nested scroll containers in the same document. Each such widget posts a
 * message here once ITS OWN internal scroll hits top/bottom in the wheel's
 * direction (see the matching listener added to each widget's own script),
 * so the outer page — and the header floating over it — keeps scrolling
 * instead of feeling stuck.
 */
export function WidgetScrollForwarder() {
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return
      const data = event.data
      if (!data || typeof data !== 'object' || data.source !== MESSAGE_SOURCE) return
      if (typeof data.deltaY !== 'number') return
      window.scrollBy({ top: data.deltaY, left: 0, behavior: 'auto' })
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return null
}

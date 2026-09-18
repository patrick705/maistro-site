'use client'

import { useEffect, useRef } from 'react'

import type { CustomHtmlBlock } from '@/lib/content/types'
import styles from './CustomHtml.module.css'

export function CustomHtmlBlockView({ block }: { block: CustomHtmlBlock }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sandboxed = block.sandboxed !== false
  const wrapClass = block.fullWidth ? styles.fullWidth : styles.contained

  // An uploaded file is served from Sanity's own CDN — already a different
  // origin from this site, so the browser isolates it regardless of the
  // sandbox toggle. Pasted code has no file of its own, so it only gets that
  // same isolation when sandboxed is on (an iframe srcDoc, opaque origin).
  const useIframe = Boolean(block.file?.url) || sandboxed

  // dangerouslySetInnerHTML-inserted <script> tags are inert per the HTML
  // spec — re-create them as real elements so they actually run. Only
  // reached when sandboxed is explicitly off for pasted code, i.e. content
  // the site owner has marked as trusted to run directly in the page.
  useEffect(() => {
    if (useIframe || !block.code || !containerRef.current) return
    const container = containerRef.current
    container.querySelectorAll('script').forEach((oldScript) => {
      const newScript = document.createElement('script')
      Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value))
      newScript.textContent = oldScript.textContent
      oldScript.replaceWith(newScript)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block.code, useIframe])

  // "Text edits" let a site owner tweak copy inside an embed (a headline, a
  // button label) by CSS selector, without touching the embed's own code.
  // Most of our real embeds are a small wrapper — this same "unsandboxed
  // pasted code" path — around a same-origin <iframe> pointing at a static
  // widget file, so the selector actually needs to run inside THAT nested
  // document, not this outer wrapper. Cross-origin embeds (an uploaded
  // file, or a sandboxed srcDoc iframe) can't be reached at all — the
  // try/catch just lets those silently no-op instead of throwing.
  useEffect(() => {
    if (useIframe || !block.code || !containerRef.current) return
    const edits = block.textEdits ?? []
    if (edits.length === 0) return

    function applyEdits(scope: Document | HTMLElement) {
      for (const edit of edits) {
        if (!edit.selector || !edit.text) continue
        try {
          scope.querySelectorAll(edit.selector).forEach((el) => {
            el.textContent = edit.text
          })
        } catch {
          // Invalid selector — skip it rather than breaking the rest of the block.
        }
      }
    }

    const container = containerRef.current
    const nestedIframe = container.querySelector('iframe')
    if (!nestedIframe) {
      applyEdits(container)
      return
    }

    const tryApply = () => {
      try {
        if (nestedIframe.contentDocument) applyEdits(nestedIframe.contentDocument)
      } catch {
        // Cross-origin nested iframe — nothing reachable from here.
      }
    }
    if (nestedIframe.contentDocument?.readyState === 'complete') tryApply()
    nestedIframe.addEventListener('load', tryApply)
    return () => nestedIframe.removeEventListener('load', tryApply)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block.code, block.textEdits, useIframe])

  if (!block.file?.url && !block.code) return null

  if (useIframe) {
    return (
      <div className={wrapClass}>
        {block.file?.url ? (
          <iframe src={block.file.url} title={block.label || 'Embedded content'} className={styles.iframe} sandbox={sandboxed ? 'allow-scripts' : undefined} />
        ) : (
          <iframe srcDoc={block.code} title={block.label || 'Embedded content'} className={styles.iframe} sandbox="allow-scripts" />
        )}
      </div>
    )
  }

  return <div ref={containerRef} className={wrapClass} dangerouslySetInnerHTML={{ __html: block.code ?? '' }} />
}

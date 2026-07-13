'use client'

import { useEffect, useState, type FormEvent } from 'react'

import { useDemoModal } from '@/lib/demo-modal-context'
import { submitLead } from '@/lib/submitLead'
import type { DemoModalContent } from '@/lib/content/types'
import styles from './DemoModal.module.css'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function DemoModal({ content }: { content: DemoModalContent }) {
  const { isOpen, close } = useDemoModal()
  const [status, setStatus] = useState<Status>('idle')

  function handleClose() {
    close()
    setStatus('idle')
  }

  // Body scroll lock while open — a side effect on an external system, not
  // a React state sync, so it belongs in an effect.
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Esc-to-close — subscribing to an external event, calling setState from
  // its callback (not synchronously in the effect body).
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, close])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    setStatus('submitting')
    try {
      await submitLead({
        name: String(data.get('name') || ''),
        email: String(data.get('email') || ''),
        company: String(data.get('company') || ''),
        venues: String(data.get('venues') || ''),
        source: 'demo-modal',
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
      style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      aria-hidden={!isOpen}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div className={`${styles.card} ${isOpen ? styles.cardVisible : ''}`}>
        <button type="button" className={styles.closeBtn} onClick={handleClose} aria-label="Close">
          ✕
        </button>

        {status !== 'success' ? (
          <div>
            <div className={styles.eyebrow}>{content.eyebrow}</div>
            <h3 className={styles.headline}>{content.headline}</h3>
            <p className={styles.subhead}>{content.subhead}</p>
            <form className={styles.form} onSubmit={handleSubmit}>
              <input name="name" required placeholder="Name" className={styles.input} />
              <input name="email" required type="email" placeholder="Work email" className={styles.input} />
              <div className={styles.row2}>
                <input name="company" placeholder="Company" className={styles.input} />
                <input name="venues" placeholder="Venues" className={styles.input} />
              </div>
              <button type="submit" className={styles.submit} disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending…' : 'Book a demo →'}
              </button>
              {status === 'error' && (
                <p className={styles.error}>Something went wrong — please try again.</p>
              )}
            </form>
          </div>
        ) : (
          <div className={styles.success}>
            <div className={styles.successIcon}>✓</div>
            <h3 className={styles.headline}>{content.successHeadline}</h3>
            <p className={styles.subhead}>{content.successBody}</p>
            <button type="button" className={styles.doneBtn} onClick={handleClose}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

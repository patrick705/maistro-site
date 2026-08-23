'use client'

import { useState, type FormEvent } from 'react'

import styles from './ContactSection.module.css'

interface ContactContent {
  contactHeadline: string
  contactSubhead: string
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function ContactSection({
  content,
  onSubmit,
  style,
}: {
  content: ContactContent
  /** Injected rather than hardcoded so this component has no dependency on the live leads API — lets the Kitchen CMS preview reuse it without risking a real lead getting submitted. */
  onSubmit: (fields: { name: string; email: string; message: string }) => Promise<void>
  style?: React.CSSProperties
}) {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    setStatus('submitting')
    try {
      await onSubmit({
        name: String(data.get('name') || ''),
        email: String(data.get('email') || ''),
        message: String(data.get('message') || ''),
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className={styles.section} style={style}>
      <div className={styles.head}>
        <h2 className={styles.headline}>{content.contactHeadline}</h2>
        <p className={styles.subhead}>{content.contactSubhead}</p>
      </div>

      {status === 'success' ? (
        <div className={styles.success}>
          <div className={styles.successIcon}>✓</div>
          <h3 className={styles.successTitle}>You&apos;re on the list!</h3>
          <p className={styles.successBody}>We&apos;ll be in touch within one working day.</p>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row2}>
            <input name="name" required placeholder="Name" className={styles.input} />
            <input name="email" required type="email" placeholder="Work email" className={styles.input} />
          </div>
          <textarea
            name="message"
            placeholder="What would you like Maistro to run?"
            rows={4}
            className={styles.textarea}
          />
          <button type="submit" className={styles.submit} disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending…' : 'Book a demo'}
          </button>
          {status === 'error' && <p className={styles.error}>Something went wrong — please try again.</p>}
        </form>
      )}
    </section>
  )
}

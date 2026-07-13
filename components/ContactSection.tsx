'use client'

import { useState, type FormEvent } from 'react'

import { submitLead } from '@/lib/submitLead'
import styles from './ContactSection.module.css'
import type { HomePage } from '@/lib/content/types'

type ContactContent = Pick<HomePage, 'contactHeadline' | 'contactSubhead'>

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function ContactSection({ content }: { content: ContactContent }) {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    setStatus('submitting')
    try {
      await submitLead({
        name: String(data.get('name') || ''),
        email: String(data.get('email') || ''),
        message: String(data.get('message') || ''),
        source: 'contact-form',
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className={styles.section}>
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

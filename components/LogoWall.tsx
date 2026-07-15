'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

import styles from './LogoWall.module.css'
import type { ClientLogo } from '@/lib/content/types'

export function LogoWall({ logos }: { logos: ClientLogo[] }) {
  const [selectedName, setSelectedName] = useState<string | null>(null)
  const isOpen = selectedName !== null

  function close() {
    setSelectedName(null)
  }

  // Body scroll lock while a popup is open.
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Esc-to-close.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen])

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {logos.map((client) => (
          <button
            key={client.name}
            type="button"
            className={styles.tile}
            onClick={() => setSelectedName(client.name)}
            aria-haspopup="dialog"
          >
            {client.logo?.url ? (
              <Image
                src={client.logo.url}
                alt={client.logo.alt}
                width={160}
                height={62}
                className={styles.logoImage}
              />
            ) : (
              <span className={styles.wordmark}>{client.name}</span>
            )}
          </button>
        ))}
        <div className={styles.moreTile}>
          <span className={styles.moreText}>+ many more</span>
        </div>
      </div>

      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
        aria-hidden={!isOpen}
        onClick={(e) => {
          if (e.target === e.currentTarget) close()
        }}
      >
        {logos.map((client) => {
          const visible = selectedName === client.name
          return (
            <div
              key={client.name}
              className={`${styles.popup} ${visible ? styles.popupVisible : ''}`}
              role="dialog"
              aria-modal={visible}
              aria-hidden={!visible}
            >
              <button type="button" className={styles.closeBtn} onClick={close} aria-label="Close">
                ✕
              </button>
              {client.logo?.url && (
                <Image
                  src={client.logo.url}
                  alt={client.logo.alt}
                  width={200}
                  height={78}
                  className={styles.popupLogo}
                />
              )}
              <h3 className={styles.popupName}>{client.name}</h3>
              {client.description && <p className={styles.popupDescription}>{client.description}</p>}
              {client.website && (
                <a href={client.website} target="_blank" rel="noreferrer" className={styles.popupLink}>
                  Visit website →
                </a>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

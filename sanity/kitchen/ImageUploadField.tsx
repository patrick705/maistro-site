import { useRef, useState } from 'react'
import { useClient } from 'sanity'

import { studioUrlFor } from './studioImageUrl'
import { kitchen } from './theme'

const API_VERSION = '2024-01-01'

export interface SanityImageValue {
  _type: 'image'
  asset?: { _type: 'reference'; _ref: string }
  alt?: string
}

/**
 * Thumbnail + upload/remove for a single image field, backed by real
 * `client.assets.upload`. Optionally shows an alt-text input alongside —
 * pass `showAlt` when the schema requires alt-when-uploaded (matches the
 * conditional-required pattern already used across the schema).
 */
export function ImageUploadField({
  value,
  onChange,
  showAlt = true,
  width = 90,
  height = 66,
}: {
  value: SanityImageValue | undefined
  onChange: (next: SanityImageValue | undefined) => void
  showAlt?: boolean
  width?: number
  height?: number
}) {
  const client = useClient({ apiVersion: API_VERSION })
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const url = value?.asset?._ref ? studioUrlFor(client, value).width(width * 2).height(height * 2).fit('crop').url() : null

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const asset = await client.assets.upload('image', file)
      onChange({ _type: 'image', asset: { _type: 'reference', _ref: asset._id }, alt: value?.alt })
    } catch (err) {
      // Without this, a failed upload (permissions, network, file too big)
      // left the field silently unset — the block still saved fine, just
      // missing its image, which then crashed the live page's <Image>.
      setError(err instanceof Error ? err.message : 'Upload failed — try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width,
          height,
          borderRadius: 6,
          overflow: 'hidden',
          background: kitchen.surface,
          border: `1px solid ${kitchen.borderSoft}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '0 0 auto',
        }}
      >
        {url ? (
          <img src={url} alt={value?.alt || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: 10, color: kitchen.textFaint }}>No image</span>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} style={smallBtn()}>
            {uploading ? 'Uploading…' : value?.asset ? 'Replace' : 'Upload'}
          </button>
          {value?.asset && (
            <button type="button" onClick={() => onChange(undefined)} style={smallBtn()}>
              Remove
            </button>
          )}
          <input ref={inputRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
        </div>
        {error && <span style={{ fontSize: 11, color: kitchen.danger }}>{error}</span>}
        {showAlt && value?.asset && (
          <input
            placeholder="Alt text"
            value={value.alt ?? ''}
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
            style={{
              padding: '5px 8px',
              border: `1px solid ${kitchen.borderInput}`,
              borderRadius: 6,
              fontSize: 11.5,
              font: 'inherit',
            }}
          />
        )}
      </div>
    </div>
  )
}

function smallBtn(): React.CSSProperties {
  return {
    padding: '4px 9px',
    border: `1px solid ${kitchen.borderInput}`,
    borderRadius: 6,
    background: '#fff',
    cursor: 'pointer',
    fontSize: 11,
    color: kitchen.textBody,
  }
}

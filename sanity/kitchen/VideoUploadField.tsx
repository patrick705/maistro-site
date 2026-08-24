import { useRef, useState } from 'react'
import { useClient } from 'sanity'

import { studioFileUrlFor } from './studioFileUrl'
import { kitchen } from './theme'

const API_VERSION = '2024-01-01'

export interface SanityFileValue {
  _type: 'file'
  asset?: { _type: 'reference'; _ref: string }
}

/**
 * Upload/replace/remove for a single self-hosted video file, backed by real
 * `client.assets.upload('file', ...)`. Mirrors ImageUploadField's pattern —
 * there's no thumbnail preview (video assets don't have one until played),
 * just the filename-less asset id and a native <video> preview once uploaded.
 */
export function VideoUploadField({
  value,
  onChange,
}: {
  value: SanityFileValue | undefined
  onChange: (next: SanityFileValue | undefined) => void
}) {
  const client = useClient({ apiVersion: API_VERSION })
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const previewUrl = studioFileUrlFor(client, value?.asset?._ref)

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploading(true)
    try {
      const asset = await client.assets.upload('file', file, { filename: file.name })
      onChange({ _type: 'file', asset: { _type: 'reference', _ref: asset._id } })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {previewUrl && (
        <video src={previewUrl} controls muted style={{ width: '100%', maxWidth: 280, borderRadius: 8, background: '#000' }} />
      )}
      <div style={{ display: 'flex', gap: 6 }}>
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} style={smallBtn()}>
          {uploading ? 'Uploading…' : value?.asset ? 'Replace video' : 'Upload video'}
        </button>
        {value?.asset && (
          <button type="button" onClick={() => onChange(undefined)} style={smallBtn()}>
            Remove
          </button>
        )}
        <input ref={inputRef} type="file" accept="video/mp4,video/webm" onChange={onFile} style={{ display: 'none' }} />
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

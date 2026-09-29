import { useState } from 'react'
import { useClient } from 'sanity'

import { useLiveQuery } from './useLiveQuery'
import { kitchen } from './theme'

interface Row {
  _id: string
  name?: string
  email?: string
  submittedAt?: string
  message?: string
  source?: string
  company?: string
  venues?: string
  deliveryMethod?: string
  enteredCompetition?: boolean
}

const LEADS_QUERY = `*[_type == "lead" && !(_id in path("drafts.**"))] | order(submittedAt desc){_id, name, email, submittedAt, message, source, company, venues, deliveryMethod, enteredCompetition}`

const SOURCE_LABEL: Record<string, string> = {
  'demo-modal': 'Demo modal',
  'contact-form': 'Contact form',
  'roi-calculator': 'ROI calculator',
  'say-hi': 'Say Hi postcard',
}

function csvEscape(value: string) {
  const needsQuotes = /[",\n]/.test(value)
  const escaped = value.replace(/"/g, '""')
  return needsQuotes ? `"${escaped}"` : escaped
}

function downloadCsv(rows: Row[]) {
  const headers = ['Name', 'Email', 'Company', 'Venues', 'Source', 'Delivery method', 'Entered competition', 'Message', 'Submitted at']
  const lines = [headers.join(',')]
  for (const row of rows) {
    lines.push(
      [
        row.name ?? '',
        row.email ?? '',
        row.company ?? '',
        row.venues ?? '',
        row.source ? SOURCE_LABEL[row.source] || row.source : '',
        row.deliveryMethod ?? '',
        row.enteredCompetition ? 'Yes' : '',
        row.message ?? '',
        row.submittedAt ?? '',
      ]
        .map((v) => csvEscape(String(v)))
        .join(','),
    )
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function CollectionListView({ type }: { type: 'lead' }) {
  const client = useClient({ apiVersion: '2024-01-01' })
  const { data: rows, refetch } = useLiveQuery<Row[]>(LEADS_QUERY)
  const [copied, setCopied] = useState(false)

  async function remove(id: string) {
    if (!confirm('Delete this document? This cannot be undone.')) return
    await client.delete(id)
    await client.delete(`drafts.${id}`).catch(() => {})
    refetch()
  }

  async function copyEmails() {
    const emails = (rows ?? []).map((r) => r.email).filter(Boolean).join('\n')
    await navigator.clipboard.writeText(emails)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '26px 24px 72px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        <h1 style={{ margin: 0, fontFamily: kitchen.fontDisplay, fontSize: 26, fontWeight: 700 }}>Leads</h1>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button type="button" onClick={copyEmails} disabled={!rows?.length} style={rowBtnStyle(false)}>
            {copied ? 'Copied!' : 'Copy all emails'}
          </button>
          <button type="button" onClick={() => rows && downloadCsv(rows)} disabled={!rows?.length} style={rowBtnStyle(false)}>
            Export CSV
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {(rows ?? []).map((row) => (
          <div
            key={row._id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: '12px 14px',
              border: `1px solid ${kitchen.borderSoft}`,
              borderRadius: 9,
              background: '#fff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {row.name || 'Untitled'}
                </span>
                <span style={{ fontSize: 11.5, color: kitchen.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {row.email}
                </span>
              </div>
              {row.source && (
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 999,
                    background: kitchen.surface,
                    color: kitchen.textMuted,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {SOURCE_LABEL[row.source] || row.source}
                </span>
              )}
              <span style={{ fontSize: 10.5, color: kitchen.textFaint, fontFamily: kitchen.fontMono, whiteSpace: 'nowrap' }}>
                {(row.submittedAt || '').slice(0, 10)}
              </span>
              <button type="button" onClick={() => remove(row._id)} style={rowBtnStyle(true)}>
                Delete
              </button>
            </div>
            {(row.company || row.venues) && (
              <div style={{ fontSize: 11.5, color: kitchen.textMuted }}>
                {[row.company, row.venues].filter(Boolean).join(' · ')}
              </div>
            )}
            {row.source === 'say-hi' && (row.deliveryMethod || row.enteredCompetition) && (
              <div style={{ fontSize: 11.5, color: kitchen.textMuted }}>
                {row.deliveryMethod === 'postcard' ? 'Wants a physical postcard' : 'Wants an email reply'}
                {row.enteredCompetition ? ' · entered the €500 competition' : ''}
              </div>
            )}
            {row.message && (
              <div
                style={{
                  fontSize: 12.5,
                  color: kitchen.ink,
                  background: kitchen.surface,
                  borderRadius: 7,
                  padding: '8px 10px',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.5,
                }}
              >
                {row.message}
              </div>
            )}
          </div>
        ))}
        {rows?.length === 0 && <div style={{ color: kitchen.textFaint, fontSize: 13, padding: 20 }}>Nothing here yet.</div>}
      </div>
    </div>
  )
}

function rowBtnStyle(danger = false): React.CSSProperties {
  return {
    padding: '5px 11px',
    border: `1px solid ${danger ? kitchen.danger : kitchen.borderInput}`,
    borderRadius: 7,
    background: '#fff',
    cursor: 'pointer',
    fontSize: 11.5,
    color: danger ? kitchen.danger : kitchen.textBody,
  }
}

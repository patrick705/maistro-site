export interface LeadPayload {
  name: string
  email: string
  company?: string
  venues?: string
  message?: string
  source: 'demo-modal' | 'contact-form'
}

export async function submitLead(payload: LeadPayload): Promise<void> {
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.error || 'Failed to submit')
  }
}

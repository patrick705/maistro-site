import { NextResponse } from 'next/server'

import { getWriteClient, isSanityConfigured } from '@/lib/sanity/client'

const MAX_FIELD_LENGTH = 500

function cleanField(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  return trimmed.slice(0, MAX_FIELD_LENGTH)
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const name = cleanField((body as Record<string, unknown>).name)
  const email = cleanField((body as Record<string, unknown>).email)
  const company = cleanField((body as Record<string, unknown>).company)
  const venues = cleanField((body as Record<string, unknown>).venues)
  const message = cleanField((body as Record<string, unknown>).message)
  const rawSource = (body as Record<string, unknown>).source
  const source =
    rawSource === 'contact-form' ? 'contact-form' : rawSource === 'roi-calculator' ? 'roi-calculator' : 'demo-modal'

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 })
  }

  if (!isSanityConfigured || !process.env.SANITY_API_WRITE_TOKEN) {
    console.warn('[leads] Sanity is not configured yet — lead was not stored:', { name, email, source })
    return NextResponse.json({ ok: true, stored: false })
  }

  try {
    await getWriteClient().create({
      _type: 'lead',
      name,
      email,
      company,
      venues,
      message,
      source,
      submittedAt: new Date().toISOString(),
    })
    return NextResponse.json({ ok: true, stored: true })
  } catch (err) {
    console.error('[leads] failed to store lead in Sanity:', err)
    // Still tell the visitor it worked — the mockup's UX always shows success,
    // and we don't want a CMS hiccup to make a real prospect think it failed.
    return NextResponse.json({ ok: true, stored: false })
  }
}

import { NextResponse } from 'next/server'

import { getWriteClient, isSanityConfigured } from '@/lib/sanity/client'

const MAX_FIELD_LENGTH = 500
const HUBDECK_TIMEOUT_MS = 8000

function cleanField(value: unknown, maxLength = MAX_FIELD_LENGTH): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  return trimmed.slice(0, maxLength)
}

function normaliseSource(value: unknown): 'contact-form' | 'roi-calculator' | 'say-hi' | 'demo-modal' {
  return value === 'contact-form' || value === 'roi-calculator' || value === 'say-hi' || value === 'demo-modal'
    ? value
    : 'demo-modal'
}

function normaliseDeliveryMethod(source: string, value: unknown): 'email' | 'postcard' | undefined {
  return source === 'say-hi' && (value === 'email' || value === 'postcard') ? value : undefined
}

async function forwardToHubdeck({
  name,
  email,
  company,
  venues,
  postcode,
  message,
  source,
  pageUrl,
}: {
  name?: string
  email: string
  company?: string
  venues?: string
  postcode?: string
  message?: string
  source: string
  pageUrl: string
}): Promise<boolean> {
  const url = process.env.HUBDECK_INBOUND_URL?.trim()
  const token = process.env.HUBDECK_INBOUND_TOKEN?.trim()

  if (!url && !token) return false
  if (!url || !token) {
    throw new Error('Hubdeck inbound relay is partially configured')
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name || 'Website enquiry',
      email,
      company: company || '',
      venue: venues || '',
      postcode: postcode || '',
      message: message || '',
      source,
      pageUrl,
      referrer: pageUrl,
      contactConsent: false,
      marketingConsent: false,
      consentVersion: '',
    }),
    cache: 'no-store',
    signal: AbortSignal.timeout(HUBDECK_TIMEOUT_MS),
  })

  const responseText = await response.text()
  if (!response.ok) {
    throw new Error('Hubdeck inbound returned HTTP ' + response.status)
  }

  if (responseText) {
    try {
      const result = JSON.parse(responseText) as { ok?: boolean }
      if (result.ok === false) throw new Error('Hubdeck rejected the enquiry')
    } catch (error) {
      if (error instanceof Error && error.message === 'Hubdeck rejected the enquiry') throw error
      // Hubdeck may return an empty body even after accepting the enquiry.
    }
  }

  return true
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const values = body as Record<string, unknown>
  const name = cleanField(values.name, 120)
  const email = cleanField(values.email, 254)
  const company = cleanField(values.company, 180)
  const venues = cleanField(values.venues, 180)
  const postcode = cleanField(values.postcode, 40)
  const message = cleanField(values.message)
  const source = normaliseSource(values.source)
  const deliveryMethod = normaliseDeliveryMethod(source, values.deliveryMethod)
  const enteredCompetition = source === 'say-hi' ? Boolean(values.enteredCompetition) : undefined
  const pageUrl = request.headers.get('referer') || ''

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 })
  }

  let hubdeckStored = false
  try {
    hubdeckStored = await forwardToHubdeck({
      name,
      email,
      company,
      venues,
      postcode,
      message,
      source,
      pageUrl,
    })
  } catch (err) {
    console.error('[leads] failed to relay lead to Hubdeck:', err)
    return NextResponse.json(
      { error: 'We could not send your enquiry right now. Please try again.' },
      { status: 502 },
    )
  }

  let stored = false
  if (!isSanityConfigured || !process.env.SANITY_API_WRITE_TOKEN) {
    console.warn('[leads] Sanity is not configured — lead was not stored there:', { name, email, source })
  } else {
    try {
      await getWriteClient().create({
        _type: 'lead',
        name,
        email,
        company,
        venues,
        postcode,
        message,
        source,
        deliveryMethod,
        enteredCompetition,
        submittedAt: new Date().toISOString(),
      })
      stored = true
    } catch (err) {
      console.error('[leads] failed to store lead in Sanity:', err)
    }
  }

  return NextResponse.json({ ok: true, stored, hubdeckStored })
}

import { NextResponse } from 'next/server'

import { getWriteClient, isSanityConfigured } from '@/lib/sanity/client'

const MAX_FIELD_LENGTH = 560
const HUBDECK_TIMEOUT_MS = 8000
const ALLOWED_FORM_ORIGINS = new Set([
  'https://maistro-contact.patrick-shan-1947.chatgpt.site',
  'https://yesmaistro.com',
  'https://www.yesmaistro.com',
  'https://maistro-connected.patrick-shan-1947.chatgpt.site',
])

function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  return !origin || origin === new URL(request.url).origin || ALLOWED_FORM_ORIGINS.has(origin)
}

function responseHeaders(request: Request): Headers {
  const headers = new Headers({ 'Cache-Control': 'no-store', Vary: 'Origin' })
  const origin = request.headers.get('origin')
  if (origin && isAllowedOrigin(request)) {
    headers.set('Access-Control-Allow-Origin', origin)
  }
  return headers
}

function jsonResponse(request: Request, body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: responseHeaders(request) })
}

export async function OPTIONS(request: Request) {
  if (!isAllowedOrigin(request)) {
    return jsonResponse(request, { error: 'Origin not allowed' }, 403)
  }

  const headers = responseHeaders(request)
  headers.set('Allow', 'POST, OPTIONS')
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Content-Type')
  return new NextResponse(null, { status: 204, headers })
}

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

  if (!url || !token) {
    throw new Error('Hubdeck inbound relay is not configured')
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

  if (!response.ok) {
    throw new Error('Hubdeck inbound returned HTTP ' + response.status)
  }

  const result = await response.json().catch(() => null) as { ok?: unknown } | null
  if (result?.ok !== true) {
    throw new Error('Hubdeck response did not confirm receipt of the enquiry')
  }

  return true
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return jsonResponse(request, { error: 'Origin not allowed' }, 403)
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return jsonResponse(request, { error: 'Invalid request body' }, 400)
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
    return jsonResponse(request, { error: 'Email is required' }, 400)
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse(request, { error: 'Enter a valid email address' }, 400)
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
    return jsonResponse(
      request,
      { error: 'We could not send your enquiry right now. Please try again.' },
      502,
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

  return jsonResponse(request, { ok: true, stored, hubdeckStored })
}


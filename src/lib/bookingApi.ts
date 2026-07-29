import type { BookingValues } from '@/content/booking'

export interface BookingSubmission {
  values: BookingValues
  consent: boolean
  submissionId: string
  turnstileToken: string
  website: string
}

export interface BookingReceipt {
  referenceCode: string
}

interface BookingApiResponse {
  ok?: boolean
  referenceCode?: string
  error?: string
}

const BOOKING_API_URL = import.meta.env.VITE_BOOKING_API_URL?.trim() ?? ''

export function isBookingApiConfigured(): boolean {
  return Boolean(BOOKING_API_URL && import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim())
}

function messageFromResponse(body: unknown): string | undefined {
  if (!body || typeof body !== 'object') return undefined
  const candidate = body as BookingApiResponse
  return typeof candidate.error === 'string' ? candidate.error : undefined
}

export async function submitBooking(
  submission: BookingSubmission,
): Promise<BookingReceipt> {
  if (!BOOKING_API_URL) {
    throw new Error('Online appointment requests are not connected yet.')
  }

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), 12_000)

  try {
    const response = await fetch(BOOKING_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        submissionId: submission.submissionId,
        ...submission.values,
        consent: submission.consent,
        turnstileToken: submission.turnstileToken,
        website: submission.website,
      }),
      signal: controller.signal,
    })

    let body: unknown
    try {
      body = await response.json()
    } catch {
      body = undefined
    }

    if (!response.ok) {
      throw new Error(
        messageFromResponse(body) ??
          'Your request could not be sent. Please wait a moment and try again.',
      )
    }

    if (
      !body ||
      typeof body !== 'object' ||
      typeof (body as BookingApiResponse).referenceCode !== 'string'
    ) {
      throw new Error('The clinic received an unexpected response. Please try again.')
    }

    return { referenceCode: (body as BookingApiResponse).referenceCode as string }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('The request took too long. Please check your connection and try again.')
    }
    throw error
  } finally {
    window.clearTimeout(timeoutId)
  }
}

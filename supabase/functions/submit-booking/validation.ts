export const ALLOWED_CONCERNS = [
  'First visit',
  'A toothache or break',
  'A check-up',
  'Brushing or toothpaste advice',
] as const

export const ALLOWED_TIMES = [
  'Morning',
  'After school',
  'Saturday morning',
  'Please call me to talk it through',
] as const

export interface BookingPayload {
  submissionId: string
  childName: string
  childAge: string
  concern: string
  preferredTime: string
  parentName: string
  phone: string
  email: string
  consent: boolean
  turnstileToken: string
  website?: string | undefined
}

export interface ValidBooking {
  submissionId: string
  childName: string
  childAge: number
  concern: (typeof ALLOWED_CONCERNS)[number]
  preferredTime: (typeof ALLOWED_TIMES)[number]
  parentName: string
  phone: string
  email: string
  turnstileToken: string
}

interface ValidationSuccess {
  ok: true
  value: ValidBooking
}

interface ValidationFailure {
  ok: false
  message: string
}

export type ValidationResult = ValidationSuccess | ValidationFailure

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[+()\d][+()\d\s-]{4,31}$/

function clean(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export function validateBookingPayload(input: unknown): ValidationResult {
  if (!input || typeof input !== 'object') {
    return { ok: false, message: 'The request body is not valid.' }
  }

  const payload = input as Partial<BookingPayload>
  if (clean(payload.website, 200)) {
    return { ok: false, message: 'The request could not be accepted.' }
  }

  const submissionId = clean(payload.submissionId, 40)
  const childName = clean(payload.childName, 80)
  const parentName = clean(payload.parentName, 100)
  const phone = clean(payload.phone, 32)
  const email = clean(payload.email, 254).toLowerCase()
  const concern = clean(payload.concern, 80)
  const preferredTime = clean(payload.preferredTime, 80)
  const turnstileToken = clean(payload.turnstileToken, 2048)
  const childAgeText = clean(payload.childAge, 2)
  const childAge = Number(childAgeText)

  if (!UUID_PATTERN.test(submissionId)) {
    return { ok: false, message: 'The request identifier is not valid.' }
  }
  if (childName.length < 1 || parentName.length < 2) {
    return { ok: false, message: 'Please provide the requested names.' }
  }
  if (!Number.isInteger(childAge) || childAge < 0 || childAge > 18) {
    return { ok: false, message: 'Please provide an age between 0 and 18.' }
  }
  if (!ALLOWED_CONCERNS.includes(concern as (typeof ALLOWED_CONCERNS)[number])) {
    return { ok: false, message: 'Please choose a valid reason for the visit.' }
  }
  if (!ALLOWED_TIMES.includes(preferredTime as (typeof ALLOWED_TIMES)[number])) {
    return { ok: false, message: 'Please choose a valid preferred time.' }
  }
  if (!PHONE_PATTERN.test(phone) || !EMAIL_PATTERN.test(email)) {
    return { ok: false, message: 'Please check the contact details.' }
  }
  if (payload.consent !== true) {
    return { ok: false, message: 'Consent is required before sending a request.' }
  }
  if (!turnstileToken) {
    return { ok: false, message: 'Please complete the anti-spam check.' }
  }

  return {
    ok: true,
    value: {
      submissionId,
      childName,
      childAge,
      concern: concern as (typeof ALLOWED_CONCERNS)[number],
      preferredTime: preferredTime as (typeof ALLOWED_TIMES)[number],
      parentName,
      phone,
      email,
      turnstileToken,
    },
  }
}

import { createClient } from 'npm:@supabase/supabase-js@2'
import { validateBookingPayload } from './validation.ts'

interface TurnstileResult {
  success: boolean
  hostname?: string
  action?: string
  'error-codes'?: string[]
}

interface AppointmentRecord {
  id: string
  reference_code: string
  notification_status: 'pending' | 'sent' | 'failed'
}

const jsonHeaders = { 'Content-Type': 'application/json; charset=utf-8' }

function corsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  }
}

function json(status: number, body: Record<string, unknown>, origin?: string): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...jsonHeaders,
      ...(origin ? corsHeaders(origin) : {}),
    },
  })
}

function configuredOrigins(): string[] {
  return (Deno.env.get('BOOKING_ALLOWED_ORIGINS') ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

async function verifyTurnstile(
  token: string,
  remoteIp: string | null,
  secret: string,
): Promise<TurnstileResult> {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({
      secret,
      response: token,
      remoteip: remoteIp ?? undefined,
      idempotency_key: crypto.randomUUID(),
    }),
    signal: AbortSignal.timeout(8_000),
  })

  if (!response.ok) return { success: false, 'error-codes': ['verification-unavailable'] }
  return (await response.json()) as TurnstileResult
}

async function sendClinicNotification(referenceCode: string, requestId: string): Promise<boolean> {
  const apiKey = Deno.env.get('RESEND_API_KEY')
  const from = Deno.env.get('RESEND_FROM_EMAIL')
  const to = Deno.env.get('CLINIC_NOTIFICATION_EMAIL')
  if (!apiKey || !from || !to) return false

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      ...jsonHeaders,
      Authorization: `Bearer ${apiKey}`,
      'Idempotency-Key': `booking/${requestId}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `New Tiny Tusk appointment request — ${referenceCode}`,
      text:
        `A new appointment request has been received.\n\n` +
        `Reference: ${referenceCode}\n\n` +
        `Sign in to the protected Supabase project to review the request. ` +
        `Personal details are intentionally not included in this email.`,
    }),
    signal: AbortSignal.timeout(8_000),
  })

  return response.ok
}

Deno.serve(async (request) => {
  const origin = request.headers.get('origin') ?? ''
  const allowedOrigins = configuredOrigins()
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : undefined

  if (request.method === 'OPTIONS') {
    return allowedOrigin
      ? new Response(null, { status: 204, headers: corsHeaders(allowedOrigin) })
      : json(403, { error: 'Origin not allowed.' })
  }

  if (request.method !== 'POST') {
    return json(405, { error: 'Method not allowed.' }, allowedOrigin)
  }
  if (!allowedOrigin) {
    return json(403, { error: 'Origin not allowed.' })
  }

  const contentLength = Number(request.headers.get('content-length') ?? '0')
  if (contentLength > 12_000) {
    return json(413, { error: 'Request too large.' }, allowedOrigin)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const turnstileSecret = Deno.env.get('TURNSTILE_SECRET_KEY')
  if (!supabaseUrl || !serviceRoleKey || !turnstileSecret) {
    console.error('Booking function is missing required server configuration.')
    return json(503, { error: 'Online booking is temporarily unavailable.' }, allowedOrigin)
  }

  let rawPayload: unknown
  try {
    rawPayload = await request.json()
  } catch {
    return json(400, { error: 'The request body is not valid JSON.' }, allowedOrigin)
  }

  const validation = validateBookingPayload(rawPayload)
  if (!validation.ok) {
    return json(400, { error: validation.message }, allowedOrigin)
  }

  let turnstile: TurnstileResult
  try {
    turnstile = await verifyTurnstile(
      validation.value.turnstileToken,
      request.headers.get('cf-connecting-ip'),
      turnstileSecret,
    )
  } catch (error) {
    console.error('Turnstile verification failed.', error)
    return json(503, { error: 'The anti-spam check is temporarily unavailable.' }, allowedOrigin)
  }

  if (
    !turnstile.success ||
    (turnstile.action !== undefined && turnstile.action !== 'booking_request')
  ) {
    return json(400, { error: 'The anti-spam check was not accepted. Please try again.' }, allowedOrigin)
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: existing } = await supabase
    .from('appointment_requests')
    .select('id, reference_code, notification_status')
    .eq('submission_id', validation.value.submissionId)
    .maybeSingle<AppointmentRecord>()

  if (existing) {
    return json(
      200,
      { ok: true, referenceCode: existing.reference_code, duplicate: true },
      allowedOrigin,
    )
  }

  const { data, error } = await supabase
    .from('appointment_requests')
    .insert({
      submission_id: validation.value.submissionId,
      parent_name: validation.value.parentName,
      contact_email: validation.value.email,
      contact_phone: validation.value.phone,
      child_first_name: validation.value.childName,
      child_age_years: validation.value.childAge,
      concern: validation.value.concern,
      preferred_time: validation.value.preferredTime,
      consented_at: new Date().toISOString(),
    })
    .select('id, reference_code, notification_status')
    .single<AppointmentRecord>()

  if (error || !data) {
    console.error('Appointment request insert failed.', error)
    return json(500, { error: 'The request could not be saved. Please try again.' }, allowedOrigin)
  }

  let notificationSent = false
  try {
    notificationSent = await sendClinicNotification(data.reference_code, data.id)
  } catch (error) {
    console.error('Clinic notification failed.', error)
  }

  const { error: notificationUpdateError } = await supabase
    .from('appointment_requests')
    .update({ notification_status: notificationSent ? 'sent' : 'failed' })
    .eq('id', data.id)

  if (notificationUpdateError) {
    console.error('Notification status update failed.', notificationUpdateError)
  }

  return json(
    201,
    {
      ok: true,
      referenceCode: data.reference_code,
      notificationSent,
    },
    allowedOrigin,
  )
})

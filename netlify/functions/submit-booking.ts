import { handleBookingSubmission, type BookingPayload } from '../../src/server/bookingHandler'

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let body: BookingPayload = {}
  try {
    body = (await req.json()) as BookingPayload
  } catch {
    body = {}
  }

  const result = await handleBookingSubmission(body)

  return new Response(JSON.stringify(result), {
    status: result.ok ? 200 : 400,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

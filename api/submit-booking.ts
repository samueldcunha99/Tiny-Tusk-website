import type { IncomingMessage, ServerResponse } from 'node:http'
import { handleBookingSubmission, type BookingPayload } from '../src/server/bookingHandler'

export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.statusCode = 204
    res.end()
    return
  }

  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  let body = req.body
  if (!body) {
    body = await new Promise((resolve) => {
      let data = ''
      req.on('data', (chunk) => { data += chunk })
      req.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch {
          resolve({})
        }
      })
    })
  } else if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      body = {}
    }
  }

  const result = await handleBookingSubmission(body as BookingPayload)

  res.setHeader('Content-Type', 'application/json')
  res.statusCode = result.ok ? 200 : 400
  res.end(JSON.stringify(result))
}

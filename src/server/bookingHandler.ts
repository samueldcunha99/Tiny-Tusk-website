import nodemailer from 'nodemailer'

export interface BookingPayload {
  submissionId?: string
  childName?: string
  childAge?: string
  concern?: string
  preferredTime?: string
  parentName?: string
  phone?: string
  email?: string
  consent?: boolean
  turnstileToken?: string
  website?: string // Honeypot
}

export interface BookingResult {
  ok: boolean
  referenceCode?: string
  error?: string
}

function generateReferenceCode(): string {
  const year = new Date().getFullYear()
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `TT-${year}-${randomPart}`
}

function getMailTransporter() {
  const host = process.env.EMAIL_HOST?.trim() || 'smtp.gmail.com'
  const port = Number(process.env.EMAIL_PORT?.trim() || 465)
  const secure = process.env.EMAIL_SECURE !== 'false'
  const user = process.env.EMAIL_USER?.trim() || 'hello@tinytuskdental.com'
  const pass = process.env.EMAIL_PASS?.trim() || 'cwdjcuykqhalagnx'

  if (!user || !pass) {
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false,
    },
  })
}

export async function handleBookingSubmission(payload: BookingPayload): Promise<BookingResult> {
  // 1. Honeypot check
  if (payload.website && payload.website.trim().length > 0) {
    return { ok: true, referenceCode: generateReferenceCode() }
  }

  // 2. Validate fields
  const parentName = payload.parentName?.trim() || ''
  const phone = payload.phone?.trim() || ''
  const email = payload.email?.trim() || ''
  const childName = payload.childName?.trim() || ''
  const childAge = payload.childAge?.trim() || ''
  const concern = payload.concern?.trim() || 'General Check-up'
  const preferredTime = payload.preferredTime?.trim() || 'Flexible'

  if (!parentName || !phone || !email || !childName || !childAge) {
    return {
      ok: false,
      error: 'Please fill in all required fields (Parent name, phone, email, child name and age).',
    }
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }

  // 3. Optional Turnstile check
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY?.trim()
  if (turnstileSecret && payload.turnstileToken) {
    try {
      const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: turnstileSecret,
          response: payload.turnstileToken,
        }),
      })
      const turnstileData = (await turnstileRes.json()) as { success?: boolean }
      if (!turnstileData.success) {
        return { ok: false, error: 'Anti-spam check failed. Please refresh and try again.' }
      }
    } catch (err) {
      console.warn('Turnstile verification request failed:', err)
    }
  }

  const referenceCode = generateReferenceCode()
  const transporter = getMailTransporter()

  if (!transporter) {
    console.error('Mail transporter not configured: EMAIL_USER or EMAIL_PASS missing.')
    return {
      ok: false,
      error: 'Mail transporter configuration missing on server.',
    }
  }

  const clinicRecipients =
    process.env.CLINIC_NOTIFICATION_EMAIL?.trim() || 'samueldcunha99@gmail.com, hello@tinytuskdental.com'

  const submissionDate = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'short',
  })

  // 4. Send email to clinic
  const clinicHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F7F7F7; margin: 0; padding: 24px; color: #18528E; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(24,82,142,0.08); }
    .header { background: #18528E; color: #ffffff; padding: 32px 28px; text-align: center; }
    .badge { display: inline-block; background: #FFE497; color: #18528E; font-weight: bold; font-size: 18px; padding: 8px 18px; border-radius: 999px; margin-top: 12px; letter-spacing: 0.05em; }
    .content { padding: 28px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    td { padding: 12px 8px; border-bottom: 1px solid #C1CBE7; font-size: 15px; }
    td.label { font-weight: bold; color: #18528E; width: 38%; }
    td.val { color: #333333; }
    .actions { margin-top: 24px; text-align: center; }
    .btn { display: inline-block; background: #F16C59; color: #ffffff; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 999px; margin: 6px; }
    .btn-call { background: #18528E; }
    .footer { text-align: center; font-size: 12px; color: #888888; padding: 20px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1 style="margin:0; font-size: 24px;">New Appointment Request</h1>
      <div class="badge">${referenceCode}</div>
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-top: 0;">A parent has requested an appointment on the website:</p>
      <table>
        <tr>
          <td class="label">Child's Name</td>
          <td class="val"><strong>${childName}</strong></td>
        </tr>
        <tr>
          <td class="label">Child's Age</td>
          <td class="val">${childAge} years old</td>
        </tr>
        <tr>
          <td class="label">Reason for Visit</td>
          <td class="val"><strong>${concern}</strong></td>
        </tr>
        <tr>
          <td class="label">Preferred Time</td>
          <td class="val">${preferredTime}</td>
        </tr>
        <tr>
          <td class="label">Parent / Guardian</td>
          <td class="val"><strong>${parentName}</strong></td>
        </tr>
        <tr>
          <td class="label">Phone</td>
          <td class="val"><a href="tel:${phone}" style="color:#18528E; text-decoration:underline;">${phone}</a></td>
        </tr>
        <tr>
          <td class="label">Email</td>
          <td class="val"><a href="mailto:${email}" style="color:#18528E; text-decoration:underline;">${email}</a></td>
        </tr>
        <tr>
          <td class="label">Received At</td>
          <td class="val">${submissionDate}</td>
        </tr>
      </table>

      <div class="actions">
        <a class="btn btn-call" href="tel:${phone}">Call Parent</a>
        <a class="btn" href="mailto:${email}?subject=Tiny%20Tusk%20Appointment%20Confirmation%20(${referenceCode})">Email Parent</a>
      </div>
    </div>
    <div class="footer">
      Tiny Tusk Pediatric Dental Clinic · Automatic Notification System
    </div>
  </div>
</body>
</html>
`

  // 5. Send confirmation email to parent
  const parentHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F7F7F7; margin: 0; padding: 24px; color: #18528E; }
    .card { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(24,82,142,0.08); }
    .header { background: #18528E; color: #ffffff; padding: 32px 24px; text-align: center; }
    .badge { display: inline-block; background: #FFE497; color: #18528E; font-weight: bold; font-size: 16px; padding: 6px 16px; border-radius: 999px; margin-top: 10px; }
    .content { padding: 28px; line-height: 1.6; font-size: 15px; color: #333333; }
    .box { background: #F7F7F7; border-left: 4px solid #18528E; padding: 14px 18px; border-radius: 8px; margin: 18px 0; }
    .footer { text-align: center; font-size: 13px; color: #666666; padding: 20px; border-top: 1px solid #eeeeee; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1 style="margin:0; font-size: 24px; color: #ffffff;">We have your note!</h1>
      <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Tiny Tusk Pediatric Dental Clinic</p>
      <div class="badge">Reference: ${referenceCode}</div>
    </div>
    <div class="content">
      <p>Hello <strong>${parentName}</strong>,</p>
      <p>Thank you for reaching out to Tiny Tusk. We have received your appointment request for <strong>${childName}</strong>.</p>
      <div class="box">
        <p style="margin: 4px 0;"><strong>Reason:</strong> ${concern}</p>
        <p style="margin: 4px 0;"><strong>Preferred Time:</strong> ${preferredTime}</p>
        <p style="margin: 4px 0;"><strong>Reference Code:</strong> ${referenceCode}</p>
      </div>
      <p>A kind member of Dr. Nupur's team will call you shortly on <strong>${phone}</strong> to confirm the exact date and time that suits your family best.</p>
      <p>If you have any urgent questions or need to make immediate changes, feel free to reply to this email or reach out to us directly.</p>
      <p style="margin-top: 24px;">Warmly,<br><strong>Dr. Nupur & the Tiny Tusk Team</strong></p>
    </div>
    <div class="footer">
      Tiny Tusk Pediatric Dental Clinic<br>
      <a href="https://tinytuskdental.com" style="color: #18528E;">tinytuskdental.com</a>
    </div>
  </div>
</body>
</html>
`

  try {
    const fromUser = process.env.EMAIL_USER?.trim() || 'hello@tinytuskdental.com'

    // Send clinic notification
    const clinicInfo = await transporter.sendMail({
      from: `"Tiny Tusk Appointments" <${fromUser}>`,
      to: clinicRecipients,
      replyTo: email,
      subject: `New Appointment Request: ${referenceCode} - ${childName} (${parentName})`,
      html: clinicHtml,
    })
    console.log(`[MAIL] Clinic notification sent (${referenceCode}):`, clinicInfo.messageId)

    // Send parent confirmation
    const parentInfo = await transporter.sendMail({
      from: `"Tiny Tusk Pediatric Dental" <${fromUser}>`,
      to: email,
      replyTo: fromUser,
      subject: `We have your note — Tiny Tusk Pediatric Dental Clinic (${referenceCode})`,
      html: parentHtml,
    })
    console.log(`[MAIL] Parent confirmation sent (${referenceCode}):`, parentInfo.messageId)

    return { ok: true, referenceCode }
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : String(error)
    console.error('Failed to send booking notification email:', errMessage)

    let userFacingError = 'Your request was received, but the email notification could not be sent.'
    if (errMessage.includes('BadCredentials') || errMessage.includes('Username and Password not accepted')) {
      userFacingError =
        'Email authentication failed. If using Gmail/Google Workspace, please create a 16-character Google App Password in Google Account Settings -> Security -> App Passwords and add it to .env as EMAIL_PASS.'
    }

    return {
      ok: false,
      error: userFacingError,
    }
  }
}

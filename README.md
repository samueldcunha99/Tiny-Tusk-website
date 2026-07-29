# Tiny Tusk

Marketing website and appointment-request flow for Tiny Tusk Pediatric Dental
Clinic.

## Local development

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
npm run typecheck
npm run build
```

The front end runs without backend credentials, but it will clearly show that
online appointment requests are not connected. It never displays a false
success state.

## Appointment backend

The backend uses Supabase Postgres and Edge Functions, Cloudflare Turnstile for
bot protection, and Resend for reference-only clinic notifications. Start with
[`docs/backend.md`](docs/backend.md).

Local Supabase commands require Docker:

```sh
npm run backend:start
npm run backend:status
npm run backend:stop
```

## Content and release safeguards

- Never invent clinical claims, credentials, prices, opening hours, addresses,
  statistics, or testimonials.
- Dr. Nupur's credentials in `src/content/team.ts` are client-verified.
- Testimonials remain placeholders until the clinic supplies approved quotes
  with written consent.
- Review `docs/audit-2026-07-29.md` before continuing front-end work.

## Photography licensing

The photography in `public/images/` was extracted from the client's brand book.
Its licensing and permission for web use must be confirmed with the client
before the site goes live.

# Appointment backend runbook

## What is implemented

The appointment form sends one HTTPS request to the `submit-booking` Supabase
Edge Function. The browser never receives a database key and cannot write
directly to the appointment table.

The function:

1. accepts only configured website origins;
2. enforces a 12 KB request limit and strict server-side validation;
3. rejects honeypot submissions and verifies Cloudflare Turnstile;
4. uses a browser-generated UUID to make retries idempotent;
5. stores the minimum appointment-request data in Postgres;
6. emails the clinic a reference code without personal details; and
7. returns the same reference code to the parent.

Row Level Security allows only explicitly approved Supabase Auth users to read
or update appointment requests. A daily database job deletes records after 90
days.

## Services to create

Use clinic-owned accounts for:

- a Supabase project, preferably in the closest available region;
- a Cloudflare Turnstile widget for the production domain and localhost; and
- a Resend account with a verified sending domain.

Do not use personal developer accounts for production ownership.

## Deploy the database and function

Install dependencies, authenticate the CLI, and link this repository:

```sh
npm install
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

Configure server-only secrets. Use the real production origin and include the
development origin only when it is actually needed:

```sh
npx supabase secrets set BOOKING_ALLOWED_ORIGINS=https://www.example.com,http://localhost:5173
npx supabase secrets set TURNSTILE_SECRET_KEY=YOUR_TURNSTILE_SECRET
npx supabase secrets set RESEND_API_KEY=YOUR_RESEND_API_KEY
npx supabase secrets set RESEND_FROM_EMAIL="Tiny Tusk <appointments@example.com>"
npx supabase secrets set CLINIC_NOTIFICATION_EMAIL=THE_CLINIC_INBOX
npx supabase functions deploy submit-booking --no-verify-jwt
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are supplied automatically to a
hosted Supabase Edge Function. Never place server secrets in a `VITE_` variable,
commit them, or expose them to the browser.

## Connect the website

Copy `.env.example` to `.env.local` and set:

```dotenv
VITE_BOOKING_API_URL=https://YOUR_PROJECT_REF.supabase.co/functions/v1/submit-booking
VITE_TURNSTILE_SITE_KEY=YOUR_PUBLIC_TURNSTILE_SITE_KEY
```

Restart the Vite server after changing environment variables. Configure the
same two public variables in the production website host before building.

## Give clinic staff access

For the MVP, use the protected Supabase table editor instead of building a
custom admin dashboard.

1. Invite or create the staff member in Supabase Authentication.
2. Copy that user's UUID.
3. Run this in the Supabase SQL editor:

```sql
insert into public.admin_users (user_id)
values ('THE_AUTH_USER_UUID');
```

Only users listed in `admin_users` pass the appointment table's RLS policies.
Remove a staff member by deleting their row from `admin_users` or disabling
their Auth account.

## Production checks

Before accepting real patient details:

- get clinic/legal approval for the consent and retention wording;
- confirm the production origin is in `BOOKING_ALLOWED_ORIGINS`;
- confirm Turnstile permits the production hostname;
- submit one test request and record the browser reference code;
- verify one database row exists and no duplicate appears after a retry;
- verify the clinic email contains only the reference code;
- verify an anonymous Supabase client cannot select or insert table rows;
- verify an approved staff account can read and update a request;
- check Edge Function logs without logging request bodies; and
- confirm the scheduled retention job exists in Supabase Cron.

The function intentionally does not log names, phone numbers, email addresses,
or children's details.

## Local backend testing

The Supabase local stack requires Docker:

```sh
npm run backend:start
npx supabase db reset
npx supabase functions serve submit-booking --no-verify-jwt
```

Use Turnstile test keys locally, or connect the front end to a non-production
Supabase project. Do not put production personal data into development systems.

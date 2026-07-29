create extension if not exists pgcrypto;

create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_booking_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_booking_admin() from public;
grant execute on function public.is_booking_admin() to authenticated;

create table public.appointment_requests (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique,
  reference_code text not null unique default (
    'TT-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))
  ),
  parent_name text not null check (char_length(parent_name) between 2 and 100),
  contact_email text not null check (char_length(contact_email) between 3 and 254),
  contact_phone text not null check (char_length(contact_phone) between 5 and 32),
  child_first_name text not null check (char_length(child_first_name) between 1 and 80),
  child_age_years smallint not null check (child_age_years between 0 and 18),
  concern text not null check (
    concern in (
      'First visit',
      'A toothache or break',
      'A check-up',
      'Brushing or toothpaste advice'
    )
  ),
  preferred_time text not null check (
    preferred_time in (
      'Morning',
      'After school',
      'Saturday morning',
      'Please call me to talk it through'
    )
  ),
  consented_at timestamptz not null,
  status text not null default 'pending' check (
    status in ('pending', 'contacted', 'scheduled', 'closed')
  ),
  notification_status text not null default 'pending' check (
    notification_status in ('pending', 'sent', 'failed')
  ),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '90 days')
);

comment on table public.appointment_requests is
  'Minimal appointment-request data. Delete expired records on a scheduled retention job.';
comment on column public.appointment_requests.submission_id is
  'Browser-generated idempotency key. Prevents duplicate requests during retries.';
comment on column public.appointment_requests.expires_at is
  'Data-retention deadline. Production must schedule deletion of expired records.';

create index appointment_requests_status_created_idx
  on public.appointment_requests (status, created_at desc);
create index appointment_requests_expires_idx
  on public.appointment_requests (expires_at);

alter table public.appointment_requests enable row level security;

create policy "Booking admins can read appointment requests"
  on public.appointment_requests
  for select
  to authenticated
  using (public.is_booking_admin());

create policy "Booking admins can update appointment requests"
  on public.appointment_requests
  for update
  to authenticated
  using (public.is_booking_admin())
  with check (public.is_booking_admin());

revoke all on table public.appointment_requests from anon;
revoke all on table public.appointment_requests from authenticated;
grant select, update on table public.appointment_requests to authenticated;

create or replace function public.delete_expired_appointment_requests()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  deleted_count integer;
begin
  delete from public.appointment_requests
  where expires_at <= now();

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

revoke all on function public.delete_expired_appointment_requests() from public;

create extension if not exists pg_cron with schema extensions;

select cron.schedule(
  'tiny-tusk-delete-expired-appointment-requests',
  '17 3 * * *',
  $$select public.delete_expired_appointment_requests();$$
);

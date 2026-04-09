-- Applications submitted via /api/apply (server uses service role to insert).
-- Logged-in users get user_id set; guests remain null.
-- Run in Supabase SQL Editor after 001_profiles_and_login_rpc.sql

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users (id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  city text,
  attempt_type text,
  overview text,
  record_details text,
  consent boolean not null default false
);

create index if not exists applications_user_id_idx on public.applications (user_id);
create index if not exists applications_created_at_idx on public.applications (created_at desc);

alter table public.applications enable row level security;

-- Signed-in users can read only their own rows (inserts are done with service role).
create policy "applications_select_own"
  on public.applications for select
  using (auth.uid() = user_id);

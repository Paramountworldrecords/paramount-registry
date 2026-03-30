-- Paramount World Records — Supabase schema
-- Supabase Dashboard -> SQL Editor -> paste -> Run
--
-- After this, disable "Confirm email" for testing if you want instant login:
-- Authentication -> Providers -> Email -> Confirm email (toggle off for dev)

-- 1) Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  email text,
  name text,
  age int,
  gender text,
  phone text,
  address text,
  created_at timestamptz not null default now()
);

create unique index if not exists profiles_username_lower_idx on public.profiles (lower(username));

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- 2) Auto-create profile when a user signs up (reads user_metadata from signUp)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, email, name, age, gender, phone, address)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', 'user_' || left(new.id::text, 8)),
    new.email,
    new.raw_user_meta_data ->> 'name',
    nullif(new.raw_user_meta_data ->> 'age', '')::int,
    new.raw_user_meta_data ->> 'gender',
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'address'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3) Login helper: resolve username -> email (for username + password sign-in)
create or replace function public.login_email_for_username(p_username text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select email
  from public.profiles
  where lower(username) = lower(trim(p_username))
  limit 1;
$$;

grant execute on function public.login_email_for_username(text) to anon;
grant execute on function public.login_email_for_username(text) to authenticated;

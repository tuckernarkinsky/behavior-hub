-- ============================================================
-- Behavior Hub — Supabase Schema
-- Paste this into: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- Organizations (each clinic/practice is one org)
create table if not exists public.organizations (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  created_at  timestamptz default now()
);

-- User profiles (extends auth.users)
create table if not exists public.profiles (
  id              uuid references auth.users on delete cascade primary key,
  name            text,
  role            text not null default 'RBT',  -- 'BCBA' | 'RBT' | 'OT' | 'PT' | 'Admin'
  initials        text,
  color           text default '#0E9F8F',
  organization_id uuid references public.organizations,
  created_at      timestamptz default now()
);

-- Clients
create table if not exists public.clients (
  id              uuid default gen_random_uuid() primary key,
  name            text not null,
  age             int,
  color           text default '#0E9F8F',
  diagnosis       text,
  address         text,
  programs        int default 0,
  behaviors       int default 0,
  organization_id uuid references public.organizations,
  created_by      uuid references auth.users,
  created_at      timestamptz default now()
);

-- Scheduled sessions
create table if not exists public.sessions (
  id              uuid default gen_random_uuid() primary key,
  client_id       uuid references public.clients on delete cascade,
  date            date not null,
  start_time      text,
  end_time        text,
  address         text,
  status          text default 'upcoming',  -- 'upcoming' | 'completed' | 'cancelled'
  therapist_id    uuid references auth.users,
  supervisor_id   uuid references auth.users,
  organization_id uuid references public.organizations,
  created_by      uuid references auth.users,
  created_at      timestamptz default now()
);

-- Session notes (archived after sign-off)
create table if not exists public.session_notes (
  id              uuid default gen_random_uuid() primary key,
  client_id       uuid references public.clients on delete cascade,
  therapist_id    uuid references auth.users,
  date            date not null,
  duration        text,
  note            text,
  skill_pct       int,
  behavior_count  int default 0,
  signed_at       timestamptz default now(),
  organization_id uuid references public.organizations
);

-- ── Row Level Security ──────────────────────────────────────

alter table public.profiles       enable row level security;
alter table public.organizations   enable row level security;
alter table public.clients         enable row level security;
alter table public.sessions        enable row level security;
alter table public.session_notes   enable row level security;

-- Profiles: users can read/update their own
create policy "profiles_self" on public.profiles
  for all using (auth.uid() = id);

-- Org members can see each other's profiles
create policy "profiles_org" on public.profiles
  for select using (
    organization_id in (
      select organization_id from public.profiles where id = auth.uid()
    )
  );

-- Clients: org-wide access
create policy "clients_org" on public.clients
  for all using (
    organization_id in (
      select organization_id from public.profiles where id = auth.uid()
    )
  );

-- Sessions: org-wide
create policy "sessions_org" on public.sessions
  for all using (
    organization_id in (
      select organization_id from public.profiles where id = auth.uid()
    )
  );

-- Notes: org-wide
create policy "notes_org" on public.session_notes
  for all using (
    organization_id in (
      select organization_id from public.profiles where id = auth.uid()
    )
  );

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, initials)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    upper(left(coalesce(new.raw_user_meta_data->>'full_name', new.email), 1))
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

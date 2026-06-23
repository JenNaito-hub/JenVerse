-- JENVERSE — Supabase schema
-- Run this in the Supabase SQL editor after creating your project.
-- Enables row-level security so each user only sees their own data.

-- ── Profiles ────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  role text default 'Member',
  created_at timestamptz default now()
);

-- ── Projects ────────────────────────────────────────────────────────────────
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  color text default '#D7F205',
  assets int default 0,
  progress int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── History (every generation) ───────────────────────────────────────────────
create table if not exists public.history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('knowledge', 'image')),
  title text not null,
  prompt text not null,
  model text not null,
  project text,
  tokens int,
  thumbnail text,
  created_at timestamptz default now()
);

-- ── Workflows (reusable generation pipelines) ────────────────────────────────
create table if not exists public.workflows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  description text,
  category text not null default 'Generation',
  color text default '#D7F205',
  tags text[] default '{}',
  current_version text not null default '1.0.0',
  versions jsonb not null default '[]',
  runs int default 0,
  favorite boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── Conversations + messages ─────────────────────────────────────────────────
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'New conversation',
  model text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.history enable row level security;
alter table public.workflows enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

create policy "Profiles are viewable by owner"
  on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Projects are owned"
  on public.projects for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "History is owned"
  on public.history for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Workflows are owned"
  on public.workflows for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Conversations are owned"
  on public.conversations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Messages belong to owned conversations"
  on public.messages for all using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  );

-- ── Auto-create a profile on signup ──────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

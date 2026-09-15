-- Rooted With Ally — Instagram Content Planner
-- Run this once in your Supabase project's SQL editor (Project > SQL Editor > New query).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- posts
-- ---------------------------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date,
  time text not null default '09:00',
  type text not null default 'Reel' check (type in ('Reel', 'Carousel', 'Story', 'Post')),
  pillar text not null default 'quiet' check (pillar in ('quiet', 'faith', 'coming', 'real')),
  status text not null default 'idea' check (status in ('idea', 'drafted', 'scheduled', 'posted')),
  title text not null default '',
  caption text not null default '',
  hashtags text not null default '',
  cta text not null default '',
  thumb_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_user_id_idx on public.posts (user_id);
create index if not exists posts_user_date_idx on public.posts (user_id, date);

alter table public.posts enable row level security;

drop policy if exists "select own posts" on public.posts;
create policy "select own posts" on public.posts for select using (auth.uid() = user_id);

drop policy if exists "insert own posts" on public.posts;
create policy "insert own posts" on public.posts for insert with check (auth.uid() = user_id);

drop policy if exists "update own posts" on public.posts;
create policy "update own posts" on public.posts for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "delete own posts" on public.posts;
create policy "delete own posts" on public.posts for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- planner_settings — one row per user: banner photo strip + sidebar portrait
-- ---------------------------------------------------------------------------
create table if not exists public.planner_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  banner_photos jsonb not null default '[null, null, null, null, null]'::jsonb,
  sidebar_photo text,
  updated_at timestamptz not null default now()
);

alter table public.planner_settings enable row level security;

drop policy if exists "select own settings" on public.planner_settings;
create policy "select own settings" on public.planner_settings for select using (auth.uid() = user_id);

drop policy if exists "upsert own settings" on public.planner_settings;
create policy "insert own settings" on public.planner_settings for insert with check (auth.uid() = user_id);

drop policy if exists "update own settings" on public.planner_settings;
create policy "update own settings" on public.planner_settings for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- keep updated_at fresh
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at before update on public.posts
  for each row execute function public.set_updated_at();

drop trigger if exists settings_set_updated_at on public.planner_settings;
create trigger settings_set_updated_at before update on public.planner_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- storage bucket for banner / sidebar / post photos
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('planner-photos', 'planner-photos', true)
on conflict (id) do nothing;

drop policy if exists "planner photos are publicly readable" on storage.objects;
create policy "planner photos are publicly readable" on storage.objects
  for select using (bucket_id = 'planner-photos');

drop policy if exists "users upload to their own folder" on storage.objects;
create policy "users upload to their own folder" on storage.objects
  for insert with check (
    bucket_id = 'planner-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "users update their own photos" on storage.objects;
create policy "users update their own photos" on storage.objects
  for update using (
    bucket_id = 'planner-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "users delete their own photos" on storage.objects;
create policy "users delete their own photos" on storage.objects
  for delete using (
    bucket_id = 'planner-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

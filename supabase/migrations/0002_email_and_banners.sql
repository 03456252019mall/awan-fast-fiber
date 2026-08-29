-- ============================================================
-- AWAN FAST FIBER — Migration 2: email column + banners
-- Run this AFTER 0001_init.sql in Supabase SQL Editor
-- ============================================================

alter table public.profiles add column if not exists email text;

create table if not exists public.banners (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  image_url text,
  button_text text,
  button_url text,
  start_date date,
  end_date date,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.banners enable row level security;

create policy "banners_public_read" on public.banners
  for select using (is_active = true or public.is_staff());
create policy "banners_staff_write" on public.banners
  for all using (public.is_staff()) with check (public.is_staff());

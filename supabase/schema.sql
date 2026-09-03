-- Run this once in your Supabase project's SQL Editor (Project -> SQL Editor -> New query).
-- These tables are only ever read/written by the serverless function using the
-- service role key, so Row Level Security stays disabled here by design (no
-- client-side code touches these tables directly).

create table if not exists role_predictions (
  id uuid primary key default gen_random_uuid(),
  normalized_title text not null,
  country text not null default 'global',
  prediction jsonb not null,
  model_used text not null,
  created_at timestamptz not null default now(),
  unique (normalized_title, country)
);

create table if not exists usage_daily (
  user_id uuid not null,
  date date not null,
  count integer not null default 0,
  primary key (user_id, date)
);

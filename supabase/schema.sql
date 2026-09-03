-- Run this once in your Supabase project's SQL Editor (Project -> SQL Editor -> New query).
-- Ejecuta el archivo COMPLETO y de una sola vez: los ALTER del final dependen de que
-- los CREATE TABLE de arriba ya se hayan aplicado en la misma ejecución.

-- Caché de predicciones del LLM: evita volver a pagar por un puesto ya consultado.
create table if not exists role_predictions (
  id uuid primary key default gen_random_uuid(),
  normalized_title text not null,
  country text not null default 'global',
  prediction jsonb not null,
  model_used text not null,
  created_at timestamptz not null default now(),
  unique (normalized_title, country)
);

-- Contador diario por usuario: hace cumplir el límite de 10 predicciones/día.
create table if not exists usage_daily (
  user_id uuid not null,
  date date not null,
  count integer not null default 0,
  primary key (user_id, date)
);

-- Estas tablas solo las toca la función serverless (api/predict-role.js) con la
-- service role key. Activamos RLS SIN políticas a propósito: el service role se
-- salta RLS y sigue funcionando igual, mientras que cualquier lectura o escritura
-- desde el navegador con la anon key queda bloqueada por defecto.
alter table role_predictions enable row level security;
alter table usage_daily enable row level security;

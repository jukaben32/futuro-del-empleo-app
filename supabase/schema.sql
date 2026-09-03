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

-- Contador diario por usuario: hace cumplir el límite de 10 acciones de IA/día
-- (diagnósticos vía predict-role.js y roadmaps vía generate-roadmap.js comparten este cupo).
create table if not exists usage_daily (
  user_id uuid not null,
  date date not null,
  count integer not null default 0,
  primary key (user_id, date)
);

-- Caché de roadmaps de reskilling generados por IA (api/generate-roadmap.js), para
-- profesiones que no encajan en ninguna de las 3 rutas curadas fijas (RESKILLING_PATHS
-- en src/data/futureJobsData.js). Misma clave de caché que role_predictions: el
-- roadmap se deriva 1:1 del diagnóstico ya cacheado para ese (puesto, país).
create table if not exists reskilling_roadmaps (
  id uuid primary key default gen_random_uuid(),
  normalized_title text not null,
  country text not null default 'global',
  roadmap jsonb not null,
  model_used text not null,
  created_at timestamptz not null default now(),
  unique (normalized_title, country)
);

-- Estas 3 tablas solo las toca la función serverless (api/predict-role.js y
-- api/generate-roadmap.js) con la service role key. Activamos RLS SIN políticas
-- a propósito: el service role se salta RLS y sigue funcionando igual, mientras
-- que cualquier lectura o escritura desde el navegador con la anon key queda
-- bloqueada por defecto.
alter table role_predictions enable row level security;
alter table usage_daily enable row level security;
alter table reskilling_roadmaps enable row level security;


-- ============================================================================
-- Fase 2: persistencia de usuario (src/lib/userData.js). A diferencia de las
-- 3 tablas de arriba, estas SÍ se leen y escriben directo desde el navegador
-- con la sesión del usuario (supabase-js adjunta su JWT automáticamente) — por
-- eso llevan políticas RLS reales basadas en auth.uid(), no "RLS sin políticas".
-- ============================================================================

-- Perfil mínimo: último puesto y país consultados, para no repreguntarlos.
create table if not exists user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_job_title text,
  country text not null default 'global',
  updated_at timestamptz not null default now()
);

alter table user_profiles enable row level security;

create policy "select_own_profile" on user_profiles
  for select using (auth.uid() = user_id);
create policy "insert_own_profile" on user_profiles
  for insert with check (auth.uid() = user_id);
create policy "update_own_profile" on user_profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);


-- Historial de diagnósticos por usuario (distinto de role_predictions: esa es
-- una caché global compartida; esta es "qué consultó cada quien", con su
-- propio roadmap si llegó a generarlo).
create table if not exists user_diagnosis_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  normalized_title text not null,
  country text not null default 'global',
  job_title text not null,
  diagnosis jsonb not null,
  roadmap jsonb,
  updated_at timestamptz not null default now(),
  unique (user_id, normalized_title, country)
);

alter table user_diagnosis_history enable row level security;

create policy "select_own_history" on user_diagnosis_history
  for select using (auth.uid() = user_id);
create policy "insert_own_history" on user_diagnosis_history
  for insert with check (auth.uid() = user_id);
create policy "update_own_history" on user_diagnosis_history
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete_own_history" on user_diagnosis_history
  for delete using (auth.uid() = user_id);


-- Progreso de las casillas del plan de reskilling, por usuario y por plan
-- (path_key: uno de los 3 ids fijos de RESKILLING_PATHS, o
-- "custom:<puesto_normalizado>:<país>" para un roadmap generado por IA —
-- ver buildCustomProgressKey en src/lib/userData.js).
create table if not exists user_roadmap_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  path_key text not null,
  completed_steps jsonb not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (user_id, path_key)
);

alter table user_roadmap_progress enable row level security;

create policy "select_own_progress" on user_roadmap_progress
  for select using (auth.uid() = user_id);
create policy "insert_own_progress" on user_roadmap_progress
  for insert with check (auth.uid() = user_id);
create policy "update_own_progress" on user_roadmap_progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);


-- Diagnóstico compartible: se crea autenticado, se lee sin sesión (el punto de
-- un enlace compartible es que funcione para quien lo reciba, sin loguearse).
-- Deliberadamente NO incluye el roadmap generado, solo el diagnóstico — ver README.
create table if not exists shared_diagnoses (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete cascade,
  job_title text not null,
  diagnosis jsonb not null,
  created_at timestamptz not null default now()
);

alter table shared_diagnoses enable row level security;

create policy "insert_own_share" on shared_diagnoses
  for insert with check (auth.uid() = created_by);
create policy "select_any_share" on shared_diagnoses
  for select using (true);

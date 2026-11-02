-- =====================================================================
-- KING OF MUSIC — Perfiles y registro de sesiones
-- Los usuarios se crean en auth.users al iniciar sesión con Google.
-- Estas tablas se llenan SOLO desde triggers del servidor; el cliente
-- únicamente puede leer sus propias filas (RLS).
-- =====================================================================

-- Esquema privado (no expuesto por la Data API) para funciones internas.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- PERFILES
-- ---------------------------------------------------------------------
create table public.profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  email           text,
  full_name       text,
  first_name      text,
  avatar_url      text,
  provider        text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  last_sign_in_at timestamptz
);

comment on table public.profiles is
  'Perfil público mínimo de cada usuario. Se sincroniza desde auth.users (Google).';

alter table public.profiles enable row level security;

create policy "profiles: cada usuario lee su perfil"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

-- ---------------------------------------------------------------------
-- REGISTRO DE SESIONES (espejo de auth.sessions)
-- ---------------------------------------------------------------------
create table public.user_sessions (
  id             uuid primary key,               -- = auth.sessions.id
  user_id        uuid not null references auth.users (id) on delete cascade,
  created_at     timestamptz not null default now(),
  last_active_at timestamptz not null default now(),
  expires_at     timestamptz,
  user_agent     text,
  ip             inet,
  ended_at       timestamptz,
  end_reason     text check (end_reason in (
                   'signed_out', 'expired_inactivity', 'expired_max_age'))
);

comment on table public.user_sessions is
  'Historial de sesiones por usuario. Se alimenta con triggers sobre auth.sessions.';

create index user_sessions_user_id_idx on public.user_sessions (user_id, created_at desc);

alter table public.user_sessions enable row level security;

create policy "user_sessions: cada usuario lee sus sesiones"
  on public.user_sessions for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Solo lectura para usuarios autenticados; nadie escribe desde el cliente.
revoke all on public.profiles, public.user_sessions from anon, authenticated;
grant select on public.profiles, public.user_sessions to authenticated;

-- ---------------------------------------------------------------------
-- FUNCIONES DE SINCRONIZACIÓN (privadas, security definer)
-- ---------------------------------------------------------------------

-- Usuario nuevo o actualizado (nombre, foto, último inicio de sesión).
create or replace function private.sync_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  v_full text := nullif(trim(coalesce(meta->>'full_name', meta->>'name', '')), '');
begin
  insert into public.profiles as p
    (id, email, full_name, first_name, avatar_url, provider, last_sign_in_at)
  values (
    new.id,
    new.email,
    v_full,
    coalesce(nullif(trim(meta->>'given_name'), ''), split_part(v_full, ' ', 1)),
    coalesce(meta->>'avatar_url', meta->>'picture'),
    new.raw_app_meta_data->>'provider',
    new.last_sign_in_at
  )
  on conflict (id) do update set
    email           = excluded.email,
    full_name       = excluded.full_name,
    first_name      = excluded.first_name,
    avatar_url      = excluded.avatar_url,
    provider        = excluded.provider,
    last_sign_in_at = excluded.last_sign_in_at,
    updated_at      = now();
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.sync_profile();

create trigger on_auth_user_updated
  after update of email, raw_user_meta_data, last_sign_in_at on auth.users
  for each row execute function private.sync_profile();

-- Sesión creada / refrescada / terminada.
create or replace function private.sync_session()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.user_sessions (id, user_id, created_at, last_active_at, expires_at, user_agent, ip)
    values (new.id, new.user_id, coalesce(new.created_at, now()),
            coalesce(new.refreshed_at at time zone 'utc', new.updated_at, now()),
            new.not_after, new.user_agent, new.ip)
    on conflict (id) do nothing;
    return new;
  elsif tg_op = 'UPDATE' then
    update public.user_sessions
       set last_active_at = coalesce(new.refreshed_at at time zone 'utc', new.updated_at, now()),
           expires_at     = new.not_after,
           user_agent     = coalesce(new.user_agent, user_agent),
           ip             = coalesce(new.ip, ip)
     where id = new.id;
    return new;
  else -- DELETE: cierre de sesión o expiración aplicada por el servidor.
    update public.user_sessions
       set ended_at   = now(),
           end_reason = coalesce(nullif(current_setting('kom.end_reason', true), ''), 'signed_out')
     where id = old.id and ended_at is null;
    return old;
  end if;
end;
$$;

create trigger on_auth_session_change
  after insert or update or delete on auth.sessions
  for each row execute function private.sync_session();

revoke all on function private.sync_profile(), private.sync_session() from public, anon, authenticated;

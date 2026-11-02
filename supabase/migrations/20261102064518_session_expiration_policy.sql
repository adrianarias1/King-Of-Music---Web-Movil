-- =====================================================================
-- KING OF MUSIC — Política de duración de sesiones (servidor)
--
--   * Duración máxima absoluta: 30 días desde el inicio de sesión.
--   * Inactividad: 7 días sin abrir la web/app (sin refrescar token).
--
-- Borrar la fila de auth.sessions revoca sus refresh tokens: el cliente
-- ya no puede renovar y la sesión termina al expirar el access token
-- (1 h por defecto). El motivo queda registrado en public.user_sessions.
-- =====================================================================

create extension if not exists pg_cron;

create or replace function private.enforce_session_policy()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform set_config('kom.end_reason', 'expired_max_age', true);
  delete from auth.sessions
   where created_at < now() - interval '30 days';

  perform set_config('kom.end_reason', 'expired_inactivity', true);
  delete from auth.sessions
   where coalesce(refreshed_at at time zone 'utc', updated_at, created_at)
         < now() - interval '7 days';

  perform set_config('kom.end_reason', '', true);
end;
$$;

revoke all on function private.enforce_session_policy() from public, anon, authenticated;

-- Cada hora (minuto 17 para no coincidir con otros trabajos en :00).
select cron.schedule(
  'kom-enforce-session-policy',
  '17 * * * *',
  $$select private.enforce_session_policy();$$
);

-- =====================================================================
-- Nombres visibles para cuentas institucionales.
-- Las cuentas de Google Workspace de la escuela entregan el nombre como
-- "APELLIDO APELLIDO NOMBRE(S)" en mayúsculas y sin given_name.
-- Si la cuenta es de Workspace (claim hd), el nombre viene todo en
-- mayúsculas y tiene 3+ palabras, se reordena a "Nombre(s) Apellidos"
-- con formato de título. Las cuentas normales no se modifican.
-- =====================================================================

create or replace function private.display_name_parts(meta jsonb, out full_name text, out first_name text)
language plpgsql
immutable
set search_path = ''
as $$
declare
  raw   text := nullif(btrim(regexp_replace(coalesce(meta->>'full_name', meta->>'name', ''), '\s+', ' ', 'g')), '');
  given text := nullif(btrim(meta->>'given_name'), '');
  hd    text := nullif(btrim(coalesce(meta->'custom_claims'->>'hd', meta->>'hd')), '');
  words text[];
  n     int;
begin
  if raw is null then
    full_name := null;
    first_name := given;
    return;
  end if;

  words := string_to_array(raw, ' ');
  n := coalesce(array_length(words, 1), 0);

  if given is null and hd is not null and raw = upper(raw) and n >= 3 then
    -- "ZAMORA PARTIDA ENRIQUE GAEL" -> "Enrique Gael Zamora Partida"
    full_name := initcap(lower(array_to_string(words[3:n], ' ') || ' ' || array_to_string(words[1:2], ' ')));
    first_name := initcap(lower(words[3]));
  else
    full_name := case when raw = upper(raw) then initcap(lower(raw)) else raw end;
    first_name := coalesce(given, split_part(full_name, ' ', 1));
  end if;
end;
$$;

revoke all on function private.display_name_parts(jsonb) from public, anon, authenticated;

create or replace function private.sync_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta  jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  names record;
begin
  select * into names from private.display_name_parts(meta);

  insert into public.profiles as p
    (id, email, full_name, first_name, avatar_url, provider, last_sign_in_at)
  values (
    new.id,
    new.email,
    names.full_name,
    names.first_name,
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

-- Recalcula los perfiles existentes (el trigger de reseñas actualiza
-- también el nombre visible de sus reseñas).
update public.profiles p
   set full_name  = names.full_name,
       first_name = names.first_name,
       updated_at = now()
  from auth.users u
  cross join lateral private.display_name_parts(coalesce(u.raw_user_meta_data, '{}'::jsonb)) as names
 where u.id = p.id;

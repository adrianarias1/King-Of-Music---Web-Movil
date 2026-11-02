-- =====================================================================
-- KING OF MUSIC — Reseñas
--
--   * review_subjects: catálogo de lo que se puede reseñar.
--   * reviews: un usuario escribe muchas reseñas; cada reseña tiene un
--     autor. El autor puede editar (calificación y comentario) y borrar.
--   * Moderación básica: status 'published' | 'hidden' (solo admins,
--     desde el panel de Supabase).
--   * Validación en el servidor: normalización del texto, longitudes,
--     calificación 1-5, catálogo y límite anti-spam (5 por minuto).
-- =====================================================================

-- ---------------------------------------------------------------------
-- CATÁLOGO
-- ---------------------------------------------------------------------
create table public.review_subjects (
  section    text not null check (section in ('personajes', 'escenarios', 'mapa')),
  id         text not null check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name       text not null,
  sort_order smallint not null default 0,
  primary key (section, id)
);

comment on table public.review_subjects is
  'Personajes, escenarios y mapa que se pueden reseñar. Los IDs coinciden con src/data.';

insert into public.review_subjects (section, id, name, sort_order) values
  ('personajes', 'juan-grabriel',           'Juan Grabriel',                 1),
  ('personajes', 'jose-jose-jose',          'José José José',                2),
  ('personajes', 'alex-llora',              'Alex Llora',                    3),
  ('personajes', 'roman-ayala',             'Román Ayala',                   4),
  ('personajes', 'natanael-chano',          'Natanael Chano',                5),
  ('personajes', 'peso-plomo',              'Peso Plomo',                    6),
  ('personajes', 'flavia',                  'Flavia',                        7),
  ('mapa',       'general',                 'Mapa general',                  1),
  ('escenarios', 'la-madrugadora',          'La Madrugadora',                1),
  ('escenarios', 'bellas-artes',            'Bellas Artes',                  2),
  ('escenarios', 'zocalo-ciudad-de-mexico', 'Zócalo de la Ciudad de México', 3);

alter table public.review_subjects enable row level security;

create policy "review_subjects: lectura pública"
  on public.review_subjects for select
  to anon, authenticated
  using (true);

revoke all on public.review_subjects from anon, authenticated;
grant select on public.review_subjects to anon, authenticated;

-- ---------------------------------------------------------------------
-- RESEÑAS
-- ---------------------------------------------------------------------
create table public.reviews (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null default auth.uid()
                      references auth.users (id) on delete cascade,
  section           text not null,
  subject_id        text not null,
  rating            smallint not null check (rating between 1 and 5),
  comment           text not null check (
                      char_length(comment) between 10 and 1000
                      and comment = btrim(comment, E' \t\r\n')
                      and comment ~ '[[:alnum:]]'
                    ),
  author_name       text not null check (char_length(author_name) between 1 and 120),
  author_avatar_url text,
  status            text not null default 'published'
                      check (status in ('published', 'hidden')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  foreign key (section, subject_id)
    references public.review_subjects (section, id) on update cascade
);

comment on table public.reviews is
  'Reseñas de la comunidad. Autor, nombre y foto los asigna el servidor.';

-- Listado público por elemento (solo publicadas) y "mis reseñas".
create index reviews_subject_published_idx
  on public.reviews (section, subject_id, created_at desc)
  where status = 'published';
create index reviews_user_id_idx
  on public.reviews (user_id, created_at desc);

alter table public.reviews enable row level security;

-- Todos leen las publicadas; el autor también ve las suyas ocultas.
create policy "reviews: lectura pública de publicadas"
  on public.reviews for select
  to anon, authenticated
  using (status = 'published' or (select auth.uid()) = user_id);

create policy "reviews: crear a nombre propio"
  on public.reviews for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "reviews: el autor edita"
  on public.reviews for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "reviews: el autor borra"
  on public.reviews for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Permisos por columna: el cliente solo elige qué reseña y su contenido;
-- al editar solo puede cambiar calificación y comentario.
revoke all on public.reviews from anon, authenticated;
grant select on public.reviews to anon, authenticated;
grant insert (section, subject_id, rating, comment) on public.reviews to authenticated;
grant update (rating, comment) on public.reviews to authenticated;
grant delete on public.reviews to authenticated;

-- ---------------------------------------------------------------------
-- FUNCIONES (privadas)
-- ---------------------------------------------------------------------

-- Limpia el comentario: saltos de línea uniformes, sin espacios al final
-- de cada línea, máximo una línea en blanco seguida y sin espacios dobles.
create or replace function private.normalize_review_comment(value text)
returns text
language sql
immutable
set search_path = ''
as $$
  select btrim(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(coalesce(value, ''), E'\r\n?', E'\n', 'g'),
        E'[ \t]+\n', E'\n', 'g'),
      E'\n{3,}', E'\n\n', 'g'),
    E'[ \t]{2,}', ' ', 'g'),
  E' \t\n');
$$;

-- Antes de insertar: autor desde la sesión, nombre y foto desde el
-- perfil, texto normalizado y límite anti-spam.
create or replace function private.reviews_before_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  recent int;
  p record;
begin
  if uid is null then
    raise exception 'KOM_AUTH_REQUIRED' using errcode = '42501';
  end if;

  select count(*) into recent
    from public.reviews
   where user_id = uid and created_at > now() - interval '1 minute';
  if recent >= 5 then
    raise exception 'KOM_RATE_LIMIT'
      using errcode = 'P0001',
            hint = 'Máximo 5 reseñas por minuto.';
  end if;

  select full_name, first_name, avatar_url into p
    from public.profiles where id = uid;

  new.user_id           := uid;
  new.author_name       := left(coalesce(nullif(btrim(p.full_name), ''), nullif(btrim(p.first_name), ''), 'Jugador'), 120);
  new.author_avatar_url := p.avatar_url;
  new.status            := 'published';
  new.comment           := private.normalize_review_comment(new.comment);
  new.created_at        := now();
  new.updated_at        := new.created_at;
  return new;
end;
$$;

create trigger reviews_before_insert
  before insert on public.reviews
  for each row execute function private.reviews_before_insert();

-- Antes de actualizar: normaliza y marca la fecha de edición solo si
-- cambió el contenido.
create or replace function private.reviews_before_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.comment := private.normalize_review_comment(new.comment);
  if new.comment is distinct from old.comment or new.rating is distinct from old.rating then
    new.updated_at := now();
  else
    new.updated_at := old.updated_at;
  end if;
  new.created_at := old.created_at;
  return new;
end;
$$;

create trigger reviews_before_update
  before update on public.reviews
  for each row execute function private.reviews_before_update();

-- Si el usuario cambia su nombre o foto en Google, sus reseñas se
-- actualizan con el nuevo nombre visible.
create or replace function private.sync_review_authors()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.reviews
     set author_name = left(coalesce(nullif(btrim(new.full_name), ''), nullif(btrim(new.first_name), ''), 'Jugador'), 120),
         author_avatar_url = new.avatar_url
   where user_id = new.id;
  return new;
end;
$$;

create trigger on_profile_updated_sync_reviews
  after update of full_name, first_name, avatar_url on public.profiles
  for each row
  when (old.full_name is distinct from new.full_name
        or old.first_name is distinct from new.first_name
        or old.avatar_url is distinct from new.avatar_url)
  execute function private.sync_review_authors();

revoke all on function
  private.normalize_review_comment(text),
  private.reviews_before_insert(),
  private.reviews_before_update(),
  private.sync_review_authors()
from public, anon, authenticated;

-- Los triggers del cliente necesitan ejecutar la normalización.
grant usage on schema private to authenticated;
grant execute on function private.normalize_review_comment(text) to authenticated;

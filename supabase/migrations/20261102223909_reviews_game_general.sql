-- =====================================================================
-- Reseñas sobre el juego en general + estadísticas globales.
-- =====================================================================

-- 1. Nueva categoría "juego" en el catálogo.
alter table public.review_subjects
  drop constraint review_subjects_section_check;
alter table public.review_subjects
  add constraint review_subjects_section_check
  check (section in ('juego', 'personajes', 'escenarios', 'mapa'));

insert into public.review_subjects (section, id, name, sort_order)
values ('juego', 'general', 'El juego', 0);

-- 2. Índice para la vista general (últimas reseñas publicadas de todo).
create index reviews_published_recent_idx
  on public.reviews (created_at desc, id desc)
  where status = 'published';

-- 3. Promedio y total de todas las reseñas publicadas.
--    SECURITY INVOKER: respeta RLS; solo cuenta filas publicadas.
create or replace function public.review_stats()
returns table (total integer, average numeric)
language sql
stable
security invoker
set search_path = ''
as $$
  select count(*)::integer as total,
         round(avg(rating)::numeric, 1) as average
    from public.reviews
   where status = 'published';
$$;

revoke all on function public.review_stats() from public;
grant execute on function public.review_stats() to anon, authenticated;

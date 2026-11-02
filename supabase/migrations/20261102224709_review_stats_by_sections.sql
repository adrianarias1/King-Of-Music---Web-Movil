-- review_stats() acepta un filtro opcional de categorías:
--   review_stats()                         -> todas las reseñas publicadas
--   review_stats(array['escenarios','mapa']) -> solo esas categorías
drop function if exists public.review_stats();

create or replace function public.review_stats(sections text[] default null)
returns table (total integer, average numeric)
language sql
stable
security invoker
set search_path = ''
as $$
  select count(*)::integer as total,
         round(avg(rating)::numeric, 1) as average
    from public.reviews
   where status = 'published'
     and (sections is null or section = any (sections));
$$;

revoke all on function public.review_stats(text[]) from public;
grant execute on function public.review_stats(text[]) to anon, authenticated;

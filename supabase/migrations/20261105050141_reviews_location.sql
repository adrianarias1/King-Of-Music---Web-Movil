-- =====================================================================
-- Ubicación de la reseña: "Estado, País" (p. ej. "Nayarit, México").
-- Opcional. Nunca se guardan coordenadas; solo el texto ya resuelto.
-- Se define al publicar y no se edita después.
-- =====================================================================

alter table public.reviews
  add column location text
    check (
      location is null
      or (
        char_length(location) between 3 and 120
        and location ~ '^[^,]+, [^,]+$'
        and location = btrim(location)
      )
    );

comment on column public.reviews.location is
  'Ubicación desde donde se publicó, formato "Estado, País". Opcional.';

-- El cliente puede enviarla al publicar (no al editar).
grant insert (location) on public.reviews to authenticated;

-- Datos (aplicado manualmente el 2026-11-05, con autorización del autor):
-- update public.reviews set location = 'Nayarit, México'
--  where location is null
--    and author_name in ('Enrique Gael Zamora Partida', 'Zamora Partida Enrique Gael');

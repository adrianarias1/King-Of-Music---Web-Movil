# Reseñas

Las reseñas se abren desde el botón flotante dorado (abajo a la derecha,
`ReviewsDock` en `App.tsx`). El panel tiene dos áreas: **Escribir reseña** y
**Comunidad**. Escritorio: panel lateral con ambas áreas; móvil: hoja inferior
con pestañas.

## Vista general (por defecto)

Al abrir el panel, la categoría es **"El juego en general"**:

- El formulario sirve para opinar sobre el juego, sin elegir personaje ni
  escenario (se guarda como `section = 'juego'`, `subject_id = 'general'`).
- La lista muestra las **últimas 15 reseñas de toda la comunidad** (juego,
  personajes, escenarios y mapa), cada una con su etiqueta "Sobre: …".
  **Ver más reseñas** carga las siguientes 15 (paginación por cursor).
- El promedio y el total son de **todas** las reseñas publicadas
  (`public.review_stats()`).
- Al elegir Personajes o Mapa y escenarios aparece un segundo selector y el
  botón **Volver a la vista general**. La etiqueta "Sobre: …" de una reseña
  lleva directo a las reseñas de ese elemento.

## Vista de un personaje o escenario

El selector **Mostrar** ofrece:

- **Más recientes** / **Mejor calificación**: reseñas del elemento elegido.
- **Ver todas**: todas las reseñas de la categoría (p. ej. en Mapa y escenarios
  aparecen las de todos los escenarios y del mapa), de 15 en 15 con
  **Ver más**, etiqueta "Sobre: …" y promedio de esa categoría
  (`review_stats(array['escenarios','mapa'])`).

Los datos viven en Supabase (proyecto KING OF MUSIC). Las reseñas de la
versión anterior (solo en el navegador) eran de prueba y se descartan.

## Ubicación (opcional)

Al escribir una reseña, la casilla **"Mostrar desde qué país publico"** (activada
por defecto y recordada en el dispositivo) pide permiso de ubicación la primera
vez que el usuario interactúa con el formulario:

1. Web: geolocalización del navegador. App: `@capacitor/geolocation`
   (ubicación aproximada; permisos en `AndroidManifest.xml`).
2. La Edge Function `reverse-geocode` (Supabase, requiere sesión) convierte las
   coordenadas en **"Estado, País"** con OpenStreetMap. Las coordenadas no se
   guardan.
3. Se guarda en `reviews.location`; en la lista se muestra **solo el país**, en
   dorado. Si el usuario niega el permiso o desactiva la casilla, la reseña se
   publica sin ubicación.

Código: `src/lib/location.ts` · `supabase/functions/reverse-geocode/index.ts`.

## Reglas

- Cualquiera puede **leer** las reseñas publicadas, sin iniciar sesión.
- Para **escribir** hay que iniciar sesión con Google. El nombre y la foto del
  autor salen de su cuenta; no se escriben a mano.
- Un usuario puede escribir **muchas reseñas**; cada reseña tiene un solo autor.
- El autor puede **editar** (calificación y comentario) y **eliminar** sus
  reseñas. Las editadas muestran "editada".
- **Anti-spam:** máximo 5 reseñas por minuto por usuario.
- **Moderación básica:** un administrador puede cambiar `status` a `hidden`
  desde el panel de Supabase (Table Editor → `reviews`). La reseña deja de
  verse para todos; su autor la ve con el aviso "Ocultada por moderación".

## Validación (formulario + base de datos)

| Regla | Formulario | Base de datos |
|---|---|---|
| Categoría y elemento existentes | ✅ | ✅ catálogo `review_subjects` |
| Calificación entera 1–5 | ✅ | ✅ |
| Comentario obligatorio, no solo espacios ni solo símbolos | ✅ | ✅ |
| Espacios y saltos de línea normalizados | ✅ | ✅ |
| 10–1000 caracteres (contador en vivo) | ✅ | ✅ |
| Sesión iniciada; autor = usuario de la sesión | ✅ | ✅ RLS + trigger |
| Límite de 5 por minuto | — | ✅ trigger |

Código: `src/features/reviews/validation.ts` (reglas compartidas),
`repository.ts` (Supabase), `Reviews.tsx` (interfaz).
SQL: `supabase/migrations/20261102221718_reviews.sql` `20261102223909_reviews_game_general.sql` y `20261102224709_review_stats_by_sections.sql`.

## Tabla `public.reviews`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | Llave primaria |
| `user_id` | uuid | Autor (`auth.users`), lo asigna el servidor |
| `section` | text | `juego` · `personajes` · `escenarios` · `mapa` |
| `subject_id` | text | ID del catálogo (`juan-grabriel`, `general`…) |
| `rating` | smallint | 1–5 |
| `comment` | text | 10–1000 caracteres |
| `author_name` | text | Nombre visible, desde el perfil |
| `author_avatar_url` | text | Foto de Google (opcional) |
| `status` | text | `published` · `hidden` |
| `location` | text | "Estado, País" desde donde se publicó (opcional) |
| `created_at` / `updated_at` | timestamptz | Publicación / última edición |

Para agregar un personaje o escenario reseñable: añadirlo en `src/data` y
crear la fila correspondiente en `public.review_subjects` con el mismo ID.

## Pruebas

```bash
node --test src/features/reviews/validation.test.mjs
```

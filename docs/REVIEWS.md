# Reseñas

Las reseñas se abren desde el botón flotante dorado (abajo a la derecha,
`ReviewsDock` en `App.tsx`). El panel tiene dos selectores (Categoría y
personaje/escenario) y dos áreas: **Escribir reseña** y **Comunidad**.
Escritorio: panel lateral con ambas áreas; móvil: hoja inferior con pestañas.

Los datos viven en Supabase (proyecto KING OF MUSIC). Las reseñas de la
versión anterior (solo en el navegador) eran de prueba y se descartan.

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
SQL: `supabase/migrations/20261102221718_reviews.sql`.

## Tabla `public.reviews`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | Llave primaria |
| `user_id` | uuid | Autor (`auth.users`), lo asigna el servidor |
| `section` | text | `personajes` · `escenarios` · `mapa` |
| `subject_id` | text | ID del catálogo (`juan-grabriel`, `general`…) |
| `rating` | smallint | 1–5 |
| `comment` | text | 10–1000 caracteres |
| `author_name` | text | Nombre visible, desde el perfil |
| `author_avatar_url` | text | Foto de Google (opcional) |
| `status` | text | `published` · `hidden` |
| `created_at` / `updated_at` | timestamptz | Publicación / última edición |

Para agregar un personaje o escenario reseñable: añadirlo en `src/data` y
crear la fila correspondiente en `public.review_subjects` con el mismo ID.

## Pruebas

```bash
node --test src/features/reviews/validation.test.mjs
```

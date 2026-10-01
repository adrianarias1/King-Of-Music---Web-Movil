# ARCHITECTURE.md — Arquitectura

## Panorama general
SPA de una sola pagina. Sin router: la navegacion usa anchors (`#inicio`, `#personajes`) con scroll suave y `scroll-padding-top` para compensar el header fijo.

## Estructura
```text
src/
  components/
    layout/    # Header, Footer (estructura global)
    sections/  # Secciones del landing, una por archivo
    ui/        # Reutilizables: Button, Modal, SmartImage, Reveal, ErrorBoundary, ToolCard
    three/     # CharacterViewer, ViewerCanvas, CharacterModel, PlaceholderFigure, AbilityModal
  data/        # characters.ts, locations.ts, tools.ts, team.ts, storyboard.ts, navigation.ts
  hooks/       # useInView, useDialog, useReducedMotion, useBodyScrollLock, useScrolledPast
  styles/      # tokens.css, base.css, layout.css, overlays.css, index.css
  types/       # index.ts (dominio)
  utils/       # assets.ts (assetUrl, assetExists)
  config.ts    # Config global: descarga y rutas de assets pendientes
```

## Separacion de responsabilidades
- **Datos** en `src/data/*.ts`, tipados con `src/types/index.ts`. Los componentes visuales no hardcodean contenido.
- **Config** en `src/config.ts`: unico lugar para `download` y rutas de hero/trailer/mapa pendientes.
- **Placeholders**: `SmartImage` y la comprobacion `assetExists()` evitan 404 y muestran bloques CSS propios.

## Cargado y rendimiento
- `CharacterViewer` se importa con `React.lazy` + `Suspense` (arrastre de Three.js fuera del bundle inicial).
- El Canvas 3D solo se monta cuando la seccion se acerca al viewport (`useInView`, rootMargin 300px) y usa `frameloop="never"` cuando sale de pantalla.
- `manualChunks` en `vite.config.ts` separa `three` y `motion`.
- `base: './'` para funcionar en subdirectorios y en el WebView de Capacitor (`file://`).
- Video del trailer: el `<video>` no se monta hasta pulsar Play; sin autoplay.

## Manejo de errores
- `ErrorBoundary` envuelve el visor 3D y la seccion lazy: nunca pantalla blanca.
- `useGLTF` envuelto en `Suspense` con fallback; si el `.glb` no existe se usa `PlaceholderFigure` (geometria Three.js pura).
- `assetExists()` (HEAD) evita intentar cargar assets inexistentes.

## Accesibilidad
- Componentes semanticos, botones reales, `aria-*` en tabs, dialogo y modal.
- `useDialog`: Escape cierra, foco atrapado y restaurado, clic en overlay cierra.
- `useBodyScrollLock` bloquea el body con menu o modal abierto.
- `prefers-reduced-motion` respetado globalmente y en animaciones Motion.

## Puntos de extension
- **Fuente Kings**: `src/fonts.css` + `src/styles/tokens.css`.
- **Video o modelo en una habilidad**: campo `Ability.media` (ya tipado) para ampliar el modal sin cambiar la API.
- **Nueva seccion**: crear en `sections/`, registrar `id` y anadir el anchor en `data/navigation.ts`.
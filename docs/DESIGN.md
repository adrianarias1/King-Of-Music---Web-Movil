# DESIGN.md — Identidad visual

## Paleta
```css
--color-black: #000000;
--color-white: #FFFFFF;
--color-gray-light: #BABABA;
--color-gray-dark: #333333;
--color-navy: #002F61;
```
Predomina el **dark mode**. Secciones blancas puntuales para contraste.

## Tipografia
- Display: `Kings, Georgia, serif` — solo titulos grandes, marca y encabezados importantes.
- Body: `Inter, Segoe UI, -apple-system, BlinkMacSystemFont, Arial, sans-serif` — parrafos, UI.
- Tamanos con `clamp()`: `--fs-hero`, `--fs-title`, `--fs-subtitle`, `--fs-lead`, `--fs-body`, `--fs-small`, `--fs-label`.

**Kings pendiente:** colocar `public/fonts/Kings.woff2` y descomentar `@font-face` en `src/fonts.css`.

## Espaciados
- `--container-max: 1440px`, `--section-pad-y: clamp(4rem,10vw,9rem)`, `--container-pad: clamp(1.125rem,4.5vw,4rem)`.
- `header-h` 64px (movil), 76px (desktop). `scroll-padding-top` compensado.

## Animaciones (Motion)
Fade, translateY, scale sutil, stagger ligero, crossfade, animaciones de menu. Duraciones 200–600ms. **Respetan `prefers-reduced-motion`** (se desactivan animaciones no esenciales).

## Estetica
Minimalista, cinematografica, con enfasis en multimedia (renders/modelos/fotos/storyboard/video). Evitar exceso de bordes/cards. Alternancia de fondos negro/blanco para ritmo visual.
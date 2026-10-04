# King of Music

> Un videojuego de combate inspirado en la escena musical mexicana.

## Descripcion

King of Music es una experiencia promocional construida con React + TypeScript + Vite. Combina una landing page web responsive con la posibilidad de empaquetarse como aplicacion Android mediante Capacitor, reutilizando practicamente el mismo codigo base.

- **Stack:** React, TypeScript, Vite, CSS moderno, Motion, Lucide React, Three.js, @react-three/fiber, @react-three/drei, Capacitor, Git.
- **Filosofia:** SPA sencilla, rendimiento primero, diseño oscuro minimalista y arquitectura orientada a datos.

## Requisitos previos

- [Node.js](https://nodejs.org/) (v20+ recomendado)
- [npm](https://www.npmjs.com/)

Para compilar Android (opcional):
- [Android Studio](https://developer.android.com/studio) + Android SDK (no es obligatorio para desarrollo web).

## Instalacion

```bash
npm install
```

## Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo (http://localhost:5173)
npm run build    # Build de produccion (genera dist/)
npm run preview  # Previsualiza el build localmente
npm run lint     # Analisis estatico con oxlint
```

## Estructura del proyecto

```text
src/
  components/
    layout/      # Header, Footer
    sections/    # Secciones del landing (Hero, Trailer, etc.)
    ui/          # Componentes reutilizables (Button, Modal...)
    three/       # Visor 3D, geometria placeholder y modelos
  data/          # Datos separados de la UI (characters, locations...)
  hooks/         # Hooks reutilizables (useInView, useDialog...)
  styles/        # Tokens, reset, utilidades
  types/         # Tipos TypeScript
  utils/         # Utilidades (assets)
  App.tsx
  main.tsx

public/
  icons/         # Iconos y favicon
  images/        # PENDIENTE: colocar assets definitivos
  videos/        # PENDIENTE: trailer.mp4
  models/        # PENDIENTE: modelos .glb
  fonts/         # PENDIENTE: fuente Kings.woff2
  downloads/     # APK para descarga (cuando exista)

docs/            # Documentacion del proyecto (ver mas abajo)
```

> Importante: el repositorio parte sin assets definitivos. Todos los recursos opcionales muestran placeholders y no generan errores 404.

## Como anadir contenido

### Anadir un personaje

1. Editar `src/data/characters.ts` y añadir una entrada `Character`.
2. Colocar el modelo 3D en `public/models/<id>.glb`.
3. Colocar la ilustracion en `public/images/characters/<id>.jpg`.
4. El visor detecta automaticamente si el `.glb` existe. Si no, usa un placeholder 3D propio.

### Anadir un modelo GLB

Colocar el archivo en `public/models/nombre.glb`. Actualizar la ruta en `src/data/characters.ts` (`model: '/models/nombre.glb'`). El visor comprueba existencia (HEAD) antes de cargarlo para evitar 404.

### Anadir una habilidad

Editar el array `abilities` de cada personaje en `src/data/characters.ts`. Puedes añadir `preview` (`/images/abilities/<char>/<id>.jpg`) o `media` (video/modelo) para futuras ampliaciones (la arquitectura ya está preparada).

### Actualizar el mapa

1. Colocar la imagen del mapa conceptual en `public/images/map.png`.
2. Editar `src/data/locations.ts` y ajustar `x` e `y` (porcentajes 0-100) sobre esa imagen.
3. Opcional: añadir fotos de cada lugar en `public/images/locations/<id>.png`.

### Actualizar el Hero / Trailer / Storyboard

- Hero: `public/images/hero.jpg`, video opcional `public/videos/hero.mp4` (config en `src/config.ts`).
- Trailer: `public/videos/trailer.mp4` y poster `public/images/trailer-poster.jpg`.
- Storyboard: `public/images/storyboard/page-XX.jpg` (6 paginas por defecto).
- Galeria: `public/images/dev/shot-XX.jpg`.

### Fuente de marca "Kings"

La fuente está preparada pero no incluida. Colocar `Kings.woff2` en `public/fonts/` y descomentar el bloque `@font-face` en `src/fonts.css`. Se usa únicamente para títulos grandes, nombre de marca y encabezados importantes.

### Habilitar la descarga (APK)

1. Colocar el APK en `public/downloads/king-of-music.apk` (o cualquier nombre).
2. Editar `src/config.ts`:
   ```ts
   export const download = {
     available: true,
     url: './downloads/king-of-music.apk',
   } as const
   ```
3. Opcional: pasar valores por `window.KING_OF_MUSIC` en builds nativos.

Mientras `available` sea `false`, el CTA aparece deshabilitado con "Próximamente" y no apunta a archivos inexistentes.

## Capacitor / Android

Capacitor esta instalado y el proyecto nativo `android/` ya fue generado con:

- `appId`: `com.kingofmusic.app`
- `appName`: `King of Music`
- `webDir`: `dist`

### Estado actual del entorno

| Requisito | Estado |
|---|---|
| Node.js / npm | Disponible |
| Proyecto `android/` generado | Si (`npx cap add android`) |
| `npx cap sync android` | Funciona |
| Android SDK | Presente en `%LOCALAPPDATA%\Android\Sdk` |
| JDK (Java 17+) | **No instalado** |
| Gradle | **No disponible** |

Por eso el proyecto web esta completo y verificado, pero **el APK no puede compilarse todavia**: falta instalar un JDK y un Android Studio. El proyecto nativo queda listo; no se bloqueo nada del lado web.

### Compilar el APK

1. Instalar **JDK 17 o superior** y **Android Studio** (incluye el Android SDK y Gradle).
2. Definir las variables de entorno:
   ```powershell
   $env:ANDROID_HOME="$env:LOCALAPPDATA\Android\Sdk"
   $env:ANDROID_SDK_ROOT=$env:ANDROID_HOME
   ```
3. Sincronizar el build web con el proyecto nativo:
   ```bash
   npm run build
   npx cap sync android
   ```
4. Abrir Android Studio:
   ```bash
   npx cap open android
   ```
5. Desde Android Studio: **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
   El archivo queda en `android/app/build/outputs/apk/debug/app-debug.apk`.

Alternativa por linea de comandos (con el JDK en el PATH):
```bash
cd android
.\gradlew.bat assembleDebug
```

### Instalar en un dispositivo
```bash
cd android
.\gradlew.bat installDebug
```

### Notas
- `android/` **no** esta en `.gitignore`: se versiona por defecto. Si el equipo prefiere un `.gitignore` mas estricto para Android, ajustarlo antes del primer commit.
- `android/app/src/main/assets/public/` contiene una copia de `dist/`. Se regenera con `npx cap copy` / `npx cap sync android`.
- `android/app/src/main/assets/capacitor.config.json` se genera desde `capacitor.config.ts`. No editarlo a mano.

## Rendimiento y accesibilidad

- **Lazy loading:** CharacterViewer carga Three.js de forma diferida (Suspense + rootMargin).
- **Fuera de pantalla:** el Canvas 3D usa `frameloop="never"` cuando la sección no está visible.
- **Assets:** el helper `assetExists()` evita errores 404 y permite placeholders automáticos.
- **Accesibilidad:** HTML semántico, foco visible, Escape para modales, aria labels, navegación con teclado y `prefers-reduced-motion` aplicado en animaciones.
- **Responsive:** Mobile-first con `clamp()`, `min()`, `max()`, `aspect-ratio`, `100svh` y pocos media queries.
- **Errores:** `ErrorBoundary` evita pantalla blanca ante fallos de WebGL/recursos opcionales.

## Documentacion adicional

- [docs/PROJECT.md](docs/PROJECT.md) — Objetivo, alcance y roadmap
- [docs/DESIGN.md](docs/DESIGN.md) — Identidad visual, tipografía, colores
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — Arquitectura, patrones y decisiones
- [docs/CONTENT.md](docs/CONTENT.md) — Guía de assets, donde colocarlos y checklist

## Licencia

Proyecto universitario. Todos los derechos reservados a su equipo desarrollador.

## Estado del proyecto

Este es un milestone base funcional: estructura, navegación, secciones estáticas, visor 3D con fallback, storyboard, mapa interactivo, manejo de errores, lazy loading y preparación para Capacitor. Los assets definitivos son placeholders y están marcados para su reemplazo.
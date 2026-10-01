# PROJECT.md — King of Music

## Objetivo general
King of Music es un videojuego de peleas ambientado en la escena musical mexicana. Este proyecto desarrolla una experiencia promocional que funciona como landing page web responsive y como aplicación Android instalable (reutilizando el mismo código mediante Capacitor).

## Prioridades
1. Rendimiento
2. Estabilidad
3. Experiencia de usuario intuitiva
4. Responsive design
5. Buenas animaciones
6. Código mantenible
7. Facilidad para continuar el desarrollo
8. Reutilizar prácticamente el mismo código en web y Android

## Alcance (MVP base)
- SPA con navegación por anchors/scroll suave (sin rutas).
- Secciones definidas: Header, Hero, Personajes, Visor 3D, Trailer, Storyboard, Mapa, Behind the Game, Equipo, Download CTA, Footer.
- Visor 3D con soporte .glb/.gltf y fallback geométrico (sin archivos externos).
- Storyboard, mapa conceptual interactivo (sin APIs externas), trailer lazy-load (sin autoplay), assets con placeholders seguros.

## Roadmap sugerido
- [x] Base del proyecto web: secciones, navegacion, placeholders, visor 3D, storyboard, mapa, errores y lazy loading.
- [x] Proyecto nativo `android/` generado y sincronizado con Capacitor.
- [ ] Instalar JDK 17+ y Android Studio para compilar el APK (bloqueante solo para el APK, no para la web).
- [ ] Reemplazar todos los placeholders por assets definitivos.
- [ ] Añadir fuente `Kings.woff2` en `public/fonts/` y activarla en `src/fonts.css`.
- [ ] Configurar `download.available = true` con APK real en `public/downloads/`.
- [ ] Añadir renders/fotos reales del equipo en `public/images/team/`.
- [ ] Pulido de animaciones segun feedback.
- [ ] Optimizacion de LOD/texturas de modelos GLB para movil.

## Estado de verificacion (milestone base)
- `npm run build`: correcto, sin errores de TypeScript.
- `npm run lint` (oxlint): sin warnings.
- Consola del navegador: sin errores ni warnings.
- Sin imagenes rotas ni 404: los assets ausentes muestran placeholders propios.
- `prefers-reduced-motion`: desactiva animaciones y scroll suave.
- Contraste de textos clave: >= 4.5:1.

## Decisiones clave
- No se usan Next.js, RN, Tailwind, Router, Firebase, backend, BD, GSAP, Lenis, jQuery.
- Mobile-first, `prefers-reduced-motion`, lazy loading del 3D, `frameloop="never"` fuera de pantalla, ErrorBoundaries.
- Datos separados de componentes (`src/data/*`), componentes pequeños, sin hardcodear contenido.
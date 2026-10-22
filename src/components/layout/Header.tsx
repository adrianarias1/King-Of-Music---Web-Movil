
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'motion/react'

import {
  ArrowUpRight,
  Menu,
  X,
} from 'lucide-react'

import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  desktopNav,
  mobileNav,
} from '../../data/navigation'

import { siteConfig } from '../../config'

import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import { useDialog } from '../../hooks/useDialog'
import { useScrolledPast } from '../../hooks/useScrolledPast'

import './Header.css'

// =========================================================
// KING OF MUSIC — HEADER V3
//
// CORRECCIONES:
//
// 1. Evita que el logotipo original se superponga
//    con el título del menú lateral.
//
// 2. Evita que el botón hamburguesa se superponga
//    con el botón de cerrar.
//
// 3. Conserva el menú lateral deslizante.
//
// 4. Conserva los efectos y colores originales.
//
// 5. Unifica el breakpoint móvil en 1024px.
//
// 6. Conserva cierre por:
//    - Botón X.
//    - Fondo oscurecido.
//    - Enlaces del menú.
//    - Tecla Escape.
//
// 7. Conserva el bloqueo de scroll.
// =========================================================

export function Header() {
  // =====================================================
  // 1. ESTADOS
  // =====================================================

  const [menuOpen, setMenuOpen] = useState(false)

  const scrolled = useScrolledPast(32)

  const reduced = useReducedMotion()

  // =====================================================
  // 2. CONTROL DEL MENÚ
  // =====================================================

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
  }, [])

  const openMenu = useCallback(() => {
    setMenuOpen(true)
  }, [])

  // =====================================================
  // 3. ACCESIBILIDAD
  // =====================================================

  // Conservamos el hook original encargado de
  // gestionar el comportamiento del diálogo.

  const { panelRef } = useDialog(
    menuOpen,
    closeMenu,
  )

  // Bloquear el scroll del documento mientras
  // el panel lateral permanece abierto.

  useBodyScrollLock(menuOpen)

  // =====================================================
  // 4. BREAKPOINT RESPONSIVE
  //
  // IMPORTANTE:
  //
  // Header.css utiliza 1024px para mostrar
  // la navegación horizontal.
  //
  // JavaScript debe utilizar exactamente
  // el mismo breakpoint.
  // =====================================================

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      '(min-width: 1024px)',
    )

    const handleDesktop = () => {
      if (mediaQuery.matches) {
        setMenuOpen(false)
      }
    }

    handleDesktop()

    mediaQuery.addEventListener(
      'change',
      handleDesktop,
    )

    return () => {
      mediaQuery.removeEventListener(
        'change',
        handleDesktop,
      )
    }
  }, [])

  // =====================================================
  // 5. ANIMACIONES
  // =====================================================


const overlayTransition = {
  duration: reduced ? 0 : 0.55,
  ease: [0.22, 1, 0.36, 1] as [
    number,
    number,
    number,
    number,
  ],
}


  const panelTransition = {
    duration: reduced ? 0 : 0.46,

    ease: [0.22, 1, 0.36, 1] as [
      number,
      number,
      number,
      number,
    ],
  }

  // =====================================================
  // 6. CONTROL DE SUPERPOSICIONES
  //
  // Cuando menuOpen es true:
  //
  // - El header original se oculta visualmente.
  // - El menú lateral permanece visible.
  // - El botón hamburguesa deja de recibir clics.
  // - El botón X queda libre para funcionar.
  //
  // El botón hamburguesa sigue montado para
  // conservar la referencia de foco del diálogo.
  // =====================================================

  const headerBarStyle = {
    visibility: menuOpen
      ? ('hidden' as const)
      : ('visible' as const),

    pointerEvents: menuOpen
      ? ('none' as const)
      : ('auto' as const),

    zIndex: menuOpen ? 0 : undefined,
  }

  // =====================================================
  // 7. ESTRUCTURA PRINCIPAL
  // =====================================================

  return (
    <header
      className={[
        'site-header',
        scrolled || menuOpen ? 'is-solid' : '',
        menuOpen ? 'is-menu-open' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >

      {/* ===============================================
          BARRA SUPERIOR
          
          CORRECCIÓN V3:
          Se oculta mientras el menú esté abierto.
          =============================================== */}

      <div
        className="site-header__inner container container--wide"
        style={headerBarStyle}
        aria-hidden={menuOpen}
      >

        {/* =============================================
            MARCA / LOGOTIPO
            ============================================= */}

        <a
          className="brand"
          href="#inicio"
          onClick={closeMenu}
          aria-label={`${siteConfig.name} — inicio`}
          tabIndex={menuOpen ? -1 : undefined}
        >
          <span
            className="brand__mark"
            aria-hidden="true"
          >
            <span />
            <span />
            <span />
          </span>

          <span className="brand__text">
            King <em>of</em> Music
          </span>
        </a>

        {/* =============================================
            NAVEGACIÓN DE ESCRITORIO
            ============================================= */}

        <nav
          className="site-header__nav"
          aria-label="Navegación principal"
        >
          <ul>
            {desktopNav.map((link) => (
              <li key={link.href}>
                <a
                  className="site-header__link"
                  href={link.href}
                  tabIndex={menuOpen ? -1 : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* =============================================
            ACCIONES DEL HEADER
            ============================================= */}

        <div className="site-header__actions">

          {/* Descargar */}

          <a
            className="site-header__cta"
            href="#descargar"
            onClick={closeMenu}
            tabIndex={menuOpen ? -1 : undefined}
          >
            Descargar
          </a>

          {/* ===========================================
              BOTÓN HAMBURGUESA

              CORRECCIÓN V3:
              El botón no se desmonta.
              Simplemente se oculta cuando
              el menú lateral está abierto.

              Esto evita que se empalme
              con el botón de cerrar.
              =========================================== */}

          <button
            type="button"
            className="site-header__burger"
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            aria-label="Abrir menú de navegación"
            onClick={openMenu}
            tabIndex={menuOpen ? -1 : undefined}
            style={{
              visibility: menuOpen
                ? 'hidden'
                : 'visible',

              pointerEvents: menuOpen
                ? 'none'
                : 'auto',
            }}
          >
            <Menu
              size={22}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </button>

        </div>
      </div>

      {/* ===============================================
          MENÚ LATERAL MÓVIL
          =============================================== */}

      <AnimatePresence initial={false}>
        {menuOpen && (
          <>

            {/* ===========================================
                FONDO OSCURECIDO

                Se cierra al tocar fuera del panel.
                =========================================== */}

            <motion.div
              className="mobile-menu__backdrop"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={overlayTransition}
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* ===========================================
                PANEL LATERAL

                Tiene su propio contexto visual.
                No depende del header original.
                =========================================== */}

            <motion.div
              id="menu-movil"
              ref={panelRef}
              className="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menú de navegación"
              tabIndex={-1}
              initial={{
                x: reduced ? 0 : '100%',
                opacity: reduced ? 1 : 0.9,
              }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              exit={{
                x: reduced ? 0 : '100%',
                opacity: reduced ? 1 : 0.9,
              }}
              transition={panelTransition}
            >

              {/* =========================================
                  CABECERA DEL PANEL
                  ========================================= */}

              <div className="mobile-menu__top">

                <div className="mobile-menu__heading">

                  <span className="mobile-menu__eyebrow label">
                    KING OF MUSIC
                  </span>

                  <span className="mobile-menu__title">
                    Navegación
                  </span>

                </div>

                {/* =======================================
                    BOTÓN CERRAR

                    Único botón visible para cerrar
                    desde la parte superior.
                    ======================================= */}

                <button
                  type="button"
                  className="mobile-menu__close"
                  onClick={closeMenu}
                  aria-label="Cerrar menú"
                >
                  <X
                    size={22}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </button>

              </div>

              {/* =========================================
                  DIVISOR DORADO
                  ========================================= */}

              <div
                className="mobile-menu__divider"
                aria-hidden="true"
              />

              {/* =========================================
                  ENLACES DE NAVEGACIÓN
                  ========================================= */}

              <nav
                className="mobile-menu__nav"
                aria-label="Navegación móvil"
              >
                <ul className="mobile-menu__list">

                  {mobileNav.map((link, index) => (
                    <motion.li
                      key={link.href}
                      initial={
                        reduced
                          ? false
                          : {
                              opacity: 0,
                              x: 22,
                            }
                      }
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        duration: reduced ? 0 : 0.35,

                        delay: reduced
                          ? 0
                          : 0.09 + index * 0.045,

                        ease: [
                          0.22,
                          1,
                          0.36,
                          1,
                        ],
                      }}
                    >
                      <a
                        className="mobile-menu__link"
                        href={link.href}
                        onClick={closeMenu}
                      >

                        {/* Numeración */}

                        <span className="mobile-menu__num label">
                          {String(index + 1).padStart(
                            2,
                            '0',
                          )}
                        </span>

                        {/* Nombre del apartado */}

                        <span className="mobile-menu__link-label">
                          {link.label}
                        </span>

                        {/* Indicador */}

                        <ArrowUpRight
                          className="mobile-menu__arrow"
                          size={18}
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />

                      </a>
                    </motion.li>
                  ))}

                </ul>
              </nav>

              {/* =========================================
                  PARTE INFERIOR DEL MENÚ
                  ========================================= */}

              <div className="mobile-menu__bottom">

                {/* Descargar */}

                <a
                  className="mobile-menu__cta"
                  href="#descargar"
                  onClick={closeMenu}
                >
                  <span>
                    Descargar
                  </span>

                  <ArrowUpRight
                    size={18}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </a>

                {/* Mensaje decorativo */}

                <p className="mobile-menu__footer-text label">
                  EL COMBATE COMIENZA AQUÍ
                </p>

              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

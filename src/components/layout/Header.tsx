import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { desktopNav, mobileNav } from '../../data/navigation'
import { siteConfig } from '../../config'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import { useDialog } from '../../hooks/useDialog'
import { useScrolledPast } from '../../hooks/useScrolledPast'
import './Header.css'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const scrolled = useScrolledPast(32)
  const reduced = useReducedMotion()
  const { panelRef } = useDialog(menuOpen, () => setMenuOpen(false))

  useBodyScrollLock(menuOpen)

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <header className={`site-header${scrolled || menuOpen ? ' is-solid' : ''}`}>
      <div className="site-header__inner container container--wide">
        <a className="brand" href="#inicio" aria-label={`${siteConfig.name} — inicio`}>
          <span className="brand__mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="brand__text">
            King <em>of</em> Music
          </span>
        </a>

        {/* Navegacion de escritorio */}
        <nav className="site-header__nav" aria-label="Navegacion principal">
          <ul>
            {desktopNav.map((link) => (
              <li key={link.href}>
                <a className="site-header__link" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <a className="site-header__cta" href="#descargar">
            Descargar
          </a>
          <button
            type="button"
            className="site-header__burger"
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={22} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Panel movil */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="menu-movil"
            ref={panelRef}
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegacion"
            tabIndex={-1}
            initial={{ opacity: 0, y: reduced ? 0 : -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -8 }}
            transition={{ duration: reduced ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mobile-menu__top">
              <span className="label">Navegacion</span>
              <button
                type="button"
                className="mobile-menu__close"
                onClick={closeMenu}
                aria-label="Cerrar menu"
              >
                <X size={22} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Navegacion movil">
              <ul className="mobile-menu__list">
                {mobileNav.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={reduced ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduced ? 0 : 0.24, delay: reduced ? 0 : 0.04 * index }}
                  >
                    <a className="mobile-menu__link" href={link.href} onClick={closeMenu}>
                      <span className="mobile-menu__num label">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span>{link.label}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <a className="mobile-menu__cta" href="#descargar" onClick={closeMenu}>
              Descargar
            </a>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
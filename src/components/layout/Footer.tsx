import { CodeXml } from 'lucide-react'
import { siteConfig } from '../../config'
import './Footer.css'

// Se calcula una sola vez: evita impurezas durante el render.
const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner container">
        <div className="site-footer__brand">
          <p className="site-footer__name">{siteConfig.name}</p>
          <p className="site-footer__tag">{siteConfig.tagline}</p>
        </div>

        <nav className="site-footer__nav" aria-label="Navegacion del pie">
          <ul>
            <li>
              <a href="#personajes">Personajes</a>
            </li>
            <li>
              <a href="#trailer">Trailer</a>
            </li>
            <li>
              <a href="#historia">Historia</a>
            </li>
            <li>
              <a href="#mapa">Mapa</a>
            </li>
            <li>
              <a href="#equipo">Equipo</a>
            </li>
          </ul>
        </nav>

        <a
          className="site-footer__repo"
          href={siteConfig.repository}
          target="_blank"
          rel="noreferrer noopener"
        >
          <CodeXml size={16} strokeWidth={1.5} aria-hidden="true" />
          <span>GitHub</span>
        </a>
      </div>

      <div className="site-footer__legal container">
        <p>{siteConfig.universityProject ? 'Proyecto universitario' : null}</p>
        <p>
          &copy; {YEAR} {siteConfig.name}
        </p>
      </div>
    </footer>
  )
}
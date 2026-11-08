import { CodeXml } from 'lucide-react'
import { siteConfig } from '../../config'
import { useI18n } from '../../i18n'
import './Footer.css'

// Se calcula una sola vez: evita impurezas durante el render.
const YEAR = new Date().getFullYear()

export function Footer() {
  const { t, l } = useI18n()
  return (
    <footer className="site-footer">
      <div className="site-footer__inner container">
        <div className="site-footer__brand">
          <p className="site-footer__name">{siteConfig.name}</p>
          <p className="site-footer__tag">{l(siteConfig.tagline)}</p>
        </div>

        <nav className="site-footer__nav" aria-label={t.footer.nav}>
          <ul>
            <li>
              <a href="#personajes">{t.nav.characters}</a>
            </li>
            <li>
              <a href="#trailer">{t.nav.trailer}</a>
            </li>
            <li>
              <a href="#historia">{t.nav.story}</a>
            </li>
            <li>
              <a href="#mapa">{t.nav.map}</a>
            </li>
            <li>
              <a href="#equipo">{t.nav.team}</a>
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
        <p>{siteConfig.universityProject ? t.footer.project : null}</p>
        <p>
          &copy; {YEAR} {siteConfig.name}
        </p>
      </div>
    </footer>
  )
}
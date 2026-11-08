import { useI18n, LANGS } from '../../i18n'
import './LanguageSwitch.css'

interface Props {
  className?: string
  tabIndex?: number | undefined
}

/**
 * Selector de idioma ES / EN. El idioma elegido se recuerda en este
 * dispositivo y se aplica a todo el sitio al instante.
 */
export function LanguageSwitch({ className, tabIndex }: Props) {
  const { lang, setLang, t } = useI18n()

  return (
    <div className={`lang-switch${className ? ` ${className}` : ''}`} role="group" aria-label={t.lang.group}>
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          className={`lang-switch__option${code === lang ? ' is-active' : ''}`}
          aria-pressed={code === lang}
          lang={code}
          title={t.lang[code]}
          onClick={() => setLang(code)}
          tabIndex={tabIndex}
        >
          <span aria-hidden="true">{code.toUpperCase()}</span>
          <span className="visually-hidden">{t.lang[code]}</span>
        </button>
      ))}
    </div>
  )
}

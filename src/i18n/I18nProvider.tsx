import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { I18nContext } from './context'
import type { I18nValue } from './context'
import { LANGS, LOCALES } from './types'
import type { Lang, L } from './types'
import { es } from './messages/es'
import { en } from './messages/en'

/* ==========================================================================
   KING OF MUSIC — Proveedor de idioma
   --------------------------------------------------------------------------
   - Idioma inicial: el que eligió el usuario (guardado en este dispositivo);
     si no hay, el del navegador/teléfono (español → es, cualquier otro → en).
   - Al cambiarlo se actualizan <html lang>, el título y la descripción.
   ========================================================================== */

const STORAGE_KEY = 'kom-lang'
const MESSAGES = { es, en } as const

function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LANGS as readonly string[]).includes(value)
}

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isLang(saved)) return saved
  } catch {
    // Almacenamiento no disponible.
  }
  const preferred = typeof navigator !== 'undefined' ? (navigator.languages ?? [navigator.language]) : []
  for (const tag of preferred) {
    const base = tag?.toLowerCase().split('-')[0]
    if (isLang(base)) return base
  }
  return 'es'
}

function setMeta(selector: string, content: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content)
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Solo dura esta visita.
    }
  }, [])

  const t = MESSAGES[lang]

  useEffect(() => {
    document.documentElement.lang = LOCALES[lang]
    document.title = t.meta.title
    setMeta('meta[name="description"]', t.meta.description)
    setMeta('meta[property="og:description"]', t.meta.tagline)
  }, [lang, t])

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      setLang,
      t,
      l: (text: L) => text[lang],
      locale: LOCALES[lang],
    }),
    [lang, setLang, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

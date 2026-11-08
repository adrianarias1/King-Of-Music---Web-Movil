import { createContext, useContext } from 'react'
import type { Lang, L } from './types'
import type { Messages } from './messages/es'

export interface I18nValue {
  lang: Lang
  setLang: (lang: Lang) => void
  /** Textos de la interfaz en el idioma actual. */
  t: Messages
  /** Elige el idioma actual de un texto de los datos: l({ es, en }). */
  l: (text: L) => string
  /** 'es-MX' o 'en-US', para fechas y números. */
  locale: string
}

export const I18nContext = createContext<I18nValue | null>(null)

export function useI18n(): I18nValue {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used inside <I18nProvider>.')
  return value
}

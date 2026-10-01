import { useCallback, useEffect, useRef } from 'react'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) => element.offsetParent !== null || element === document.activeElement,
  )
}

interface Options {
  closeOnOverlayClick?: boolean
  /** Elemento que recibe el foco al abrir. Por defecto, el primer focusable. */
  initialFocusRef?: React.RefObject<HTMLElement | null>
}

/**
 * Comportamiento accesible de dialogo/modal:
 * - Escape cierra
 * - focus se mueve al abrir y se restaura al cerrar
 * - el foco queda atrapado dentro del dialogo
 * - clic en el overlay cierra
 */
export function useDialog(
  open: boolean,
  onClose: () => void,
  { closeOnOverlayClick = true, initialFocusRef }: Options = {},
) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!closeOnOverlayClick) return
      if (event.target === event.currentTarget) onClose()
    },
    [closeOnOverlayClick, onClose],
  )

  useEffect(() => {
    if (!open) return undefined

    restoreFocusRef.current = document.activeElement as HTMLElement | null

    const panel = panelRef.current
    if (!panel) return undefined

    const target = initialFocusRef?.current ?? getFocusable(panel)[0] ?? panel
    // rAF deja que el elemento exista y sea focusable antes de enfocarlo.
    const frame = requestAnimationFrame(() => target.focus())
    document.body.classList.add('has-dialog')

    return () => {
      cancelAnimationFrame(frame)
      document.body.classList.remove('has-dialog')
      restoreFocusRef.current?.focus?.()
    }
  }, [open, initialFocusRef])

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return

      const focusable = getFocusable(panel)
      if (focusable.length === 0) {
        event.preventDefault()
        panel.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return

      const active = document.activeElement
      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return { panelRef, handleOverlayClick }
}
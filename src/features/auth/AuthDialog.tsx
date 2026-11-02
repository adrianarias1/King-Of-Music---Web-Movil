import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import './Login.css'

interface Props {
  id: string
  open: boolean
  onClose: () => void
  labelledBy: string
  describedBy?: string
  closeLabel: string
  children: ReactNode
}

/**
 * Contenedor común de los diálogos de cuenta (<dialog> nativo):
 * Escape y clic fuera cierran, el foco queda atrapado dentro y el scroll
 * del body se bloquea mientras está abierto.
 */
export function AuthDialog({ id, open, onClose, labelledBy, describedBy, closeLabel, children }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useBodyScrollLock(open)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
    return () => { if (dialog.open) dialog.close() }
  }, [open])

  return createPortal(
    <dialog
      id={id}
      ref={dialogRef}
      className="login-dialog"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return
        const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]'))
          .filter((control) => control.getClientRects().length > 0)
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return
        const rect = event.currentTarget.getBoundingClientRect()
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose()
      }}
    >
      <button className="login-dialog__close" type="button" onClick={onClose} aria-label={closeLabel}>
        <X size={21} aria-hidden="true" />
      </button>
      {children}
    </dialog>,
    document.body,
  )
}

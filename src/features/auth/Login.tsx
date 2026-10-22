import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import './Login.css'

interface Props {
  open: boolean
  onClose: () => void
}

/** UI only. Connect the Google button to a future auth service here;
 * never infer a session from this dialog or persist a fake user locally. */
export function Login({ open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [notice, setNotice] = useState('')
  useBodyScrollLock(open)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
    return () => { if (dialog.open) dialog.close() }
  }, [open])

  function close() {
    setNotice('')
    onClose()
  }

  return <>
    {createPortal(<dialog
      id="login-dialog"
      ref={dialogRef}
      className="login-dialog"
      aria-labelledby="login-title"
      aria-describedby="login-description"
      onCancel={event => { event.preventDefault(); close() }}
      onKeyDown={event => {
        if (event.key !== 'Tab') return
        const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]'))
          .filter(control => control.getClientRects().length > 0)
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
      onClick={event => {
        if (event.target !== event.currentTarget) return
        const rect = event.currentTarget.getBoundingClientRect()
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close()
      }}
    >
      <button className="login-dialog__close" type="button" onClick={close} aria-label="Cerrar inicio de sesión"><X size={21} aria-hidden="true" /></button>
      <img className="login-dialog__logo" src={`${import.meta.env.BASE_URL}images/king-of-music-logo.png`} alt="" width={72} height={72} />
      <p className="login-dialog__eyebrow">King of Music · Comunidad</p>
      <h2 id="login-title">Tu voz forma parte<br />del juego.</h2>
      <p id="login-description">Inicia sesión con Google para compartir tus reseñas sobre los personajes, el mapa y los escenarios.</p>
      <form onSubmit={event => {
        event.preventDefault()
        setNotice('El inicio de sesión con Google estará disponible próximamente. Por ahora puedes explorar la web y probar las reseñas locales.')
      }}>
        <button className="login-dialog__google" type="submit">
          <svg width="21" height="21" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.8 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.5a4.7 4.7 0 0 1-2 3.1v2.6h3.3c1.9-1.8 3-4.4 3-7.6Z" /><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.8-2.5l-3.3-2.6c-.9.6-2 1-3.5 1-2.6 0-4.9-1.8-5.7-4.1H2.9v2.7A10.2 10.2 0 0 0 12 22Z" /><path fill="#FBBC05" d="M6.3 13.8a6.2 6.2 0 0 1 0-3.6V7.5H2.9a10 10 0 0 0 0 9l3.4-2.7Z" /><path fill="#EA4335" d="M12 6.1c1.5 0 2.8.5 3.9 1.5l2.9-2.9A9.8 9.8 0 0 0 12 2a10.2 10.2 0 0 0-9.1 5.5l3.4 2.7A6.1 6.1 0 0 1 12 6.1Z" /></svg>
          Continuar con Google
        </button>
        <p className="login-dialog__preview">Próximamente · El acceso aún no está habilitado.</p>
        <p className="login-dialog__notice" role="status">{notice}</p>
      </form>
      <div className="login-dialog__footer"><span />La música nos une<span /></div>
    </dialog>, document.body)}
  </>
}

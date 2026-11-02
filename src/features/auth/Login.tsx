import { useEffect, useState } from 'react'
import { AuthDialog } from './AuthDialog'
import { useAuth } from './authContext'

interface Props {
  open: boolean
  onClose: () => void
}

/**
 * Diálogo de inicio de sesión. El botón de Google redirige a Google
 * mediante Supabase Auth; al volver, AuthProvider recupera la sesión.
 */
export function Login({ open, onClose }: Props) {
  const { signInWithGoogle, error, clearError, isNative, status } = useAuth()
  const [redirecting, setRedirecting] = useState(false)

  // Si la sesión ya está activa (p. ej. al volver de Google), se cierra.
  useEffect(() => {
    if (open && status === 'signed_in') onClose()
  }, [open, status, onClose])

  function close() {
    setRedirecting(false)
    clearError()
    onClose()
  }

  async function handleGoogle() {
    if (redirecting || isNative) return
    setRedirecting(true)
    await signInWithGoogle()
    // Si hubo error no hay redirección: se libera el botón.
    setRedirecting(false)
  }

  return (
    <AuthDialog
      id="login-dialog"
      open={open}
      onClose={close}
      labelledBy="login-title"
      describedBy="login-description"
      closeLabel="Cerrar inicio de sesión"
    >
      <img className="login-dialog__logo" src={`${import.meta.env.BASE_URL}images/king-of-music-logo-sm.webp`} alt="" width={72} height={72} />
      <p className="login-dialog__eyebrow">King of Music · Comunidad</p>
      <h2 id="login-title">Tu voz forma parte<br />del juego.</h2>
      <p id="login-description">Inicia sesión con Google para compartir tus reseñas sobre los personajes, el mapa y los escenarios.</p>
      <form onSubmit={(event) => { event.preventDefault(); void handleGoogle() }}>
        <button className="login-dialog__google" type="submit" disabled={redirecting || isNative} aria-busy={redirecting}>
          <svg width="21" height="21" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.8 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.5a4.7 4.7 0 0 1-2 3.1v2.6h3.3c1.9-1.8 3-4.4 3-7.6Z" /><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.8-2.5l-3.3-2.6c-.9.6-2 1-3.5 1-2.6 0-4.9-1.8-5.7-4.1H2.9v2.7A10.2 10.2 0 0 0 12 22Z" /><path fill="#FBBC05" d="M6.3 13.8a6.2 6.2 0 0 1 0-3.6V7.5H2.9a10 10 0 0 0 0 9l3.4-2.7Z" /><path fill="#EA4335" d="M12 6.1c1.5 0 2.8.5 3.9 1.5l2.9-2.9A9.8 9.8 0 0 0 12 2a10.2 10.2 0 0 0-9.1 5.5l3.4 2.7A6.1 6.1 0 0 1 12 6.1Z" /></svg>
          {redirecting ? 'Conectando con Google…' : 'Continuar con Google'}
        </button>
        <p className="login-dialog__preview">
          {isNative
            ? 'Por ahora el inicio de sesión está disponible en la versión web.'
            : 'Si es tu primera vez, tu cuenta se crea automáticamente.'}
        </p>
        <p className="login-dialog__notice" role="alert">{error ?? ''}</p>
      </form>
      <div className="login-dialog__footer"><span />La música nos une<span /></div>
    </AuthDialog>
  )
}

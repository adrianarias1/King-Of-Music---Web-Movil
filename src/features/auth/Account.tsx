import { useState } from 'react'
import { ExternalLink, LogOut } from 'lucide-react'
import { AuthDialog } from './AuthDialog'
import { useAuth } from './authContext'
import { GOOGLE_ACCOUNT_URL, SESSION_INACTIVITY_DAYS } from './sessionPolicy'

interface Props {
  open: boolean
  onClose: () => void
}

const dateFormat = new Intl.DateTimeFormat('es-MX', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function formatDate(value: string | undefined): string | null {
  if (!value) return null
  const time = Date.parse(value)
  return Number.isFinite(time) ? dateFormat.format(time) : null
}

/**
 * Panel de la cuenta (sesión iniciada): datos básicos, información de la
 * sesión, acceso a los ajustes de Google y cierre de sesión.
 */
export function Account({ open, onClose }: Props) {
  const { profile, sessionInfo, signOut } = useAuth()
  const [signingOut, setSigningOut] = useState(false)
  const [avatarFailed, setAvatarFailed] = useState(false)

  async function handleSignOut() {
    if (signingOut) return
    setSigningOut(true)
    await signOut()
    setSigningOut(false)
    onClose()
  }

  const initial = (profile?.firstName || profile?.email || '?').charAt(0).toUpperCase()
  const startedAt = formatDate(sessionInfo?.startedAt)
  const maxAgeAt = formatDate(sessionInfo?.maxAgeAt)

  return (
    <AuthDialog
      id="account-dialog"
      open={open}
      onClose={onClose}
      labelledBy="account-title"
      describedBy="account-description"
      closeLabel="Cerrar panel de la cuenta"
    >
      <div className="account__avatar" aria-hidden="true">
        {profile?.avatarUrl && !avatarFailed ? (
          <img
            src={profile.avatarUrl}
            alt=""
            width={72}
            height={72}
            referrerPolicy="no-referrer"
            onError={() => setAvatarFailed(true)}
          />
        ) : (
          <span>{initial}</span>
        )}
      </div>

      <p className="login-dialog__eyebrow">Tu cuenta</p>
      <h2 id="account-title">Hola, {profile?.firstName}</h2>
      {profile?.fullName || profile?.email ? (
        <p className="account__identity">
          {profile.fullName ? <strong>{profile.fullName}</strong> : null}
          {profile.email ? <span>{profile.email}</span> : null}
        </p>
      ) : null}

      {startedAt ? (
        <dl className="account__session">
          <div>
            <dt>Sesión iniciada</dt>
            <dd>{startedAt}</dd>
          </div>
          {maxAgeAt ? (
            <div>
              <dt>Vence a más tardar</dt>
              <dd>{maxAgeAt}</dd>
            </div>
          ) : null}
          <p className="account__session-note">
            También se cierra tras {SESSION_INACTIVITY_DAYS} días sin usar King of Music.
          </p>
        </dl>
      ) : null}

      <p id="account-description" className="account__note">
        Para cambiar los datos de la cuenta es necesario hacerlo desde los ajustes de Google.
      </p>

      <a
        className="account__google"
        href={GOOGLE_ACCOUNT_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Ir a los ajustes de Google
        <ExternalLink size={16} aria-hidden="true" />
        <span className="visually-hidden"> (se abre en una pestaña nueva)</span>
      </a>

      <button
        className="account__signout"
        type="button"
        onClick={() => void handleSignOut()}
        disabled={signingOut}
        aria-busy={signingOut}
      >
        <LogOut size={17} aria-hidden="true" />
        {signingOut ? 'Cerrando sesión…' : 'Cerrar sesión'}
      </button>

      <div className="login-dialog__footer"><span />La música nos une<span /></div>
    </AuthDialog>
  )
}

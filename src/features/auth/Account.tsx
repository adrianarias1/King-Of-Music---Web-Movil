import { useState } from 'react'
import { ExternalLink, LogOut } from 'lucide-react'
import { AuthDialog } from './AuthDialog'
import { useAuth } from './authContext'
import { GOOGLE_ACCOUNT_URL, SESSION_INACTIVITY_DAYS } from './sessionPolicy'
import { useI18n } from '../../i18n'

interface Props {
  open: boolean
  onClose: () => void
}

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}

function formatDate(value: string | undefined, locale: string): string | null {
  if (!value) return null
  const time = Date.parse(value)
  return Number.isFinite(time) ? new Intl.DateTimeFormat(locale, DATE_OPTIONS).format(time) : null
}

/**
 * Panel de la cuenta (sesión iniciada): datos básicos, información de la
 * sesión, acceso a los ajustes de Google y cierre de sesión.
 */
export function Account({ open, onClose }: Props) {
  const { profile, sessionInfo, signOut } = useAuth()
  const { t, locale } = useI18n()
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
  const startedAt = formatDate(sessionInfo?.startedAt, locale)
  const maxAgeAt = formatDate(sessionInfo?.maxAgeAt, locale)

  return (
    <AuthDialog
      id="account-dialog"
      open={open}
      onClose={onClose}
      labelledBy="account-title"
      describedBy="account-description"
      closeLabel={t.account.close}
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

      <p className="login-dialog__eyebrow">{t.account.eyebrow}</p>
      <h2 id="account-title">{t.account.hello(profile?.firstName ?? '')}</h2>
      {profile?.fullName || profile?.email ? (
        <p className="account__identity">
          {profile.fullName ? <strong>{profile.fullName}</strong> : null}
          {profile.email ? <span>{profile.email}</span> : null}
        </p>
      ) : null}

      {startedAt ? (
        <dl className="account__session">
          <div>
            <dt>{t.account.started}</dt>
            <dd>{startedAt}</dd>
          </div>
          {maxAgeAt ? (
            <div>
              <dt>{t.account.expires}</dt>
              <dd>{maxAgeAt}</dd>
            </div>
          ) : null}
          <p className="account__session-note">
            {t.account.inactivity(SESSION_INACTIVITY_DAYS)}
          </p>
        </dl>
      ) : null}

      <p id="account-description" className="account__note">
        {t.account.note}
      </p>

      <a
        className="account__google"
        href={GOOGLE_ACCOUNT_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t.account.googleSettings}
        <ExternalLink size={16} aria-hidden="true" />
        <span className="visually-hidden"> {t.common.newTab}</span>
      </a>

      <button
        className="account__signout"
        type="button"
        onClick={() => void handleSignOut()}
        disabled={signingOut}
        aria-busy={signingOut}
      >
        <LogOut size={17} aria-hidden="true" />
        {signingOut ? t.account.signingOut : t.account.signOut}
      </button>

      <div className="login-dialog__footer"><span />{t.auth.motto}<span /></div>
    </AuthDialog>
  )
}

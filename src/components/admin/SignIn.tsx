import { useEffect, useState, type FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import { KeyRound, LogOut, ShieldAlert, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { supabase, configured } from '@/lib/supabase'

interface SignInProps {
  onSignedIn: (session: Session) => void
}

/**
 * Supabase's raw auth errors name the symptom, not the fix. The two that actually
 * bite here both point at setup rather than at the credentials, so they get a
 * sentence that says what to do instead.
 */
function explain(err: unknown): string {
  const raw = err instanceof Error ? err.message : ''
  const lower = raw.toLowerCase()

  if (lower.includes('email not confirmed')) {
    return 'This account has not been confirmed. Create it again in the Supabase dashboard with "Auto Confirm User" ticked.'
  }
  if (lower.includes('invalid login credentials')) {
    return 'Check the email and password. If public sign-ups are disabled — which they should be — the account must have been created from the Supabase dashboard, not the site.'
  }
  if (lower.includes('fetch')) {
    return 'Could not reach Supabase. Check your connection and try again.'
  }
  return raw || 'Could not sign in.'
}

export default function SignIn({ onSignedIn }: SignInProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!configured) return
    // Supabase persists the session, so a refresh should not force a re-login.
    supabase()
      ?.auth.getSession()
      .then(({ data }) => {
        if (data.session) onSignedIn(data.session)
      })
  }, [onSignedIn])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      const { data, error: authError } = await supabase()!.auth.signInWithPassword({
        email: email.trim(),
        password
      })
      if (authError) throw authError
      if (data.session) onSignedIn(data.session)
    } catch (err) {
      setError(explain(err))
    } finally {
      setBusy(false)
    }
  }

  if (!configured) {
    return (
      <div className="container-cy flex min-h-[80vh] items-center justify-center py-16">
        <div className="glass glass-ring glass-sheen w-full max-w-lg rounded-2xl p-8 md:p-10">
          <Badge variant="blush">Not configured</Badge>
          <h1 className="mt-4 font-display text-[1.9rem] font-semibold tracking-[-0.02em]">
            Catalogue admin
          </h1>
          <p className="mt-3 leading-relaxed text-ink/75">
            This build has no database connection, so the admin cannot run. Set the environment
            variables and rebuild.
          </p>
          <Separator className="my-7" />
          <pre className="overflow-x-auto rounded-lg bg-ink/5 px-4 py-3.5 font-mono text-[0.8rem] leading-relaxed text-ink/80">
            {`VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon public key>`}
          </pre>
        </div>
      </div>
    )
  }

  return (
    <div className="container-cy flex min-h-[80vh] items-center justify-center py-16">
      <form onSubmit={submit} className="w-full max-w-lg">
        <div className="glass glass-ring glass-sheen rounded-2xl p-8 md:p-10">
          <Badge variant="clay">Restricted</Badge>
          <h1 className="mt-4 font-display text-[1.9rem] font-semibold tracking-[-0.02em]">
            Catalogue admin
          </h1>
          <p className="mt-3 leading-relaxed text-ink/75">
            Sign in with the studio account to add and edit products.
          </p>

          <Separator className="my-7" />

          <div className="grid gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[0.78rem] uppercase tracking-[0.1em] text-ink/70">Email</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="username"
                required
                className="glass glass-ring min-h-11 rounded-pill px-4 text-[0.95rem] outline-none focus-visible:ring-2 focus-visible:ring-ink"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[0.78rem] uppercase tracking-[0.1em] text-ink/70">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="glass glass-ring min-h-11 rounded-pill px-4 text-[0.95rem] outline-none focus-visible:ring-2 focus-visible:ring-ink"
              />
            </label>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 flex items-start gap-2 rounded-pill bg-blush/20 px-4 py-3 text-[0.88rem] text-blush-deep"
            >
              <ShieldAlert size={16} strokeWidth={2} className="mt-0.5 shrink-0" aria-hidden="true" />
              {error}
            </p>
          )}

          <Button type="submit" variant="accent" className="mt-7 w-full" disabled={busy}>
            <KeyRound aria-hidden="true" />
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>

          <p className="mt-6 flex items-start gap-2 text-[0.8rem] leading-relaxed text-muted">
            <LogOut size={14} strokeWidth={2} className="mt-0.5 shrink-0" aria-hidden="true" />
            Public sign-ups must be disabled in Supabase, otherwise anyone who finds this page
            could create an account and edit the catalogue.
          </p>
          <p className="mt-2 flex items-start gap-2 text-[0.8rem] leading-relaxed text-muted">
            <WifiOff size={14} strokeWidth={2} className="mt-0.5 shrink-0" aria-hidden="true" />
            Saves are instant. There is no rebuild step, so changes appear on the next page load.
          </p>
        </div>
      </form>
    </div>
  )
}

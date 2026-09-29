/**
 * Analytics, behind explicit consent.
 *
 * The script is never requested until the visitor accepts. That is the whole
 * point: a tracker that loads before consent has already broken consent.
 *
 * Configure a provider by setting VITE_ANALYTICS_* at build time. With nothing
 * configured — or with the example values still in place — `enabled` is false,
 * the banner never appears, and no request is ever made, so an unconfigured build
 * is genuinely inert rather than subtly broken.
 */
import { usableValue } from './env'

const SCRIPT_URL = usableValue(import.meta.env.VITE_ANALYTICS_URL)
const SCRIPT_DOMAIN = usableValue(import.meta.env.VITE_ANALYTICS_DOMAIN)
const SCRIPT_ID = 'analytics-script'
const CONSENT_KEY = 'bd-analytics-consent'

export type Consent = 'granted' | 'denied' | null

/** True when a provider has been configured. */
export const enabled = Boolean(SCRIPT_URL && SCRIPT_DOMAIN)

export const getConsent = (): Consent => {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY)
    return value === 'granted' || value === 'denied' ? value : null
  } catch {
    return null
  }
}

export const setConsent = (value: 'granted' | 'denied'): void => {
  try {
    window.localStorage.setItem(CONSENT_KEY, value)
  } catch {
    /* private mode — the choice will simply be asked again next visit */
  }
}

export const clearConsent = (): void => {
  try {
    window.localStorage.removeItem(CONSENT_KEY)
  } catch {
    /* nothing to clear */
  }
}

let injected = false

/** Idempotent: safe to call on every route change. */
export function loadAnalytics(): void {
  if (!enabled || injected) return
  if (document.getElementById(SCRIPT_ID)) {
    injected = true
    return
  }

  const script = document.createElement('script')
  script.id = SCRIPT_ID
  script.async = true
  script.defer = true
  script.src = SCRIPT_URL as string
  script.dataset.domain = SCRIPT_DOMAIN as string
  document.head.appendChild(script)
  injected = true
}

/**
 * Records an outbound click to a product's Instagram post.
 *
 * For a product browser this is the only metric with business meaning: a page
 * view nobody acts on is noise, and a click-through is the sale.
 */
export function trackOutboundClick(name: string, href: string): void {
  if (!enabled || getConsent() !== 'granted') return

  const w = window as unknown as {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void
  }
  w.plausible?.('Outbound: Instagram', { props: { product: name, href } })
}

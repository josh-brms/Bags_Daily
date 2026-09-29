/**
 * Site-wide identity constants.
 *
 * Everything here has a real, correct default so the site is never broken by a
 * missing env var. Env vars exist to *override*, not to define — which is why
 * these use `usableValue`, not `??`: `??` only falls back on null/undefined, so a
 * blank env var would otherwise silently produce an empty URL.
 */
import { usableValue } from '@/lib/env'

/** Display name. Used in the header, footer, splash, and social metadata. */
export const BRAND_NAME = 'Bags Daily PH'

/** The registered business. Distinct from BRAND_NAME, which is a trading style. */
export const LEGAL_ENTITY = 'CY Studio'

/** Full address, for the footer and legal pages. */
export const LOCATION = 'Legazpi City, Albay'

/** City only, for straplines where there is no room for a province. */
export const LOCATION_SHORT = 'Legazpi'

export const CONTACT_EMAIL = usableValue(import.meta.env.VITE_CONTACT_EMAIL) || 'cycybaranda@gmail.com'

/**
 * The studio's Instagram profile.
 *
 * Set VITE_INSTAGRAM_URL at build time to override. The default is the real
 * handle rather than a placeholder, because an unconfigured link 404s silently
 * for visitors from the empty state and two legal pages — a mistake that
 * produces no error and no console warning.
 *
 * Per-product links in `Product.instagram` take precedence; this is only the
 * profile-level fallback.
 */
export const INSTAGRAM_URL =
  usableValue(import.meta.env.VITE_INSTAGRAM_URL) || 'https://www.instagram.com/bags_daily.ph/'

/** True when the build has no usable Instagram URL at all. */
export const INSTAGRAM_URL_MISSING = !usableValue(import.meta.env.VITE_INSTAGRAM_URL)

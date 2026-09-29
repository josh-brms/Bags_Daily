/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Supabase project URL. The catalogue is read from here at runtime.
   * With this or the anon key unset, the site builds and runs but the
   * catalogue is empty and the admin is inert — it never crashes.
   */
  readonly VITE_SUPABASE_URL?: string
  /**
   * Supabase anon (public) key. Safe to ship: it identifies the project, and
   * every privilege is enforced by Row Level Security in Postgres.
   * The service-role key must never be used in the browser.
   */
  readonly VITE_SUPABASE_ANON_KEY?: string
  /** Real Instagram profile URL. The built-in default is an unverified placeholder. */
  readonly VITE_INSTAGRAM_URL?: string
  /** Contact address shown in the footer and legal pages. */
  readonly VITE_CONTACT_EMAIL?: string
  /**
   * Analytics script URL, e.g. https://plausible.io/js/script.js. When unset (or
   * VITE_ANALYTICS_DOMAIN is unset) analytics is completely inert: no script is
   * loaded and no consent banner is shown.
   */
  readonly VITE_ANALYTICS_URL?: string
  /** Analytics site domain passed to the script as data-domain. */
  readonly VITE_ANALYTICS_DOMAIN?: string
  /** GitHub owner for the admin. Falls back to an on-screen prompt when unset. */
  readonly VITE_GH_OWNER?: string
  /** GitHub repository for the admin. */
  readonly VITE_GH_REPO?: string
  /** Branch the admin commits to. Defaults to "main". */
  readonly VITE_GH_BRANCH?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

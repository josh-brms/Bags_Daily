import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { usableValue } from './env'

const URL = usableValue(import.meta.env.VITE_SUPABASE_URL)
const ANON_KEY = usableValue(import.meta.env.VITE_SUPABASE_ANON_KEY)

/**
 * The anon key is designed to be public: it identifies the project, not you.
 * Every privilege in this app is enforced by Row Level Security in Postgres, so
 * shipping it in the bundle is safe — a tampered client gets exactly the same
 * read/write access as a well-behaved one.
 *
 * The service-role key must never appear in this file or anywhere in `src/`.
 * Nothing here needs it: the browser reads and writes through RLS.
 *
 * Values go through `usableValue`, so a half-filled `.env` reports as
 * "not configured" instead of failing later with a server error.
 */
export const configured = Boolean(URL && ANON_KEY)

let client: SupabaseClient | null = null

export function supabase(): SupabaseClient | null {
  if (!configured) return null
  if (!client) {
    client = createClient(URL as string, ANON_KEY as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false
      }
    })
  }
  return client
}

export const BUCKET = 'product-images'

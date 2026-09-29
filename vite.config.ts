import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  /**
   * Vercel sets VERCEL=1 on every build, so production is served from the domain
   * root. Everywhere else the app is mounted under /Bags_Daily/, which is what
   * makes `npm run dev` reachable at localhost:5173/Bags_Daily/ — including
   * /Bags_Daily/admin.
   *
   * Worth knowing next to this: Vite inlines VITE_* variables at BUILD time, so
   * a build on a machine without VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
   * still succeeds and ships a site that reports "the catalogue is not
   * connected". Set them in the Vercel project's environment variables, not in a
   * committed .env file. See the Deploying section in README.md.
   */
  base: process.env.VERCEL === '1' ? '/' : '/Bags_Daily/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: false
  }
})

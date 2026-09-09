# CY Studio — The Collection

Interactive storefront for the CY Studio collection, built with React, TypeScript, and Three.js.

## Stack

- Vite 5 + React 18 + TypeScript (strict)
- Three.js via @react-three-fiber (WebGL hero: shader gradient + floating geometry, lazy-loaded)
- Framer Motion (page transitions, staggered reveals, layout animations)
- Lenis (smooth scrolling)
- Zustand (bag state), React Router (routes), Sonner (toasts)
- Tailwind CSS + Radix UI radio groups (keyboard-navigable colour/size pickers)
- Vitest + React Testing Library

## Run

```bash
npm ci
npm run dev       # dev server
npm run build     # typecheck + production build to dist/
npm test          # unit + component tests
npm run lint      # eslint
```

## Pages

- `/` — WebGL hero, product grid, about
- `/product/:id` — detail page with colour/size pickers and demo add-to-bag
- `/privacy`, `/terms`, `/refund`, `/cookies` — legal pages (PH-law aligned)

## Deployment

GitHub Actions deploys to GitHub Pages on every push to `main`
(`.github/workflows/deploy.yml`). The app builds with `base: /Bags_Daily/`
and `404.html` as an SPA fallback.

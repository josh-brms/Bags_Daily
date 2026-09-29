# Bags Daily PH — The Collection

A product browser for the Bags Daily PH collection. Each product has its own page with a photo
gallery; buying happens on Instagram, not here.

## Stack

- Vite 5 + React 18 + TypeScript (strict)
- Three.js via @react-three/fiber (ambient WebGL background, lazy-loaded behind a splash)
- Framer Motion (page transitions, staggered reveals)
- Lenis (smooth scrolling)
- Embla (featured carousel + product gallery), React Router, Sonner (toasts)
- Supabase (Postgres catalogue + Auth + Storage), accessed through RLS
- Tailwind CSS + Radix primitives (Dialog/Sheet for the admin)
- Vitest + React Testing Library

## Run

```bash
npm ci
npm run dev       # dev server
npm run build     # typecheck + production build to dist/
npm test          # unit + component tests
npm run lint      # eslint
npm run images    # regenerate responsive variants + og-image.png
```

## Configuration

All optional. With none of these set the site still builds and runs; each one only
switches a feature on.

```
# Set the real Instagram profile. Until you do, every card and the empty-state
# CTA point at an unverified placeholder.
VITE_INSTAGRAM_URL=https://www.instagram.com/bags_daily.ph/
VITE_CONTACT_EMAIL=cycybaranda@gmail.com

# Supabase. Without these the catalogue is empty and the admin is inert.
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon public key>

# Analytics. Until BOTH are set, analytics is completely inert: no script is
# loaded and no consent banner appears.
VITE_ANALYTICS_URL=https://plausible.io/js/script.js
VITE_ANALYTICS_DOMAIN=your-domain.example
```

## Pages

- `/` — hero, featured carousel, product grid (or the empty state), interactive tote playground, about
- `/product/:id` — one product: swipeable gallery, description, and the Instagram link
- `/admin` — catalogue editor. Not linked from the site; reachable by URL only
- `/privacy`, `/terms`, `/refund`, `/cookies` — legal pages (PH-law aligned)

## The catalogue

Products live in **Supabase**. `src/lib/products.ts` is the only module that talks
to it, and `src/hooks/useProducts.ts` loads them for the storefront.

```ts
export interface Product {
  id: string        // a uuid, not a sequence
  name: string
  brand: string
  price: number
  images: string[]  // the `gallery` column, in order
  description: string
  isPosted: boolean // false keeps a draft off the storefront
}
```

`images[0]` is the cover. The cap is 40 photos, set by the widest product that
actually exists (38) — anything lower would reject the studio's own catalogue.

A product page reads the whole catalogue and picks its product out of it, rather
than fetching one row. That way there is only one read path to keep honest.

### The table was not made here

The `products` table predates this repo and its columns do **not** match what a
first reading of the code would suggest:

- the photos are in **`gallery`**, not `images`
- there is **no `instagram` column**, so the call to action is the profile URL in
  `src/data/site.ts`, not a per-product post
- `id` is a **uuid**, so `Number(id)` is `NaN`
- `image_url` is a redundant copy of `gallery[0]`
- `sort_order` is `0` on every row, so ordering is by `created_at`

[`supabase/schema.sql`](supabase/schema.sql) is the written record of that shape
and of the RLS policies. It documents the table; it does not create it. If the
columns there and the columns in the dashboard ever disagree, the storefront says
so by name rather than failing silently.

Without `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` the site still builds and
runs: the catalogue is empty and the storefront says so, rather than crashing.
This is deliberate — a missing env var should never take the site down.

### Setting up Supabase

1. Create a project at <https://supabase.com>.
2. The table, the RLS policies, and the `product-images` bucket already exist —
   see [The table was not made here](#the-table-was-not-made-here). Nothing to run.
3. **Run [`supabase/fix-updated-at-trigger.sql`](supabase/fix-updated-at-trigger.sql)**
   once. A `BEFORE UPDATE` trigger on the table assigns `NEW.updated_at`, which
   this table does not have, so every product edit failed with *"record "new" has
   no field "updated_at""* while adding a new product still worked. Nothing in the
   app reads `updated_at`; the trigger only ever got in the way.
4. **Project Settings → API** for the URL and anon key. Add both to `.env.local`
   (see [`.env.example`](.env.example)).
5. **Authentication → Sign In / Up → Email** — create one account for yourself,
   then turn **Allow new users to sign up** OFF. Re-check it periodically; it is
   the entire security boundary.

> That last step is the security boundary. RLS allows any *signed-in* user to
> write, so if anyone can create an account they can edit your catalogue. Turning
> off public sign-ups leaves exactly one way in: an account you made.

### How access is controlled

| | Anonymous visitor | Signed-in admin |
|---|---|---|
| Read products | yes | yes |
| Create / update / delete | no | yes |
| Upload images | no | yes |

This is enforced by Row Level Security in Postgres, not by the app — so it holds
even if someone bypasses the admin UI or edits the bundle. It replaces the earlier
design, where a full GitHub credential sat in `sessionStorage`; that weakness is
gone.

## Admin

`/admin` — email and password, backed by Supabase Auth. Products are read and
written directly against the database, so **saves are instant**: no commit, no
rebuild, no waiting for GitHub Actions. Reload the storefront and the change is
there.

Photos are resized in the browser (max 1600 px, JPEG q0.82) and then uploaded to
Supabase Storage. The resize matters: uploaded files are not tracked by git, but
they do count against storage quota, and a 6 MB phone photo is not worth storing.

Select several files at once. Each thumbnail can be moved up or down or removed
before saving, and the first one is the cover. Uploads run one at a time so the
button can report "Uploading 3 of 6" instead of appearing to hang.

Editing a product rewrites its `gallery`. A photo removed from the editor stops
being referenced, but the file stays in Storage — there is no delete-on-remove, so
the bucket grows over time. 440 photos are in there now.

The admin is not linked from the site. It is reachable by URL only.

## Before launch

- **Check `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`** match the project that
  holds the catalogue. Wrong values fail as a 401, not as an empty page.
- **Turn off public sign-ups** in Supabase Auth, or anyone who finds `/admin` can
  create an account and edit your catalogue.
- **Update the social URLs in `index.html`** if you deploy anywhere other than
  `bags-daily.vercel.app`. Crawlers do not run JavaScript, so those cannot be
  filled in at runtime.

## Deployment

**Vercel is the production host** — <https://bags-daily.vercel.app>. It deploys
from `main` automatically. GitHub Pages is not used; its workflow has been
removed, so nothing publishes a second, catalogue-less copy of the site.

### The two variables the build needs

Vite inlines `VITE_*` variables **at build time**, not at runtime. A build on a
machine without them still succeeds and still deploys — it just ships a site that
reports *"The catalogue is not connected"*, with an admin that shows a
"Not configured" panel instead of a sign-in form. Nothing in CI can tell you,
because the build is genuinely green. This has already happened once.

Set these in the Vercel project (**Settings → Environment Variables**, Production
scope) and redeploy — a redeploy is required, because adding a variable does not
rebuild an already-deployed bundle:

```
VITE_SUPABASE_URL=https://bwhkaefcjsiwdeqihwkf.supabase.co
VITE_SUPABASE_ANON_KEY=<the sb_publishable_… key from Supabase → Project Settings → API>
```

The anon key is designed to be public — it ships in the browser bundle to every
visitor. Keeping it out of the repo is about git history, not secrecy.

After any deploy, confirm the config actually landed rather than trusting the
green check:

```bash
curl -s https://bags-daily.vercel.app/ | grep -o '/assets/index-[A-Za-z0-9_-]*\.js'
curl -s "https://bags-daily.vercel.app/assets/index-<hash>.js" | grep -c bwhkaefcjsiwdeqihwkf
```

A count of `0` means the build had no Supabase config, whatever CI reported.

### Deep links

`vercel.json` rewrites everything to `index.html` so client-side routes survive a
hard load. The pattern is `/(.*)`; do not narrow it with a negative lookahead
like `((?!api/).*)` unless there is an `api/` directory to protect. There is not
one, and doing that silently disables the fallback for *every* route — `/admin`,
`/collection` and `/product/:id` all return a platform 404 while the homepage
still looks fine, because in-app navigation never hits the server.

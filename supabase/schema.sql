-- Bags Daily — the live `products` table, as it actually is
--
-- READ THIS FIRST
--   The table in Supabase was created outside this repo. This file does NOT
--   create it. It is a written record of the shape the app depends on, so that
--   anyone reading the code can see the contract without opening the dashboard,
--   plus the policies and bucket that the app relies on.
--
--   The app is `src/lib/products.ts` (the Product type) and
--   `src/lib/productsRead.ts` (the exact column list and sort order). Those two
--   and this file must agree. If you change one, change all three.
--
--   If the columns here and the columns in the dashboard ever disagree, the
--   storefront shows "The products table does not match what the site expects"
--   and names the columns it wanted — that error is the tripwire for this.
--
-- TWO THINGS THAT ARE EASY TO GET WRONG
--   id is a uuid, not a sequence. Number(row.id) is NaN, which silently breaks
--     routing and React keys.
--   the photos are in `gallery`, not `images`. There is no `instagram` column,
--     so the site's call to action is the profile URL in src/data/site.ts.

-- ---------------------------------------------------------------------------
-- The table
-- ---------------------------------------------------------------------------
--   id          uuid        primary key
--   name        text
--   brand       text        Coach, Christy NG, Lacoste, Longchamp, ...
--   price       numeric     whole pesos
--   description text        empty on all 29 current rows
--   image_url   text        redundant: always equal to gallery[0]
--   gallery     text[]      the photos, in order; 4 to 38 on a current product
--   is_posted   boolean     true on all 29 current rows
--   sort_order  integer     0 on all 29 current rows, so ordering uses created_at
--   created_at  timestamptz
--
-- `image_url` is deliberately left in place. It duplicates gallery[0] on every
-- row, and dropping it is a one-line change for whoever owns the dashboard — but
-- it is not this repo's data to delete, and nothing reads it.
--
-- The app enforces at most 40 photos per product (MAX_PRODUCT_IMAGES). There is
-- no check constraint for it: adding one now would fail on a table that already
-- holds valid rows, and the ceiling is a UI concern rather than an integrity one.

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- Confirmed against the live project: an anonymous insert returns
-- 42501 "new row violates row-level security policy for table products". Reads
-- are public, because the catalogue is public.
--
-- The policies below are what that behaviour means. They are recorded here, not
-- re-applied, so that the security model is reviewable in one place. If you ever
-- need to re-create them, this is the source.

-- alter table public.products enable row level security;

-- drop policy if exists "products are public to read" on public.products;
-- create policy "products are public to read"
--   on public.products for select
--   using (true);

-- drop policy if exists "signed in users may insert products" on public.products;
-- create policy "signed in users may insert products"
--   on public.products for insert
--   to authenticated
--   with check (true);

-- drop policy if exists "signed in users may update products" on public.products;
-- create policy "signed in users may update products"
--   on public.products for update
--   to authenticated
--   using (true)
--   with check (true);

-- drop policy if exists "signed in users may delete products" on public.products;
-- create policy "signed in users may delete products"
--   on public.products for delete
--   to authenticated
--   using (true);

-- ---------------------------------------------------------------------------
-- The security boundary that is NOT in the database
-- ---------------------------------------------------------------------------
-- RLS allows any *signed-in* user to write. So the moment public sign-ups are
-- enabled, anyone who finds /admin can create themselves an account and rewrite
-- the catalogue. Turning sign-ups off is the actual lock:
--
--   Dashboard -> Authentication -> Providers -> Email
--   -> "Allow new users to sign up" = OFF
--
-- Check it is still off. It is one toggle and it is the whole perimeter.

-- ---------------------------------------------------------------------------
-- Triggers: there was a broken one, and it has been removed
-- ---------------------------------------------------------------------------
-- An earlier version of this file created a BEFORE UPDATE trigger that assigns
-- NEW.updated_at. This table has no updated_at column, so that trigger could
-- never succeed: every UPDATE raised
--   record "new" has no field "updated_at"
-- and editing a product in /admin failed. INSERT was unaffected, which is what
-- made it look like an RLS or permissions problem rather than a broken trigger.
--
-- Removed by supabase/fix-updated-at-trigger.sql, which finds the trigger by
-- matching its function body rather than by name. The orphaned
-- public.touch_updated_at() function was left in place: dead, but harmless, and
-- dropping it would fail if anything else referenced it.
--
-- The reason it got installed at all: `create table if not exists` was a no-op
-- against an existing table, but the trigger DDL underneath it was not guarded by
-- table existence, so running this file against a database whose table already
-- existed applied the trigger anyway. This file is now a record rather than a
-- script, precisely so that it cannot.

-- ---------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------
-- 440 photos already live in the public `product-images` bucket, addressed as
--   <project>/storage/v1/object/public/product-images/<timestamp>-<slug>.jpeg
-- which is the `gallery` value. Uploading is authenticated-only; reading is not.

-- insert into storage.buckets (id, name, public)
-- values ('product-images', 'product-images', true)
-- on conflict (id) do nothing;

-- drop policy if exists "product images are public" on storage.objects;
-- create policy "product images are public"
--   on storage.objects for select
--   using (bucket_id = 'product-images');

-- drop policy if exists "signed in users may upload product images" on storage.objects;
-- create policy "signed in users may upload product images"
--   on storage.objects for insert
--   to authenticated
--   with check (bucket_id = 'product-images');

-- drop policy if exists "signed in users may replace product images" on storage.objects;
-- create policy "signed in users may replace product images"
--   on storage.objects for update
--   to authenticated
--   using (bucket_id = 'product-images');

-- drop policy if exists "signed in users may delete product images" on storage.objects;
-- create policy "signed in users may delete product images"
--   on storage.objects for delete
--   to authenticated
--   using (bucket_id = 'product-images');

-- ---------------------------------------------------------------------------
-- Backup, if you ever want one
-- ---------------------------------------------------------------------------
-- Nothing in this repo can dump the table: the anon key has read access and
-- nothing else, which is the point. To snapshot before any manual change:
--
--   Dashboard -> Table Editor -> products -> Export as CSV
--   …or SQL Editor:  select * from public.products order by created_at;

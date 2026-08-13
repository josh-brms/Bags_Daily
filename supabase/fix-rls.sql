-- ============================================================
--  Bag's Daily — RLS fix / verify script
--  Safe to run as many times as you want.
--  Run in: Supabase Dashboard -> SQL Editor -> New query -> Run
--  Then retry adding a product in the admin panel.
-- ============================================================

-- ---------- 0. Make sure the gallery column exists (migration) ----------
alter table public.products
  add column if not exists gallery text[] not null default '{}';

-- ---------- 1. Make sure security is enabled ----------
alter table public.products enable row level security;
alter table public.settings enable row level security;

-- ---------- 2. Recreate table policies ----------
drop policy if exists "public can view products" on public.products;
drop policy if exists "admin can manage products" on public.products;

create policy "public can view products"
  on public.products for select
  using (true);

create policy "admin can manage products"
  on public.products for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "public can view settings" on public.settings;
drop policy if exists "admin can manage settings" on public.settings;

create policy "public can view settings"
  on public.settings for select
  using (true);

create policy "admin can manage settings"
  on public.settings for all
  to authenticated
  using (true)
  with check (true);

-- ---------- 3. Make sure the photo storage bucket exists ----------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "public can view product photos" on storage.objects;
drop policy if exists "admin can upload product photos" on storage.objects;
drop policy if exists "admin can edit product photos" on storage.objects;
drop policy if exists "admin can delete product photos" on storage.objects;

create policy "public can view product photos"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "admin can upload product photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "admin can edit product photos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

create policy "admin can delete product photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');

-- ---------- 4. Result check (should list 6 policy rows) ----------
select tablename, policyname
from pg_policies
where tablename in ('products', 'settings')
   or (schemaname = 'storage' and tablename = 'objects');
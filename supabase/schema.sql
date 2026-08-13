-- ============================================================
--  Bag's Daily — Supabase schema
--  Run this once in: Supabase Dashboard -> SQL Editor -> New query
-- ============================================================

-- ---------- Tables ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text not null default '',
  price numeric not null default 0,
  description text not null default '',
  image_url text not null default '',
  gallery text[] not null default '{}',
  is_posted boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  shop_name text not null default 'Bag''s Daily',
  tagline text not null default '',
  shop_description text not null default '',
  shop_rules text not null default '',
  instagram_url text not null default 'https://www.instagram.com/bags_daily.ph',
  updated_at timestamptz not null default now()
);

insert into public.settings (id) values (1) on conflict (id) do nothing;

-- ---------- Row Level Security ----------
alter table public.products enable row level security;
alter table public.settings enable row level security;

drop policy if exists "public can view products" on public.products;
drop policy if exists "admin can manage products" on public.products;
drop policy if exists "public can view settings" on public.settings;
drop policy if exists "admin can manage settings" on public.settings;

create policy "public can view products"
  on public.products for select
  using (true);

create policy "admin can manage products"
  on public.products for all
  to authenticated
  using (true)
  with check (true);

create policy "public can view settings"
  on public.settings for select
  using (true);

create policy "admin can manage settings"
  on public.settings for all
  to authenticated
  using (true)
  with check (true);

-- ---------- Storage bucket for product photos ----------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

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
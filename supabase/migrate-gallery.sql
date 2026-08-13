-- ============================================================
--  Bag's Daily — add photo gallery (multiple photos per product)
--  Run ONCE in: Supabase Dashboard -> SQL Editor -> New query
-- ============================================================

alter table public.products
  add column if not exists gallery text[] not null default '{}';
-- ============================================================
--  Bag's Daily — one-time diagnostic helper
--  Run ONCE in: Supabase Dashboard -> SQL Editor -> New query
--  Then click "Diagnose" in the admin panel to see your setup.
-- ============================================================

create or replace function public.check_shop()
returns jsonb
language sql
security definer
stable
as $$
  select jsonb_build_object(
    'current_role', auth.role(),
    'is_authenticated', (auth.role() = 'authenticated'),
    'products_policies', (select count(*) from pg_policies where schemaname = 'public' and tablename = 'products'),
    'settings_policies', (select count(*) from pg_policies where schemaname = 'public' and tablename = 'settings'),
    'storage_object_policies', (select count(*) from pg_policies
        where schemaname = 'storage' and tablename = 'objects'
          and policyname ilike '%product%'),
    'bucket_exists', exists (select 1 from storage.buckets where id = 'product-images'),
    'bucket_public', coalesce((select public from storage.buckets where id = 'product-images'), false),
    'product_count', (select count(*) from public.products),
    'has_gallery_column', exists (select 1 from information_schema.columns
        where table_schema = 'public' and table_name = 'products' and column_name = 'gallery')
  );
$$;

grant execute on function public.check_shop() to anon, authenticated;

-- quick self-test inside the SQL editor (should print a JSON object)
select public.check_shop();
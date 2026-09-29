-- Bags Daily — remove the stale updated_at trigger
--
-- WHY THIS EXISTS
--   An earlier version of supabase/schema.sql created a BEFORE UPDATE trigger
--   whose function assigns NEW.updated_at. The products table was created outside
--   this repo and has no updated_at column, so running that file against the live
--   database installed a trigger that could never succeed.
--
--   Symptom: editing a product in /admin fails with
--     "Could not save that product. (record "new" has no field "updated_at")"
--   Adding a new product still worked, because INSERT does not fire a BEFORE
--   UPDATE trigger. That difference is the tell.
--
--   The trigger never did anything useful. src/ contains no reference to
--   updated_at, and the storefront orders by created_at.
--
-- WHEN TO RUN
--   Once, in the Supabase SQL editor (Dashboard -> SQL -> New query). It is safe
--   to re-run: step 1 only reads, and step 2 finds nothing to drop the second
--   time.
--
-- VERIFY
--   Step 3 should return zero rows, and editing a product in /admin should save.

-- ---------------------------------------------------------------------------
-- 1. Read-only: what triggers are actually on the table, and what do they do?
--    Check the output before running step 2.
-- ---------------------------------------------------------------------------
select t.tgname as trigger_name,
       pg_get_triggerdef(t.oid) as definition,
       pg_get_functiondef(t.tgfoid) as function_body
from pg_trigger t
where t.tgrelid = 'public.products'::regclass
  and not t.tgisinternal;

-- ---------------------------------------------------------------------------
-- 2. Drop any trigger whose function touches updated_at.
--
--    Matched on the function body rather than a hardcoded trigger name on
--    purpose: if the trigger was renamed at some point, a hardcoded
--    "drop trigger if exists products_touch_updated_at" would quietly do nothing
--    and the save would still fail with the identical message. Matching the body
--    cannot miss it, and cannot catch a trigger that never mentions the column.
-- ---------------------------------------------------------------------------
do $$
declare
  r record;
begin
  for r in
    select t.tgname
    from pg_trigger t
    where t.tgrelid = 'public.products'::regclass
      and not t.tgisinternal
      and pg_get_functiondef(t.tgfoid) like '%updated_at%'
  loop
    execute format('drop trigger if exists %I on public.products', r.tgname);
    raise notice 'dropped trigger: %', r.tgname;
  end loop;

  if not found then
    raise notice 'no trigger referencing updated_at was found — nothing to do';
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- 3. Confirm it is gone. Expect zero rows.
-- ---------------------------------------------------------------------------
select t.tgname as remaining_trigger
from pg_trigger t
where t.tgrelid = 'public.products'::regclass
  and not t.tgisinternal;

-- ---------------------------------------------------------------------------
-- Deliberately NOT done here
--
--   drop function public.touch_updated_at();
--
--   It is left in place. It is dead code, but dropping it fails with a dependency
--   error if anything else turns out to reference it, and an unused function is
--   harmless. Delete it once you are sure nothing else uses it.
--
--   The table's `image_url` column is also left alone. It duplicates gallery[0] on
--   every row and nothing in the app reads it, so editing a product will leave it
--   drifting out of date. Harmless, but it is your data to delete, not this
--   repo's.

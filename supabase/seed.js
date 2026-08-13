// ============================================================
//  Bag's Daily — one-time product seeder
//  Loads the images from ../images into your Supabase database.
//
//  Usage:
//    1. cd supabase
//    2. npm install @supabase/supabase-js
//    3. SUPABASE_URL="https://xxx.supabase.co" \
//       SUPABASE_SERVICE_ROLE_KEY="<service_role key>" \
//       node seed.js
//    (Get both from Supabase Dashboard -> Settings -> API)
//    NOTE: the service_role key bypasses security — never put it
//    in the website code, only use it here on your own computer.
// ============================================================

import { createClient } from '@supabase/supabase-js';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

async function main() {
  const imagesDir = join(__dirname, '..', 'images');
  let files;
  try {
    files = readdirSync(imagesDir).filter((f) => EXTENSIONS.has(f.slice(f.lastIndexOf('.'))));
  } catch {
    console.error(`Could not read images folder: ${imagesDir}`);
    process.exit(1);
  }

  if (!files.length) {
    console.log('No images found — nothing to seed.');
    return;
  }

  console.log(`Found ${files.length} image(s). Checking which are already in the shop...`);

  const { data: existing, error: listError } = await supabase
    .from('products')
    .select('image_url');
  if (listError) throw listError;

  const existingUrls = new Set((existing || []).map((p) => p.image_url));
  let inserted = 0;

  for (const file of files) {
    const imageUrl = `images/${file}`;
    if (existingUrls.has(imageUrl)) {
      console.log(`  skip (already added): ${file}`);
      continue;
    }

    const name = file
      .replace(/\.[^.]+$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const { error } = await supabase.from('products').insert({
      name,
      brand: '',
      price: 1500,
      description: 'Add a description in the admin panel.',
      image_url: imageUrl,
      gallery: [imageUrl],
      is_posted: false,
    });

    if (error) {
      console.error(`  FAILED: ${file} ->`, error.message);
    } else {
      inserted++;
      console.log(`  added: ${file} (name: "${name}")`);
    }
  }

  console.log(`\nDone! ${inserted} product(s) added.`);
  console.log('Open admin.html -> sign in -> edit names, brands and prices.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
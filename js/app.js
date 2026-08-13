import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { icon } from './icons.js';

const INSTALLMENT_FEE = 200;
const KNOWN_BRANDS = ['Coach', 'Christy NG', 'Lacoste', 'ALO', 'Lululemon', 'Tory Burch', 'Longchamp', 'Charles & Keith'];
const DEFAULT_IG = 'https://www.instagram.com/bags_daily.ph';

let supabase = null;
let products = [];
let settings = null;
let activeBrand = 'All';

const el = (id) => document.getElementById(id);

/* ---------- Installment helpers ---------- */
const installmentPrice = (price) => price + INSTALLMENT_FEE;
const monthly = (price, months) => Math.round(installmentPrice(price) / months);

const formatPeso = (n) =>
  '₱' + Number(n).toLocaleString('en-PH', { maximumFractionDigits: 0 });

/* ---------- Theme ---------- */
function initTheme() {
  const saved = localStorage.getItem('bagsdaily-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.dataset.theme = theme;
  updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
  const btn = el('themeToggle');
  if (btn) btn.innerHTML = theme === 'dark' ? icon('sun') : icon('moon');
}

function toggleTheme() {
  const current = document.documentElement.dataset.theme;
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('bagsdaily-theme', next);
  updateThemeIcon(next);
}

/* ---------- Render helpers ---------- */
function brandList() {
  const fromData = [...new Set(products.map((p) => p.brand).filter(Boolean))];
  return [...new Set([...KNOWN_BRANDS, ...fromData])];
}

function renderFilters() {
  const wrap = el('brandFilters');
  const brands = brandList();
  const chips = ['All', ...brands].map(
    (b) => `<button class="chip ${b === activeBrand ? 'active' : ''}" data-brand="${b}">${b}</button>`
  ).join('');
  wrap.innerHTML = chips;
}

function installmentChipsHtml(price) {
  const total = installmentPrice(price);
  return `
    <div class="installment-chips">
      <div class="inst-chip">${formatPeso(monthly(price, 3))}/mo<small>3 months · ${formatPeso(total)}</small></div>
      <div class="inst-chip">${formatPeso(monthly(price, 6))}/mo<small>6 months · ${formatPeso(total)}</small></div>
    </div>`;
}

function cardHtml(p) {
  return `
    <article class="product-card reveal visible" data-brand="${(p.brand || '').toLowerCase()}">
      <div class="card-img">
        ${p.brand ? `<span class="badge">${escapeHtml(p.brand)}</span>` : ''}
        ${p.is_posted ? `<span class="posted-flag">${icon('pin', { klass: 'svg-icon sm' })} Posted</span>` : ''}
        <img src="${p.image_url}" alt="${escapeHtml(p.name)}" loading="lazy"
             onerror="this.src='https://placehold.co/600x600/ffe1ec/c9186b?text=Bag%27s+Daily'">
      </div>
      <div class="card-body">
        ${p.brand ? `<span class="card-brand">${escapeHtml(p.brand)}</span>` : ''}
        <h3 class="card-name">${escapeHtml(p.name)}</h3>
        <div class="price-row">
          <span class="price">${formatPeso(p.price)}</span>
          <span class="installment-note">or ${formatPeso(installmentPrice(p.price))} on installment</span>
        </div>
        ${installmentChipsHtml(p.price)}
        <a class="order-btn" href="${settings?.instagram_url || DEFAULT_IG}" target="_blank" rel="noopener">
          ${icon('bagSimple', { klass: 'svg-icon' })} Order Now
        </a>
      </div>
    </article>`;
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

function renderGrid() {
  const grid = el('productGrid');
  const filtered = activeBrand === 'All'
    ? products
    : products.filter((p) => (p.brand || '').toLowerCase() === activeBrand.toLowerCase());

  if (!filtered.length) {
    grid.innerHTML = `<div class="empty-state"><span class="icon-big">${icon('bag', { size: 'lg' })}</span>No ${activeBrand === 'All' ? '' : activeBrand + ' '}items right now — check IG for the latest drops!</div>`;
    return;
  }
  grid.innerHTML = filtered.map(cardHtml).join('');
}

function renderPosted() {
  const strip = el('postedStrip');
  const posted = products.filter((p) => p.is_posted);
  if (!posted.length) {
    strip.innerHTML = `<div class="empty-state"><span class="icon-big">${icon('inbox', { size: 'lg' })}</span>No posted items yet — check back soon!</div>`;
    return;
  }
  strip.innerHTML = posted.map(
    (p) => `
      <article class="mini-card">
        <img src="${p.image_url}" alt="${escapeHtml(p.name)}" loading="lazy"
             onerror="this.src='https://placehold.co/600x600/ffe1ec/c9186b?text=Bag%27s+Daily'">
        <div class="mini-body">
          ${p.brand ? `<span class="card-brand">${escapeHtml(p.brand)}</span>` : ''}
          <h3 class="card-name">${escapeHtml(p.name)}</h3>
          <div class="mini-actions">
            <span class="mini-price">${formatPeso(p.price)}</span>
            <a class="mini-order" href="${settings?.instagram_url || DEFAULT_IG}" target="_blank" rel="noopener">Order</a>
          </div>
        </div>
      </article>`
  ).join('');
}

/* ---------- Settings render ---------- */
function renderSettings() {
  if (!settings) return;
  document.title = `${settings.shop_name || 'Bag\'s Daily'} — Shop`;
  el('logoText').innerHTML = `${escapeHtml(settings.shop_name || 'Bag\'s Daily')} <span>Daily</span>`;
  el('heroTitle').innerHTML = `${escapeHtml(settings.shop_name || 'Bag\'s Daily').replace('Daily', '<em>Daily</em>')}`;
  el('heroTagline').textContent = settings.tagline || '';
  el('aboutText').textContent = settings.shop_description || '';
  const rules = (settings.shop_rules || '').split(/\n+/).filter(Boolean);
  el('rulesGrid').innerHTML = rules.length
    ? rules.map((r, i) => `<div class="rule-card"><div class="rule-num">${i + 1}</div><p>${escapeHtml(r)}</p></div>`).join('')
    : `<div class="rule-card"><div class="rule-num">${icon('heartFill', { klass: 'svg-icon' })}</div><p>Shop rules coming soon!</p></div>`;
  document.querySelectorAll('[data-ig-link]').forEach((a) => {
    a.href = settings.instagram_url || DEFAULT_IG;
  });
}

/* ---------- Data ---------- */
async function loadData() {
  try {
    const [prodRes, setRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: true }),
      supabase.from('settings').select('*').eq('id', 1).maybeSingle(),
    ]);
    if (prodRes.error) throw prodRes.error;
    if (setRes.error) throw setRes.error;
    products = prodRes.data || [];
    settings = setRes.data || null;
    renderSettings();
    renderFilters();
    renderGrid();
    renderPosted();
    updateBrandMarquee();
  } catch (err) {
    console.error('Load failed:', err);
    el('productGrid').innerHTML = `<div class="empty-state"><span class="icon-big">${icon('alert', { size: 'lg' })}</span>Couldn't load products. Please try again later.</div>`;
  }
}

function updateBrandMarquee() {
  const track = el('marqueeTrack');
  const brands = brandList();
  if (!brands.length) return;
  const half = [...brands, ...brands];
  track.innerHTML = half.map((b) => `<span>${escapeHtml(b)}</span>${icon('heartFill', { klass: 'marquee-dot' })}`).join('');
}

/* ---------- Mobile nav ---------- */
function setupNav() {
  const burger = el('hamburger');
  const nav = el('navMenu');
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    nav.classList.toggle('open');
  });
  nav.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      nav.classList.remove('open');
    })
  );
}

/* ---------- Events ---------- */
function bindEvents() {
  el('themeToggle').addEventListener('click', toggleTheme);

  el('brandFilters').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    activeBrand = chip.dataset.brand;
    renderFilters();
    renderGrid();
  });
}

/* ---------- Reveal on scroll ---------- */
function setupReveal() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal:not(.visible)').forEach((n) => io.observe(n));
}

/* ---------- Init ---------- */
function init() {
  initTheme();
  setupNav();
  bindEvents();
  setupReveal();
  updateBrandMarquee();

  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
    el('productGrid').innerHTML = `
      <div class="setup-notice" style="grid-column:1/-1">
        <h3>Almost ready!</h3>
        <p>Paste your Supabase URL and anon key into <code>js/config.js</code><br>
        (see <code>README.md</code> — takes about 10 minutes).</p>
      </div>`;
    return;
  }

  supabase = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  loadData();
}

document.addEventListener('DOMContentLoaded', init);
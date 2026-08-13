import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { icon } from './icons.js';

let supabase = null;

const el = (id) => document.getElementById(id);
const show = (id, on) => (el(id).style.display = on ? '' : 'none');

const formatPeso = (n) =>
  '₱' + Number(n).toLocaleString('en-PH', { maximumFractionDigits: 0 });

/* ---------- Theme ---------- */
function initTheme() {
  const saved = localStorage.getItem('bagsdaily-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.dataset.theme = theme;
  el('themeToggle').innerHTML = theme === 'dark' ? icon('sun') : icon('moon');
}

/* ---------- Auth ---------- */
async function handleAuth() {
  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
    el('loginError').textContent = 'Missing Supabase keys. Paste them into js/config.js first.';
    el('loginError').style.display = 'block';
    return;
  }
  supabase = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

  const { data } = await supabase.auth.getSession();
  if (data.session) {
    enterDashboard(data.session.user);
  } else {
    show('loginCard', true);
  }
}

async function login(email, password) {
  const err = el('loginError');
  err.style.display = 'none';
  const btn = el('loginBtn');
  btn.textContent = 'Signing in…';
  btn.disabled = true;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  btn.textContent = 'Sign In';
  btn.disabled = false;

  if (error) {
    err.textContent = error.message.includes('Invalid login')
      ? 'Wrong email or password.'
      : error.message;
    err.style.display = 'block';
    return;
  }
  enterDashboard(data.user);
}

function enterDashboard(user) {
  show('loginCard', false);
  show('dashboard', true);
  document.querySelector('.admin-head h1').innerHTML =
    `${icon('user')} Welcome, ${escapeHtml(user.email)}`;
  loadAll();
}

async function logout() {
  await supabase.auth.signOut();
  location.reload();
}

/* ---------- Storage ---------- */
async function uploadImage(file) {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
}

/* ---------- Products ---------- */
let allProducts = [];

function renderProducts() {
  const list = el('productList');
  el('productCount').textContent = `(${allProducts.length})`;
  list.innerHTML = allProducts.length
    ? allProducts.map((p) => `
      <div class="admin-item">
        <img src="${p.image_url}" alt="" onerror="this.src='https://placehold.co/56x56/ffe1ec/c9186b?text=Bag'">
        <div class="admin-item-info">
          <div class="name">${escapeHtml(p.name)}
            ${p.brand ? `<span class="chip-tag">${escapeHtml(p.brand)}</span>` : ''}
            ${p.is_posted ? '<span class="chip-tag">Posted</span>' : ''}
          </div>
          <div class="meta">${formatPeso(p.price)} · ${(p.description || '').slice(0, 60)}</div>
        </div>
        <div class="admin-item-actions">
          <button class="btn btn-small btn-success" data-toggle-post="${p.id}">${icon('pin', { size: 'sm' })} ${p.is_posted ? 'Unpost' : 'Post'}</button>
          <button class="btn btn-small" data-edit="${p.id}">${icon('pencil', { size: 'sm' })} Edit</button>
          <button class="btn btn-small btn-danger" data-delete="${p.id}">${icon('trash', { size: 'sm' })}</button>
        </div>
      </div>`).join('')
    : '<p style="color:var(--muted)">No products yet — add your first one above! 🎉</p>';
  bindProductButtons();
}

function bindProductButtons() {
  document.querySelectorAll('[data-edit]').forEach((b) =>
    b.addEventListener('click', () => startEdit(b.dataset.edit)));
  document.querySelectorAll('[data-delete]').forEach((b) =>
    b.addEventListener('click', () => deleteProduct(b.dataset.delete)));
  document.querySelectorAll('[data-toggle-post]').forEach((b) =>
    b.addEventListener('click', () => togglePosted(b.dataset.togglePost)));
}

async function loadProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) return showError('productError', error.message);
  allProducts = data || [];
  renderProducts();
}

async function saveProduct(e) {
  e.preventDefault();
  const err = el('productError');
  err.style.display = 'none';

  const id = el('productId').value;
  let imageUrl = el('pImageUrl').value.trim();

  try {
    const file = el('pImageFile').files[0];
    if (file) imageUrl = await uploadImage(file);
    if (!imageUrl) throw new Error('Please add a photo (upload a file or paste a link).');

    const payload = {
      name: el('pName').value.trim(),
      brand: el('pBrand').value.trim(),
      price: parseFloat(el('pPrice').value),
      description: el('pDesc').value.trim(),
      is_posted: el('pPosted').checked,
      image_url: imageUrl,
    };

    let error;
    if (id) {
      ({ error } = await supabase.from('products').update(payload).eq('id', id));
    } else {
      ({ error } = await supabase.from('products').insert(payload));
    }
    if (error) throw error;

    resetForm();
    loadProducts();
  } catch (errMsg) {
    const msg = errMsg.message || String(errMsg);
    if (/row-level security|42501|permission denied/i.test(msg)) {
      showError('productError',
        'Permission denied. This usually means you are not signed in, or the security policies are missing.\n\nFix: run supabase/fix-rls.sql in the Supabase SQL Editor, then log out and log back in here.');
    } else {
      showError('productError', msg);
    }
  }
}

function startEdit(id) {
  const p = allProducts.find((x) => x.id === id);
  if (!p) return;
  el('productId').value = p.id;
  el('pName').value = p.name;
  el('pBrand').value = p.brand || '';
  el('pPrice').value = p.price;
  el('pDesc').value = p.description || '';
  el('pPosted').checked = !!p.is_posted;
  el('pImageUrl').value = p.image_url;
  el('pPreview').src = p.image_url;
  el('pImageFile').value = '';
  el('formTitle').innerHTML = `${icon('pencil')} Edit Product`;
  el('saveBtn').innerHTML = `${icon('save')} Update Product`;
  el('cancelEditBtn').hidden = false;
  el('productForm').scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
  el('productForm').reset();
  el('productId').value = '';
  el('pPreview').src = 'https://placehold.co/74x74/ffe1ec/c9186b?text=Bag';
  el('formTitle').textContent = 'Add Product';
  el('saveBtn').innerHTML = `${icon('save')} Save Product`;
  el('cancelEditBtn').hidden = true;
}

async function deleteProduct(id) {
  const p = allProducts.find((x) => x.id === id);
  if (!confirm(`Delete "${p?.name}"? This cannot be undone.`)) return;
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return alert('Delete failed: ' + error.message);
  loadProducts();
}

async function togglePosted(id) {
  const p = allProducts.find((x) => x.id === id);
  if (!p) return;
  const { error } = await supabase
    .from('products')
    .update({ is_posted: !p.is_posted })
    .eq('id', id);
  if (error) return alert('Update failed: ' + error.message);
  loadProducts();
}

/* ---------- Settings ---------- */
async function loadSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();
  if (error) return showError('settingsError', error.message);
  const s = data || {};
  el('sName').value = s.shop_name || '';
  el('sTagline').value = s.tagline || '';
  el('sInstagram').value = s.instagram_url || '';
  el('sDescription').value = s.shop_description || '';
  el('sRules').value = s.shop_rules || '';
}

async function saveSettings(e) {
  e.preventDefault();
  const err = el('settingsError');
  err.style.display = 'none';
  const payload = {
    id: 1,
    shop_name: el('sName').value.trim() || 'Bag\'s Daily',
    tagline: el('sTagline').value.trim(),
    instagram_url: el('sInstagram').value.trim(),
    shop_description: el('sDescription').value.trim(),
    shop_rules: el('sRules').value.trim(),
  };
  const { error } = await supabase.from('settings').upsert(payload);
  if (error) return showError('settingsError', error.message);
  alert('Settings saved! ✅');
}

/* ---------- Helpers ---------- */
function showError(id, msg) {
  const err = el(id);
  err.textContent = msg;
  err.style.display = 'block';
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

function loadAll() {
  loadProducts();
  loadSettings();
}

/* ---------- Bind ---------- */
function bind() {
  el('themeToggle').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('bagsdaily-theme', next);
    el('themeToggle').innerHTML = next === 'dark' ? icon('sun') : icon('moon');
  });

  el('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    login(el('loginEmail').value, el('loginPassword').value);
  });

  el('logoutBtn').addEventListener('click', logout);
  el('productForm').addEventListener('submit', saveProduct);
  el('settingsForm').addEventListener('submit', saveSettings);
  el('cancelEditBtn').addEventListener('click', resetForm);

  el('pImageFile').addEventListener('change', () => {
    const f = el('pImageFile').files[0];
    if (f) el('pPreview').src = URL.createObjectURL(f);
  });
  el('pImageUrl').addEventListener('input', () => {
    if (el('pImageUrl').value.trim()) el('pPreview').src = el('pImageUrl').value.trim();
  });

  document.querySelectorAll('.tab-btn').forEach((btn) =>
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      el('tab-' + btn.dataset.tab).classList.add('active');
    })
  );
}

/* ---------- Init ---------- */
initTheme();
bind();
handleAuth();
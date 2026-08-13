# 👜 Bag's Daily — Shop Website

A pink, interactive shop site for **"Bag's Daily"** with product gallery, Instagram ordering,
installment plans, dark/light mode, and a password-protected admin panel.

![Features](https://img.shields.io/badge/features-gallery%20•%20installments%20•%20admin%20panel%20•%20dark%20mode-ff4d8d)

---

## ✨ Features

| Public site (`index.html`) | Admin panel (`admin.html`) |
|---|---|
| Pink gradient hero + brand marquee | Login (Supabase Auth) |
| Product gallery with brand badges & filters | Add / edit / delete products |
| **Swipeable photos** (Shopee-style color gallery) | Upload several photos per product |
| Installment prices (₱+200, split 3 or 6 months) | Toggle "Posted" items |
| **Recently Posted** section | Edit shop name, tagline, about, rules, IG link |
| **Order Now** → opens your Instagram | Dark/light theme everywhere |
| Shop rules & about sections | Fully mobile-friendly |
| Dark mode / light mode toggle | |

**Installment formula:** `installment price = original + ₱200`
→ 3-month: `÷ 3` per month · 6-month: `÷ 6` per month
*Example: ₱1,600 → ₱1,800 → ₱600/mo (3mo) or ₱300/mo (6mo)*

---

## 🗄️ 1. Supabase setup (~10 minutes, free)

1. Go to [supabase.com](https://supabase.com) → **Start your project** → create an account → **New project**.
   - Name: `bags-daily`, remember your **database password**.
2. In your project, open **SQL Editor** → **New query**, paste the entire contents of
   [`supabase/schema.sql`](supabase/schema.sql), click **Run**. (This creates the tables,
   security rules, and photo storage.)
3. Create your admin account: **Authentication → Users → Add user**.
   Choose an email + password (e.g. `admin@yourshop.com` / a strong password).
4. Copy your keys: **Settings → API** →
   - **Project URL**
   - **anon public key**
5. Open [`js/config.js`](js/config.js) and paste them:

   ```js
   window.SUPABASE_URL = 'https://yyyyyyyy.supabase.co';
   window.SUPABASE_ANON_KEY = 'eyJhbGciOi...';
   ```

6. *(Optional but recommended)* Seed your 16 existing photos as products:

   ```bash
   cd supabase
   npm install
   SUPABASE_URL="https://yyyyyyyy.supabase.co" \
   SUPABASE_SERVICE_ROLE_KEY="<service_role key from Settings > API>" \
   node seed.js
   ```

   Then edit each product (name, brand, price) in the admin panel.

---

## 🖥️ 2. Run it locally

```bash
npx serve .
# or:
python3 -m http.server 8080
```

Open `http://localhost:8080` for the store, `http://localhost:8080/admin.html` for the admin panel.

> Note: the site MUST be served over HTTP (`localhost` or hosting) — opening `index.html`
> directly as a file won't work because it loads the Supabase library as a module.

---

## 🚀 3. Publish it (free)

Any static-hosting service works — the site is plain HTML/CSS/JS (with the Supabase SDK via CDN):

**Option A — Netlify (easiest):**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the whole project folder in.
3. Done — you get a free URL like `https://bags-daily.netlify.app`.

**Option B — Vercel / GitHub Pages:** same — upload the folder or push to a repo and deploy.

Since products live in Supabase (the cloud), **everything the admin adds/edits shows up
instantly for all visitors** — no rebuild needed.

---

## 🛠️ Managing the shop

- Go to `https://your-site.com/admin.html` and sign in with your admin email/password.
- **Products tab** — add a product (photo + name + brand + price), set the 📌 **Posted**
  checkbox to feature it in the *Recently Posted* section, edit or delete anytime.
- **Settings tab** — edit the shop name, tagline, About text, Shop Rules (one per line),
  and your Instagram link.
- Add as many more admins as you like in Supabase → Authentication → Users.

---

## 📁 Project structure

```
├── index.html          # public store front
├── admin.html          # admin panel (login + manage)
├── css/styles.css      # pink theme, dark/light, responsive
├── js/
│   ├── config.js       # ← paste your Supabase keys here
│   ├── app.js          # public site logic
│   └── admin.js        # admin logic
├── images/             # your product photos (used by the seeder)
└── supabase/
    ├── schema.sql      # run once in Supabase SQL Editor
    └── seed.js         # optional: load images/ as initial products
```

---

## 🔐 Security notes

- Visitors can **only read** products/settings — write access requires admin login (RLS).
- The `service_role` key is **only** used by `seed.js` on your machine — never put it in `js/config.js`.
- To change your admin password later: Supabase → Authentication → Users → edit user.
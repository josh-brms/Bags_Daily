# CY Studio — The Collection

Static storefront for the CY Studio collection: home page, product detail pages, and legal pages (privacy, terms, refund, cookies).

Built with plain HTML, CSS, and vanilla JavaScript. No build step, no external requests.

## Run locally

```bash
python3 -m http.server 8123
```

Then open http://localhost:8123

## Structure

- `index.html` — hero, product grid, about, footer
- `product.html?id=N` — product detail (colours, sizes, add-to-bag demo)
- `products.js` — product data (prices in PHP)
- `privacy.html` / `terms.html` / `refund.html` / `cookies.html` — legal pages
- `images/` — product and scene photography

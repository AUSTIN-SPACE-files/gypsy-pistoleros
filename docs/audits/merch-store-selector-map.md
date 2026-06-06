# Merch Store — BZ Selector Map (Audit)

**Source:** Live DOM capture of https://gypsypistoleros.com/merch-store (public, logged-out view)
**Captured:** 2026-06-04 via Claude in Chrome
**Theme context:** `body.theme-nadia.theme-nadia-d` — confirmed this is the site-wide BZ theme family ("Nadia – Playful" in the BZ theme picker). There is one site-wide theme; the v0 rebuild merch page carries the same theme class. Store classes below are emitted by the store FEATURE, not the theme, so they are valid regardless of theme variant.

This pass MAPS the styling surface only. No CSS was written, no files in the repo were changed, nothing was deployed.

---

## 1. Grid / Section Wrapper

| Purpose | Exact selector | Notes / risk |
|---|---|---|
| Store section (one per "category") | `section.feature.store_feature` | **2 store features already on the page.** Stacking more = more categories. This is the unit you repeat. |
| Inner feature block | `div.zoogle-feature.block.layout_full` | BZ feature wrapper. |
| Grid wrapper | `div.store-wrapper.store-layout-grid` | The grid container. Layout mode is in the class (`store-layout-grid`). |
| Product card | `article.store.store-item.border-accent.multiple-images` | Repeating card. `multiple-images` is conditional (only when a product has >1 image). Target `article.store-item`. |
| **Feature-level heading** | **NONE — `no-feature-level-heading`** | **KEY FINDING: store features emit no heading above the grid.** Our HTML v0 heading blocks (plain h2) sit flush above each store section. Nothing to suppress. |

---

## 2. Product Card

| Purpose | Exact selector | Notes / risk |
|---|---|---|
| Card root | `article.store-item` | |
| Image area (outer) | `div.image-area-wrapper` | |
| Image figure | `figure.image-area` | |
| Main image link (white tile) | `a.main-image.highlight-image.thumbnail-image.dnt` | The current white tile. Restyle bg here for dark tiles. `.dnt` = do-not-track marker, leave it. |
| Image element | `figure.image-area img` | Don't add classes; target by descendant. |
| Thumbnail strip (multi-image only) | `ul.image-thumbnails.pdf__hide` → `li.image-thumbnail` → `a.thumbnail-image.highlight-image.square-crop.dnt` | Only present on multi-image products. |
| Product details block | `div.product-details` | |
| Product title | `h1.text-main.alt-font.heading-tertiary` → `a.store-grid-link` | Title is an `h1` (BZ's choice) wrapping an anchor. Style the anchor: v0 = Georgia 600 sentence case, white, green on hover. |
| Description | `div.description` | Often empty. |
| Current / sale price | `div.product-price.text-main` | Bold current price + "Save 20%" text. e.g. `£20.00 Save 20%`. |

---

## 3. Price Block (entangled with cart button — handle with care)

| Purpose | Exact selector | Notes / risk |
|---|---|---|
| Action wrapper | `div.product-action.pdf__hide` | |
| **Cart form (DO NOT alter structure)** | `form.store_item.salable-item.not-in-cart.available.with-quantity.in-stock.submit-check` | Stimulus-wired. State modifiers in class. |
| Add-to-cart button | `button.button.add-to-cart.sale-price` | **Price spans live INSIDE this JS-wired button.** Style the spans, never the button structure/data-*. |
| "Sale" tag text | `button.add-to-cart span.sale-tag-text` | Text "Sale". |
| Strikethrough old price | `button.add-to-cart span.old-price.lighter` | e.g. `£25.00`. This is the strikethrough hook. |
| Current price (separate) | `div.product-price.text-main` | Carries current price + "Save N%". |

---

## 4. SALE Badge

| Purpose | Exact selector | Notes / risk |
|---|---|---|
| Red SALE badge (top-right of tile) | `a.main-image div.sale-tag` | Sits inside the image link, NOT product-details. v0 restyle: red fill (accent-red) + red-bright border, white text, Inter, sentence case. |

---

## 5. Sold-out / Not-available State

| Purpose | Exact selector | Notes / risk |
|---|---|---|
| Sold-out form modifier | `form.store_item ... .not-available` | The available/not-available state is a class modifier on the form. e.g. Pink Badge Set form has `not-available` instead of `available`. |
| "Not available" label | `em.unless-available.text-secondary` | Shown when not available. |
| "Out of stock" label | `em.if-out-of-stock.text-secondary` | Shown when out of stock. |
| "In cart" link | `a.button.if-in-cart` | Shown when item already in cart. |

Style these via the parent state class, e.g. `form.not-available em.unless-available { ... }`.

---

## 6. Interactive / DO-NOT-TOUCH Inventory

- `form.store_item` carries `data-controller="cart--salable-item"` and a `data-action` — **never alter.**
- **6 hidden `<input>` elements** per form — never remove/reorder.
- `button.add-to-cart` — Stimulus submit. Style appearance only; never change tag, structure, or data-*.
- `a.if-in-cart`, `em.unless-available`, `em.if-out-of-stock` — JS toggles visibility by state; style only.
- State classes on the form (`available` / `not-available`, `in-stock` / `out-of-stock`, `not-in-cart`) are JS-managed — read them in selectors, never write them.

---

## 7. Specificity Notes

- The store markup is **NOT shadow DOM** — all hooks are plain classes, directly reachable (unlike `wa-button` `::part()` work).
- BZ theme uses `#usersite-container`-scoped ID rules. Prefix v0 store selectors with `#usersite-container` where a theme rule overrides (likely on `button`, `a`, `img`, price text colour). **Never use `!important`.**
- Theme family is Nadia site-wide — store selectors are feature-emitted and unaffected by theme variant.

---

## Open Questions / Blockers

1. **Price/button entanglement:** current price (`div.product-price`) and old price (`span.old-price` inside the button) are in two different places. A clean price row may need CSS to visually reunite them; verify both render predictably across sale vs non-sale items (non-sale items e.g. Lee's waistcoat have no `.old-price` / `.sale-tag`).
2. **`multiple-images` conditional:** card class and thumbnail strip vary by product image count. Build CSS must handle both single- and multi-image cards.
3. No feature-level heading exists — confirmed good for flush HTML heading blocks.

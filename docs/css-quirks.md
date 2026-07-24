# CSS quirks — Bandzoogle deployment notes

This document records CSS workarounds required specifically because of
Bandzoogle's injected theme styles. These are not bugs in our CSS; they
are necessary overrides.

---

## Bandzoogle section display override

Bandzoogle's theme CSS applies a high-specificity rule to every page:

```css
#usersite-container section { display: block; }
```

The ID selector gives this specificity (1,0,1), which beats any
class-based selector we write (0,1,0 or 0,2,0 etc.), forcing
`display: block` on all `<section>` elements regardless of our own CSS.

### Workaround

Any v0 rule that sets a non-block `display` value on a section wrapper
class (i.e., a class applied directly to a `<section>` element) must
use `!important` on that property only.

### Affected rules (as of May 2026)

| File                        | Rule            | Value              |
|-----------------------------|-----------------|---------------------|
| css/components/homepage.css | `.section-hero` | `display: flex`     |
| css/components/homepage.css | `.section-album`| `display: grid`     |

### Scope

`!important` is applied **only** to the `display` property, and **only**
on rules whose selector class is placed directly on a `<section>` element.
Child elements (divs, spans, etc.) do not need this treatment because the
Bandzoogle rule only targets `section` elements.

### Adding new section wrappers

If a new component introduces a section wrapper with `display: flex`,
`display: grid`, or any non-block value, add `!important` to that
`display` declaration at the time of writing.

---

## Web Awesome card backgrounds

Bandzoogle's theme (or `wa-card`'s default `::part(base)` styling)
forces `.review-card` and similar card wrappers to a white background.
Our v0 design assumes dark card backgrounds throughout.

Workaround: explicit `background-color: var(--color-bg-primary) !important;`
on `.review-card` in `css/components/reviews.css`.

When a v2 reviews-grid variant is built later, the same workaround
pattern will likely be needed.

---

## Bandzoogle auto-injected page title

Every Bandzoogle page automatically injects an `<h1>` page title inside
`<div class="title-wrap">` above the page content. The text comes from
the page's name in BZ admin.

Earlier homepage versions had a hero `<h1>` reading "Gypsy Pistoleros"
which visually duplicated Bandzoogle's auto-injected title.

Resolution: don't fight the auto-title. Use a distinct hero `<h1>` copy
(homepage uses "Glam Punk Goth 'n' Roll Outlaws") so the two headings
are complementary, not duplicate.

For pages where the auto-title is genuinely unwanted, add
`.title-wrap { display: none !important; }` to `section-rhythm.css`
(prefixed with `#usersite-container`), scoped if necessary.

---

## Bandzoogle element-level overrides

Bandzoogle's theme uses ID-selector rules on generic HTML elements:

```css
#usersite-container section { display: block; }
#usersite-container p, ol, ul, dl, blockquote, figure, table {
  margin: 1em 0;
}
```

These have specificity (1,0,1), beating any single-class selector
in component CSS.

## Pattern — case-by-case !important

When a component rule's `display` or `margin` is being overridden by
Bandzoogle, add `!important` to **only the affected property**:

```css
.section-hero {
  display: flex !important;   /* beats Bandzoogle override */
  align-items: center;        /* not affected, no !important */
  /* ... */
}
```

Comment the rule with what override is being beaten so future
maintainers understand the `!important`.

## What we tried and abandoned (Pass 5e → 5g)

A broad reset using `revert !important` on `.page-content` descendants
was attempted. It failed because the reset's `!important` also beat
our own non-important component rules — breaking centring on
`.section-join__copy` and introducing browser-default blockquote
margins (40px).

Lesson: `revert !important` is more aggressive than it looks. It doesn't
hand cascade back to component CSS unless component CSS also uses
`!important`. Better to be surgical.

## Running list of known collisions

| Rule | Property | File |
|------|----------|------|
| `.section-hero` | `display: flex` | `homepage.css` |
| `.section-album` | `display: grid` | `homepage.css` |
| `.section-join__copy` | `margin: 0 auto ...` | `homepage.css` |
| `.review-card` | `background-color` | `reviews.css` |
| `.review-card__quote` | `margin` | `reviews.css` |
| `.section-at-a-glance__pull-quote` | `margin` | `press-kit.css` |

Add to this list as new collisions are discovered during deployment.

---

## Bandzoogle scoping — #usersite-container prefix

Bandzoogle's documented Custom CSS guidance (visible in their admin
panel) recommends prefixing custom selectors with `#usersite-container`.
This elevates them to ID-specificity, beating Bandzoogle's theme
rules which use the same pattern.

Without this prefix, rules targeting common elements (`section`, `p`,
`ol`, `ul`, `dl`, `blockquote`, `figure`, `table`, `::before`
pseudo-elements) often lose the cascade to Bandzoogle's theme.

Currently applied in: `section-rhythm.css`

Recommended for future cross-page baseline rules (any new cross-component
override would benefit from this prefix over case-by-case `!important`;
`bandzoogle-overrides.css` was deleted May 2026 — see the Bandzoogle
override pattern section above).

Per-component rules can still use class-only selectors as long as
they don't conflict with Bandzoogle theme defaults. The current
collisions and `!important` fixes (see the "Running list" above)
remain the pattern for resolved cases.

---

### BZ theme h1 rule overrides class selectors

Bandzoogle's theme CSS contains:

```css
#usersite-container h1 { font-size: 25px; padding-bottom: 5px; }
```

Specificity (1,0,1). Any custom h1 styling with a bare class selector
(specificity 0,1,0) loses to this rule — the h1 renders at 25px
regardless of the class rule's value.

**Fix:** prefix the class selector with `#usersite-container`:

```css
/* BAD — loses to BZ theme (0,1,0 vs 1,0,1) */
.section-hero__title { font-size: clamp(8rem, 36vw, 15rem); }

/* GOOD — matches BZ specificity (1,1,0 vs 1,0,1) */
#usersite-container .section-hero__title { font-size: clamp(8rem, 36vw, 15rem); }
```

Applied in `homepage.css` for `.section-hero__title` (Pass 6d).

**Likely scope:** this pattern probably applies to h2, h3, h4, and h5
as well — BZ's theme likely contains similar per-element overrides.
If any custom heading typography appears at an unexpected size on the
live site, try adding the `#usersite-container` prefix to the selector
before reaching for `!important`.

**Discovery note:** this collision was invisible during local staging
because BZ's theme stylesheet is served from a different origin and
blocked by CORS — the rule doesn't appear in DevTools computed styles
until deployed to the live domain.

---

### Bandzoogle assigns new file IDs per upload

Bandzoogle Files URLs include both a numeric ID and a filename:
`https://gypsypistoleros.com/files/[ID]/[filename]`. Changing the
file extension in CSS without re-uploading does **not** swap the
underlying asset — each upload gets a new ID. To replace an image
asset, upload the new file (gets a new ID), then update CSS to
point to the new URL. The old file remains in BZ Files until
manually deleted.

Example: the hero photo was first uploaded as `gp-arches-promo.webp`
(ID 1413345), then re-uploaded as a JPEG (ID 1413423). CSS must
reference 1413423, not 1413345. See `docs/deployment.md` for the
running list of current file IDs.

---

### Pseudo-element z-index can be forced negative by external rules

`section-rhythm.css` includes a high-specificity rule:

```css
#usersite-container .page-content > section::before { z-index: -1; }
```

This puts the `::before` of every section behind the section's
background. If you later need a `::before` to render in front of
an element (e.g. an overlay, fade, or interactive layer), the
negative z-index forces it behind the parent, making it invisible
unless the parent has `isolation: isolate`.

**Solutions:**
- Move the visible layer to `::after` (which doesn't get the -1 rule)
- Use a child element with an explicit positive z-index
- Write a more specific rule to override the section-rhythm one

Applied in Pass 6f: the hero fade gradient moved from `::before`
(z:-1, invisible) to `::after` (z:1, between photo and text).

---

### wa-card has no [part="base"] — style the host directly

Unlike wa-button, wa-card's shadow DOM does NOT include a
`[part="base"]` wrapper element. The shadow root has only four
children: `<slot part="media">`, `<header part="header">`,
`<div part="body">`, and `<footer part="footer">`. Background,
border, and outer container styling for wa-card must be set
on the host element directly OR by overriding the Web Awesome
design tokens (`--wa-color-surface-default`, etc.) which the
shadow DOM CSS consumes internally.

This is different from wa-button (which DOES have `part="base"`).
Confirmed via Pass 7e diagnostic on the press-kit downloads
section.

```css
/* WRONG — no [part="base"] exists */
.section-downloads__grid wa-card::part(base) { background: ...; }

/* CORRECT — host element + WA token overrides */
.section-downloads__grid wa-card {
  --wa-color-surface-default: var(--color-bg-primary);
  background-color: var(--color-bg-primary);
  border: 2px solid rgba(255, 255, 255, 0.15);
}
```

---

### BZ HTML feature does not auto-sync with staging files

Bandzoogle stores page HTML inside an HTML feature on the BZ
draft page itself. There is no file watcher or auto-sync between
the local `staging/*.html` files and the BZ HTML feature.

After any HTML change (new sections, new attributes like
`data-reviews-render`, copy edits, etc.), the user must:
1. Copy the entire updated `staging/[page].html` content
2. In BZ admin → draft page → edit HTML feature
3. Select all existing content → delete → paste new
4. Save → hard-refresh the draft URL

This is different from CSS (`dist/v0-bundle.css` pasted into
Customize CSS once, applies site-wide) and external JS
(`reviews.js`, `shows.js` at stable BZ Files URLs — uploading a
new version at the same file ID immediately updates the script
served on every page).

Diagnostic for catching this trap (run in browser DevTools console
on the draft page):

```js
const containers = document.querySelectorAll('[data-reviews-tag]');
containers.forEach(c => {
  console.log('data-reviews-render:', c.getAttribute('data-reviews-render') || '(not set)');
});
```

If a known-set attribute is `"(not set)"`, the HTML wasn't synced.

---

### wa-button shadow DOM and ::part(base)

Web Awesome's `<wa-button>` uses shadow DOM. Style the inner button
via `::part(base)` and the label text via `::part(label)`. The host
element's overflow may clip large `box-shadow`s — if shadows appear
cut off at the button's bounding box, add `overflow: visible` to
the host element selector (`wa-button[variant="brand"]` etc.).

Hover and active states use the **host:state::part(base)** pattern:

```css
/* correct */
wa-button[variant="brand"]:hover::part(base) { ... }

/* incorrect — pseudo-class on the part doesn't work cross-browser */
wa-button[variant="brand"]::part(base):hover { ... }
```

---

### wa-details default theme clashes with dark themes

Web Awesome's `<wa-details>` component renders with a white
background and white expanded panel by default — clashes hard
with dark-themed pages. Restyling requires multiple shadow-DOM
`::part()` overrides and is significantly more work than the
`wa-card` case. For most use cases on this site (Past Shows
disclosure, etc.), better to remove the `wa-details` wrapper
and render content inline with optional tagline prose.

Confirmed via Pass 8c on the shows page. Past Shows section was
originally wrapped in `<wa-details>` — removed and replaced with
inline `.shows-grid` rendering.

---

### Disabled wa-button needs explicit colour override

Web Awesome's default disabled state on `variant="brand"` renders
as a desaturated red, which reads as 'error' rather than 'muted'.
Site-wide override added in Pass 8c (buttons-v0.css) to render as
muted neutral grey (`--color-text-secondary` fill, black text,
`cursor: not-allowed`). The override targets both
`[variant="brand"][disabled]` and bare `wa-button[disabled]` to
catch JS-rendered output that omits classes.

Applies on: homepage UK Tour 2026 "Coming soon" buttons, shows
page upcoming/past tickets cells, press kit Full Press Bundle
card.

---

### Real &lt;table&gt; elements vs CSS-grid-mimicking-tables

`shows.js` previously implemented a "table layout" using CSS-grid
on `.show-card` elements with a `data-shows-layout="table"`
attribute. This produced a grid-styled appearance but used
semantically-incorrect `<article>` elements per row. Pass 8e
refactored to produce real `<table>` output, which:
- Provides correct semantic HTML for accessibility tools
- Supports browser-native cell copy/paste
- Enables proper text reflow on narrow viewports via
  media query stacking

The `reviews.js` renderer added the same pattern in Pass 7e for
the press kit reviews table.

---

## Bandzoogle override pattern — cross-component rules

*Archived from `css/components/bandzoogle-overrides.css` (May 2026). That file was deleted after the May 2026 bundle trim pass — its content is preserved here.*

### When to add cross-component overrides

Per-component Bandzoogle collisions belong in the component CSS file itself (e.g. `homepage.css`, `reviews.css`). Only add a new rule to a dedicated overrides location if the override is genuinely cross-component or site-wide — i.e. it cannot belong to any single component file.

The working pattern for per-component fixes:

```css
/* In the component's own file — add !important only to the affected property */
.my-section {
  display: flex !important;   /* beats BZ's #usersite-container section { display: block } */
  align-items: center;        /* unaffected, no !important */
}
```

Comment the `!important` with what it's overriding so future maintainers understand it. Add the collision to the "Running list of known collisions" table below.

### History — broad reset attempted and rolled back (Pass 5e → 5g)

An earlier version of `bandzoogle-overrides.css` contained a broad reset using `display: revert !important` and `margin: revert !important` on `.page-content` descendants. The intent was to hand cascade back to component CSS rules. In practice the `!important` on the reset beat our own (non-important) component rules — breaking centring on `.section-join__copy` and adding browser-default margins (40px) to blockquotes.

Lesson: `revert !important` is more aggressive than it looks. It hands cascade back to the browser default, not to component CSS. Better to be surgical: one `!important` per affected property.

### Cross-component override placeholder

No cross-component overrides were needed as of May 2026. If a future deployment surfaces one, add it directly to `section-rhythm.css` (for `#usersite-container`-scoped rules) or create a new component-adjacent file rather than using a monolithic overrides file.

---

## Single-product pages (.website-page-single-feature)

- Product pages use a DISTINCT wrapper from the merch store: `.website-page-single-feature`,
  NOT `.website-page-v0-merch-store`. Styling applies to ALL product pages site-wide; drive
  off generic selectors (`select[name^="cart_item[option_"]`, `.add-to-cart`), not per-product.

- **IMPORTANT — product-page card scoping:** BZ gives the product-page card
  `article.store.store-item` with EITHER `.single-image` OR `.multiple-images` depending on how
  many photos the product has. Do NOT scope product-page-only effects to `.single-image` —
  that misses every multi-photo product. The correct discriminator is the single-product
  WRAPPER: `.single-store-item` (also `.store-layout-list` / `.store_item_feature`), present on
  product pages only. Merch grid cards use `.store-layout-grid` / `.store-wrapper` instead.

  To kill the hover bounce + card hairline on ALL product pages while keeping the merch
  grid bounce:
  ```css
  #usersite-container .single-store-item article.store.store-item:hover { transform: none; }
  #usersite-container .single-store-item article.store.store-item { border: none; border-radius: 0; }
  ```
  Specificity (1,2,1)+el beats the generic grid rule `article.store.store-item:hover` (0,3,0)
  because the single ID outranks the class column; no `!important` needed.

- The generic merch-grid bounce is `article.store.store-item:hover { transform: translateY(-3px) }`.
  Its selector is broad enough to also match product-page cards — hence the wrapper scoping
  above is required to exclude them.

---

## BZ add-to-cart button — background-color specificity fight

BZ's Nadia theme sets the button background via two rules:

```css
/* base (1,3,0) */
.not-intro-page #usersite-container .button:not(.button-secondary) {
  background-color: var(--button-color);
  color: hsla(var(--button-accessible-font-color-hsl), .8);
}
/* hover (1,5,0) */
.no-touchevents .not-intro-page #usersite-container .button:not(.button-secondary):hover {
  background-color: var(--button-hover-color);
  color: ...;
}
```

Both set the **longhand** `background-color` (not the shorthand `background`). Shorthand rules
in our bundle did not override them even at equal or higher specificity because longhand always
wins over shorthand at equal specificity.

**Fix:** use the `background-color` longhand in our button rules. Prefix the base rule to
reach (1,4,1)+ and the hover rule with `.no-touchevents` to reach (1,5,3)+, beating BZ on the
element column tiebreak.

**Diagnostic note:** BZ's theme `<link>` is cross-origin (CORS-opaque); `.cssRules` throws in
JS. Diagnose via `getComputedStyle` on the element, inline `style` attribute probes, and
zoomed screenshots — not CSSOM.

---

## BZ cart drawer (section.cart-summary)

### Panel background

BZ locks the cart-summary background with a double-ID + `!important` rule:

```css
#usersite-container .cart-summary#cart-summary {
  background-color: var(--section-background-color) !important;
}
```

Specificity: (2,1,0) with `!important`. A plain `body #usersite-container section.cart-summary`
rule (1,2,2) loses because it is not `!important`.

**Fix:** match the double-ID pattern and add one extra element to win the specificity tiebreak:

```css
#usersite-container section.cart-summary#cart-summary {
  background-color: #0f0f0f !important;  /* (2,1,1) beats BZ's (2,1,0) */
}
```

Within the `!important` layer, specificity decides; our (2,1,1) beats (2,1,0) on the element
column.

### Qty select appearance and the "revert to 1" non-bug

`appearance: none` + a data-URI SVG chevron on the cart qty `<select>` is safe and does not
interfere with BZ's quantity-change handler. A cart item appearing to "revert to 1" on quantity
change is BZ **clamping quantity to available stock** — a 1-stock item cannot be set to 2. This
is correct behaviour, not a styling regression.

### Checkout button specificity

BZ's Nadia hover rule for buttons reaches (1,5,0) inside the cart drawer. Use:

```css
body #usersite-container section.cart-summary .checkout-action a.button.button-full.no-pjax:hover
```

This is (1,5,3) — beats (1,5,0) on the element column. Use `background-color` longhand.

---

## Bandzoogle file IDs ignore the filename slug

File ID `1417814` is referenced in `homepage.css:99` as `04-merch-store.webp` (for
the now-superseded `.section-hero--merch` rule) but actually serves
`gp-arches-guitar.webp` (1920×802) — confirmed by opening the live asset. Curling
the same file ID with a nonsense filename appended returns a byte-identical `303`
redirect to curling it with the "correct" filename:

```
curl -sI https://gypsypistoleros.com/files/1417814/04-merch-store.webp
curl -sI https://gypsypistoleros.com/files/1417814/totally-wrong-name.webp
```

Both come back `HTTP/2 303`, identical headers. Bandzoogle serves purely by file
ID and ignores the human-readable slug entirely.

**Implication:** filenames embedded in Bandzoogle file URLs are comments, not
contracts. A CSS rule can claim a file is one image while BZ actually serves a
different one at that ID, and this class of drift is undetectable from source
review or HTTP inspection — the slug never 404s, never redirects differently,
never reveals itself. The only way to catch it is opening the asset and looking.
Found once, this ID, this session; there is no way to rule out others without
doing the same check for every file ID referenced in the codebase.

---

## Content pasted into a BZ HTML Feature Row sits outside `.page-content`

`.page-content` is our own wrapper class, applied only around content we paste as
an HTML Feature Row. A shared component pasted onto a page like `/merch-store`
still lives inside a `moda-section`, but not inside a `.page-content` div, unless
the specific paste target is one of our own HTML Feature Rows.

The only `.page-content`-scoped typography rule anywhere in the codebase is:

```css
#usersite-container .page-content h1,
#usersite-container .page-content h2,
#usersite-container .page-content h3,
#usersite-container .page-content h4,
#usersite-container .page-content h5,
#usersite-container .page-content h6 {
  text-transform: none;
}
```

(`section-rhythm.css:100-105`). `typography.css`'s global `h1, h2 { text-transform:
uppercase }` sits at specificity (0,0,1) — the rule above is the *only* thing
standing between a heading and forced uppercase. Any shared component pasted
somewhere without a `.page-content` ancestor renders uppercase headings unless it
carries its own `#usersite-container`-scoped override at (1,1,1) or higher.

**Caught on:** the merch join panel (`.section-join__content h2`) — identical
markup rendered uppercase on `/merch-store` and sentence-case on `/home`, purely
from `.page-content` ancestor presence or absence. Fixed at the component,
not the page, by raising `.section-join__content h2` to (1,1,1) and setting
`text-transform: none` directly (commit `715de3389fe1acab5c8d14a7d822c9f4e2ce5c89`).

Audited the rest of the `.page-content`-scoped rules while tracing this: only one
other property category is scoped this way anywhere — `background-color`/
`border-top` on a couple of `::before` pseudo-elements for photo-variant hairline
suppression (not typography, and not reachable from merch's DOM shape regardless).
No `.page-content`-scoped rule anywhere sets `font-family`, `font-size`,
`letter-spacing`, `line-height`, `margin`, or `color`. `text-transform` is
the only one to watch for in future shared components.

---

## `.page-content` blocks are not siblings

Confirmed live on `/shows`: each `.page-content` div sits inside its own
`div.block-interactions`, itself sitting in a *different* `moda-section` than the
one holding the next `.page-content`. Native Bandzoogle widgets (the Shows
calendar, Spotify embeds, etc.) can and do sit in the gaps between them.

`.page-content + .page-content` matches **nothing** on this site. There is no
structural CSS selector that can say "the second `.page-content` block on this
page" — `:nth-of-type` can't either, since each `.page-content` is the only div
of its type within its own singleton wrapper. Any rule depending on adjacency
between two `.page-content` blocks — or between a hero in one block and content
in another — has to target the actual elements by name or by position within
their own container, not by sibling relationship to another `.page-content`.

---

## Page-class scoping alone leaks into the site header and footer

Live pages carry `website-page-<slug>` on `div#page-root.inner-page`, which wraps
the site-wide header and footer as well as the page's own content. Any rule
scoped only by that page class — without also anchoring to `#page-content-wrap`
— will match `moda-section` elements inside the header and footer too, since
they share the same page-class ancestor.

This produced three separate defects in one session:

- Merch's band/hairline rhythm styling the site header and footer.
- Press kit's 1200px content cap narrowing the header and footer.
- Merch's rhythm rules scoped to `.website-page-v0-merch-store` (the draft page
  class) instead of `.website-page-merch-store` (the live one) — a related but
  distinct scoping mistake that meant the rhythm never applied to the live page
  at all.

**Fix pattern:** pair a page-class selector with `#page-content-wrap` as a
direct-child ancestor of the relevant `moda-sections.zoogle-content` container:

```css
#page-root.website-page-X #page-content-wrap > moda-sections.zoogle-content > moda-section
```

---

## `moda-section` padding lives in the shadow DOM

`moda-section` itself computes `padding: 0`, which is why this doesn't show up
inspecting the host element directly. The real padding lives on its shadow-DOM
`div[part="content"]`, driven by Bandzoogle's own `--section-block-padding`
custom property, plus `section.feature` (BZ's wrapper around each pasted block)
carrying its own 10px on top. Both are reachable from outside the shadow root via
`::part(content)`.

This is why band colours did not reach their hairlines at `.page-content` seams
until zeroed — confirmed live, a 75px gap dropped to 11px (residual = section
.feature's 10px plus rounding) once `::part(content)`'s `padding-block` was
zeroed:

```css
moda-section:has(.page-content)::part(content) {
  padding-block-end: 0 !important;
}
```

`padding-block-start` needs a hero-safety exclusion: the hero's negative-margin
pull-up (`margin-top: -107px`) is calibrated against the position of this
padding's inner edge, and removing it shifts the hero out of position. See the
full reasoning and the `:not(:has(.section-hero)):not(:has(.section-page-hero))`
guard in `section-rhythm.css`. `padding-block-end` carries no such risk anywhere
— the hero is always first in its block, never last.

---

## Divider system, current state

Four shared tokens (`variables.css`):

- `--rhythm-band-dark` (`#000000`), `--rhythm-band-light` (`#0f0f0f`) — the two
  band colours, shared across all three independent band mechanisms
  (`.page-content > section`, merch `moda-section`, `.video-album`).
- `--rhythm-hairline` (`rgba(255, 255, 255, 0.2)`) — translucent, for dividers
  drawn over a flat band.
- `--rhythm-hairline-solid` (`#333333`) — opaque, for dividers drawn over a
  photograph. The translucent value composites with whatever sits behind it —
  fine over a flat band, inconsistent over a photo, where it varies in colour
  along its length and reads as different weights top to bottom.

Hairlines are drawn **top-only**, by the section below each boundary — never
`border-bottom`. Photo variants (`.section-join--photo`, `.section-watch--photo`)
zero their own structural `::before`, so they can't draw their own top hairline
via the normal mechanism and need an explicit `border-top` instead — but their
bottom edge is already served by the *next* section's top hairline, so a
`border-bottom` on a photo variant always doubles into a 2px line. Exception: a
photo section that is *last* in its `.page-content` block has no following
section to supply that line, and needs its own `border-bottom` added back.

---

## Two dependencies that live outside the repo and won't announce themselves

- `/shows`' black-first section rhythm depends on Bandzoogle's native Calendar
  Feature widget existing in the gap between the page's two `.page-content`
  blocks. If that feature row is ever removed from the live Bandzoogle page, the
  page loses its black-first section entirely and nothing else picks it up
  automatically.
- Five native-block band parities are hand-assigned by `nth-child` position, not
  computed: `/home` block 2, `/press-kit-epk` blocks 2 through 5. The visual
  sequence runs across both `.page-content` sections and native Bandzoogle
  blocks in one continuous alternation, which CSS cannot compute across two
  structurally different mechanisms. Adding, removing, or reordering a
  Bandzoogle feature row on either page shifts these positions and requires
  reassigning the `nth-child` targets and colours by hand.

---

## Verification discipline: always cache-bust before measuring

The deployed bundle is fetched by the live site via a `<link rel="stylesheet"
href=".../v0-bundle.css">`. Browsers (and some measurement tooling) will happily
serve a cached copy of that file even after a fresh deploy. Always cache-bust
before trusting a computed-style measurement:

```js
const old = document.querySelector('link[rel=stylesheet][href*="v0-bundle.css"]');
const fresh = old.cloneNode();
fresh.href += (fresh.href.includes('?') ? '&' : '?') + 'cb=' + Date.now();
await new Promise(r => fresh.onload = r);
old.remove();
```

A measurement taken without this during this session read a stale bundle and
reported an h2 `margin-bottom` of 20px that had never existed in any version of
the CSS — full git history of both competing rules was searched with no result,
and no `--space-*` token even equals 20px. It triggered an extended, ultimately
fruitless trace before a stale cache became the likely explanation.

---

## Hero lever value: -107px, not -286px

`.section-hero`'s `margin-top` is `-107px` in the current source
(`homepage.css`), not `-286px`. The value changed three times: `-250px` →
`-286px` (`b37bcaf`) → `-324px` (`d51134a`, absorbing a taller logo) → `-107px`
(`50746ce`, "Make header an overlay on hero pages" — once the header became
`position: absolute`, logo height no longer needed absorbing into the margin at
all). `homepage.css`'s inline comment has tracked this correctly at every step.
A `-286px` figure cited from outside this document during this session did not
match any current or historical version of this file (`docs/css-quirks.md` has
never recorded this value at any point in its git history) or of the CSS itself
past `d51134a` — the wrong value came from an external note, not from drift in
this file.

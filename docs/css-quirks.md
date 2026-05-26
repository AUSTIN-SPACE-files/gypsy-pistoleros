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

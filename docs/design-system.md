# Gypsy Pistoleros — Design System

**Canonical reference for all pages built on this site.**
**Source: `staging/cult-membership.html` · Built by AUSTIN_SPACE — May 2026**

---

## 1. Overview

This design system defines the visual language established on the Cult of the Pistoleros membership page. The aesthetic is gothic-carnival glam-punk: deep black backgrounds, a neon palette drawn from the Dark Faerie Tales vinyl artwork, and a two-font typographic system — Georgia for all display and heading roles, Inter for all body copy and UI text. There is no italic editorial voice and no premium gold in the design system. Every section is textured, layered, and framed — nothing is bare.

Every new page built on this system must follow the same structural rhythm: hero → alternating section archetypes (A, B, C). Every section heading uses the canonical `.section-heading--framed` block. Every CTA button follows the neon pink primary / neon green secondary hierarchy established in Pass 9d. Decorative icon accents on framing hairlines should vary in icon and colour per section so no two adjacent sections feel identical. Pages close on Archetype A, B, or C — there is no inverted closer archetype in this system. If in doubt, look at `cult-membership.html` — it is the canonical implementation.

---

## 2. Design Tokens — CSS Variables

Source of truth: [`css/variables.css`](../css/variables.css)

```css
/* Gypsy Pistoleros — variables.css */
/* Part of the AUSTIN_SPACE build — May 2026 */
/* DO NOT edit directly in Bandzoogle — always edit here first */

:root {
  /* ==========================================
     BACKGROUNDS
     ========================================== */
  --color-bg-primary: #0a0a0a;     /* Page base, Archetype A/C sections, solid card bodies */
  --color-bg-secondary: #111111;   /* Secondary surface; used by .section--alt modifier */
  --color-bg-elevated: #0f0f0f;    /* Archetype B lifted panel sections (press section) */

  /* ==========================================
     ACCENTS — pulled from Dark Faerie Tales vinyl artwork
     ========================================== */

  /* Neon green with black splatter vinyl */
  --color-accent-green: #39ff14;         /* Decorative hairline icons; neon brand colour */
  --color-accent-green-muted: #1a7a0a;

  /* Neon purple with black splatter vinyl */
  --color-accent-purple: #bf00ff;        /* Text links and nav ONLY — never on buttons */
  --color-accent-purple-muted: #6b0099;

  /* Blood red — gothic secondary */
  --color-accent-red: #8b0000;           /* Gothic secondary; hover/danger states */
  --color-accent-red-bright: #cc0000;

  /* Gold — retained for yellow star rating fill only */
  --color-accent-gold: #c9a84c;          /* RETIRED for design-system roles. Retained for the yellow
                                            star rating fill only (functional/semantic, not decorative).
                                            Do not use for new design work. */

  /* Silver — tier indicator and premium accents */
  --color-silver: #c0c0c0;              /* Tier indicator, premium accents, comparison table highlight column, gold-tinted-border replacement */
  --color-silver-dark: #909090;         /* Silver hover state */

  /* Electric blue — high saturation neon accent; use for decorative hairline icons */
  --color-accent-blue: #00bfff;         /* Decorative hairline icon accent */

  /* Hot pink — decorative accent on hairlines and hero divider */
  --color-accent-pink: #ff2d92;         /* Decorative hairline icon accent */

  /* ==========================================
     TEXT
     ========================================== */
  --color-text-primary: #e8e8e0;      /* Body text, titles — off-white, not harsh */
  --color-text-secondary: #a0a090;    /* Muted text, taglines, fine print */
  --color-text-accent: #39ff14;       /* Green for links/highlights */

  /* ==========================================
     BORDERS
     ========================================== */
  --color-border-subtle: rgba(255, 255, 255, 0.08);
  --color-border-accent: rgba(57, 255, 20, 0.3);

  /* ==========================================
     TYPOGRAPHY
     ========================================== */

  /* ---- Two-font system ---- */

  /* Display — Georgia (all heading and display roles at any size) */
  --font-display: Georgia, 'Times New Roman', serif;

  /* Body / UI — Inter (all body copy, taglines, UI text) */
  --font-body: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  --font-mono: 'Courier New', monospace;

  /* Scale */
  --text-xs:   0.75rem;    /*  12px */
  --text-sm:   0.875rem;   /*  14px */
  --text-base: 1rem;       /*  16px */
  --text-lg:   1.125rem;   /*  18px */
  --text-xl:   1.25rem;    /*  20px */
  --text-2xl:  1.5rem;     /*  24px */
  --text-3xl:  1.875rem;   /*  30px */
  --text-4xl:  2.25rem;    /*  36px */
  --text-5xl:  3rem;       /*  48px */
  --text-6xl:  3.75rem;    /*  60px */

  /* ==========================================
     SPACING & LAYOUT
     ========================================== */
  --space-1:  0.25rem;
  --space-2:  0.5rem;
  --space-3:  0.75rem;
  --space-4:  1rem;
  --space-6:  1.5rem;
  --space-8:  2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;

  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;

  --max-width:     1200px;
  --content-width: 800px;
}
```

**Convenience aliases** — defined inline in `cult-membership.html`, required for `var(--color-text-muted)` to resolve:

```css
:root {
  --color-text-muted: var(--color-text-secondary); /* used by section-tagline, support copy */
}
```

---

## 3. Typography

### Display — Georgia

Used for:
- Hero titles
- Section heading titles (`.section-heading__title`)
- Section heading labels (`.section-heading__label`) — Georgia tracked uppercase, replacing the previous Cinzel role for labels
- Comparison table tier names (`.tier-name`) and benefit titles (`.benefit-title`) — Georgia tracked uppercase
- FAQ question rows

Standard sizes: `2.5rem` (40px) for section titles, `clamp(2.5rem, 9vw, 5rem)` (40px–80px) for hero, `2rem` (32px) for sub-section / card titles.
Colour: always `var(--color-text-primary)` (#e8e8e0) unless overridden by silver tier indicators.
Text-transform: uppercase where tracked.

**Georgia-compensated scale:** Georgia has a smaller visual presence than the retired Bleeding Cowboys at equivalent pixel sizes. Size values across the system have been bumped to maintain the previous visual hierarchy:
- Hero title: `clamp(2.5rem, 9vw, 5rem)` (40px–80px)
- Section heading title: `2.5rem` (40px)
- Sub-section / card title: `2rem` (32px)

### Body — Inter

Used for:
- All body copy (default 16px, line-height 1.7)
- Section taglines (`.section-heading__tagline`) — previously Cormorant italic, now Inter regular
- Press review quotes (`.press-quote`) — previously Cormorant italic, now Inter regular
- Comparison table benefit descriptions (`.benefit-desc`) — previously Cormorant italic, now Inter regular
- Benefit descriptions, UI labels, button text, fine print

**Inter is never italicised.** Previous Cormorant italic roles (taglines, pull quotes, press review quotes, comparison table benefit descriptions) now render in Inter regular. `font-style: normal` always.

**Exception — quote surfaces.** Italic is restored on quote contexts as of May 2026. Pull quotes, blockquotes, and press review quotes render in Inter italic. Body prose, taglines, descriptions, and loading states remain upright. The distinction: italic signals quoted/cited material, not editorial voice.

### Secondary heading and nav typography (May 2026 lock)

The two-font system distributes heading and nav typography across both tiers:

- **h1, h2** — Georgia. Hero and primary section headings (display tier, see locked scale in §4).
- **h3** — Georgia, tracked uppercase. Display tier, sub-section role. `font-size: clamp(1.125rem, 2.5vw, 1.875rem)` (18–30px). `letter-spacing: 0.06em`. `text-transform: uppercase`. `font-weight: 600`.
- **h4** — Inter, tracked uppercase. Label tier — functional sub-heading. `font-size: 1.25rem` (20px). `letter-spacing: 0.12em`. `text-transform: uppercase`. `font-weight: 600`.
- **h5** — Inter, tracked uppercase. Label tier — smallest label. `font-size: 1.125rem` (18px). `letter-spacing: 0.12em`. `text-transform: uppercase`. `font-weight: 400`.
- **h6** — Inter regular weight 600. Functional sub-label. `font-size: 1rem` (16px). `letter-spacing: 0.05em`. `text-transform: uppercase`.
- **Nav links** — Inter, tracked uppercase, UI chrome. `font-size: 1.5rem` (24px) desktop, `1.125rem` (18px) mobile minimum. `letter-spacing: 0.12em`. `text-transform: uppercase`. `font-weight: 400`. Colour: `var(--color-text-primary)`. Hover: `var(--color-accent-purple)`.

Semantic break: h1–h3 are display headings (Georgia, hierarchical typography); h4–h6 and nav are functional labels (Inter, tracked uppercase).

### Font loading

```css
/* No self-hosted fonts — Georgia is a web-safe system font, no @font-face required */

/* Inter — Google Fonts */
/* Add to <head> and to Bandzoogle › Pages › Site-wide Settings › Headers & Metatags */
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
```

---

## 4. Section Heading Pattern

> **Locked scale (May 2026).** Hero, section heading, and sub-section sizes were tuned for Georgia and verified visually on the homepage. Do not adjust without an explicit design decision.
>
> - Hero title: `clamp(2.5rem, 9vw, 5rem)` (40px–80px)
> - Section heading title: `2.5rem` (40px)
> - Sub-section / card title: `2rem` (32px)
> - Hero content container: `var(--max-width)` (1200px) — not `var(--content-width)`

Every section uses the same canonical heading block. Do not deviate.

### HTML structure

```html
<div class="section-heading section-heading--framed">
  <p class="section-heading__label">[GEORGIA TRACKED UPPERCASE LABEL]</p>
  <h2 class="section-heading__title">[GEORGIA TITLE]</h2>
  <p class="section-heading__tagline">[Inter regular tagline]</p>
</div>
```

For left-aligned headings (split-copy sections only), add `.section-heading--left`:

```html
<div class="section-heading section-heading--left section-heading--framed">
```

### CSS

```css
.section-heading {
  text-align: center;
}

.section-heading--left {
  text-align: left;
}

/* --framed: adds hairline borders above __label and below __tagline,
   hugging text width via display: inline-block */
.section-heading--framed .section-heading__label {
  display: inline-block;
  border-top: 1px solid rgba(160, 160, 144, 0.4);
  padding-top: 16px;
  position: relative;
}

.section-heading--framed .section-heading__tagline {
  display: inline-block;
  border-bottom: 1px solid rgba(160, 160, 144, 0.4);
  padding-bottom: 16px;
  position: relative;
}

.section-heading__label {
  display: block;
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: 12px;
  margin-top: 0;
  position: relative;
  z-index: 2;
  /* 2px black stroke — knocks out background texture behind the label */
  text-shadow:
    -1px -1px 0 var(--color-bg-primary),
     1px -1px 0 var(--color-bg-primary),
    -1px  1px 0 var(--color-bg-primary),
     1px  1px 0 var(--color-bg-primary),
     0   -2px 0 var(--color-bg-primary),
     0    2px 0 var(--color-bg-primary),
    -2px  0   0 var(--color-bg-primary),
     2px  0   0 var(--color-bg-primary);
}

.section-heading__title {
  font-family: var(--font-display);
  font-size: 2.5rem;          /* 40px — standard section title (Georgia-compensated scale, locked) */
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-primary);
  line-height: 1.0;
  margin-bottom: 8px;
  margin-top: 0;
  position: relative;
  z-index: 1;
}

.section-heading__tagline {
  font-family: var(--font-body);
  font-style: normal;
  font-size: 18px;
  font-weight: 400;
  color: var(--color-text-muted);
  line-height: 1.7;
  margin-top: 0;
  margin-bottom: 48px;
  position: relative;
  z-index: 2;
  /* Same 2px stroke as __label — maintains legibility over texture */
  text-shadow:
    -1px -1px 0 var(--color-bg-primary),
     1px -1px 0 var(--color-bg-primary),
    -1px  1px 0 var(--color-bg-primary),
     1px  1px 0 var(--color-bg-primary),
     0   -2px 0 var(--color-bg-primary),
     0    2px 0 var(--color-bg-primary),
    -2px  0   0 var(--color-bg-primary),
     2px  0   0 var(--color-bg-primary);
}

/* Overrides typography.css `p:last-child { margin-bottom: 0 }` (specificity 0-1-1) */
.section-heading .section-heading__tagline {
  margin-bottom: 48px;
}
```

### Behaviour notes

- Default alignment is centred. The `.section-heading--left` modifier is currently used only on the JOIN THE HIGH ORDER split-copy section.
- The `--framed` modifier adds 1px hairline borders above the label and below the tagline. Because both elements are `display: inline-block`, the border hugs the text width rather than stretching full-width.
- Decorative icons are placed at the outer ends of these hairlines using `.section-heading__icon` position classes (see section 7).
- The `text-shadow` stroke on `__label` and `__tagline` is a legibility-over-textured-backgrounds device. Archetype A and B sections sit type over tiled icon patterns; the 2px black stroke knocks out the pattern behind label and tagline text. This is not font-specific — it applies regardless of which display font is in use.

---

## 5. Section Archetypes

Pages alternate archetypes to create rhythm. No two adjacent sections should be the same archetype. This is a three-archetype system: A, B, C.

### Archetype A — Textured section, solid cards

```css
/* Section: bg-primary with tiled icon pattern via ::before */
.section--support,
.section--faq {
  position: relative;
  overflow: hidden;
  clip-path: inset(0);
  background: var(--color-bg-primary);
}

/* The ::before pseudo-element carries the icon texture.
   Example: cross.svg on WHY YOUR SUPPORT MATTERS */
.section--support::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  /* 300vw × 300vw — after 45° rotation, half-diagonal ≈ 212vw,
     which exceeds any viewport width at any reasonable aspect ratio */
  width: 300vw;
  height: 300vw;
  transform: translate(-50%, -50%) rotate(-45deg);
  background-image: url('assets/icon-patterns/cross.svg');
  background-repeat: repeat;
  background-size: 80px auto;
  opacity: 0.025;
  pointer-events: none;
  z-index: 0;
  /* Normalises any source SVG fill to pure white before opacity is applied */
  filter: brightness(0) invert(1);
}

/* All direct children lifted above the texture */
.section--support > * {
  position: relative;
  z-index: 1;
}

/* Cards inside Archetype A sections: solid bg-primary, silver-tinted border, no texture */
.support-benefit {
  background: var(--color-bg-primary);
  border: 1px solid rgba(192, 192, 192, 0.3);
  border-radius: var(--radius-lg);
}
```

**Currently used on:** WHY YOUR SUPPORT MATTERS (cross.svg), YOUR QUESTIONS (eye.svg)

---

### Archetype B — Lifted panel section, textured cards

```css
/* Section: bg-elevated — no texture on the section itself */
.section--press {
  background: var(--color-bg-elevated);  /* #0f0f0f */
}

/* Cards: bg-primary with icon pattern inside the card at higher opacity */
.press-card-wrap {
  background: var(--color-bg-primary);
  border: 1px solid rgba(192, 192, 192, 0.2);
  border-left: 3px solid var(--color-silver);
  border-radius: var(--radius-lg);
  padding: 32px 28px;
  position: relative;
  overflow: hidden;
}

.press-card-wrap::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background-repeat: repeat;
  background-size: 80px auto;
  transform: rotate(-45deg);
  opacity: 0.05;       /* Higher than Archetype A section (0.025) — card is smaller */
  pointer-events: none;
  z-index: 0;
  filter: brightness(0) invert(1);
}

/* Per-card icon via modifier class */
.press-card-wrap--classic-rock::before { background-image: url('assets/icon-patterns/skull.svg'); }
.press-card-wrap--powerplay::before    { background-image: url('assets/icon-patterns/crown.svg'); }
.press-card-wrap--punksite::before     { background-image: url('assets/icon-patterns/mask.svg'); }

/* Lift card content above texture */
.press-card-wrap > * {
  position: relative;
  z-index: 1;
}
```

**Currently used on:** WHAT THEY'RE SAYING (skull/crown/mask icons per card)

---

### Archetype C — Solid darkest section

```css
/* No texture, no cards. Content sits directly on the page base. */
.section--join,
.section--privileges {
  background: var(--color-bg-primary);
}
```

**Currently used on:** JOIN THE HIGH ORDER (two-column 40/60 image + text), HIGH ORDER PRIVILEGES (comparison table)

---

## 6. Texture Pattern System

Icon patterns are the primary texture element across sections and cards.

### Mechanics

- SVG files live in `staging/assets/icon-patterns/` — each a 64×64 viewBox path, fill `#e8e8e0`, Font Awesome solid path data
- Applied via `::before` pseudo-element using `background-image`, `background-repeat: repeat`, `background-size: 80px auto`
- The pseudo-element is rotated -45deg to give the pattern a diagonal orientation
- `filter: brightness(0) invert(1)` normalises any source SVG fill to pure white regardless of the original fill colour, before opacity is applied
- Section-level textures (`opacity: 0.025`) are subtler than card-level textures (`opacity: 0.05`) — the card's smaller bounding box means the pattern reads more clearly at lower viewport sizes
- Content above the texture sits on `z-index: 1`; the texture pseudo-element sits on `z-index: 0`

### Canonical pattern block (section level)

```css
.section--[name] {
  position: relative;
  overflow: hidden;
  clip-path: inset(0);  /* reliably clips the rotated ::before to section bounds */
  background: var(--color-bg-primary);
}

.section--[name]::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  /* 300vw guarantees edge-to-edge coverage after -45deg rotation.
     Half-diagonal of a 300vw square ≈ 212vw — exceeds any section on any display. */
  width: 300vw;
  height: 300vw;
  transform: translate(-50%, -50%) rotate(-45deg);
  background-image: url('assets/icon-patterns/[name].svg');
  background-repeat: repeat;
  background-size: 80px auto;
  opacity: 0.025;
  pointer-events: none;
  z-index: 0;
  filter: brightness(0) invert(1);
}

.section--[name] > * {
  position: relative;
  z-index: 1;
}
```

### Card-level pattern block

```css
.card-wrap::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background-image: url('assets/icon-patterns/[name].svg');
  background-repeat: repeat;
  background-size: 80px auto;
  transform: rotate(-45deg);
  opacity: 0.05;
  pointer-events: none;
  z-index: 0;
  filter: brightness(0) invert(1);
}
```

### Available icons

| File | Description |
|---|---|
| `skull.svg` | Gothic skull — Classic Rock press card |
| `crown.svg` | Crown — Powerplay press card |
| `mask.svg` | Masquerade mask — Punksite press card |
| `cross.svg` | Gothic cross — WHY YOUR SUPPORT MATTERS section |
| `fire.svg` | Flame — decorative hairline icon |
| `feather.svg` | Quill feather — WHAT THEY'RE SAYING hairline; hero divider |
| `spider.svg` | Spider — JOIN THE HIGH ORDER hairline; YOUR QUESTIONS hairline |
| `eye.svg` | Eye — YOUR QUESTIONS section texture; WHY YOUR SUPPORT MATTERS hairline |

---

## 7. Decorative Icon Accents on Hairlines

Decorative icons sit at the outer ends of the framing hairlines (the `border-top` on `__label` and `border-bottom` on `__tagline`). They use absolute positioning relative to the `display: inline-block` element, so they land at the ends of the text-width hairline rather than at the full section edge. The available decorative accent palette is: **silver, neon green, neon pink, electric blue**. Gold is not used as a decorative accent colour.

### Icon position classes

```css
.section-heading__icon {
  position: absolute;
  font-size: 12px;
  line-height: 1;
}

.section-heading__icon--top-left    { top: -6px;    left: 0;  }
.section-heading__icon--top-right   { top: -6px;    right: 0; }
.section-heading__icon--bottom-left { bottom: -6px; left: 0;  }
.section-heading__icon--bottom-right{ bottom: -6px; right: 0; }
```

### The four pair patterns

| Pattern | Top icon position | Bottom icon position |
|---|---|---|
| 1 | `--top-left` | `--bottom-right` |
| 2 | `--top-right` | `--bottom-left` |
| 3 | `--top-right` | `--bottom-right` |
| 4 | `--top-left` | `--bottom-left` |

### HTML example — Pattern 2 (top right + bottom left)

```html
<div class="section-heading section-heading--framed">
  <span class="section-heading__label">
    Exclusive Membership
    <i class="fa-solid fa-skull section-heading__icon section-heading__icon--top-right"
       style="color: var(--color-accent-blue);"></i>
  </span>
  <h2 class="section-heading__title">Join The High Order</h2>
  <p class="section-heading__tagline">
    Where the real magic happens.
    <i class="fa-solid fa-spider section-heading__icon section-heading__icon--bottom-left"
       style="color: var(--color-accent-green);"></i>
  </p>
</div>
```

### Current section assignments

| Section | Pattern | Top icon | Bottom icon |
|---|---|---|---|
| JOIN THE HIGH ORDER | 2 | blue skull (`--top-right`) | green spider (`--bottom-left`) |
| WHY YOUR SUPPORT MATTERS | 1 | pink crown (`--top-left`) | blue eye (`--bottom-right`) |
| HIGH ORDER PRIVILEGES | 3 | green fire (`--top-right`) | pink cross (`--bottom-right`) |
| WHAT THEY'RE SAYING | 2 | blue feather (`--top-right`) | green star (`--bottom-left`) |
| YOUR QUESTIONS | 4 | pink spider (`--top-left`) | blue crown (`--bottom-left`) |

### Hero divider exception

The hero EST. MMXXVI divider is a different component — a horizontal flex row with a label in the centre and icon + line on each side. Icons at the outer ends use separate classes, not the `section-heading__icon` system:

```css
.hero-divider__icon-left  { color: var(--color-accent-green); font-size: 14px; flex-shrink: 0; }
.hero-divider__icon-right { color: var(--color-accent-pink);  font-size: 14px; flex-shrink: 0; }
```

```html
<div class="hero-divider-wrap">
  <i class="fa-solid fa-star hero-divider__icon-left"></i>
  <span class="hero-divider__line"></span>
  <span class="hero-divider-label">Est. MMXXVI</span>
  <span class="hero-divider__line"></span>
  <i class="fa-solid fa-feather hero-divider__icon-right"></i>
</div>
```

Green star on the left, pink feather on the right.

---

## 8. Button Hierarchy

> **Current:** Flat buttons with 2px black border, colour-shift hover. No shadow, no transform. The previous chunky 3D shadow pattern (Pass 6h/6i) was retired. Text links and nav use `--color-accent-purple` — never on buttons.

Two button types. All use the `<wa-button>` Web Awesome component via the `variant` attribute.

### Primary — Neon pink (variant="brand")

Used for commitment/conversion actions: JOIN THE CULT (hero), JOIN THE HIGH ORDER, BUY / STREAM, HEAR DARK FAERIE TALES, etc.

```css
wa-button[variant="brand"]::part(base) {
  background-color: var(--color-accent-pink);   /* #ff2d92 */
  color: #ffffff;
  border: 2px solid #000;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.05em;
  transition: background-color 0.15s ease;
}

wa-button[variant="brand"]:hover::part(base),
wa-button[variant="brand"]:active::part(base) {
  background-color: var(--color-accent-pink-muted);   /* #d12579 — ~18% darker */
}
```

HTML pattern:
```html
<wa-button variant="brand" size="large">
  <i class="fa-thin fa-crown" slot="prefix"></i>
  <span>JOIN THE CULT</span>
</wa-button>
```

---

### Secondary — Neon green (variant="neutral")

Used for discovery/explore actions: SEE TOUR DATES, DISCOVER WHAT'S INCLUDED, Or join The High Order, etc.

```css
wa-button[variant="neutral"]::part(base) {
  background-color: var(--color-accent-green);   /* #39ff14 */
  color: #000000;
  border: 2px solid #000;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.05em;
  transition: background-color 0.15s ease;
}

wa-button[variant="neutral"]:hover::part(base),
wa-button[variant="neutral"]:active::part(base) {
  background-color: var(--color-accent-green-dark);   /* #2dcc10 — ~20% darker */
}
```

HTML pattern:
```html
<wa-button variant="neutral" size="medium">
  <span>DISCOVER WHAT'S INCLUDED</span>
  <i class="fa-thin fa-arrow-right" slot="suffix"></i>
</wa-button>
```

---

*(The previous inverted black-on-gold variant, used exclusively inside `.section--final`, is retired alongside Archetype D.)*

---

## 9. Card Patterns

### Press review card (Archetype B)

```css
.press-card-wrap {
  background: var(--color-bg-primary);
  border: 1px solid rgba(192, 192, 192, 0.2);
  border-left: 3px solid var(--color-silver);  /* silver accent bar */
  border-radius: var(--radius-lg);
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  overflow: hidden;
}

/* Tiled icon texture inside the card */
.press-card-wrap::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background-repeat: repeat;
  background-size: 80px auto;
  transform: rotate(-45deg);
  opacity: 0.05;
  pointer-events: none;
  z-index: 0;
  filter: brightness(0) invert(1);
}

/* Per-card icon assignment via modifier class */
.press-card-wrap--classic-rock::before { background-image: url('assets/icon-patterns/skull.svg'); }
.press-card-wrap--powerplay::before    { background-image: url('assets/icon-patterns/crown.svg'); }
.press-card-wrap--punksite::before     { background-image: url('assets/icon-patterns/mask.svg'); }

.press-card-wrap > * { position: relative; z-index: 1; }

.press-publication {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-primary);
  text-align: center;
  margin: 8px 0 12px;
}

.press-quote {
  font-family: var(--font-body);
  font-style: normal;
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

.press-score {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--color-text-primary);
  margin: 0;
  text-align: center;
}

/* Star rating row */
.fa-stars { display: flex; gap: 0.3rem; justify-content: center; }
/* Yellow star fill — functional rating colour, retained gold. Not the retired design-system gold. */
.fa-stars .fa-star--on  { color: var(--color-accent-gold); }
/* Dim off-state matches the on-state hue for visual consistency — same functional/semantic rationale. */
.fa-stars .fa-star--off { color: rgba(201, 168, 76, 0.2); }
```

HTML pattern:
```html
<div class="press-card-wrap press-card-wrap--classic-rock">
  <p class="press-publication">Classic Rock</p>
  <p class="press-quote">"A gothic carnival of glam-punk riffs…"</p>
  <div class="fa-stars">
    <i class="fa-solid fa-star fa-star--on"></i>
    <i class="fa-solid fa-star fa-star--on"></i>
    <i class="fa-solid fa-star fa-star--on"></i>
    <i class="fa-solid fa-star fa-star--on"></i>
    <i class="fa-solid fa-star fa-star--off"></i>
  </div>
  <p class="press-score">8/10</p>
</div>
```

---

### Support benefit card (Archetype A)

```css
.support-benefit {
  background: var(--color-bg-primary);
  border: 1px solid rgba(192, 192, 192, 0.3);
  border-radius: 8px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 400;
  color: var(--color-text-muted);
  line-height: 1.8;
}

.support-benefit i {
  font-size: 22px;
  color: var(--color-silver);
  flex-shrink: 0;
}
```

No hover state (non-interactive). No texture overlay.

HTML pattern:
```html
<div class="support-benefit">
  <i class="fa-thin fa-music"></i>
  <span>Produce the music you love</span>
</div>
```

---

### FAQ accordion card

Uses `<wa-details>` Web Awesome component.

```css
wa-details.faq-item::part(base) {
  background: var(--color-bg-primary);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 12px 20px;
  transition: border-color 0.2s ease, background 0.2s ease;
}

wa-details.faq-item:hover::part(base) {
  border-color: rgba(192, 192, 192, 0.3);
  background: var(--color-bg-primary);
}

/* Question row: Georgia tracked uppercase */
wa-details.faq-item::part(header),
wa-details.faq-item::part(summary) {
  font-family: var(--font-display);
  font-size: 14px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-primary);
}

.faq-summary {
  display: flex;
  align-items: center;
  gap: 16px;
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-primary);
}

.faq-icon {
  color: var(--color-silver);
  font-size: 18px;
  flex-shrink: 0;
}

/* Chevron turns silver on hover */
wa-details.faq-item:hover::part(expand-icon),
wa-details.faq-item:hover::part(summary-icon) {
  color: var(--color-silver);
}

wa-details.faq-item::part(content),
wa-details.faq-item::part(body) {
  padding-bottom: var(--space-4);
}

/* Answer body: Inter, muted, comfortable reading */
wa-details.faq-item p {
  color: var(--color-text-secondary);
  line-height: 1.8;
}
```

HTML pattern:
```html
<wa-details class="faq-item">
  <span slot="summary" class="faq-summary">
    <i class="fa-solid fa-tag faq-icon"></i>
    How Much Does It Cost?
  </span>
  <p>£5 per month, billed monthly…</p>
</wa-details>
```

---

## 10. Comparison Table

Used on HIGH ORDER PRIVILEGES (Archetype C section).

### HTML structure

```html
<div class="comparison-table-outer">
  <div class="comparison-table-wrap">
    <table class="comparison-table">
      <thead>
        <tr>
          <th class="comparison-col--benefit"></th>
          <th class="comparison-col--chosen">
            <span class="tier-name">THE CHOSEN</span>
            <span class="tier-price">£2/month</span>
          </th>
          <th class="comparison-col--high-order">
            <span class="tier-name">THE HIGH ORDER</span>
            <span class="tier-price">£5/month</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="comparison-benefit">
            <div class="benefit-cell">
              <i class="fa-solid fa-film benefit-icon"></i>
              <div class="benefit-text">
                <span class="benefit-title">EXCLUSIVE VIDEO UPDATES</span>
                <span class="benefit-desc">Monthly update video from the band — the journey, unfiltered</span>
              </div>
            </div>
          </td>
          <td class="comparison-tick">
            <i class="fa-solid fa-check" style="color: var(--color-silver); font-size: 18px;"></i>
          </td>
          <td class="comparison-tick comparison-tick--high-order">
            <i class="fa-solid fa-check" style="color: var(--color-silver); font-size: 18px;"></i>
          </td>
        </tr>

        <!-- CTA row at the bottom -->
        <tr class="comparison-cta-row">
          <td></td>
          <td>
            <wa-button variant="neutral" size="medium">
              <span>JOIN THE CHOSEN</span>
            </wa-button>
          </td>
          <td class="comparison-tick--high-order">
            <wa-button variant="brand" size="medium">
              <i class="fa-solid fa-crown" slot="prefix"></i>
              <span>JOIN THE HIGH ORDER</span>
            </wa-button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

### CSS

```css
.comparison-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.comparison-col--benefit   { width: 60%; }
.comparison-col--chosen,
.comparison-col--high-order {
  text-align: center;
  width: 20%;
  min-width: 110px;
}

/* High Order column: silver top border + subtle silver wash */
.comparison-col--high-order {
  border-top: 2px solid var(--color-silver);
  background-color: rgba(192, 192, 192, 0.05);
}

.comparison-table thead th {
  padding: 16px 8px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  vertical-align: bottom;
}

/* Tier header labels */
.tier-name {
  display: block;
  font-family: var(--font-display);
  font-size: var(--text-sm);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
.comparison-col--chosen .tier-name    { color: var(--color-text-secondary); }
.comparison-col--high-order .tier-name { color: var(--color-silver); }

.tier-price {
  display: block;
  font-family: var(--font-body);
  font-style: normal;
  font-size: var(--text-base);
  margin-top: var(--space-2);
}
.comparison-col--chosen .tier-price    { color: var(--color-text-secondary); }
.comparison-col--high-order .tier-price { color: var(--color-silver); }

/* Body rows */
.comparison-table tbody tr {
  border-bottom: 1px solid rgba(255,255,255,0.06);
  transition: background 0.15s ease;
}
.comparison-table tbody tr:hover { background: rgba(255,255,255,0.02); }

/* Benefit cell: icon + text stack */
.comparison-benefit { padding: 12px 24px; }

.benefit-cell {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 4px 0;
}

.benefit-icon {
  font-size: 26px;
  color: var(--color-silver);
  flex-shrink: 0;
  margin-top: 2px;
}

.benefit-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Georgia tracked uppercase for benefit title */
.benefit-title {
  font-family: var(--font-display);
  font-size: 11px;
  letter-spacing: 0.15em;
  color: var(--color-silver);
}

/* Inter regular for benefit description */
.benefit-desc {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* Tick/cross cells */
.comparison-tick {
  text-align: center;
  vertical-align: middle;
  padding: 12px 8px;
}
.comparison-tick--high-order { background-color: rgba(192, 192, 192, 0.05); }

.comparison-tick .fa-check { color: var(--color-silver); font-size: 18px; }
.comparison-tick .fa-xmark { color: var(--color-text-secondary); font-size: 18px; }

/* CTA row */
.comparison-cta-row td {
  padding: 20px 8px;
  text-align: center;
  vertical-align: middle;
}
tr.comparison-cta-row:hover { background: transparent !important; }

/* Mobile: fade right edge to hint at horizontal scroll */
@media (max-width: 600px) {
  .comparison-table-outer::after {
    content: '';
    position: absolute;
    top: 0; right: 0; bottom: 0;
    width: 48px;
    background: linear-gradient(to right, transparent, var(--color-bg-primary));
    pointer-events: none;
    z-index: 1;
  }
}
```

---

## 11. File and Asset Structure

```
gypsy-pistoleros/
│
├── css/
│   ├── variables.css               ← Design tokens (source of truth)
│   ├── gypsy-pistoleros.css        ← Master import file (paste into Bandzoogle)
│   └── components/
│       ├── typography.css          ← Font loading + heading/body type rules
│       ├── buttons.css             ← wa-button overrides
│       ├── navigation.css          ← Nav link styles
│       ├── header.css              ← Site header
│       ├── icons.css               ← Icon utilities
│       ├── membership.css          ← Membership component styles
│       ├── merch-store.css         ← Merch store styles
│       └── footer.css              ← Footer styles
│
├── staging/
│   ├── cult-membership.html        ← Canonical page (design system reference)
│   ├── staging-wrapper.html        ← Preview wrapper
│   ├── index.html
│   ├── merch-store.html
│   ├── press-kit.html
│   └── shows.html
│
├── staging/assets/
│   ├── fonts/
│   │   (empty — Georgia is a web-safe system font; no self-hosted fonts required)
│   ├── icon-patterns/
│   │   ├── skull.svg               ← 8-icon texture pool
│   │   ├── crown.svg
│   │   ├── mask.svg
│   │   ├── cross.svg
│   │   ├── fire.svg
│   │   ├── feather.svg
│   │   ├── spider.svg
│   │   └── eye.svg
│   ├── press-logos/
│   │   ├── classic-rock.svg        ← Press logos (available; currently unused on page)
│   │   ├── powerplay.svg
│   │   └── punksite.svg
│   └── images/
│       ├── Dark-fae.png            ← Band photography
│       └── cult_test.webp
│
└── docs/
    ├── design-system.md            ← This file
    ├── bandzoogle-classes.md
    └── case-study-notes.md
```

<!-- TODO: Bleeding Cowboys font files (.woff/.woff2) can be deleted from
     the Bandzoogle Files tab after the page fix pass lands and is verified -->

**Bandzoogle deployment note:** `gypsy-pistoleros.css` uses `@import` directives that only resolve locally. When pasting into Bandzoogle › Edit Theme › Customize CSS, inline all component CSS into a single block. The `@import` pattern is for local development only.

---

## 12. Patterns to Reuse on Future Pages

Checklist for every new page built on this design system:

- [ ] Open with a full-bleed hero — band photo background, bottom-to-top gradient overlay, centred heading and primary CTA
- [ ] Alternate section archetypes to create rhythm — suggested sequence: `C → A → C → B → A → C` or similar. Pages close on Archetype A, B, or C — there is no inverted closer archetype.
- [ ] Every section heading uses `.section-heading.section-heading--framed` with the `__label` (Georgia tracked uppercase) / `__title` (Georgia) / `__tagline` (Inter regular) structure — no exceptions
- [ ] Apply decorative icon accents per the four pair patterns — vary icons and colours per section so no two adjacent sections feel identical. Pull from the 8-icon pool; combine with the four accent colours (silver, green, pink, blue)
- [ ] Neon pink (`variant="brand"`) for commitment/conversion actions. Neon green (`variant="neutral"`) for discovery actions. Both use the flat-button pattern documented in Section 8 — 2px black border, colour-shift hover, no shadow, no transform.
- [ ] Text links and nav accent use `var(--color-accent-purple)` — **never on buttons**
- [ ] No italic in body text. Inter is never italicised. Georgia italic is not used.
- [ ] Texture icons normalised via `filter: brightness(0) invert(1)` so source SVG colour is irrelevant
- [ ] Close on Archetype A, B, or C. There is no inverted closer archetype in this system.

---

## 13. Known Constraints and Quirks

**`filter: brightness(0) invert(1)` on texture pseudo-elements**
Normalises any source SVG fill to pure white before opacity is applied. This means the source SVG fill colour (`#e8e8e0`) is irrelevant — the filter always produces white. Do not rely on source fill for texture colouring.

**300vw pseudo-element width is non-negotiable**
The texture `::before` uses `width: 300vw; height: 300vw` so that after a -45° rotation, the diagonal covers the full viewport width with margin. After a 45° rotation, the half-diagonal of a 300vw square is ≈ 212vw. Reducing this will cause texture clipping on wide viewports or tall sections.

**`clip-path: inset(0)` on section-level texture containers**
`overflow: hidden` alone does not reliably clip `transform: rotate()`-ed pseudo-elements in all browsers. `clip-path: inset(0)` is required alongside `overflow: hidden` to guarantee clean section bounds.

**Text-shadow stroke on `__label` and `__tagline`**
The 2px black text-shadow stroke on `__label` and `__tagline` is a legibility-over-textured-backgrounds device. Archetype A and B sections sit type over tiled icon patterns; the stroke knocks out the pattern behind label and tagline text, keeping them readable. This behaviour is generic to whatever display font is in use — it is not specific to any previous typeface.

**`--color-text-muted` alias**
`--color-text-muted` is an inline alias defined in `cult-membership.html`, not in `variables.css`. It resolves to `--color-text-secondary`. Any new page that uses `var(--color-text-muted)` must include this alias or replace it with `var(--color-text-secondary)` directly.

**`wa-button` label font override**
<!-- TODO: verify wa-button ::part(label) font override is no longer needed once buttons render in Inter. May be safe to delete. -->
Web Awesome's `<wa-button>` applies its own font to the `::part(label)` shadow DOM element. Previously, `font-family: 'Cinzel', serif !important` on `::part(label)` and inline `style` on the label `<span>` were both required. Since button labels now inherit Inter via `var(--font-body)`, this override may no longer be necessary — verify against rendered output before removing.

**Bandzoogle `@import` limitation**
Bandzoogle's Customize CSS field does not resolve `@import` paths. When deploying, all component CSS must be inlined into a single block. Always edit source files locally first; treat the Bandzoogle CSS field as a deployment target, not a source.

**V2 font tokens — not deprecated, not v0**
May 2026 audit corrected: `--font-display-secondary`, `--font-cinzel-min`, `--font-cinzel-max`, and `--font-display-tertiary` are active consumers in the v2 component bundle (`cult-gathering.css`, `cg-inscribed.css`, `hero-v2.css`, `press-pasteup.css`) which powers `cult-membership.html`. They were initially mislabelled as deprecated in `variables.css`; the label was corrected to "V2 BUNDLE TOKENS". These tokens are NOT consumed by the v0 bundle (active staging pages). Do not delete without checking both v0 and v2 import chains.

# Secondary Typography Audit
## h3–h5 / Nav Links / Button Labels / Table Headers / FAQ Rows

**Project:** Gypsy Pistoleros — AUSTIN_SPACE Bandzoogle build  
**Date:** 2026-05-26  
**Auditor:** Claude Code  
**Status:** AUDIT ONLY — no CSS modifications made  
**Scope:** Surfaces not covered by the primary font-stack sweep (which handled Cormorant
survivors, Cinzel on non-heading elements, and Google Fonts links).

---

## 1. Spec Status Per Surface

| Surface | Spec status | Evidence |
|---|---|---|
| h1 | SPECIFIED | §3: Georgia for hero/page titles (heading role, font-stack already correct) |
| h2 | SPECIFIED | §3: Georgia for section headings (heading role, font-stack already correct) |
| **h3** | **SILENT** | §3 mentions Georgia for named components (section-heading__title, at-a-glance labels, etc.) but assigns no font-family to the global `h3` tag |
| **h4** | **SILENT** | Not addressed in §3 or any other section |
| **h5** | **SILENT** | Not addressed in §3 or any other section |
| h6 | SILENT | Not addressed — current CSS uses `var(--font-body)` (conformant with two-font system) |
| **Nav links** | **PARTIAL** | §1, §12: colour = `var(--color-accent-purple)` specified; font-family, size, weight, tracking all silent |
| **Button labels** | **SPECIFIED** | §8: `var(--font-body)`, `font-size: 14px`, `font-weight: 600`, `letter-spacing: 0.05em` — fully explicit |
| **Table headers (general)** | **SILENT** | §10 mentions the comparison table but provides no thead `th` font spec |
| **FAQ rows** | **SPECIFIED** | §9: `font-family: var(--font-display)` (Georgia), `font-size: 14px`, `letter-spacing: 0.15em`, `text-transform: uppercase`, `color: var(--color-text-primary)`. `.faq-summary` additionally `font-weight: 600` |

---

## 2. Current CSS State Per Surface

### h3, h4, h5 — `css/components/typography.css`

```css
/* lines 86–94 */
h3, h4, h5 {
  font-family: var(--font-display-secondary);   /* ← DEPRECATED TOKEN → Cinzel */
  color: var(--color-text-primary);
  line-height: 1.2;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-top: 0;
  margin-bottom: var(--space-3);
}

/* line 97 */
h3 { font-size: clamp(var(--font-cinzel-min), 2.5vw, var(--text-3xl)); font-weight: 600; }
/*                    ↑ DEPRECATED TOKEN in clamp floor (resolves to 1.125rem / 18px) */

/* line 100 */
h4 { font-size: var(--text-xl);  font-weight: 600; }   /* 20px — token valid */

/* line 101 */
h5 { font-size: var(--font-cinzel-min); font-weight: 400; }   /* ← DEPRECATED TOKEN (1.125rem / 18px) */
```

**Effective render:** Cinzel (deprecated token resolves). Not a hard break; deprecated token
is still defined in `variables.css` with a deprecation comment. Will continue to render Cinzel
until the rule is updated.

---

### h6 — `css/components/typography.css`

```css
/* lines 107–117 */
h6 {
  font-family: var(--font-body);   /* Inter — conformant ✓ */
  font-size: var(--text-base);     /* 16px */
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  line-height: 1.4;
  margin-top: 0;
  margin-bottom: var(--space-2);
}
```

**Effective render:** Inter — correct per two-font system. No action needed.

---

### Nav links — `css/components/typography.css` + `css/components/navigation.css`

**typography.css, lines 192–203:**
```css
.nav-link {
  font-family: var(--font-display-secondary);   /* ← DEPRECATED TOKEN → Cinzel */
  font-size: var(--text-2xl);                   /* 1.5rem / 24px */
  font-weight: 400;
  color: var(--color-text-primary);
  text-decoration: none;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: color 0.2s ease;
}
.nav-link:hover { color: var(--color-accent-purple); }
```

**navigation.css, line 165 (narrow mobile breakpoint, exact line depends on current state):**
```css
font-size: var(--font-cinzel-min);   /* ← DEPRECATED TOKEN → 1.125rem / 18px */
/* comment: "hold at 18px minimum" */
```

**Effective render:** Cinzel at 24px desktop / 18px narrow-mobile. Deprecated tokens resolve;
not a hard break, but nav will continue rendering in Cinzel until these rules are updated.

---

### Button labels — `css/components/buttons-v0.css` (wins cascade)

```css
/* Authoritative rule — imported AFTER typography.css in v0.css, so wins */
wa-button[variant="brand"]::part(label),
wa-button[variant="neutral"]::part(label) {
  font-family: var(--font-body);     /* Inter — conformant ✓ */
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.05em;
}
```

**Effective render:** Inter 14px 600 — matches §8 spec exactly. ✓

---

### Button labels (dead rules) — `css/components/typography.css`

```css
/* lines 211–216 — LATENT CONFLICT, loses cascade to buttons-v0.css */
wa-button:not([size="small"])::part(label) {
  font-family: var(--font-display);   /* Georgia — was BleedingCowboys */
  font-size: 2rem;                    /* 32px — wrong (spec: 14px) */
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* lines 218–224 — LATENT CONFLICT, loses cascade to buttons-v0.css */
wa-button[size="small"]::part(label) {
  font-family: var(--font-display-secondary);   /* ← DEPRECATED TOKEN → Cinzel */
  font-size: var(--font-cinzel-min);            /* ← DEPRECATED TOKEN → 18px */
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
```

**Effective render:** These rules never fire — buttons-v0.css wins cascade (imported later,
same selector specificity). Buttons render correctly. But these rules are confusing dead code
containing both a deprecated token and a wrong font-size.

---

### Table headers (general) — site-wide `thead th` patterns

No global `thead th` rule in typography.css or any shared file. Each component stylesheet
declares its own `thead th` rules:

| File | Selector | font-family | font-size | colour |
|---|---|---|---|---|
| `reviews.css:181–190` | `.reviews-table thead th` | `var(--font-body)` | `var(--text-xs)` | `var(--color-silver)` |
| `shows.css:179–189` | `.shows-table thead th` | `var(--font-body)` | `var(--text-xs)` | `var(--color-silver)` |
| `press-kit.css:338–347` | `.section-charting__table thead th` | *(inherits `font-family` from `.section-charting__table`)* | `var(--text-xs)` | `var(--color-text-secondary)` |

`.section-charting__table` itself declares `font-family: var(--font-body)` — so charting
table headers inherit Inter correctly via cascade. All three sets render Inter. No deprecated
tokens in table header rules.

---

### FAQ rows — `css/components/cult-membership.css`

Confirmed from grep (current state after prior sweeps):

```css
/* .faq-summary — question row */
.faq-summary {
  font-family: var(--font-display);   /* Georgia — conformant ✓ */
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-primary);
}

/* wa-details summary part — same spec */
wa-details::part(summary) {
  font-family: var(--font-display);   /* Georgia — conformant ✓ */
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-primary);
}
```

**Effective render:** Georgia 14px — matches §9 spec exactly. ✓

---

## 3. Gap Table

*This is the decision table for prompt #15. Each row is a design question requiring user input.*

| Surface | Spec status | Current font-family | Current size | Conflict / gap type | Notes |
|---|---|---|---|---|---|
| **h3** | SILENT | Cinzel (deprecated token) | clamp(18px, 2.5vw, 30px) — deprecated token in floor | Deprecated token. No spec to conform to. | Design decision: replace Cinzel with Georgia (--font-display) or Inter (--font-body)? |
| **h4** | SILENT | Cinzel (deprecated token) | 20px (var(--text-xl), valid token) | Deprecated token. No spec. | Same decision as h3 — Georgia or Inter? |
| **h5** | SILENT | Cinzel (deprecated token) | 18px (deprecated token) | Deprecated token. Both font-family AND size use deprecated tokens. | Two fixes needed: font-family + font-size |
| **Nav links (desktop)** | PARTIAL | Cinzel (deprecated token) | 24px (var(--text-2xl), valid token) | Deprecated token. Colour specified (purple), font-family silent. | Design decision: Georgia or Inter? |
| **Nav links (mobile min)** | PARTIAL | Cinzel (deprecated token) | 18px (deprecated token in navigation.css) | Deprecated token. Both font-family AND size use deprecated tokens here. | Two fixes needed if nav font-family is decided |
| **Button labels (typography.css)** | SPECIFIED | Georgia 2rem (large) / Cinzel 18px (small) — both DEAD RULES | N/A (buttons-v0.css wins) | Latent conflict. Dead code with wrong values. | Clean up or delete — no render impact, but misleading |
| **h6** | SILENT | Inter (var(--font-body)) | 16px | None — conformant with two-font system | No action needed |
| **Table headers** | SILENT | Inter (all three components) | var(--text-xs) | None — consistent across components | No action needed |
| **FAQ rows** | SPECIFIED | Georgia (var(--font-display)) | 14px | None — conformant ✓ | No action needed |
| **Button labels (buttons-v0.css)** | SPECIFIED | Inter (var(--font-body)) | 14px | None — conformant ✓ | No action needed |

---

## 4. High-Priority Breaks (Deleted-Token Consumers)

**None.** `--font-display-min` (deleted in a prior session) has been fully swept and all
references replaced with literal `2rem`. No currently-rendering rule references a deleted token.

---

## 5. Deprecated-Token Consumers

These rules render correctly today because the deprecated tokens still resolve in `variables.css`.
They will break if the deprecated tokens are later removed.

| Rule | File | Deprecated token(s) | Resolves to |
|---|---|---|---|
| `h3, h4, h5 { font-family }` | typography.css:87 | `--font-display-secondary` | Cinzel |
| `h3 { font-size }` (clamp floor) | typography.css:97 | `--font-cinzel-min` | 1.125rem / 18px |
| `h5 { font-size }` | typography.css:101 | `--font-cinzel-min` | 1.125rem / 18px |
| `.nav-link { font-family }` | typography.css:193 | `--font-display-secondary` | Cinzel |
| `font-size` in narrow-mobile nav rule | navigation.css:165 | `--font-cinzel-min` | 1.125rem / 18px |
| `wa-button[size="small"]::part(label) { font-family }` | typography.css:219 | `--font-display-secondary` | Cinzel (dead rule — doesn't fire) |
| `wa-button[size="small"]::part(label) { font-size }` | typography.css:220 | `--font-cinzel-min` | 1.125rem (dead rule — doesn't fire) |

---

## 6. Open Questions for User

These are design decisions that cannot be resolved by mechanical sweep alone. Answers drive
prompt #15 (the fix pass).

**Q1 — h3/h4/h5 font-family**  
The spec is silent. Two options consistent with the two-font system:
- **Georgia** (`var(--font-display)`) — keeps all heading levels in the same display face; cleaner hierarchy
- **Inter** (`var(--font-body)`) — sub-h2 headings treated as heavy body text; more utilitarian

*Note: If Georgia, the letter-spacing (0.06em) and text-transform (uppercase) currently on
h3–h5 should be reviewed — they were tuned for Cinzel.*

**Q2 — h3 font-size floor**  
Currently `clamp(var(--font-cinzel-min), 2.5vw, var(--text-3xl))`. The deprecated token
in the floor needs replacing with a literal value regardless of which font-family is chosen.
Suggested literal: `1.125rem` (18px) — same value the deprecated token resolved to.
Alternatively raise the floor to `1.25rem` (20px) if the font-family changes to Georgia
and the floor feels tight.

**Q3 — nav link font-family**  
Spec specifies colour only. Two options:
- **Georgia** (`var(--font-display)`) — nav reads as a display element; consistent with h1/h2
- **Inter** (`var(--font-body)`) — nav treated as UI chrome rather than brand display

*Note: If Georgia, the current size (24px) is above the 2rem BleedingCowboys floor and will
render as standard Georgia — not the display flourish of the hero. Visually different from h1/h2
even with the same token.*

**Q4 — dead button label rules in typography.css**  
Three options:
- **Delete** the `wa-button::part(label)` blocks from typography.css — no render impact, cleaner code
- **Update** them to match buttons-v0.css values — keeps them as documentation but still dead (buttons-v0 still wins cascade unless import order changes)
- **Leave** as is — these rules never fire; low priority

---

## 7. Overall Picture

The primary sweep (prior sessions) eliminated all unexpected italic usage and Cormorant/Cinzel
on non-heading body content. What remains is a **heading and nav identity question**: the
three-tier font threshold system (BleedingCowboys / Cinzel / Inter) has been retired, but
h3–h5 and nav links still reference its deprecated tokens. These rules render today — Cinzel
resolves — but are carrying technical debt that will break if the deprecated tokens are ever
removed from `variables.css`.

**No hard breaks exist.** This is a design-decision pass, not an emergency fix.

The two open design decisions are the same question asked twice: should mid-level headings
(h3–h5) and nav links render in **Georgia** (folded into the display tier) or **Inter** (folded
into the body tier)? Answering those two questions clears the path for a clean mechanical fix
pass with no surprises.

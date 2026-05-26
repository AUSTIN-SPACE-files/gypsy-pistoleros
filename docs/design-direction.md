# Design Direction — v2

**Purpose:** The active working document for the v2 design direction. This is the *synthesised* document — the place where raw observations from `band-research.md` get turned into actual rules, decisions, and patterns for the page.

**Relationship to `design-system.md`:** The existing `design-system.md` documents the v1 system as built. This document is the v2 *extension and revision* — it will eventually either fold back into `design-system.md` as a replacement, or sit alongside it as a v2 reference. Don't edit `design-system.md` until the v2 direction is settled.

**Status:** Scaffold. Sections marked *TBD* will be filled in across working sessions.

---

## 1. Brief Recap

**Band positioning (canonical):**

> The world's only Glam Punk Goth 'n' Roll band — a high-voltage collision of punk grit, gothic theatre, and outlaw glamour. Not retro. Not revival. A movement. A spectacle. A riot in glitter.

**Reference stack (band-level):**
The Damned • Misfits • Iron Maiden • KISS • Hanoi Rocks • The Cult • Killing Joke • Ghost

**What v1 got wrong (per review on screenshots, May 2026):**
- Too tasteful — reads as gothic-boutique / SaaS-in-a-black-t-shirt
- Cards too uniform, too rectangular, too polite — every section uses the same vocabulary
- Textures at 2.5–5% opacity are doing nothing visible
- Gold dominates accents — pulling toward Ghost / luxury rather than glam-punk
- Hot pink (`#ff2d92`) is underused given the brief
- No paste-up / collage / flyer culture energy
- No bleed between sections — clean horizontal breaks throughout

**What v1 got right (keep):**
- Three-tier typographic hierarchy (Bleeding Cowboys / Cinzel / Cormorant)
- Framed section headings with line ends and coloured icon accents
- Hero photo treatment
- Inverted gold closer (Archetype D)
- Texture pattern *concept* (just needs turning up and re-vocabularised)
- "Cult / Chosen / High Order" tier naming — staying

---

## 2. Design Direction Principles

*To be filled in after research session — these are the rules that get distilled from band research, framed as do/don't statements.*

### Principle 1 — TBD
### Principle 2 — TBD
### Principle 3 — TBD
*(Aim for 5–8 principles total.)*

---

## 3. Visual Vocabulary Shifts (v1 → v2)

### 3.1 Texture system
*TBD — what replaces the icon-pattern-tile system. Likely candidates: layered paper textures, photocopy noise overlay, screen-print misregistration marks.*

### 3.2 Card system
*TBD — what replaces the uniform-rectangle pattern. Likely candidates: flyer-style paste-up cuttings, torn-paper backgrounds with tape, rotated cards, cartouche frames for ceremonial moments.*

### 3.3 Colour rules
*TBD — audit of where gold currently lives vs where it should live, and what role hot pink takes. Probable direction: pink becomes default accent, gold reserved for ceremonial / High Order moments only.*

### 3.4 Typography rules
*TBD — extending the three-tier stack with a fourth "ransom-note / hand-cut / spray-paint" treatment layer, used selectively.*

### 3.5 Section transitions
*TBD — replacing clean horizontal section breaks with bleed, torn edges, overlap.*

### 3.6 Ornament system
*TBD — replacing 12px icon dots on hairlines with larger illustrated ornament, plus sigil / cartouche vocabulary for ceremonial moments.*

---

## 4. Section Archetypes — v2

*TBD — the v1 system has Archetypes A/B/C/D. v2 may keep these and add new ones (paste-up section, screen-print section, ceremonial-cartouche section), or replace the system entirely. Decision deferred to after research.*

### Archetype A v2 — *TBD*
### Archetype B v2 — *TBD*
### Archetype C v2 — *TBD*
### Archetype D v2 — *TBD*
### New archetypes — *TBD*

---

## 5. Asset Specification

*This section grows as we identify what custom AI-generated assets the v2 direction needs. Each asset class gets: purpose, visual description, dimensions/format, generation prompts, anchor references from `band-research.md`.*

### 5.1 Base asset (existing)
*To be described once the existing asset is shared.*

### 5.2 Texture assets — TBD
- Paper textures (count, types):
- Photocopy / grain overlays:
- Screen-print / ink marks:
- Torn-edge masks:

### 5.3 Ornamental assets — TBD
- Sigils / occult marks:
- Cartouches / frames:
- Hand-drawn dividers:
- Mascot / iconography:

### 5.4 Hero treatments — TBD
- Wordmark treatment:
- Hero photo overlay:

---

## 6. Section-by-Section Audit

*TBD — once the v2 vocabulary is settled, walk through each section of `cult-membership.html` and decide: keep / modify / replace, with notes.*

| Section | v1 Archetype | v2 Direction | Priority |
|---|---|---|---|
| Hero | — | TBD | |
| JOIN THE HIGH ORDER | C | TBD | |
| WHY YOUR SUPPORT MATTERS | A | TBD | |
| HIGH ORDER PRIVILEGES | C | TBD | |
| WHAT THEY'RE SAYING | B | TBD | |
| YOUR QUESTIONS | A | TBD | |
| BECOME HIGH ORDER | D | TBD | |

---

## 7. Implementation Sequencing

*TBD — once direction is settled, the order in which sections get rebuilt. Default working assumption: press reviews first (highest impact, lowest risk proof of concept).*

---

## 8. Open Questions / Parking Lot

*Things we noticed but deferred. Revisit before finalising.*

- *e.g. should the navigation header be redesigned alongside the page sections, or treated separately?*

---

## 9. Decision Log

*Every meaningful direction decision goes here with date and rationale, so future-us doesn't relitigate settled questions.*

| Date | Decision | Rationale |
|---|---|---|
| [TBD] | "Cult / Chosen / High Order" tier naming retained | On-brand for glam-punk; structurally distinctive |
| [TBD] | Custom AI-generated textures over commissioned illustration | Iteration speed; strong base asset already exists |

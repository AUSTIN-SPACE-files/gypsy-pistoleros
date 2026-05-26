# Gypsy Pistoleros — AUSTIN_SPACE Case Study Notes

## Project Overview
- **Client:** Gypsy Pistoleros
- **Platform:** Bandzoogle Pro
- **Build start:** May 14, 2026
- **Goal:** Full site redesign via CSS + SEO uplift — documenting for austinspace.co.uk case study

---

## Baseline Metrics (captured May 14, 2026)

### Analytics (Jan 1 – May 13, 2026)
- Total visits: 13,990
- Unique visitors: 12,036
- Page views: 17,463
- Notable: Traffic spike late April / early May (album release + tour)

### Mailing list
- Subscribers at baseline: ~405
- Platform: Bandzoogle native (unlimited on Pro)
- Incentive: free download of *Duende A Go Go Loco*

### SEO state at baseline
- All meta descriptions: "Automatically generated"
- Zero custom page titles written
- No Google Analytics connected
- No Meta Pixel installed
- Completely untouched — huge upside

### Store state at baseline
- ~15 products
- Most items out of stock (band on tour)
- Blanket 20% sale applied — not strategic
- Stripe active but API key rotation flagged

---

## Before Screenshots
Stored in `docs/before-screenshots/` — captured May 14, 2026.

Pages to capture:
- [ ] Home
- [ ] Shows
- [ ] CDs and Vinyls
- [ ] Merch Store
- [ ] Cult of the Pistoleros membership page
- [ ] Press Kit
- [ ] Contact & Booking
- [ ] Mobile views (375px) of key pages

---

## Build Log

### Session 1 — May 14, 2026
- Project structure created
- CSS framework scaffolded (variables, component files)
- Staging wrapper built
- Web Awesome 3.7.0 integrated (components + icon library)
- Three-tier font system implemented: Bleeding Cowboys (≥32px) / Cinzel (18–31px) / Inter (body)
- Cormorant Garamond added as editorial italic tier
- CSS-only mobile hamburger nav implemented
- WA components showcase built in staging wrapper

### Session 2 — May 14, 2026
- **Cult membership page v1 built** — staging/cult-membership.html
- Full 6-section conversion landing page: Hero → What is The Cult → Benefits (5 cards) → Press proof (3 quotes) → FAQ (5 accordion items) → Final CTA
- All wa-card, wa-details, wa-rating, wa-button, wa-divider, wa-icon components used
- Gold button treatment applied site-wide pattern established
- Three-tier font system applied throughout: BC display headings, Cinzel nav/UI, Cormorant Garamond editorial italic
- Responsive: 3-col → 2-col → 1-col at 1024px / 768px / 480px breakpoints
- Image areas are clearly labelled placeholders — awaiting band photography assets
- Bandzoogle class name inspection checklist created

---

## After Metrics (to be filled at launch + 60/90 day marks)

| Metric | Baseline | Launch | +60 days | +90 days |
|--------|----------|--------|----------|----------|
| Monthly visits | — | — | — | — |
| Unique visitors | — | — | — | — |
| Mailing list size | ~405 | — | — | — |
| Bounce rate | — | — | — | — |
| Store conversion | — | — | — | — |

---

## Case Study Narrative Points (running list)

- Charles has a decade of band merch web/ecommerce at BSI Merch (Iron Maiden, Slayer, Ghost, Anthrax, ~200 others) — bringing that context to a direct band client
- Pro bono exchange: build in return for case study + review
- Constraint-led design: no CMS access for CSS, no build tools, pure CSS pasted into a field
- SEO was completely untouched — every page on default settings — measurable starting point
- Cult membership page: strongest revenue tool, most underserved page — priority redesign

---

## Key Decisions Log

| Date | Decision | Reason |
|------|----------|--------|
| May 14, 2026 | Pure CSS, no preprocessors | Bandzoogle constraint — CSS pasted directly into field |
| May 14, 2026 | Bleeding Cowboys Pro as display font | Confirmed match to existing tour banner + homepage (WhatTheFont) |
| May 14, 2026 | Neon green + neon purple as brand accents | Pulled from Dark Faerie Tales vinyl artwork |

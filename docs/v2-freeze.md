# v2 CSS Freeze

**Date:** 2026-05-22

## Context

The AUSTIN_SPACE build of gypsypistoleros.com started with a full v2 design-system
prototype (`css/gypsy-pistoleros.css`, `docs/design-system.md`). v2 implements a
rich visual language: gold accents, texture patterns, Cormorant Garamond editorial
italic, Cinzel uppercase overrides, Bleeding Cowboys flourishes, and complex section
archetypes (hero-v2, cg-inscribed, pf-pasteup, cult-gathering).

A decision was made to pause v2 work and ship a **v0 baseline** first. v0 is a
clean, deployment-ready build that:

- Uses Web Awesome 3.7.0 components (`wa-button`, `wa-card`, `wa-details`, etc.)
- Applies token-based spacing, colour, and typography from `css/variables.css`
- Contains no gold accents, texture patterns, or v2 styling flourishes
- Is deployed via `dist/v0-bundle.css`, pasted into Bandzoogle Customize CSS

## What is frozen

The following CSS files are **v2 prototypes**. They are excluded from `css/v0.css`
and `dist/v0-bundle.css`. They are not applied to any live page.

| File | Purpose |
|------|---------|
| `css/gypsy-pistoleros.css` | v2 master bundle (imports all v2 components) |
| `css/components/hero-v2.css` | Full-bleed photographic hero with overlay |
| `css/components/join-v2.css` | CG-Editorial split layout (60/40 copy + image) |
| `css/components/cg-inscribed.css` | Ceremonial Gothic archetype (inscribed panels) |
| `css/components/press-pasteup.css` | PF-Pasteup newspaper cutting archetype |
| `css/components/cult-gathering.css` | Cult gathering photo/paraphernalia section |
| `css/components/grain.css` | Page-grain overlay (v2 texture flourish) |
| `css/components/buttons.css` | v2 gold/silver button overrides |

The v2 prototype of `staging/cult-membership.html` has been archived to
`archive/v2/cult-membership.html`. It must not be modified or deployed.

## What replaces it

For v0 launch, the active pages use `css/v0.css` which imports only:

```
variables.css
components/icons.css
components/typography.css
components/navigation.css
components/footer.css
components/reviews.css
components/homepage.css
components/press-kit.css
components/shows.css
components/cult-membership.css
```

## When v2 work resumes

v2 work will resume on a per-page basis as time allows. Before styling any page
in v2 mode:

1. Read `docs/design-system.md` — this is the authoritative v2 design system.
2. Read the archived v2 prototype for that page in `archive/v2/` if one exists.
3. Create a new page-specific CSS file (or extend `css/gypsy-pistoleros.css`)
   targeting real Bandzoogle selectors from `docs/bandzoogle-injected-markup.md`.
4. Do not mix v0 token patterns with v2 flourishes in the same component file.

## Pages in scope for v2

- `staging/cult-membership.html` — v2 prototype archived at `archive/v2/cult-membership.html`
- All other pages will receive v2 treatment page by page as work resumes

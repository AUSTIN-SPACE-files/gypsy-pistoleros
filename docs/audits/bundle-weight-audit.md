# Bundle weight audit — 2026-05-26

**Bundle:** `dist/v0-bundle.css` — 91,483 bytes / 3,507 lines  
**Context:** Bandzoogle Customize CSS field silently rejects saves at this size. The hard ceiling is unknown but clearly below 91,483 bytes.  
**Goal:** Identify trim candidates so the user can choose which to apply. No CSS was modified.

---

## Section 1 — Import chain

### v0.css imports (in order)

| # | File | Bytes | Lines |
|---|------|------:|------:|
| 1 | `css/variables.css` | 6,292 | 170 |
| 2 | `css/components/icons.css` | 695 | 24 |
| 3 | `css/components/typography.css` | 9,560 | 345 |
| 4 | `css/components/navigation.css` | 4,256 | 167 |
| 5 | `css/components/bandzoogle-overrides.css` | 1,910 | 46 |
| 6 | `css/components/footer.css` | 2,010 | 71 |
| 7 | `css/components/reviews.css` | 6,926 | 271 |
| 8 | `css/components/buttons-v0.css` | 3,268 | 98 |
| 9 | `css/components/homepage.css` | 10,343 | 415 |
| 10 | `css/components/press-kit.css` | 13,967 | 569 |
| 11 | `css/components/shows.css` | 11,522 | 513 |
| 12 | `css/components/videos.css` | 6,634 | 302 |
| 13 | `css/components/cult-membership.css` | 6,197 | 296 |
| 14 | `css/components/section-rhythm.css` | 5,806 | 154 |
| | **Sum of source files** | **89,386** | **3,441** |
| | Build headers + section separators | 2,097 | 66 |
| | **Bundle total** | **91,483** | **3,507** |

**Bundle composition verified:** The bundle is a straight concatenation of the 14 source files plus 2,097 bytes of build overhead (main header comment: ~716 bytes; 14 section separator comments: ~1,381 bytes). No additional content is injected.

*Note: the task brief cited 91,445 bytes / 3,479 lines. The current bundle reads 91,483 bytes / 3,507 lines — a 38-byte / 28-line difference, likely a rebuild since the task was written. Analysis uses the current measured numbers throughout.*

---

### Component files on disk NOT imported into v0

These files exist in `css/components/` but are excluded from the v0 bundle. They are dead weight on disk but contribute zero bytes to the bundle. All are part of the frozen v2 work (see `docs/v2-freeze.md`).

| File | Bytes | Status |
|------|------:|--------|
| `press-pasteup.css` | 12,456 | v2 frozen — large file |
| `cult-gathering.css` | 7,720 | v2 frozen |
| `cg-inscribed.css` | 7,464 | v2 frozen |
| `hero-v2.css` | 2,887 | v2 frozen |
| `join-v2.css` | 3,142 | v2 frozen |
| `membership.css` | 771 | stub, v2 frozen |
| `grain.css` | 302 | v2 frozen |
| `merch-store.css` | 304 | stub, v2 frozen |
| `header.css` | 299 | stub, v2 frozen |
| **Total** | **35,345** | — |

These files are not a bundle concern but represent 35 KB of disk debt if the v2 freeze is permanent.

---

### v2 master file (gypsy-pistoleros.css)

`gypsy-pistoleros.css` is marked `ORPHANED v2 BUNDLE — NOT LOADED IN v0`. It imports: variables.css, icons.css, typography.css, navigation.css, header.css (stub), merch-store.css (stub), membership.css (stub), footer.css, grain.css, hero-v2.css, join-v2.css, cg-inscribed.css, press-pasteup.css, cult-gathering.css. No overlap with the v0 import list except the shared base files (variables, icons, typography, navigation, footer).

---

## Section 2 — Per-file content analysis

**Method:** CSS selectors were matched against the four active staging HTML files: `index.html`, `shows.html`, `press-kit.html`, `videos.html`. `cult-membership.html` was excluded per brief (not deployed). Navigation and footer selectors are not present in staging HTML because Bandzoogle injects that markup server-side; those are annotated separately.

---

### 1. variables.css — 6,292 bytes

| Category | Bytes | Notes |
|----------|------:|-------|
| Active custom properties | ~5,500 | All brand colours, WA token overrides, spacing, typography, layout |
| Deprecated tokens (4 definitions) | ~383 | `--font-display-secondary`, `--font-cinzel-min`, `--font-cinzel-max`, `--font-display-tertiary` — see Section 5 |
| Comments | 2,998 | Section headers + inline notes |
| Blank lines | 30 | |

The deprecated token block is flagged with a `/* DEPRECATED */` comment in the file. These 4 tokens have no consumers in the production bundle other than `typography.css` rules that are themselves dead (`.mock-product-title`, `.membership-benefit`). Their only other consumer is `staging-wrapper.html` inline styles, which is not deployed. See Section 5 for full analysis.

---

### 2. icons.css — 695 bytes

| Category | Bytes | Notes |
|----------|------:|-------|
| Active rules | 0 | No selectors match any of the 4 active HTML files |
| Likely-dead rules | 235 | All 3 rules: `i.fa-thin`, `.benefit-card-content i.fa-thin`, `.membership-benefit i.fa-thin` |
| Comments | 460 | File header (67% overhead) |
| Blank lines | 4 | |

The file's own header comment states it is for `staging/cult-membership.html · staging/staging-wrapper.html` — neither deployed. No `fa-thin` class appears in any of the 4 active HTML files. The entire 695-byte file is a trim candidate.

**Caveat:** `i.fa-thin` is a generic element+class selector. If FontAwesome Thin icons appear in any Bandzoogle-injected markup or live blog post content (outside the 4 staging HTML files), this rule would fire. Confirm with client whether FA Thin icons are used anywhere on the live site before trimming.

---

### 3. typography.css — 9,560 bytes

| Category | Bytes | Notes |
|----------|------:|-------|
| Active rules | ~4,300 | `html`, `body`, `h1`–`h6`, `p`, `strong`, `em`, `small`, `a`, `.site-header`, `.site-title h1`, `.site-tagline`, `.nav-link`, `.site-footer__brand h3`, `blockquote`, `blockquote cite`, `.text-quote-source` |
| Dead — confirmed by file comment | 603 | `wa-button` doc-only rules (L228–247): "Kept as documentation only — these rules do not fire." |
| Dead — not in active HTML | 1,060 | `.mock-product-title` + `.mock-product-desc` (L248–273): 703 bytes; `.membership-benefit` (L274–285): 357 bytes |
| Dead — not in active HTML | 749 | `.section-heading__title` (L78–80): 201 bytes; `.text-eyebrow` + `.text-accent-*` utilities (L328–345): 548 bytes |
| Comments | 3,830 | Section headers are the main bulk (41% overhead) |
| Blank lines | 50 | |

**BZ-injected markup note:** `.site-header`, `.site-title h1`, `.site-tagline`, `.nav-link`, `.site-footer__brand h3` do not appear in staging HTML (Bandzoogle injects that markup). These selectors ARE active on the live BZ site and should not be trimmed.

**Partial dead — `.text-quote, blockquote` selector:** The `blockquote` element selector is active (press-kit.html has `<blockquote class="section-at-a-glance__pull-quote">`). The `.text-quote` class is not in any active HTML (only staging-wrapper.html). The whole rule block cannot be removed without dropping `blockquote` styling. Trimming `.text-quote,` from the selector saves ~12 bytes only — not worth it as a standalone action. However, if the broader `.text-quote-source` class is also dead (no `<cite>` inside `<blockquote>` in active HTML), the `blockquote cite, .text-quote-source` rule block could be condensed to just `blockquote cite`. Minor.

---

### 4. navigation.css — 4,256 bytes

| Category | Bytes | Notes |
|----------|------:|-------|
| Active rules (BZ-injected markup) | ~2,600 | `.nav-toggle-*`, `.site-nav`, `.nav-list`, `.nav-link`, `.nav-link--cta`, responsive breakpoints |
| Comments | 1,569 | HTML structure comment + section headers |
| Blank lines | 22 | |
| Dead | 0 | All selectors target Bandzoogle-injected navigation markup |

Not matchable from staging HTML (BZ injects nav) but confirmed active on live site.

---

### 5. bandzoogle-overrides.css — 1,910 bytes

| Category | Bytes | Notes |
|----------|------:|-------|
| CSS rules | 0 | File contains zero CSS rules |
| Comments | 1,910 | 100% developer documentation (BZ override history, known collision list, "when to add rules here" guide) |

The entire file is a comment block. No CSS rule has been added yet — the file exists as scaffolding and documentation. The comment is genuinely useful for developers working the project, explaining why the BZ override approach works case-by-case (not via a broad reset). Trimming this file saves 1,910 bytes with zero functional impact. See Section 3 for risk assessment.

---

### 6. footer.css — 2,010 bytes

| Category | Bytes | Notes |
|----------|------:|-------|
| Active rules (BZ-injected markup) | ~700 | `.site-footer`, `.site-footer__brand`, `.footer-social-link` |
| Comments | 1,308 | Section headers + cross-file note (65% overhead) |
| Blank lines | 11 | |
| Dead | 0 | All selectors target BZ-injected footer markup |

High comment ratio — 65% of the file is headers and cross-reference notes. The rules themselves are all active.

---

### 7. reviews.css — 6,926 bytes

| Category | Bytes | Notes |
|----------|------:|-------|
| Active rules | ~3,900 | `.reviews-grid`, `.review-card` + children, `.reviews-table` + children, responsive rules |
| Likely-dead | 120 | `.reviews-grid[data-reviews-layout="list"]` (L29–33): no active HTML sets this attribute |
| Comments | 2,709 | Section headers + inline explains (39%) |
| Blank lines | 38 | |

Both card mode (`index.html`, `shows.html`) and table mode (`press-kit.html` via `data-reviews-render="table"`) are confirmed active. The `data-reviews-layout="list"` selector is a third layout mode with no HTML consumer across the 4 active files.

---

### 8. buttons-v0.css — 3,268 bytes

| Category | Bytes | Notes |
|----------|------:|-------|
| Active rules | ~1,900 | All `wa-button` ::part rules — `variant="brand"`, `variant="neutral"`, disabled states, label parts |
| Comments | 1,355 | File header + inline context notes (41%) |
| Blank lines | 13 | |
| Dead | 0 | `wa-button` is used in all 4 active HTML files with `variant="brand"` and `variant="neutral"` confirmed |

`variant="brand"` + `size="large"` in index.html; `variant="brand"` + `size="small"` in press-kit.html; both variants in videos.html. Disabled state rules (`wa-button[disabled]`) fire on shows page (past shows) and press-kit downloads. All rules confirmed active.

---

### 9. homepage.css — 10,343 bytes

| Category | Bytes | Notes |
|----------|------:|-------|
| Active rules | ~6,000 | All 8 sections: `.section-hero`, `.section-album`, `.section-press`, `.section-tour`, `.section-watch`, `.section-about`, `.section-join`, `.section-contacts` |
| Comments | 4,269 | Section headers (41%) |
| Blank lines | 65 | |
| Dead | 0 | All selectors confirmed in index.html; `.section-contacts__*` also fires in press-kit.html and shows.html |

---

### 10. press-kit.css — 13,967 bytes

| Category | Bytes | Notes |
|----------|------:|-------|
| Active rules | ~10,300 | All 11 sections confirmed in press-kit.html; `.section-live` also fires in shows.html |
| Comments | 3,549 | Section headers (25%) |
| Blank lines | 95 | |
| Dead | 0 | All selectors confirmed active |

Largest single file in the bundle. Healthy 25% comment ratio.

---

### 11. shows.css — 11,522 bytes

| Category | Bytes | Notes |
|----------|------:|-------|
| Active rules | ~5,400 | `.shows-grid`, `.shows-table` + all children, section wrappers (`.section-shows-hero`, `.section-upcoming`, `.section-tba`, `.section-past`, `.section-live-reviews`, `.section-booking`) |
| Dead — confirmed by file comment | 3,623 | All `.show-card` rules and variants (see below) |
| Comments | 2,754 | Section headers + inline notes (25%) |
| Blank lines | 87 | |

**Dead code block — `.show-card` and variants (3,623 bytes):**

The file's own comment at L164 states: *"The CSS-only grid rules above are now dead code (no .show-card produced in table mode) but kept for reference."* Both `shows.html` and `index.html` set `data-shows-layout="table"` on every `.shows-grid` element. The JavaScript renderer produces a `<table class="shows-table">`, not `.show-card` elements. Dead blocks:

| Dead block | Lines | Bytes |
|-----------|------:|------:|
| DEFAULT CARD section + `.show-card` rules | L28–78 | 969 |
| STATUS VARIANTS (`.show-card--past`, `.show-card--tba`) | L80–99 | 425 |
| STATUS TEXT (`.show-card__status-text`) | L101–112 | 267 |
| TYPE LABEL PILL (`.show-card__type-label`, `--festival`) | L114–136 | 612 |
| `[data-shows-layout="table"] .show-card` CSS-only rules | L138–160 | 559 |
| Mobile responsive `.show-card` rules | L457–494 | 791 |
| **Total** | | **3,623** |

---

### 12. videos.css — 6,634 bytes

| Category | Bytes | Notes |
|----------|------:|-------|
| Active rules | ~4,200 | All `.video-album-*`, `.video-card*`, `.section-videos-*` selectors confirmed in videos.html |
| Comments | 2,379 | Section headers (36%) |
| Blank lines | 54 | |
| Dead | 0 | |

---

### 13. cult-membership.css — 6,197 bytes

| Category | Bytes | Notes |
|----------|------:|-------|
| Active rules in 4 deployed pages | 0 | No selectors match index.html, shows.html, press-kit.html, or videos.html |
| Dead (cult-membership.html only) | ~4,800 | All page-specific rules: `.section-cult-hero`, `.section-support`, `.cult-benefits-grid`, `.section-join-tiers`, `.section-privileges`, `.privileges-table`, `.tier-header`, `.section-faq` |
| Semi-shared selectors | ~80 | `.section-press--membership` (modifier on `.section-press` from homepage.css) and `.section-join` (fires on homepage too — rule is `background: var(--color-bg-secondary)` on a modifier class) |
| Comments | 1,316 | Section headers (22%) |
| Blank lines | 56 | |

The `v0.css` comment block notes that `cult-membership.html` is explicitly excluded from the v0 baseline ("This is the baseline bundle loaded by all pages EXCEPT cult-membership.html") — yet `cult-membership.css` is still imported into v0. This appears to be an oversight: the intent was to exclude the cult membership page, but its CSS was still pulled into the shared bundle.

---

### 14. section-rhythm.css — 5,806 bytes

| Category | Bytes | Notes |
|----------|------:|-------|
| Active rules | ~2,200 | Section alternation pattern, hero exclusions, heading text-transform override, BZ header transparency rules |
| Comments | 3,529 | History doc + inline explains (61% overhead) |
| Blank lines | 13 | |
| Dead | 0 | All selectors target live BZ page structure |

Highest comment ratio after bandzoogle-overrides.css (61%). The comment block includes: the alternation pattern docs, a history of the gradient experiment that was abandoned, and inline notes on each BZ selector. All are useful developer context but contribute significantly to size.

---

## Section 3 — Trim candidates (sorted by byte estimate)

| # | Candidate | Location | Byte estimate | Risk | Notes |
|---|-----------|----------|:-------------:|------|-------|
| 1 | `cult-membership.css` — entire file | `cult-membership.css` | 6,197 | **Low** | Page not deployed; no selectors match 4 active HTML files. The v0.css comment explicitly says the bundle is for "all pages EXCEPT cult-membership.html" — this import appears to be an oversight. |
| 2 | `bandzoogle-overrides.css` — 100% comments | `bandzoogle-overrides.css` | 1,910 | **Medium** | Zero CSS rules; pure developer docs. Trimming saves 1,910 bytes at the cost of losing inline BZ override pattern documentation. Consider archiving content to `docs/css-quirks.md` before removing. |
| 3 | `.show-card` status variants + type labels | `shows.css` L80–136 | 1,304 | **None** | `.show-card--past`, `.show-card--tba`, `.show-card__status-text`, `.show-card__type-label` — file's own comment confirms dead. No `.show-card` is produced in table mode. |
| 4 | `.show-card` default card block | `shows.css` L28–78 | 969 | **None** | File comment: "dead code (no .show-card produced in table mode)." |
| 5 | `.show-card` mobile responsive rules | `shows.css` L457–494 | 791 | **None** | Mobile layout rules for `.show-card` which is never rendered. |
| 6 | `.mock-product-title` + `.mock-product-desc` | `typography.css` L248–273 | 703 | **Low** | Only `staging-wrapper.html` uses these classes (not deployed). Both use `--font-display-secondary` (Cinzel) — a deprecated token. |
| 7 | `wa-button` doc-only rules | `typography.css` L228–247 | 603 | **None** | File comment: "Kept as documentation only — these rules do not fire." `buttons-v0.css` (imported later) wins the cascade. Pure dead weight. |
| 8 | `.shows-grid[table] .show-card` CSS-only rules | `shows.css` L138–160 | 559 | **None** | "CSS-only grid rules above are now dead code" — verbatim from file comment. |
| 9 | `.text-eyebrow` + `.text-accent-*` utilities | `typography.css` L328–345 | 548 | **Medium** | Not in 4 active pages. But: these are generic utility classes that could appear in Bandzoogle custom text blocks or blog posts outside the staging HTML. Confirm with client whether any live pages use them. |
| 10 | Deprecated token definitions | `variables.css` L68–74 | 383 | **Low** | `--font-display-secondary`, `--font-cinzel-min/max`, `--font-display-tertiary`. DEPRECATED comment already in file. Consumers are staging-wrapper.html inline styles and dead typography.css rules. If items 6 and 11 are also trimmed, these tokens have zero production consumers. |
| 11 | `.membership-benefit` | `typography.css` L274–285 | 357 | **Low** | Only `staging-wrapper.html`. Uses `--font-display-secondary` (deprecated token). |
| 12 | `icons.css` — entire file | `icons.css` | 695 | **Low–Medium** | All 3 rules target `fa-thin` classes only in staging-wrapper.html and cult-membership.html. File header confirms this. **Caveat:** if FA Thin icons appear in any live BZ blog/custom content, `i.fa-thin` base rule would fire. Confirm with client. |
| 13 | `.section-heading__title` | `typography.css` L78–80 | 201 | **Low** | Only `staging-wrapper.html`. Not in any of 4 active HTML files. |
| 14 | `.reviews-grid[data-reviews-layout="list"]` | `reviews.css` L29–33 | 120 | **Low** | No active HTML uses `data-reviews-layout="list"`. Three-line rule block. |

---

## Section 4 — Comments and whitespace opportunity

### Per-file overhead

| File | Total bytes | Comment bytes | Blank bytes | Overhead % |
|------|------------:|--------------:|------------:|:----------:|
| `variables.css` | 6,292 | 2,998 | 30 | 48% |
| `icons.css` | 695 | 460 | 4 | 67% |
| `typography.css` | 9,560 | 3,830 | 50 | 41% |
| `navigation.css` | 4,256 | 1,569 | 22 | 37% |
| `bandzoogle-overrides.css` | 1,910 | 1,910 | 1 | 100% |
| `footer.css` | 2,010 | 1,308 | 11 | 66% |
| `reviews.css` | 6,926 | 2,709 | 38 | 40% |
| `buttons-v0.css` | 3,268 | 1,355 | 13 | 42% |
| `homepage.css` | 10,343 | 4,269 | 65 | 42% |
| `press-kit.css` | 13,967 | 3,549 | 95 | 26% |
| `shows.css` | 11,522 | 2,754 | 87 | 25% |
| `videos.css` | 6,634 | 2,379 | 54 | 37% |
| `cult-membership.css` | 6,197 | 1,316 | 56 | 22% |
| `section-rhythm.css` | 5,806 | 3,529 | 13 | 61% |
| **Total** | **89,386** | **33,935** | **539** | **39%** |

### Comment taxonomy

The comments fall into three categories:

1. **Section heading markers** (`/* ====\n   SECTION NAME\n   ==== */`) — account for the majority of comment bytes. Present in every file. Each marker is ~3 lines / ~100 bytes. Across 14 files with ~3–10 sections each, these contribute an estimated **12,000–15,000 bytes** of the 33,935 total.

2. **File headers and attribution** (`/* File — typography.css / Part of AUSTIN_SPACE build... */`) — 4–6 lines per file, ~250 bytes each. 14 files × ~300 bytes = ~4,200 bytes. Useful developer provenance.

3. **Inline WHY comments** — explanations of non-obvious rules (e.g., `/* margin !important — beats Bandzoogle's #usersite-container blockquote { margin: 1em 0; } */`). These are the highest-value comments — they encode institutional knowledge about BZ quirks that would otherwise be re-discovered expensively. Estimated: ~10,000 bytes across the bundle.

### Recommendation

Manual comment cleanup is **not the most efficient first pass**. The dead-code candidates in Section 3 offer 14,988 bytes at zero implementation risk (several are None-risk), while comment stripping would require careful line-by-line decisions across 3,479 lines.

If comment cleanup is done, the priority order is:
1. `bandzoogle-overrides.css` — 1,910 bytes, zero rules, highest-yield single action (but archive content to docs/ first)
2. Section heading markers (`/* === SECTION NAME === */`) — reduce to single-line `/* SECTION NAME */` format, save ~3–5 bytes per marker, ~500–1,000 bytes across the bundle
3. Leave inline WHY comments untouched — they are the most valuable documentation in the codebase

**Full minification opportunity** (strip all comments + blank lines): ~34,474 bytes. Would bring the bundle to ~57,000 bytes — well inside any Bandzoogle limit. Deferred per user decision.

---

## Section 5 — v0/v2 boundary

### Deprecated token definitions

`variables.css` lines 68–74 define four deprecated font tokens, accompanied by a `/* DEPRECATED */` comment:

```css
--font-display-secondary: 'Cinzel', Georgia, serif;
--font-cinzel-min: 1.125rem;
--font-cinzel-max: 1.9375rem;
--font-display-tertiary: 'Cormorant Garamond', Georgia, serif;
```

**Byte cost:** ~383 bytes (comment block + 4 definitions).

**Current consumers:**

| Consumer | Status |
|----------|--------|
| `typography.css` `.mock-product-title` | Dead — only staging-wrapper.html (not deployed) |
| `typography.css` `.membership-benefit` | Dead — only staging-wrapper.html (not deployed) |
| `staging-wrapper.html` inline styles | Not deployed — design sandbox only |
| Live Bandzoogle pages | Not found — no active HTML files reference these tokens |

**Conclusion:** If `.mock-product-title` and `.membership-benefit` are trimmed from typography.css (items 6 and 11 in the candidates table), these 4 tokens have zero consumers in the production bundle. Their only remaining use would be in staging-wrapper.html's inline styles, which is the local design sandbox.

**Open question for user:** Is staging-wrapper.html still in use for Cinzel preview work? If the v2 typography direction has fully shifted to the Georgia two-font system, staging-wrapper.html's inline Cinzel references are also obsolete, and these token definitions can be safely removed from the v0 bundle.

**Is staging-wrapper.html a deployed page?** Per project memory and the file's own usage (Live Server on port 5501), staging-wrapper.html is the local design sandbox. It is NOT a page that Bandzoogle serves. These token definitions are in the v0 bundle but serve no production purpose.

---

## Section 6 — Estimated opportunity

| Item | Bytes |
|------|------:|
| Bundle current size | 91,483 |
| — | — |
| **Risk: None** candidates | |
| `.show-card` block + variants + mobile | 3,623 |
| `wa-button` doc-only rules (typography.css) | 603 |
| **Subtotal — zero-risk** | **4,226** |
| — | — |
| **Risk: Low** candidates | |
| `cult-membership.css` — entire file | 6,197 |
| `.mock-product-title` + `.mock-product-desc` | 703 |
| Deprecated token definitions (variables.css) | 383 |
| `.membership-benefit` (typography.css) | 357 |
| `icons.css` — entire file *(see caveat)* | 695 |
| `.section-heading__title` | 201 |
| `.reviews-grid[data-reviews-layout="list"]` | 120 |
| **Subtotal — low-risk** | **8,656** |
| — | — |
| **Risk: Medium** candidates | |
| `bandzoogle-overrides.css` — 100% comments | 1,910 |
| `.text-eyebrow` + `.text-accent-*` utilities | 548 |
| `i.fa-thin` base rule *(only if icons.css not trimmed as whole)* | 73 |
| **Subtotal — medium-risk** | **2,531** |
| — | — |
| **All candidates total** | **15,413** |
| **Estimated post-trim size** | **~76,070** |
| **Saving** | **~16.9%** |
| — | — |
| Zero + low risk only total | 12,882 |
| Post zero+low-risk trim | **~78,601** |

*Note: byte estimates for dead code blocks are based on measured line ranges in source files. Actual bundle reduction will differ slightly due to UTF-8 encoding overhead in the build process.*

---

## Open questions for user

1. **`cult-membership.css` (6,197 bytes) — will the cult membership page be deployed?**  
   If yes, the file is correct to be in the bundle. If not, it is the single largest trim candidate and can be removed entirely. The v0.css header comment says the bundle is for "all pages EXCEPT cult-membership.html", suggesting this import is an oversight rather than intentional.

2. **`bandzoogle-overrides.css` (1,910 bytes) — trim the comment or archive it?**  
   The comment documents the BZ broad-reset mistake and the case-by-case override pattern. This context is valuable. Consider moving the content to `docs/css-quirks.md` before trimming the file from the bundle. Saves 1,910 bytes with no functional impact.

3. **`.text-eyebrow` + `.text-accent-purple/green/gold` (548 bytes) — are these used anywhere on the live BZ site?**  
   These generic utility classes are absent from all 4 staging HTML files. However, they could have been applied to text in Bandzoogle's custom text blocks, blog posts, or other BZ page editor content that is not represented in staging HTML. Client confirmation needed before trimming.

4. **`icons.css` (695 bytes) — are FA Thin icons used anywhere on the live BZ site?**  
   The `i.fa-thin` base rule would fire if FA Thin icons appear anywhere in Bandzoogle page content. The file comment explicitly says these are for staging-wrapper.html and cult-membership.html only. If confirmed unused on live pages, the whole file is removable.

5. **Deprecated token definitions (383 bytes) — is staging-wrapper.html still in active use?**  
   If staging-wrapper.html is being retired (it pre-dates the Georgia two-font system), the `--font-display-secondary`, `--font-cinzel-min/max`, and `--font-display-tertiary` tokens can be removed from the v0 bundle. Removing them would also break staging-wrapper.html's Cinzel previews — is that acceptable?

6. **`wa-button[size="small"]::part(label)` in typography.css (inline comment, L243):**  
   The doc-only rule for `size="small"` contains a note: *"font-size: 12px; not specified in buttons-v0.css — flagged for confirmation"*. When the doc-only block is removed, consider whether a `size="small"` rule should be intentionally added to buttons-v0.css. press-kit.html uses `size="small"` on wa-buttons.

# Deployment configuration

This document records the configuration values needed to deploy
the v0 site to Bandzoogle.

## Data file URLs

Data files are uploaded to Bandzoogle's Files area and hosted at
predictable URLs in the format `/files/{file-id}/{filename}`.

| File                  | Production URL                                                           |
|-----------------------|--------------------------------------------------------------------------|
| reviews.json          | https://gypsypistoleros.com/files/1413218/reviews.json                   |
| shows.json            | https://gypsypistoleros.com/files/1413219/shows.json                     |
| gp-arches-promo.jpeg  | https://gypsypistoleros.com/files/1413423/gp-arches-promo.jpeg           |
| gp-sigil.png          | https://gypsypistoleros.com/files/1413427/gp-sigil.png                   |
| gp-darkfaerietales-album.webp | https://gypsypistoleros.com/files/1413344/gp-darkfaerietales-album.webp |

Note: file ID 1413345 is the old `.webp` upload of the same hero photo — unreferenced, can be deleted from BZ Files.

## CSS deployment

The compiled stylesheet is hosted on GitHub Pages, not in Bandzoogle.

**Bundle source:** `scripts/build-v0-bundle.sh` → `dist/v0-bundle.css`

**Hosted at:** `https://austin-space-files.github.io/gypsy-pistoleros/dist/v0-bundle.css`
(repo: `github.com/AUSTIN-SPACE-files/gypsy-pistoleros`)

**Loaded via** a `<link>` tag in Bandzoogle → Pages → Site-wide Settings → Headers & Metatags:

```html
<link rel="stylesheet" href="https://austin-space-files.github.io/gypsy-pistoleros/dist/v0-bundle.css">
```

**Update workflow:**
1. Edit source CSS files
2. Run `./scripts/build-v0-bundle.sh`
3. `git add dist/v0-bundle.css && git commit && git push`
4. GitHub Pages deploys in ~30 seconds — hard-refresh to verify

**⚠️ BZ Custom CSS field must stay empty.** Do not paste CSS into
Bandzoogle → Design → Customize CSS. All styles are loaded through
the `<link>` tag above.

---

## Runtime configuration

The renderers (reviews.js, shows.js) check for a global config
object before fetching. The config is set in Bandzoogle's
site-wide Headers & Metatags via an inline `<script>` block.

### The config block

Paste this into Bandzoogle: Pages → Site-wide Settings →
Headers & Metatags. Place it BEFORE the renderer `<script>` tags.

```html
<!-- v0 runtime config — data file URLs for the reviews and shows renderers -->
<script>
  window.GYPSY_CONFIG = {
    reviewsUrl: 'https://gypsypistoleros.com/files/1413218/reviews.json',
    showsUrl:   'https://gypsypistoleros.com/files/1413219/shows.json'
  };
</script>
```

### The renderer script tags

These also go in Bandzoogle Headers & Metatags, AFTER the config
block. The src URLs need to point at the hosted versions of
reviews.js and shows.js — upload these files to Bandzoogle Files
and paste the resulting URLs here.

```html
<!-- Renderers — load AFTER the config block above -->
<script src="https://gypsypistoleros.com/files/1413221/reviews.js" defer></script>
<script src="https://gypsypistoleros.com/files/1413220/shows.js" defer></script>
```

Replace `{ID}` with the actual Bandzoogle file IDs after uploading
reviews.js and shows.js to Files.

## Inline runtime (cross-origin / no-Files-upload deployments)

When the deployment target cannot fetch data files from the live
site's `/files/` URLs — typically due to CORS restrictions on a
different Bandzoogle account, or when no Files upload capability is
available (trial plans) — use the inline runtime instead.

### Generate the artefact

```
./scripts/build-inline-runtime.sh
```

Produces `dist/v0-runtime-inline.html`.

### Deploy the artefact

1. Open `dist/v0-runtime-inline.html` in a text editor
2. Copy the entire contents
3. Paste into Bandzoogle → Pages → Site-wide Settings →
   Headers & Metatags, AFTER the fonts/WA/FA blocks
4. Save

The inline artefact contains:
- Both data files (`reviews.json`, `shows.json`) as JS object literals
- Both renderer modules (`reviews.js`, `shows.js`) inlined verbatim
- All wrapped in `window.GYPSY_CONFIG` and direct `<script>` tags

### Updating data with the inline artefact

When reviews or shows data changes:
1. Edit the canonical file locally (`data/reviews.json` or `data/shows.json`)
2. Run `./scripts/build-inline-runtime.sh`
3. Copy the new `dist/v0-runtime-inline.html` contents
4. Re-paste into Bandzoogle Headers & Metatags (REPLACE the old block)
5. Save in Bandzoogle

### When to use inline vs file-based

- **Inline runtime**: trial Bandzoogle plans, cross-origin deployments,
  simplest setup with one paste
- **File-based**: paid Bandzoogle plans with Files uploads, same-origin
  deployments, data updates without re-pasting Headers

Both architectures coexist. The same renderer files (`reviews.js`,
`shows.js`) support both. The choice is which deployment configuration
to use.

---

## Updating data

To update reviews or shows data on the live site:
1. Edit the canonical file locally (`data/reviews.json` or `data/shows.json`)
2. Re-upload to Bandzoogle Files, **replacing** the existing file
   (this preserves the file ID and URL — no re-paste needed)
3. Hard-refresh the live site to verify

If a file is uploaded as new (rather than replacing) it gets a new
file ID and URL. The config block in Headers & Metatags must then
be updated with the new URL.

## What to paste into Bandzoogle's Custom HTML block

When deploying a v0 page to Bandzoogle via Pages → New Page →
Custom HTML block, paste **only** the contents of
`<div class="page-content">...</div>` from the staging HTML file.

Do NOT paste:
- The `<!DOCTYPE html>` declaration
- The `<html>` or `<head>` tags
- Any `<link>`, `<meta>`, `<script>`, or `<title>` tags
- The `<body>` tag

These are provided by Bandzoogle's page chrome (Headers & Metatags +
per-page BZ admin settings).

Pasting the `<head>` section causes:
- The skeleton's `<link rel="stylesheet" href="../css/v0.css">` to
  attempt loading `https://gypsypistoleros.com/css/v0.css`, which
  returns 200 with MIME type `text/plain`. The browser refuses to
  apply it under strict MIME checking — harmless but generates a
  console error.
- Possible nesting issues with Bandzoogle's own `<head>` markup.

The wrapping `<div class="page-content">` itself can be included or
omitted in the paste — either works.

## Local development

In local development, `window.GYPSY_CONFIG` is unset and the renderers
fall back to relative paths (`../data/reviews.json`, `../data/shows.json`).
No configuration needed for local preview to work.

---

## Page status

| Page | Source file | Status | Draft URL | Notes |
|------|-------------|--------|-----------|-------|
| Homepage (`/`) | `staging/index.html` | ✅ **Production-ready** | `/v0-homepage-draft` | Pass 6i complete. |
| Press Kit (EPK) | `staging/press-kit.html` | ✅ **Production-ready** | `/v0-press-kit-draft` | Pass 7e complete. |
| Shows | `staging/shows.html` | ✅ **Production-ready** | `/v0-shows-draft` | Pass 8e complete. |
| Videos | `staging/videos.html` | 🟡 Pending deploy | `/v0-videos-draft` | Pass 9a complete. BZ file IDs needed — see below. |
| Cult Membership | `staging/cult-membership-v0.html` | 🟡 Pending deploy | — | Staging only. |
| Merch Store | — | ⚙️ BZ-managed | — | Bandzoogle native store — no v0 work. |

### Homepage promotion checklist

When ready to make the homepage live:

1. Verify the `<link>` tag for `https://austin-space-files.github.io/gypsy-pistoleros/dist/v0-bundle.css`
   is present in BZ Headers & Metatags (see [CSS deployment](#css-deployment))
2. Copy contents of `<div class="page-content">` from `staging/index.html`
3. Paste into Bandzoogle → Pages → Home → Edit → Custom HTML block
4. Save and hard-refresh `gypsypistoleros.com`
5. Verify hero photo loads (ID 1413423 — `gp-arches-promo.jpeg`)
6. Verify hero extends behind transparent nav
7. Verify reviews and shows render (renderers loaded via Headers & Metatags)
8. Verify button 3D shadows visible and press-down hover works

### Press kit promotion checklist

When ready to make the press kit live:

1. Copy contents of `<div class="page-content">` from `staging/press-kit.html`
2. Paste into Bandzoogle → Pages → press-kit page → Edit → Custom HTML block
3. Save and hard-refresh the draft URL
4. Verify sigil loads (ID 1413427 — `gp-sigil.png`)
5. Verify album cover loads (ID 1413344 — `gp-darkfaerietales-album.webp`)
6. Verify reviews tables render (17 rows in Dark Faerie Tales section, 6 in Church section)
7. Run the DevTools diagnostic from css-quirks.md to confirm `data-reviews-render="table"` is set
8. Verify download buttons trigger file download (not navigate)
9. Verify wa-card dark theme — black fill, 2px border, no white card flash
10. Swap Section 9 `href="#"` placeholder to the live shows URL (confirm slug post-launch; draft is `/v0-shows-draft`)

### Shows page promotion checklist

When ready to deploy the shows page to Bandzoogle:

1. Copy contents of `<div class="page-content">` from `staging/shows.html`
2. Paste into Bandzoogle → Pages → shows page → Edit → Custom HTML block
3. Save and hard-refresh the draft URL
4. Verify sigil image loads at top of page (ID 1413427 — `gp-sigil.png`)
5. Verify hero h1 "Dark Faerie Tales UK Tour 2026" renders at ~40–64px, not BZ default 25px
6. Verify Upcoming section: Rebellion Punk Festival table row with disabled "Coming soon" button
7. Verify Past Shows section: 12 table rows in reverse chronological order, rows at 0.6 opacity, festival pills on Beltane / No Sleep till Blackpool / Breaking Bands
8. Verify Live Reviews section appears after Past Shows — Rock News review card renders
9. Verify TBA section cult membership link has `data-pending-url="cult-membership-page"` attribute, not a live slug
10. Verify Booking section: two-column grid with Rebel Meets Rebel Live and Jay Shredder contacts
11. Table layout verified (Pass 8e) — gold headers, type pills, status column, mobile stacked-cell fallback ✓
12. Mobile: table columns stack as labelled blocks with data-label prefixes

---

## Videos page (Pass 9a)

### New files

| File | Description |
|------|-------------|
| `data/videos.json` | Video dataset — albums array with youtube_id per entry. **All `REPLACE_WITH_YOUTUBE_ID` placeholders must be filled in before deploying.** |
| `js/videos.js` | Videos renderer IIFE — fetches videos.json, renders album sections with facade thumbnails, swaps facade for iframe on click. |
| `staging/videos.html` | Videos page source. Chrome structure matches other v0 pages. |
| `css/components/videos.css` | Videos page styles (album headers, card grid, facade, iframe, cta-link buttons). |

### Upload steps to Bandzoogle (in order)

1. **Fill in all YouTube IDs** in `data/videos.json` — replace every `REPLACE_WITH_YOUTUBE_ID` string with the real 11-character YouTube video ID.

2. **Upload `data/videos.json` to BZ Files**
   - Bandzoogle → Files → Upload
   - Note the new file ID (format: `https://gypsypistoleros.com/files/{ID}/videos.json`)
   - ⚠️ **Placeholder — update with actual ID after upload**

3. **Upload `js/videos.js` to BZ Files**
   - Note the new file ID
   - ⚠️ **Placeholder — update with actual ID after upload**

4. **Update `GYPSY_CONFIG` in BZ Headers & Metatags**
   Add `videosUrl` to the existing config block:
   ```html
   <script>
     window.GYPSY_CONFIG = {
       reviewsUrl: 'https://gypsypistoleros.com/files/1413218/reviews.json',
       showsUrl:   'https://gypsypistoleros.com/files/1413219/shows.json',
       videosUrl:  'https://gypsypistoleros.com/files/[NEW-ID]/videos.json'
     };
   </script>
   ```

5. **Add `videos.js` script tag to BZ Headers & Metatags** (after the config block):
   ```html
   <script src="https://gypsypistoleros.com/files/[NEW-ID]/videos.js" defer></script>
   ```

6. **Update `data-videos-src`** in `staging/videos.html`:
   Replace the placeholder URL in the `#gp-videos` div:
   ```html
   data-videos-src="https://gypsypistoleros.com/files/[NEW-ID]/videos.json"
   ```

7. **Rebuild and push the CSS bundle**
   ```
   ./scripts/build-v0-bundle.sh
   git add dist/v0-bundle.css && git commit -m "rebuild bundle" && git push
   ```
   GitHub Pages deploys in ~30s. Do NOT paste CSS into BZ Customize CSS — see [CSS deployment](#css-deployment).

8. **Create BZ page `/v0-videos-draft`**
   - Bandzoogle → Pages → Add Page → Custom HTML
   - Set page URL to `v0-videos-draft`
   - Paste **only the contents of `<div class="page-content">…</div>`** from `staging/videos.html`
   - Do NOT paste the `<!DOCTYPE>`, `<head>`, or `<body>` tags

### Post-deploy checklist

1. Verify album sections render (Dark Faerie Tales, Church of the Pistoleros, etc.)
2. Verify thumbnail images load for all cards (if a youtube_id is wrong, hqdefault.jpg returns a grey 120×90 placeholder — spot check)
3. Click a play button — facade should be replaced by embedded YouTube iframe with autoplay
4. Verify gold album titles render at correct size (Cinzel, uppercase, ~1.75rem desktop)
5. Verify single album (`is_single: true`) shows "Single · 2023" year format
6. Verify CTA row at bottom: "Subscribe on YouTube" gold button + "See all shows" secondary button
7. Verify 3D press-down shadow on CTA buttons (hover: shifts 2px down)
8. Mobile: verify grid stacks to 1 column at ≤720px
9. Mobile: verify play button shrinks to 48px

### Important notes

- **BZ HTML feature does NOT auto-sync** — if you edit `staging/videos.html`, you must re-paste into the BZ page.
- Videos.js reads `data-videos-src` from the mount point. Update that attribute in staging/videos.html once the real BZ file URL is known.
- Thumbnail URLs are derived from youtube_id: `https://i.ytimg.com/vi/{id}/hqdefault.jpg`. No separate thumbnail upload needed.
- The `data/videos.json` file can be updated without touching videos.js or the CSS. Re-upload to BZ Files (replacing the existing file preserves the file ID and URL).

---

### Pre-launch styling notes (shows page)

Not deployment blockers, but flagged for pre-launch polish:

- Booking section: consider adding a Press Inquiries contact block
  to match the press kit Contacts section (BJF PR, label, etc.)
- Live Reviews card body: missing reviewer credit / score / stars
  compared to press-kit table-mode reviews — may need a
  live-review card layout variant in reviews.css
- Booking section h2 size may differ from other section headings
  under BZ's default h2 override — verify on draft and fix in
  a styling sweep if needed

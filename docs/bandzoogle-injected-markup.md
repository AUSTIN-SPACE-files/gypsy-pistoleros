# Bandzoogle Injected Markup

This document records the actual HTML Bandzoogle injects site-wide around every
page content block. It is the source of truth for class names when writing
`navigation.css`, `header.css`, and `footer.css`.

The design sandbox (`staging/staging-wrapper.html`) contains a hand-drafted
approximation of the nav and footer. That approximation does **not** match what
Bandzoogle actually outputs and should not be used as a styling reference.

**Date captured:** 2026-05-21  
**Source:** live gypsypistoleros.com, DevTools view-source

---

## Injected nav markup

```html
<nav id="main-nav" class="non-mobile" data-action="turbo:load@document->selected-page#mark" data-controller="selected-page">
  <ul class="horizontal list balance_5 top menu-length-9">
    <li class="top selected">
      <div><a class="top" href="/home">Home</a></div>
    </li>
    <li class="top">
      <div><a class="top" href="/shows">Shows</a></div>
    </li>
    <li class="top">
      <div><a class="top" href="/videos">Videos</a></div>
    </li>
    <li class="top">
      <div><a class="top" target="_external" href="/cds-and-vinyls">CDs and Vinyls</a></div>
    </li>
    <li class="top">
      <div><a class="top" href="/merch-store">Merch Store</a></div>
    </li>
    <li class="top">
      <div><a class="top" href="/contact-booking">Contact &amp; Booking</a></div>
    </li>
    <li class="top">
      <div><a class="top" href="/press-kit-epk">Press Kit (EPK)</a></div>
    </li>
    <li class="has-submenu top">
      <div><a class="top" href="/become-a-member-of-the-cult-of-the-pistoleros">Become a Member of The CULT of the Pistoleros!</a></div>
      <ul style="left: 50%;">
        <li class="subpage">
          <div><a class="" href="/the-high-order-of-the-cultof-the-pistoleros-area">The High Order of The Cultof the Pistoleros Area</a></div>
        </li>
      </ul>
    </li>
    <li class="top">
      <div><a class="top" href="/new-album-reviews-so-far">NEW ALBUM REVIEWS So far</a></div>
    </li>
  </ul>
</nav>
```

### Key selectors

| Selector | Notes |
|----------|-------|
| `#main-nav` | Root nav element |
| `nav#main-nav.non-mobile` | Desktop variant — a mobile variant exists with different classes (not yet captured) |
| `ul.horizontal.list.top` | Main menu list — safe to target |
| `ul.balance_5` | Bandzoogle balance class — likely varies; avoid targeting directly |
| `ul.menu-length-9` | Dynamic — changes with item count; do not target |
| `li.top` | Top-level nav item |
| `li.top.selected` | Currently active page |
| `li.has-submenu.top` | Item with a dropdown submenu |
| `li.subpage` | Nested submenu item |
| `a.top` | Top-level link anchor |
| `div` (inside `li.top`) | Bandzoogle wraps each anchor in a `<div>` — relevant for flex/padding rules |

**Note on the submenu item:** The "Cult of the Pistoleros" nav item has a
dropdown pointing to the members-only area. The submenu `<ul>` has an inline
`style="left: 50%;"` applied by Bandzoogle's JS — this will override any CSS
positioning on `.has-submenu ul` unless `!important` is used or the inline
style is overridden via a higher-specificity rule.

---

## Injected footer markup

```html
<div id="footer-wrap">
  <div>
    <footer id="site-wide-footer" class="site-wide-footer">
      <moda-sections class="zoogle-content" data-arrangement-id="5956517" data-controller="content-width" content-width="...">
        <moda-section
          class="moda m-section m-shape m-masked m-style-feature-row-15549433 zoogle-columns zoogle-columns-1 zoogle-columns-100 default-section-style padding-none title-alignment-left block block-row layout_full"
          data-row-id="15549433"
          id="feature_row_15549433"
          variant="1"
          style="z-index: 1;">

          <div class="zoogle-columns-inner site-wrap">
            <div class="zoogle-column zoogle-column-1-of-1 col_1_of_1 layout_full" data-column-id="18362120" id="feature_column_18362120">
              <!-- Feature Row content block slot — custom brand footer goes here -->
            </div>
          </div>

          <div class="zoogle-columns-inner site-wrap">
            <div class="injected-footer">
              <footer id="page-footer" data-controller="session" data-session-url-value="/go/member/profile">

                <div class="zoogle-feature block layout_full" data-block-id="1074204" id="sitewide_block_1074204">
                  <section class="feature text_feature" data-feature-id="4348965" data-controller="content-width" id="text_feature_4348965">
                    <div data-controller="zoogle-video" data-action="message@window->zoogle-video#handleVimeoPostMessage">
                      <p>Copyright property of Gypsy Pistoleros &amp; The New Church Records 2026</p>
                    </div>
                  </section>
                </div>

                <p class="hide" data-controller="attributions">
                  Some images © <span data-attributions-target="list"></span>
                </p>

                <nav>
                  <ul>
                    <li><a class="no-pjax link" href="/go/help">Contact</a></li>
                    <li class="if-logged-in"><a class="no-pjax link" href="/go/member/edit">Edit profile</a></li>
                    <li class="unless-logged-in"><a class="login no-pjax link" rel="nofollow" href="/user_sessions/new">Log in</a></li>
                    <li class="if-logged-in"><a class="no-pjax link" data-turbo="false" rel="nofollow" data-method="delete" href="/user_sessions/logout">Log out</a></li>
                  </ul>
                </nav>

              </footer>
            </div>
          </div>

        </moda-section>
      </moda-sections>
    </footer>
  </div>
</div>
```

### Key selectors

| Selector | Notes |
|----------|-------|
| `#footer-wrap` | Outermost wrapper div |
| `footer#site-wide-footer.site-wide-footer` | Bandzoogle's site-wide footer element |
| `moda-sections` / `moda-section` | Bandzoogle custom elements — CMS-managed Feature Rows live inside these |
| `.zoogle-columns-inner.site-wrap` | Inner layout wrapper; controls max-width/padding of footer columns |
| `#feature_column_18362120` | The empty column slot where the custom brand footer Feature Row will be added |
| `.injected-footer` | Wraps `#page-footer` — the Bandzoogle-managed copyright block |
| `footer#page-footer` | Copyright text + member utility nav (Log in / Log out / Edit profile) |
| `section.feature.text_feature` | The copyright text Feature block |
| `#page-footer nav ul li.if-logged-in` | Member-only nav items — hidden unless logged in via Bandzoogle session |
| `#page-footer nav ul li.unless-logged-in` | Shown only when logged out |

**Custom brand footer note:** The bulk of the footer is a Bandzoogle Feature Row
content block managed via the CMS (`moda-section`, `feature_row_15549433`). The
custom brand footer — social icons, tagline, AUSTIN_SPACE credit — will be added
as a **separate Feature Row content block in Bandzoogle**, not via CSS or page
HTML. The empty column slot (`#feature_column_18362120`) is where it will appear
in the DOM once added.

---

## Implications for v0

- **v0 launches with Bandzoogle's default nav and footer styling.** The bundle
  in `dist/v0-bundle.css` styles page content blocks only. Bandzoogle applies
  its own base styles to `#main-nav` and `#footer-wrap`.

- **`components/navigation.css` is dead code in v0.** It was written against the
  design sandbox's hand-drafted classes (`.site-nav`, `.nav-list`, etc.) which
  do not exist in the real injected markup. It will not style anything on the
  live site. It is kept on disk pending a full rewrite during v2 work.

- **When v2 navigation styling begins**, it must target the real selectors
  documented above — primarily `#main-nav`, `li.top`, `a.top`, `li.has-submenu`,
  and `li.subpage` — not the sandbox classes.

- **`header.css` and `footer.css` stubs** should be filled in during v2 work
  using the selectors above. `footer.css` will primarily target `#footer-wrap`,
  `footer#site-wide-footer`, and `.injected-footer`. The custom brand footer
  section is CMS-managed and may need minimal or no CSS targeting.

---

## Bandzoogle-managed pages (not maintained in /staging/)

Some pages on gypsypistoleros.com are served entirely by
Bandzoogle's native systems and are NOT maintained as HTML files
in /staging/. The Bandzoogle admin panel is the source of truth
for these.

### /merch-store
- Managed via: Bandzoogle admin → Store / Merch
- Source of truth: Bandzoogle's product database
- `staging/merch-store.html` exists as a placeholder only.
  It is annotated with a comment explaining this. Do not
  treat it as an unfinished page to be built out without
  explicit confirmation.

### Future additions
As more pages are confirmed as Bandzoogle-managed, add them
to this list with the same format.

---

## Header / top chrome — CONFIRMED (Pass 6b diagnostic)

Bandzoogle injects a bare `<header>` element at the top of every
page. Confirmed via DevTools inspection during Pass 6b.

```html
<header>                     <!-- bg: rgb(0,0,0), top:40, height:179px -->
  <div class="title-wrap">
    <h1>
      <span class="inner">GYPSY PISTOLEROS</span>
    </h1>
  </div>
  <nav id="main-nav" class="non-mobile">
    <!-- nav links including "NEW ALBUM REVIEWS So far" as a list item -->
  </nav>
</header>
```

### Confirmed selectors

| Selector | Notes |
|----------|-------|
| `header` | Bare element — carries the dark chrome background |
| `.title-wrap` | Wraps the band name h1 |
| `.title-wrap > h1 > span.inner` | Actual band name text node |
| `#main-nav` | Nav element, class `non-mobile` on desktop |

Mobile nav variant has different classes — not yet captured.

### Convention guesses that did NOT match (kept harmless in CSS rules)

`.site-header`, `.site-title`, `.site-tagline`, `.header-wrap`,
`header[role="banner"]` — none of these exist in the real markup.
They remain in the transparency rules without effect.

### CSS implementation

Transparency rules in `section-rhythm.css` (Pass 6b):

```css
#usersite-container header { background-color: transparent !important; }
#usersite-container .title-wrap,
#usersite-container .title-wrap h1,
#usersite-container .title-wrap .inner { background-color: transparent !important; }
#usersite-container #main-nav { background-color: transparent !important; }
```

Hero pull-up geometry: `header top:40 + height:179 = 219px total`.
Hero uses `margin-top: -250px` (slight overestimate, safe margin).

---

## Shows page deploy (Pass 8 series) — no new BZ-injected markup patterns observed

Standard `<header>` + `#main-nav` + page content area applies.
No shows-specific BZ injection, overlays, or unexpected wrappers
encountered. The nav markup confirms the cult membership page
slug is `/become-a-member-of-the-cult-of-the-pistoleros`
(visible in the nav `<li>` at line 43 above).

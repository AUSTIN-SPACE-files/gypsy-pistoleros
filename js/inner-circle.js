/**
 * inner-circle.js — Inner Circle page (gypsypistoleros.com/blog)
 * AUSTIN_SPACE build — June 2026
 *
 * Injects a <wa-tab-group placement="start"> scaffold over BZ's
 * native gallery and blog feature rows. Three panels:
 *   Welcome       — BZ welcome hero moda-section (user-added)
 *   Images        — per-album preview grid + wa-dialog full gallery
 *   Video updates — BZ blog_feature moda-section (existing posts)
 *
 * THREE-STEP BOOT:
 *
 *   Step 1 (window.load + rAF): SNAPSHOT source references from the
 *     untouched DOM before any mutation. Never re-query after injection.
 *
 *   Step 2: BUILD scaffold and inject it as a SIBLING of
 *     moda-sections.zoogle-content (into #page-content-wrap), NOT inside
 *     the scanned container. This avoids polluting ':scope > moda-section'
 *     queries and triggers the WA autoloader to define wa-tab-group and
 *     wa-tab-panel (deadlock fix from Pass 2).
 *
 *   Step 3 (whenDefined + rAF): POPULATE panels using the snapshotted
 *     source references — move nodes, build preview grids, wire dialogs.
 *
 * Source identification (by DOM signature, not position):
 *   gallery source  — moda-section containing section.feature.gallery_feature
 *   blog source     — moda-section containing section.blog_feature
 *   welcome source  — first moda-section containing neither of the above
 *
 * Gallery: extracts {thumb: img.src, full: a.dnt href, alt} from each
 *   .gallery-item span.img-wrap a.dnt img. Builds a capped preview grid
 *   (PREVIEW_COUNT items) + wa-dialog full gallery per album. Detaches
 *   and .remove()s the original gallery moda-section — isotope never
 *   re-runs on a moved container.
 *
 * Fail gracefully: missing source → console.warn, panel stays empty.
 *   5s timeout on whenDefined warns if WA loader fails to define.
 *
 * DEPLOYMENT: upload to BZ Files, add to Headers & Metatags:
 *   <script src="https://gypsypistoleros.com/files/{ID}/inner-circle.js" defer></script>
 */

(function () {
  'use strict';

  /* =====================================================
     PAGE GUARD — URL (primary discriminator)

     Run ONLY on the blog index page. Post-detail pages share the
     same #page-content-wrap + moda-sections structure so the DOM
     guard below is not enough on its own.

     INDEX_PATHS: exact index slugs (trailing slash stripped).
     *** UPDATE THIS LIST at production cutover ***
     e.g. add '/inner-circle', '/members', or whatever the live slug is.

     isPostDetail: /blog/<numeric-id>/... — matches post URLs even
     when the index slug is '/blog', blocking those before indexOf().
  ===================================================== */

  var _path         = location.pathname.replace(/\/+$/, '');
  var _isPostDetail = /\/blog\/\d+\//.test(location.pathname);
  /* NOTE: one-place update for production cutover — add the live slug here */
  var _INDEX_PATHS  = ['/v0-blog-draft', '/blog'];
  if (_isPostDetail || _INDEX_PATHS.indexOf(_path) === -1) {
    console.log('[inner-circle] not blog index, skipping');
    return;
  }

  console.log('[inner-circle] script start', document.readyState);

  /* =====================================================
     CONSTANTS
  ===================================================== */

  var PREVIEW_COUNT = 8;
  var WA_TIMEOUT_MS = 5000;

  /* =====================================================
     DOM GUARD — exit if BZ hasn't rendered the expected wrapper
     (URL guard above is the primary gatekeeper; this is structural
     defence for pages that somehow share the same slug pattern)

     BZ renders moda-sections.zoogle-content THREE times on this page:
       [0] inside #site-wide-header  — EMPTY, matched first by querySelector
       [1] inside #page-content-wrap — the real content (gallery + blog)
       [2] inside #site-wide-footer  — footer content
     Anchoring to #page-content-wrap first avoids the wrong-host trap.
  ===================================================== */

  var contentWrap = document.getElementById('page-content-wrap');
  if (!contentWrap) return;

  var pageHost = contentWrap.querySelector(':scope > moda-sections.zoogle-content')
              || contentWrap.querySelector('moda-sections.zoogle-content');
  if (!pageHost) return;

  /* Scaffold element — set in boot step 2, consumed in populate() */
  var group = null;

  /* =====================================================
     UTILITY
  ===================================================== */

  function sentenceCase(str) {
    var s = str ? str.trim() : '';
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }

  /* =====================================================
     SOURCE IDENTIFICATION
     Called once against the untouched DOM in boot step 1.
  ===================================================== */

  function identifySources(sections) {
    var gallery = null, blog = null, welcome = null;
    for (var i = 0; i < sections.length; i++) {
      var sec = sections[i];
      if (sec.querySelector('section.feature.gallery_feature')) {
        if (!gallery) gallery = sec;
      } else if (sec.querySelector('section.blog_feature')) {
        if (!blog) blog = sec;
      } else if (!welcome) {
        welcome = sec;
      }
    }
    return { gallery: gallery, blog: blog, welcome: welcome };
  }

  /* =====================================================
     ALBUM EXTRACTION
  ===================================================== */

  function extractAlbum(galleryFeature) {
    var titleEl = galleryFeature.querySelector('header h1.alt-font')
               || galleryFeature.querySelector('header h1')
               || galleryFeature.querySelector('h1');
    var rawTitle = titleEl ? titleEl.textContent.trim() : 'Album';
    var title    = sentenceCase(rawTitle);

    var items   = [];
    var anchors = galleryFeature.querySelectorAll('.gallery-item span.img-wrap a.dnt');
    if (anchors.length === 0) {
      console.warn('[inner-circle.js] 0 gallery items in album: ' + rawTitle);
    }
    for (var i = 0; i < anchors.length; i++) {
      var a   = anchors[i];
      var img = a.querySelector('img');
      if (!img) continue;
      items.push({ thumb: img.src, full: a.href, alt: img.alt || '' });
    }
    return { title: title, items: items };
  }

  /* =====================================================
     BUILD — preview section (per album)
  ===================================================== */

  function buildPreviewSection(album, dialogId) {
    var section = document.createElement('section');
    section.className = 'ic-album-preview';

    var h3 = document.createElement('h3');
    h3.className = 'ic-album-title';
    h3.textContent = album.title;
    section.appendChild(h3);

    var grid = document.createElement('div');
    grid.className = 'ic-preview-grid';

    var shown = album.items.slice(0, PREVIEW_COUNT);
    for (var i = 0; i < shown.length; i++) {
      var item = shown[i];
      var btn  = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ic-thumb';
      btn.setAttribute('aria-label', item.alt || 'Open image ' + (i + 1));
      btn.dataset.dialogId = dialogId;
      btn.dataset.full     = item.full;
      btn.dataset.alt      = item.alt;
      btn.dataset.enlarge  = 'true';
      var img = document.createElement('img');
      img.src     = item.thumb;
      img.alt     = '';
      img.loading = 'lazy';
      btn.appendChild(img);
      grid.appendChild(btn);
    }
    section.appendChild(grid);

    var footer  = document.createElement('div');
    footer.className = 'ic-preview-footer';
    var viewAll = document.createElement('wa-button');
    viewAll.setAttribute('variant', 'neutral');
    viewAll.dataset.dialogId = dialogId;
    viewAll.textContent      = 'View all (' + album.items.length + ')';
    footer.appendChild(viewAll);
    section.appendChild(footer);

    return section;
  }

  /* =====================================================
     BUILD — gallery dialog (per album)
  ===================================================== */

  function buildDialog(album, dialogId) {
    var dialog = document.createElement('wa-dialog');
    dialog.id  = dialogId;
    dialog.setAttribute('label', album.title);
    dialog.className = 'ic-gallery-dialog';

    var gridEl = document.createElement('div');
    gridEl.className = 'ic-dialog-grid';
    for (var i = 0; i < album.items.length; i++) {
      var item = album.items[i];
      var btn  = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ic-thumb';
      btn.setAttribute('aria-label', item.alt || 'Enlarge image ' + (i + 1));
      btn.dataset.full = item.full;
      btn.dataset.alt  = item.alt;
      var img = document.createElement('img');
      img.src     = item.thumb;
      img.alt     = '';
      img.loading = 'lazy';
      btn.appendChild(img);
      gridEl.appendChild(btn);
    }
    dialog.appendChild(gridEl);

    var lb = document.createElement('div');
    lb.className = 'ic-lightbox';
    lb.hidden    = true;
    var backBtn       = document.createElement('button');
    backBtn.type      = 'button';
    backBtn.className = 'ic-lightbox-back';
    backBtn.textContent = '← Back to gallery';
    lb.appendChild(backBtn);
    var lbImg       = document.createElement('img');
    lbImg.className = 'ic-lightbox-img';
    lbImg.src       = '';
    lbImg.alt       = '';
    lb.appendChild(lbImg);
    dialog.appendChild(lb);

    var closeBtn = document.createElement('wa-button');
    closeBtn.setAttribute('slot', 'footer');
    closeBtn.setAttribute('variant', 'neutral');
    closeBtn.className   = 'ic-dialog-close';
    closeBtn.textContent = 'Close';
    dialog.appendChild(closeBtn);

    return dialog;
  }

  /* =====================================================
     WIRE — dialog events
  ===================================================== */

  function wireDialog(dialog) {
    var gridEl   = dialog.querySelector('.ic-dialog-grid');
    var lb       = dialog.querySelector('.ic-lightbox');
    var backBtn  = dialog.querySelector('.ic-lightbox-back');
    var closeBtn = dialog.querySelector('.ic-dialog-close');
    var lbImg    = dialog.querySelector('.ic-lightbox-img');

    gridEl.addEventListener('click', function (e) {
      var thumb = e.target.closest('.ic-thumb');
      if (!thumb) return;
      lbImg.src = thumb.dataset.full;
      lbImg.alt = thumb.dataset.alt || '';
      gridEl.hidden = true;
      lb.hidden     = false;
    });

    backBtn.addEventListener('click', function () {
      lb.hidden     = true;
      gridEl.hidden = false;
      lbImg.src     = '';
    });

    closeBtn.addEventListener('click', function () {
      dialog.hide();
    });

    dialog.addEventListener('wa-after-hide', function () {
      lb.hidden     = true;
      gridEl.hidden = false;
      lbImg.src     = '';
    });
  }

  /* =====================================================
     WIRE — images panel
  ===================================================== */

  function wireImagesPanel(panel) {
    panel.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-dialog-id]');
      if (!trigger) return;

      var dialogId = trigger.dataset.dialogId;
      var dialog   = document.getElementById(dialogId);
      if (!dialog) return;

      var gridEl = dialog.querySelector('.ic-dialog-grid');
      var lb     = dialog.querySelector('.ic-lightbox');
      var lbImg  = dialog.querySelector('.ic-lightbox-img');
      if (gridEl) gridEl.hidden = false;
      if (lb)     lb.hidden = true;
      if (lbImg)  lbImg.src = '';

      dialog.show();

      if (trigger.dataset.enlarge && trigger.dataset.full) {
        if (gridEl) gridEl.hidden = true;
        if (lb)     lb.hidden = false;
        if (lbImg) {
          lbImg.src = trigger.dataset.full;
          lbImg.alt = trigger.dataset.alt || '';
        }
      }
    });
  }

  /* =====================================================
     BUILD — tab scaffold
  ===================================================== */

  function setTabPlacement() {
    var placement = window.innerWidth < 900 ? 'top' : 'start';
    var tg = document.getElementById('ic-tabs');
    if (tg && tg.getAttribute('placement') !== placement) {
      tg.setAttribute('placement', placement);
    }
  }

  window.addEventListener('resize', setTabPlacement);

  function buildScaffold() {
    var g = document.createElement('wa-tab-group');
    g.setAttribute('placement', window.innerWidth < 900 ? 'top' : 'start');
    g.id        = 'ic-tabs';
    g.className = 'ic-tab-group';

    [
      { panel: 'welcome', label: 'Welcome'      },
      { panel: 'images',  label: 'Images'        },
      { panel: 'videos',  label: 'Video updates' }
    ].forEach(function (d) {
      var tab = document.createElement('wa-tab');
      tab.setAttribute('slot',  'nav');
      tab.setAttribute('panel', d.panel);
      tab.textContent = d.label;
      g.appendChild(tab);

      var panel = document.createElement('wa-tab-panel');
      panel.setAttribute('name', d.panel);
      panel.id = 'ic-panel-' + d.panel;
      g.appendChild(panel);
    });

    return g;
  }

  /* =====================================================
     POPULATE — fill panels from snapshotted sources
     Runs in boot step 3, after WA has defined the elements.
  ===================================================== */

  function populate(sources) {
    console.log('[inner-circle] populate: start');
    var welcomePanel = group.querySelector('wa-tab-panel[name="welcome"]');
    var imagesPanel  = group.querySelector('wa-tab-panel[name="images"]');
    var videosPanel  = group.querySelector('wa-tab-panel[name="videos"]');

    /* Welcome */
    if (sources.welcome) {
      welcomePanel.appendChild(sources.welcome);
    } else {
      console.warn('[inner-circle] Welcome source not found — Welcome panel empty.');
    }
    console.log('[inner-circle] populate: welcome done');

    /* Images */
    if (sources.gallery) {
      var features = sources.gallery.querySelectorAll('section.feature.gallery_feature');
      console.log('[inner-circle] populate: gallery extract start', features.length);
      if (features.length === 0) {
        console.warn('[inner-circle] 0 gallery_feature sections in gallery source.');
      }
      for (var i = 0; i < features.length; i++) {
        var album   = extractAlbum(features[i]);
        var dId     = 'ic-dialog-' + i;
        var preview = buildPreviewSection(album, dId);
        var dialog  = buildDialog(album, dId);
        imagesPanel.appendChild(preview);
        imagesPanel.appendChild(dialog);
        wireDialog(dialog);
        console.log('[inner-circle] populate: gallery', i, 'built');
      }
      sources.gallery.remove();
      console.log('[inner-circle] populate: gallery removed');
    } else {
      console.warn('[inner-circle] Gallery source not found — Images panel empty.');
    }

    wireImagesPanel(imagesPanel);

    /* Video Updates */
    if (sources.blog) {
      videosPanel.appendChild(sources.blog);
      console.log('[inner-circle] populate: blog moved');
    } else {
      console.warn('[inner-circle] Blog source not found — Video Updates panel empty.');
    }

    /* Reveal scaffold — was hidden during load gap */
    group.style.display = '';
  }

  /* =====================================================
     BOOT UTILITIES
  ===================================================== */

  function waDefinedOrTimeout(ms) {
    return Promise.race([
      Promise.all([
        customElements.whenDefined('wa-tab-group'),
        customElements.whenDefined('wa-tab-panel')
      ]).then(function () { return 'defined'; }),
      new Promise(function (resolve) {
        setTimeout(function () { resolve('timeout'); }, ms);
      })
    ]);
  }

  /* =====================================================
     BOOT SEQUENCE
     async start() keeps snapshot → inject → await WA → populate
     all inside ONE try/catch. A bare .then() callback is outside
     any sync try/catch — throws inside it become unhandled
     rejections. async/await surfaces them to the catch block.

     Step 1: snapshot sources from untouched DOM.
     Step 2: build scaffold + inject immediately (autoloader trigger).
             Set Images as default active tab.
     Step 3: await waDefinedOrTimeout — always resolves.
     Step 4: populate() — synchronous; any throw caught here.
  ===================================================== */

  /* Safety net for any rejection that escapes the try/catch */
  window.addEventListener('unhandledrejection', function (e) {
    console.error('[inner-circle] unhandled rejection', e.reason);
  });

  async function start() {
    console.log('[inner-circle] window load reached');
    console.log('[inner-circle] post-load body entered');
    try {

      /* ---- host check ---- */
      console.log('[inner-circle] host resolved', !!pageHost);

      /* ---- Step 1: snapshot BEFORE any DOM mutation ---- */
      var rawSections = Array.from(pageHost.querySelectorAll(':scope > moda-section'));
      console.log('[inner-circle] sources snapshotted', rawSections.length);
      if (rawSections.length === 0) {
        console.warn('[inner-circle] No moda-section children found — aborting.');
        return;
      }
      var sources = identifySources(rawSections);
      console.log('[inner-circle] sources identified');

      /* Secondary structural safety net (belt-and-braces, post URL guard).
         A post-detail page carries a "Back to all posts" link in its content.
         If one is found, this is not the index — bail before any DOM mutation. */
      var _allLinks = pageHost.querySelectorAll('a');
      for (var _li = 0; _li < _allLinks.length; _li++) {
        if (_allLinks[_li].textContent.trim() === 'Back to all posts') {
          console.warn('[inner-circle] post-detail detected by structure — skipping.');
          return;
        }
      }

      /* ---- Step 2: build + inject scaffold (autoloader trigger) ---- */
      group = buildScaffold();
      group.style.display = 'none'; /* hidden until populate() reveals it */
      console.log('[inner-circle] about to append scaffold');
      contentWrap.appendChild(group);
      console.log('[inner-circle] scaffold appended');

      /* ---- Step 3: await WA definitions AFTER scaffold is in DOM ---- */
      var waResult = await waDefinedOrTimeout(WA_TIMEOUT_MS);
      if (waResult === 'timeout') {
        console.warn('[inner-circle] components timed out — populating anyway');
      } else {
        console.log('[inner-circle] components defined');
      }

      /* BUG 1 FIX: WA 3.x derives the shown panel from the `active` attribute
         on the wa-tab-group element (value = panel name), NOT from active on a
         child wa-tab. Set it here, after components are upgraded. */
      group.setAttribute('active', 'images');

      /* ---- Step 4: populate panels — throw surfaces to this catch ---- */
      populate(sources);

      /* BUG 2 FIX (Option A): BZ's masonry controller laid out the blog posts
         at width 0 because the Videos panel was display:none at load time.
         Dispatch a synthetic resize when the Videos panel first becomes visible
         so masonry recalculates against its actual rendered width.
         Option B fallback: strip masonry inline styles and apply a CSS grid
         (same philosophy as the gallery rebuild) — use if resize proves unreliable.
         WA 3.x event: 'wa-tab-show' on the tab-group, detail.name = panel name. */
      group.addEventListener('wa-tab-show', function (e) {
        if (e.detail && e.detail.name === 'videos') {
          requestAnimationFrame(function () {
            window.dispatchEvent(new Event('resize'));
            console.log('[inner-circle] videos panel shown, resize dispatched');
          });
        }
      });

      /* Belt-and-braces: one resize on the next paint after Images becomes
         active, so any layout engine watching the default panel is current. */
      requestAnimationFrame(function () {
        window.dispatchEvent(new Event('resize'));
      });

      console.log('[inner-circle] populate done');

    } catch (err) {
      console.error('[inner-circle] init threw', err);
    }
  }

  /* Explicit complete-branch — no 'load' listener that never fires
     on fast/cached reloads where readyState is already 'complete'. */
  if (document.readyState === 'complete') {
    start();
  } else {
    window.addEventListener('load', start, { once: true });
  }

}());

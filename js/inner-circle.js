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
 * TWO-PHASE BOOT (fixes WA autoloader deadlock):
 *   The WA autoloader (webawesome.loader.js) only defines a custom
 *   element when an instance of it first appears in the DOM. On BZ,
 *   /blog has zero wa-tab-group/wa-tab-panel elements at page load,
 *   so awaiting customElements.whenDefined() before injecting the
 *   scaffold creates a deadlock — the promise never resolves because
 *   the element is never defined.
 *
 *   Phase 1 (window.load + rAF): BUILD and inject the empty scaffold.
 *     This is what triggers the autoloader to define wa-tab-group and
 *     wa-tab-panel. The scaffold is hidden (display:none) during this gap.
 *   Phase 2 (whenDefined + rAF): POPULATE the panels — source
 *     identification, gallery extraction, preview/dialog build, node moves.
 *
 * Source identification (by DOM signature, not position):
 *   gallery source  — moda-section containing section.feature.gallery_feature
 *   blog source     — moda-section containing section.blog_feature
 *   welcome source  — first moda-section containing neither of the above
 *
 * Gallery: extracts {thumb: img.src, full: a.dnt href, alt}. Builds a
 *   capped preview grid (PREVIEW_COUNT items). Detaches and removes the
 *   original gallery moda-section — isotope never re-runs.
 *
 * Fail gracefully: missing source → console.warn, panel stays empty.
 *   A 5s timeout on the whenDefined wait warns if WA fails to define.
 *
 * DEPLOYMENT: upload to BZ Files, add to Headers & Metatags:
 *   <script src="https://gypsypistoleros.com/files/{ID}/inner-circle.js" defer></script>
 */

(function () {
  'use strict';

  /* =====================================================
     CONSTANTS
  ===================================================== */

  var PREVIEW_COUNT      = 6;
  var WA_TIMEOUT_MS      = 5000;

  /* =====================================================
     GUARD — exit on every page except the inner-circle page
  ===================================================== */

  var pageHost = document.querySelector('moda-sections.zoogle-content');
  if (!pageHost) return;

  /* Shared across phases */
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

  function buildScaffold() {
    var g = document.createElement('wa-tab-group');
    g.setAttribute('placement', 'start');
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
     PHASE 1 — inject empty scaffold
     Appending wa-tab-group to the DOM is what causes the
     WA autoloader to define wa-tab-group and wa-tab-panel.
     Hidden until Phase 2 populates the panels.
  ===================================================== */

  function injectScaffold() {
    group = buildScaffold();
    group.style.display = 'none'; /* hidden until populated */
    pageHost.appendChild(group);
  }

  /* =====================================================
     PHASE 2 — populate panels
     Runs after WA has defined the tab components.
  ===================================================== */

  function populate() {
    /* moda-section query: wa-tab-group is a different tag — won't match */
    var sections = Array.from(pageHost.querySelectorAll(':scope > moda-section'));
    if (sections.length === 0) {
      console.warn('[inner-circle.js] No moda-section children found — aborting populate.');
      return;
    }

    var sources = identifySources(sections);

    var welcomePanel = group.querySelector('wa-tab-panel[name="welcome"]');
    var imagesPanel  = group.querySelector('wa-tab-panel[name="images"]');
    var videosPanel  = group.querySelector('wa-tab-panel[name="videos"]');

    /* Welcome */
    if (sources.welcome) {
      welcomePanel.appendChild(sources.welcome);
    } else {
      console.warn('[inner-circle.js] Welcome source not found — Welcome panel empty.');
    }

    /* Images */
    if (sources.gallery) {
      var features = sources.gallery.querySelectorAll('section.feature.gallery_feature');
      if (features.length === 0) {
        console.warn('[inner-circle.js] 0 gallery_feature sections found in gallery source.');
      }
      for (var i = 0; i < features.length; i++) {
        var album   = extractAlbum(features[i]);
        var dId     = 'ic-dialog-' + i;
        var preview = buildPreviewSection(album, dId);
        var dialog  = buildDialog(album, dId);
        imagesPanel.appendChild(preview);
        imagesPanel.appendChild(dialog);
        wireDialog(dialog);
      }
      sources.gallery.remove();
    } else {
      console.warn('[inner-circle.js] Gallery source not found — Images panel empty.');
    }

    wireImagesPanel(imagesPanel);

    /* Video Updates */
    if (sources.blog) {
      videosPanel.appendChild(sources.blog);
    } else {
      console.warn('[inner-circle.js] Blog source not found — Video Updates panel empty.');
    }

    /* Default active tab: Images if Welcome is absent */
    if (!sources.welcome) {
      var imagesTab = group.querySelector('wa-tab[panel="images"]');
      if (imagesTab) imagesTab.setAttribute('active', '');
    }

    /* Reveal scaffold now that panels are populated */
    group.style.display = '';
  }

  /* =====================================================
     BOOT
     Phase 1: window.load + rAF → inject empty scaffold (triggers autoloader)
     Phase 2: whenDefined (5s timeout) + rAF → populate panels
  ===================================================== */

  function windowLoadPromise() {
    return new Promise(function (resolve) {
      if (document.readyState === 'complete') resolve();
      else window.addEventListener('load', resolve, { once: true });
    });
  }

  function withTimeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise(function (_, reject) {
        setTimeout(function () {
          reject(new Error('WA tab components failed to define within ' + ms + 'ms — inner-circle panels not populated'));
        }, ms);
      })
    ]);
  }

  windowLoadPromise().then(function () {
    requestAnimationFrame(function () {

      /* Phase 1: put wa-tab-group in the DOM so the WA autoloader sees it */
      injectScaffold();

      /* Phase 2: wait for WA to define the components now that they exist in DOM */
      withTimeout(
        Promise.all([
          customElements.whenDefined('wa-tab-group'),
          customElements.whenDefined('wa-tab-panel')
        ]),
        WA_TIMEOUT_MS
      ).then(function () {
        requestAnimationFrame(populate);
      }).catch(function (err) {
        console.warn('[inner-circle.js]', err.message);
      });

    });
  });

}());

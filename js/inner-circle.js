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
 * Source identification (by DOM signature, not position):
 *   gallery source  — moda-section containing section.feature.gallery_feature
 *   blog source     — moda-section containing section.blog_feature
 *   welcome source  — first moda-section containing neither of the above
 *
 * Gallery handling:
 *   Extracts {thumb: img.src, full: a.dnt href, alt} from each
 *   .gallery-item span.img-wrap a.dnt img. Builds a plain CSS grid
 *   preview (N = PREVIEW_COUNT items) per album. Detaches and removes
 *   the original gallery moda-section — isotope never re-runs.
 *
 * Wait strategy: customElements.whenDefined for wa-tab-group and
 * wa-tab-panel, plus window.load (ensures BZ/isotope/zoogle-video
 * controllers have initialised), then one requestAnimationFrame.
 *
 * Fail gracefully: missing source → console.warn, panel stays empty.
 * No throw on any expected absent element.
 *
 * DEPLOYMENT: upload to BZ Files, add to Headers & Metatags:
 *   <script src="https://gypsypistoleros.com/files/{ID}/inner-circle.js" defer></script>
 */

(function () {
  'use strict';

  /* =====================================================
     CONSTANTS
  ===================================================== */

  var PREVIEW_COUNT = 6;

  /* =====================================================
     GUARD — exit immediately on every page except /blog
  ===================================================== */

  var pageHost = document.querySelector('moda-sections.zoogle-content');
  if (!pageHost) return;

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
    var gallery = null;
    var blog    = null;
    var welcome = null;

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
     Returns { title: string, items: [{thumb, full, alt}] }
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
      items.push({
        thumb: img.src,
        full:  a.href,
        alt:   img.alt || ''
      });
    }

    return { title: title, items: items };
  }

  /* =====================================================
     BUILD — preview section (per album)
     Capped to PREVIEW_COUNT items; "View all (N)" button below.
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
     Full grid (all images) + lightbox panel.
  ===================================================== */

  function buildDialog(album, dialogId) {
    var dialog = document.createElement('wa-dialog');
    dialog.id  = dialogId;
    dialog.setAttribute('label', album.title);
    dialog.className = 'ic-gallery-dialog';

    /* Grid panel — all images */
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

    /* Lightbox panel */
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

    /* Footer close button */
    var closeBtn = document.createElement('wa-button');
    closeBtn.setAttribute('slot', 'footer');
    closeBtn.setAttribute('variant', 'neutral');
    closeBtn.className  = 'ic-dialog-close';
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

    /* Grid thumb → enlarge */
    gridEl.addEventListener('click', function (e) {
      var thumb = e.target.closest('.ic-thumb');
      if (!thumb) return;
      lbImg.src = thumb.dataset.full;
      lbImg.alt = thumb.dataset.alt || '';
      gridEl.hidden = true;
      lb.hidden     = false;
    });

    /* Back → grid */
    backBtn.addEventListener('click', function () {
      lb.hidden     = true;
      gridEl.hidden = false;
      lbImg.src     = '';
    });

    /* Footer close */
    closeBtn.addEventListener('click', function () {
      dialog.hide();
    });

    /* Reset lightbox after dialog closes (handles WA × button and Escape) */
    dialog.addEventListener('wa-after-hide', function () {
      lb.hidden     = true;
      gridEl.hidden = false;
      lbImg.src     = '';
    });
  }

  /* =====================================================
     WIRE — images panel
     Delegates clicks from preview thumbs and "View all" buttons.
     Preview thumb (data-enlarge="true"): open dialog in lightbox.
     "View all" wa-button: open dialog in grid view.
  ===================================================== */

  function wireImagesPanel(panel) {
    panel.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-dialog-id]');
      if (!trigger) return;

      var dialogId = trigger.dataset.dialogId;
      var dialog   = document.getElementById(dialogId);
      if (!dialog) return;

      /* Reset to grid view before opening */
      var gridEl = dialog.querySelector('.ic-dialog-grid');
      var lb     = dialog.querySelector('.ic-lightbox');
      var lbImg  = dialog.querySelector('.ic-lightbox-img');
      if (gridEl) gridEl.hidden = false;
      if (lb)     lb.hidden = true;
      if (lbImg)  lbImg.src = '';

      dialog.show();

      /* Preview thumb: jump straight into lightbox for that image */
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
    var group = document.createElement('wa-tab-group');
    group.setAttribute('placement', 'start');
    group.id        = 'ic-tabs';
    group.className = 'ic-tab-group';

    var defs = [
      { panel: 'welcome', label: 'Welcome'       },
      { panel: 'images',  label: 'Images'         },
      { panel: 'videos',  label: 'Video updates'  }
    ];

    defs.forEach(function (d) {
      var tab = document.createElement('wa-tab');
      tab.setAttribute('slot',  'nav');
      tab.setAttribute('panel', d.panel);
      tab.textContent = d.label;
      group.appendChild(tab);

      var panel = document.createElement('wa-tab-panel');
      panel.setAttribute('name', d.panel);
      panel.id = 'ic-panel-' + d.panel;
      group.appendChild(panel);
    });

    return group;
  }

  /* =====================================================
     INIT — main orchestration
  ===================================================== */

  function init() {
    var host = document.querySelector('moda-sections.zoogle-content');
    if (!host) return;

    var sections = Array.from(host.querySelectorAll(':scope > moda-section'));
    if (sections.length === 0) {
      console.warn('[inner-circle.js] No moda-section children found — aborting.');
      return;
    }

    var sources = identifySources(sections);
    var group   = buildScaffold();

    var welcomePanel = group.querySelector('wa-tab-panel[name="welcome"]');
    var imagesPanel  = group.querySelector('wa-tab-panel[name="images"]');
    var videosPanel  = group.querySelector('wa-tab-panel[name="videos"]');

    /* ---- Welcome panel ---- */
    if (sources.welcome) {
      welcomePanel.appendChild(sources.welcome);
    } else {
      console.warn('[inner-circle.js] Welcome source not found — Welcome panel empty.');
    }

    /* ---- Images panel ---- */
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

    /* ---- Video Updates panel ---- */
    if (sources.blog) {
      videosPanel.appendChild(sources.blog);
    } else {
      console.warn('[inner-circle.js] Blog source not found — Video Updates panel empty.');
    }

    /* ---- Default active tab ---- */
    if (!sources.welcome) {
      var imagesTab = group.querySelector('wa-tab[panel="images"]');
      if (imagesTab) imagesTab.setAttribute('active', '');
    }

    /* ---- Insert scaffold ---- */
    host.appendChild(group);
  }

  /* =====================================================
     BOOT — wait for WA + page load, then rAF → init
  ===================================================== */

  Promise.all([
    customElements.whenDefined('wa-tab-group'),
    customElements.whenDefined('wa-tab-panel'),
    new Promise(function (resolve) {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', resolve, { once: true });
      }
    })
  ]).then(function () {
    requestAnimationFrame(init);
  });

}());

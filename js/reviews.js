/**
 * reviews.js — Gypsy Pistoleros review card renderer
 * AUSTIN_SPACE build — May 2026
 *
 * Self-initialises on DOMContentLoaded. Finds every .reviews-grid element
 * on the page, filters/sorts the reviews dataset per data attributes, and
 * renders <wa-card> review cards into each target.
 *
 * Supported data attributes on .reviews-grid:
 *   data-reviews-tag="featured"              filter by tag
 *   data-reviews-ids="id1,id2,id3"           show specific reviews in order
 *   data-reviews-limit="3"                   cap to first N results
 *   data-reviews-sort="rating-desc"          rating-desc | rating-asc |
 *                                            date-desc | date-asc | manual
 *   data-reviews-layout="list"              grid (default) | list
 *   data-reviews-render="table"            card (default) | table
 *
 * RATING NORMALISATION:
 *   rating_normalised is NOT stored in reviews.json (schema_version 2+).
 *   It is computed at render time as (rating_score / rating_max) * 5.
 *   This prevents data drift if a score is corrected and a stored
 *   normalised value is not updated to match.
 *
 * DEPLOYMENT NOTE — JSON path:
 *   URL is resolved at runtime via window.GYPSY_CONFIG.reviewsUrl (set in
 *   Bandzoogle Headers & Metatags) with a local fallback of ../data/reviews.json.
 *   See docs/deployment.md for the production config block.
 *
 * DEPLOYMENT NOTE — logo paths:
 *   PRESS_LOGO_BASE is relative to the page URL. In staging the logos are
 *   at staging/assets/press-logos/ so the path is 'assets/press-logos'.
 *   On Bandzoogle this may need to be an absolute path or CDN URL.
 */

(function () {
  'use strict';

  let cachedReviews = null;

  /* ---- utilities ---- */

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ---- template helpers ---- */

  const PUBLICATION_ICONS = {
    'classic-rock':               'fa-solid fa-guitar',
    'powerplay':                  'fa-solid fa-bolt',
    'punksite':                   'fa-solid fa-skull',
    'maximum-volume-music':       'fa-solid fa-volume-high',
    'fireworks-magazine':         'fa-solid fa-burst',
    'evermetal':                  'fa-solid fa-gem',
    'petes-rock-news-and-views':  'fa-solid fa-newspaper',
    'the-rockpit':                'fa-solid fa-fire',
    'liverpool-sound-and-vision': 'fa-solid fa-music',
    'ringmaster-review':          'fa-solid fa-ring',
    'overdrive-ie':               'fa-solid fa-gauge-high',
    'myglobalmind':               'fa-solid fa-globe',
    'jace-media':                 'fa-solid fa-microphone',
    'the-indie-scene':            'fa-solid fa-music',
    'the-sentinel-daily':         'fa-solid fa-shield-halved',
    'jammerzine':                 'fa-solid fa-headphones',
    'punktuation':                'fa-solid fa-skull',
    'rock-news':                  'fa-solid fa-newspaper',
    'all-about-the-rock':         'fa-solid fa-guitar',
    'get-ready-to-rock':          'fa-solid fa-rocket'
  };

  function reviewIcon(review) {
    return PUBLICATION_ICONS[review.publication_slug] || 'fa-solid fa-star';
  }

  function ratingBlock(review) {
    if (review.rating_score == null || review.rating_max == null) return '';
    const normalised = (review.rating_score / review.rating_max) * 5;
    return `<div class="review-card__rating">
        <wa-rating readonly value="${normalised}" precision="0.5"></wa-rating>
        <span class="review-card__score">${escapeHtml(String(review.rating_score))}/${escapeHtml(String(review.rating_max))}</span>
      </div>`;
  }

  function reviewerCredit(review) {
    if (!review.reviewer_name) return '';
    return `<cite class="review-card__reviewer">— ${escapeHtml(review.reviewer_name)}</cite>`;
  }

  // When neither rating nor reviewer credit exists, the footer slot collapses
  // to zero height and the card looks shorter than its grid peers. Emit an
  // aria-hidden placeholder instead so the slot always has real content height.
  function renderCard(review) {
    const ratingHtml = ratingBlock(review);
    const reviewerHtml = reviewerCredit(review);
    const footerContent = (ratingHtml || reviewerHtml)
      ? ratingHtml + reviewerHtml
      : '<span class="review-card__footer-placeholder" aria-hidden="true">&nbsp;</span>';
    const icon = reviewIcon(review);
    const bgRotate = review.iconRotate || '-18deg';
    const bgScale  = review.iconScale  || '1';
    return `<wa-card class="review-card" data-review-id="${escapeHtml(review.id)}">
  <div slot="header" class="review-card__header">
    <div class="review-card__pub">
      <i class="${icon} review-card__pub-icon" aria-hidden="true"></i>
      <span class="review-card__publication">${escapeHtml(review.publication)}</span>
    </div>
  </div>
  <div class="review-card__quote-wrap" style="--review-bg-rotate:${bgRotate};--review-bg-scale:${bgScale}">
    <i class="${icon} review-card__quote-bg" aria-hidden="true"></i>
    <blockquote class="review-card__quote">
      &ldquo;${escapeHtml(review.quote_short)}&rdquo;
    </blockquote>
  </div>
  <div slot="footer" class="review-card__footer">
    ${footerContent}
  </div>
</wa-card>`;
  }

  /* ---- table render mode ---- */

  function starsCell(review) {
    if (review.rating_score == null || review.rating_max == null) return '';
    const normalised = (review.rating_score / review.rating_max) * 5;
    return `<wa-rating readonly value="${normalised}" precision="0.5"></wa-rating>`;
  }

  function renderTableRow(review) {
    const pub = escapeHtml(review.publication || '');
    const reviewer = review.reviewer_name ? escapeHtml(review.reviewer_name) : 'N/A';
    const quote = escapeHtml(review.quote_short || '');
    const stars = starsCell(review);
    const score = (review.rating_score != null && review.rating_max != null)
      ? escapeHtml(`${review.rating_score}/${review.rating_max}`)
      : 'N/A';
    return `<tr>
  <td class="reviews-table__pub" data-label="Publication">${pub}</td>
  <td class="reviews-table__reviewer" data-label="Reviewer">${reviewer}</td>
  <td class="reviews-table__quote" data-label="Quote">&ldquo;${quote}&rdquo;</td>
  <td class="reviews-table__stars" data-label="Stars">${stars}</td>
  <td class="reviews-table__score" data-label="Score">${score}</td>
</tr>`;
  }

  function renderTable(reviews) {
    return `<table class="reviews-table">
  <thead>
    <tr>
      <th>Publication</th>
      <th>Reviewer</th>
      <th>Quote</th>
      <th>Stars</th>
      <th>Score</th>
    </tr>
  </thead>
  <tbody>
    ${reviews.map(renderTableRow).join('\n    ')}
  </tbody>
</table>`;
  }

  /* ---- filtering and sorting ---- */

  function applyFilter(reviews, target) {
    const ids = target.dataset.reviewsIds;
    const tag = target.dataset.reviewsTag;

    if (ids) {
      const idList = ids.split(',').map(s => s.trim()).filter(Boolean);
      // Preserve the caller-specified order
      return idList
        .map(id => reviews.find(r => r.id === id))
        .filter(Boolean);
    }

    if (tag) {
      return reviews.filter(r => Array.isArray(r.tags) && r.tags.includes(tag));
    }

    return reviews.slice(); // no filter — all reviews
  }

  function applySort(reviews, sort) {
    if (!sort || sort === 'manual') return reviews;

    const copy = reviews.slice();

    if (sort === 'rating-desc') {
      return copy.sort((a, b) => (b.rating_normalised || 0) - (a.rating_normalised || 0));
    }
    if (sort === 'rating-asc') {
      return copy.sort((a, b) => (a.rating_normalised || 0) - (b.rating_normalised || 0));
    }
    if (sort === 'date-desc') {
      return copy.sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return b.date.localeCompare(a.date);
      });
    }
    if (sort === 'date-asc') {
      return copy.sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return a.date.localeCompare(b.date);
      });
    }

    return reviews;
  }

  function applyLimit(reviews, limitAttr) {
    const n = parseInt(limitAttr, 10);
    return (!isNaN(n) && n > 0) ? reviews.slice(0, n) : reviews;
  }

  /* ---- rendering ---- */

  function renderIntoTarget(reviews, target) {
    let filtered = applyFilter(reviews, target);
    filtered = applySort(filtered, target.dataset.reviewsSort);
    filtered = applyLimit(filtered, target.dataset.reviewsLimit);

    if (!filtered.length) {
      target.innerHTML = '';
      return;
    }

    if (target.dataset.reviewsRender === 'table') {
      target.innerHTML = renderTable(filtered);
    } else {
      target.innerHTML = filtered.map(renderCard).join('\n');
    }
  }

  function render(reviews) {
    const targets = document.querySelectorAll('.reviews-grid');
    targets.forEach(target => renderIntoTarget(reviews, target));
  }

  function renderError(targets) {
    targets.forEach(target => {
      target.innerHTML = `<wa-alert variant="warning" open>
  <i class="fa-thin fa-triangle-exclamation" slot="icon"></i>
  Reviews currently unavailable.
</wa-alert>`;
    });
  }

  /* ---- initialisation ---- */

  async function init() {
    const targets = document.querySelectorAll('.reviews-grid');
    if (!targets.length) return;

    try {
      // Data source resolution (priority order):
      //   1. window.GYPSY_CONFIG.reviewsData — inline data object (production)
      //   2. window.GYPSY_CONFIG.reviewsUrl  — absolute URL (production, same-origin)
      //   3. '../data/reviews.json'          — relative path (local development)
      // See docs/deployment.md.
      const cfg = window.GYPSY_CONFIG || {};
      let data;

      if (cfg.reviewsData) {
        data = cfg.reviewsData;
      } else {
        const url = cfg.reviewsUrl || '../data/reviews.json';
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load reviews: ${response.status}`);
        data = await response.json();
      }

      cachedReviews = data.reviews;
      render(cachedReviews);
    } catch (_err) {
      renderError(targets);
    }
  }

  /* ---- public API ---- */

  window.GypsyReviews = {
    render: function (reviews) {
      render(reviews || cachedReviews || []);
    }
  };

  document.addEventListener('DOMContentLoaded', init);

}());

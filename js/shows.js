/**
 * shows.js — Gypsy Pistoleros tour date renderer
 * AUSTIN_SPACE build — May 2026
 *
 * Self-initialises on DOMContentLoaded. Finds every .shows-grid element
 * on the page, filters/sorts the shows dataset per data attributes, and
 * renders <article> show cards into each target.
 *
 * Supported data attributes on .shows-grid:
 *   data-shows-filter="upcoming"   show only upcoming shows
 *   data-shows-filter="past"       show only past shows
 *   data-shows-filter="all"        show all (default)
 *   data-shows-filter="homepage"   composite: 2 most recent past +
 *                                  next 3 upcoming + TBA row if present
 *   data-shows-limit="N"           cap to first N after filtering
 *   data-shows-sort="date-asc"     date-asc | date-desc
 *   data-shows-include-tba="true"  include TBA row for non-homepage
 *                                  filters. Default: false
 *   data-shows-layout="table"      horizontal row layout (homepage)
 *
 * STATUS COMPUTATION:
 *   Status is NOT stored in shows.json. Computed at render time using
 *   new Date() (local time, timezone-naive). Rules:
 *     is_tba === true                → "tba"
 *     date_end exists, date_end >= today → "upcoming" (festival still active)
 *     date_end exists, date_end < today  → "past"
 *     date_start >= today            → "upcoming"
 *     date_start < today             → "past"
 *     date_start === null, !is_tba   → null (skip — malformed entry)
 *
 * DEPLOYMENT NOTE — JSON path:
 *   URL is resolved at runtime via window.GYPSY_CONFIG.showsUrl (set in
 *   Bandzoogle Headers & Metatags) with a local fallback of ../data/shows.json.
 *   See docs/deployment.md for the production config block.
 */

(function () {
  'use strict';

  let cachedShows = null;

  /* ---- utilities ---- */

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* Parse an ISO date string (YYYY-MM-DD) as local midnight to avoid
     UTC offset issues with new Date("YYYY-MM-DD") which parses as UTC. */
  function parseLocalDate(dateStr) {
    var parts = dateStr.split('-');
    return new Date(
      parseInt(parts[0], 10),
      parseInt(parts[1], 10) - 1,
      parseInt(parts[2], 10)
    );
  }

  /* ---- status computation ---- */

  function computeStatus(show) {
    if (show.is_tba) return 'tba';
    if (!show.date_start) return null; // malformed entry — skip

    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var start = parseLocalDate(show.date_start);

    if (show.date_end) {
      var end = parseLocalDate(show.date_end);
      return end >= today ? 'upcoming' : 'past';
    }

    return start >= today ? 'upcoming' : 'past';
  }

  /* ---- template helpers ---- */

  var TYPE_LABELS = { club: 'Club', festival: 'Festival', private: 'Private' };

  function typeLabel(show) {
    if (!show.type) return '';
    var label = TYPE_LABELS[show.type] || show.type;
    return '<span class="show-card__type-label show-card__type-label--'
      + escapeHtml(show.type) + '">'
      + escapeHtml(label)
      + '</span>';
  }

  function locationStr(show) {
    var parts = [show.city, show.country].filter(Boolean);
    return parts.join(', ');
  }

  function actionBlock(show, status) {
    if (status === 'past') {
      return '<span class="show-card__status-text show-card__status-text--past">Just played</span>';
    }
    if (status === 'tba') {
      return '<span class="show-card__status-text show-card__status-text--tba">TBA</span>';
    }
    // upcoming
    if (show.ticket_url) {
      return '<wa-button variant="brand" size="small" href="'
        + escapeHtml(show.ticket_url) + '">Tickets</wa-button>';
    }
    return '<wa-button variant="brand" size="small" disabled>Coming soon</wa-button>';
  }

  /* ---- table-mode helpers ---- */

  function typeSpan(show) {
    if (!show.type) return '—';
    var label = TYPE_LABELS[show.type] || show.type;
    return '<span class="shows-table__type shows-table__type--'
      + escapeHtml(show.type) + '">'
      + escapeHtml(label) + '</span>';
  }

  function rowStatusText(status) {
    if (status === 'past')     return 'Just played';
    if (status === 'upcoming') return 'Upcoming';
    if (status === 'tba')      return 'TBA';
    return '';
  }

  function ticketsCell(show, status) {
    if (status === 'upcoming' && show.ticket_url) {
      return '<wa-button variant="brand" size="small" href="'
        + escapeHtml(show.ticket_url) + '">Tickets</wa-button>';
    }
    if (status === 'upcoming') {
      return '<wa-button variant="brand" size="small" disabled>Coming soon</wa-button>';
    }
    return '—';
  }

  function renderRow(show, status) {
    var loc = locationStr(show);
    return '<tr class="shows-table__row shows-table__row--' + escapeHtml(status)
      + '" data-show-id="' + escapeHtml(show.id) + '">\n'
      + '  <td class="shows-table__date" data-label="Date">' + escapeHtml(show.date_display) + '</td>\n'
      + '  <td class="shows-table__venue" data-label="Venue">' + escapeHtml(show.venue) + '</td>\n'
      + '  <td class="shows-table__location" data-label="Location">' + escapeHtml(loc) + '</td>\n'
      + '  <td data-label="Type">' + typeSpan(show) + '</td>\n'
      + '  <td class="shows-table__status shows-table__status--' + escapeHtml(status)
      + '" data-label="Status">' + escapeHtml(rowStatusText(status)) + '</td>\n'
      + '  <td class="shows-table__tickets" data-label="Tickets">' + ticketsCell(show, status) + '</td>\n'
      + '</tr>';
  }

  function renderTable(items) {
    var rows = items.map(function (item) {
      return renderRow(item.show, item.status);
    }).join('\n');
    return '<table class="shows-table">\n'
      + '  <thead>\n'
      + '    <tr>\n'
      + '      <th>Date</th>\n'
      + '      <th>Venue</th>\n'
      + '      <th>Location</th>\n'
      + '      <th>Type</th>\n'
      + '      <th>Status</th>\n'
      + '      <th>Tickets</th>\n'
      + '    </tr>\n'
      + '  </thead>\n'
      + '  <tbody>\n'
      + rows
      + '\n  </tbody>\n'
      + '</table>';
  }

  function renderCard(show, status) {
    var loc = locationStr(show);
    return '<article class="show-card show-card--'
      + escapeHtml(status)
      + '" data-show-id="' + escapeHtml(show.id) + '">\n'
      + '  <div class="show-card__date">' + escapeHtml(show.date_display) + '</div>\n'
      + '  <div class="show-card__venue">' + escapeHtml(show.venue) + '</div>\n'
      + '  <div class="show-card__location">' + escapeHtml(loc) + '</div>\n'
      + '  <div class="show-card__type">' + typeLabel(show) + '</div>\n'
      + '  <div class="show-card__action">' + actionBlock(show, status) + '</div>\n'
      + '</article>';
  }

  /* ---- filtering ---- */

  function withStatus(shows) {
    return shows.map(function (s) {
      return { show: s, status: computeStatus(s) };
    }).filter(function (item) {
      return item.status !== null;
    });
  }

  function applyFilter(shows, filter) {
    var all = withStatus(shows);

    if (!filter || filter === 'all') {
      return all;
    }

    if (filter === 'upcoming') {
      return all.filter(function (item) { return item.status === 'upcoming'; });
    }

    if (filter === 'past') {
      return all.filter(function (item) { return item.status === 'past'; });
    }

    if (filter === 'homepage') {
      var past = all
        .filter(function (item) { return item.status === 'past'; })
        .sort(function (a, b) {
          return b.show.date_start.localeCompare(a.show.date_start);
        })
        .slice(0, 2);

      var upcoming = all
        .filter(function (item) { return item.status === 'upcoming'; })
        .sort(function (a, b) {
          return a.show.date_start.localeCompare(b.show.date_start);
        })
        .slice(0, 3);

      var tba = all.filter(function (item) { return item.status === 'tba'; });

      return past.concat(upcoming).concat(tba);
    }

    return [];
  }

  /* ---- sorting ---- */

  function defaultSort(filter) {
    return filter === 'past' ? 'date-desc' : 'date-asc';
  }

  function applySort(items, sort) {
    var copy = items.slice();

    if (sort === 'date-asc') {
      return copy.sort(function (a, b) {
        if (!a.show.date_start && !b.show.date_start) return 0;
        if (!a.show.date_start) return 1;
        if (!b.show.date_start) return -1;
        return a.show.date_start.localeCompare(b.show.date_start);
      });
    }

    if (sort === 'date-desc') {
      return copy.sort(function (a, b) {
        if (!a.show.date_start && !b.show.date_start) return 0;
        if (!a.show.date_start) return 1;
        if (!b.show.date_start) return -1;
        return b.show.date_start.localeCompare(a.show.date_start);
      });
    }

    return items;
  }

  /* ---- limit ---- */

  function applyLimit(items, limitAttr) {
    var n = parseInt(limitAttr, 10);
    return (!isNaN(n) && n > 0) ? items.slice(0, n) : items;
  }

  /* ---- rendering ---- */

  function renderIntoTarget(shows, target) {
    var filter = target.dataset.showsFilter || 'all';
    var sort   = target.dataset.showsSort || defaultSort(filter);
    var includeTba = target.dataset.showsIncludeTba === 'true';
    var layout = target.dataset.showsLayout || 'card';

    var filtered = applyFilter(shows, filter);

    // For non-homepage filters, TBA inclusion is opt-in via data attribute.
    // Homepage filter manages its own TBA inclusion internally.
    if (filter !== 'homepage' && !includeTba) {
      filtered = filtered.filter(function (item) { return item.status !== 'tba'; });
    }

    // Homepage filter applies its own internal sort; all others sort here.
    if (filter !== 'homepage') {
      filtered = applySort(filtered, sort);
    }

    filtered = applyLimit(filtered, target.dataset.showsLimit);

    if (!filtered.length) {
      target.innerHTML = '';
      return;
    }

    if (layout === 'table') {
      target.innerHTML = renderTable(filtered);
    } else {
      target.innerHTML = filtered.map(function (item) {
        return renderCard(item.show, item.status);
      }).join('\n');
    }
  }

  function render(shows) {
    var targets = document.querySelectorAll('.shows-grid');
    targets.forEach(function (target) { renderIntoTarget(shows, target); });
  }

  function renderError(targets) {
    targets.forEach(function (target) {
      target.innerHTML = '<wa-alert variant="warning" open>\n'
        + '  <i class="fa-thin fa-triangle-exclamation" slot="icon"></i>\n'
        + '  Tour dates currently unavailable. Please check back soon.\n'
        + '</wa-alert>';
    });
  }

  /* ---- initialisation ---- */

  async function init() {
    var targets = document.querySelectorAll('.shows-grid');
    if (!targets.length) return;

    try {
      // Data source resolution (priority order):
      //   1. window.GYPSY_CONFIG.showsData — inline data object (production)
      //   2. window.GYPSY_CONFIG.showsUrl  — absolute URL (production, same-origin)
      //   3. '../data/shows.json'          — relative path (local development)
      // See docs/deployment.md.
      var cfg = window.GYPSY_CONFIG || {};
      var data;

      if (cfg.showsData) {
        data = cfg.showsData;
      } else {
        var url = cfg.showsUrl || '../data/shows.json';
        var response = await fetch(url);
        if (!response.ok) throw new Error('Failed to load shows: ' + response.status);
        data = await response.json();
      }

      cachedShows = data.shows;
      render(cachedShows);
    } catch (_err) {
      renderError(targets);
    }
  }

  /* ---- public API ---- */

  window.GypsyShows = {
    render: function (shows) {
      render(shows || cachedShows || []);
    }
  };

  document.addEventListener('DOMContentLoaded', init);

}());

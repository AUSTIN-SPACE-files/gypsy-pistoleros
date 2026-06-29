/**
 * videos.js — Gypsy Pistoleros video gallery renderer
 * AUSTIN_SPACE build — May 2026
 *
 * Self-initialises on DOMContentLoaded. Finds the #gp-videos mount point,
 * reads the data URL from its data-videos-src attribute, fetches videos.json,
 * and renders album sections with video cards (facade → iframe on click).
 *
 * JSON schema (data/videos.json):
 *   { schema_version: 1, albums: [ { id, title, release_date, blurb,
 *     is_single, videos: [ { id, youtube_id, title } ] } ] }
 *
 * Facade interaction:
 *   Each video card renders a thumbnail + play button (.video-card__facade).
 *   A single delegated click listener on #gp-videos handles all facades.
 *   On click, the facade is replaced by an <iframe> with autoplay=1.
 *
 * DEPLOYMENT NOTE — data URL:
 *   The src is read from document.getElementById('gp-videos').dataset.videosSrc.
 *   Fallback (local dev): '../data/videos.json'.
 *   See docs/deployment.md for the production config pattern.
 */

(function () {
  'use strict';

  /* ---- thumbnail derivation ---- */

  function thumbUrl(video) {
    return 'https://i.ytimg.com/vi/' + video.youtube_id + '/hqdefault.jpg';
  }

  /* ---- iframe src ---- */

  function iframeSrc(youtubeId) {
    return 'https://www.youtube.com/embed/' + youtubeId
      + '?autoplay=1&rel=0';
  }

  /* ---- rendering helpers ---- */

  function renderVideoCard(video) {
    var card = document.createElement('div');
    card.className = 'video-card';
    card.dataset.videoId = video.id;

    var facade = document.createElement('div');
    facade.className = 'video-card__facade';
    facade.setAttribute('role', 'button');
    facade.setAttribute('tabindex', '0');
    facade.setAttribute('aria-label', 'Play ' + video.title);
    facade.dataset.youtubeId = video.youtube_id;

    var thumb = document.createElement('img');
    thumb.className = 'video-card__thumb';
    thumb.src = thumbUrl(video);
    thumb.alt = '';
    thumb.loading = 'lazy';

    var play = document.createElement('span');
    play.className = 'video-card__play';
    play.setAttribute('aria-hidden', 'true');
    /* Font Awesome play icon — loaded site-wide via the FA kit */
    play.innerHTML = '<i class="fa-sharp fa-thin fa-play"></i>';

    facade.appendChild(thumb);
    facade.appendChild(play);

    var title = document.createElement('p');
    title.className = 'video-card__title';
    title.textContent = video.title;

    card.appendChild(facade);
    card.appendChild(title);

    return card;
  }

  function renderAlbum(album) {
    var section = document.createElement('section');
    section.className = 'video-album'
      + (album.is_single ? ' video-album--single' : '');
    section.dataset.albumId = album.id;

    var header = document.createElement('header');
    header.className = 'video-album__header';

    var h2 = document.createElement('h2');
    h2.className = 'video-album__title';
    h2.textContent = album.title;

    var meta = document.createElement('p');
    meta.className = 'video-album__meta';

    var yearSpan = document.createElement('span');
    yearSpan.className = 'video-album__year';
    yearSpan.textContent = album.is_single
      ? 'Single · ' + album.release_date
      : album.release_date;

    var sep = document.createElement('span');
    sep.className = 'video-album__sep';
    sep.setAttribute('aria-hidden', 'true');
    sep.textContent = '·';

    var blurb = document.createElement('span');
    blurb.className = 'video-album__blurb';
    blurb.textContent = album.blurb;

    meta.appendChild(yearSpan);
    meta.appendChild(sep);
    meta.appendChild(blurb);

    header.appendChild(h2);
    header.appendChild(meta);

    var grid = document.createElement('div');
    grid.className = 'video-album__grid';

    album.videos.forEach(function (video) {
      grid.appendChild(renderVideoCard(video));
    });

    section.appendChild(header);
    section.appendChild(grid);

    return section;
  }

  /* ---- facade interaction (delegated) ---- */

  function handleFacadeClick(event) {
    var facade = event.target.closest('.video-card__facade');
    if (!facade) return;

    var youtubeId = facade.dataset.youtubeId;
    if (!youtubeId) return;

    /* Find the card title before we swap the facade out */
    var card = facade.closest('.video-card');
    var titleEl = card ? card.querySelector('.video-card__title') : null;
    var titleText = titleEl ? titleEl.textContent : 'Video';

    var iframe = document.createElement('iframe');
    iframe.className = 'video-card__iframe';
    iframe.src = iframeSrc(youtubeId);
    iframe.title = titleText;
    iframe.allow = 'accelerated-sensors; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;

    facade.parentNode.replaceChild(iframe, facade);
  }

  function handleFacadeKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleFacadeClick(event);
    }
  }

  /* ---- full render ---- */

  function renderAlbums(mount, data) {
    /* Clear loading placeholder */
    mount.innerHTML = '';

    if (!data.albums || !data.albums.length) {
      var empty = document.createElement('p');
      empty.className = 'video-error';
      empty.textContent = "No videos available yet — check back soon.";
      mount.appendChild(empty);
      return;
    }

    data.albums.forEach(function (album) {
      mount.appendChild(renderAlbum(album));
    });
  }

  function renderError(mount) {
    mount.innerHTML = '';
    var msg = document.createElement('p');
    msg.className = 'video-error';
    msg.textContent = "Couldn’t load videos — try refreshing.";
    mount.appendChild(msg);
  }

  /* ---- initialisation ---- */

  async function init() {
    var mount = document.getElementById('gp-videos');
    if (!mount) return;

    /* Event delegation — one listener covers all video cards */
    mount.addEventListener('click', handleFacadeClick);
    mount.addEventListener('keydown', handleFacadeKeydown);

    try {
      var src = mount.dataset.videosSrc || '../data/videos.json';
      var response = await fetch(src);
      if (!response.ok) throw new Error('HTTP ' + response.status);
      var data = await response.json();
      renderAlbums(mount, data);
    } catch (err) {
      console.error('[videos.js] Failed to load videos:', err);
      renderError(mount);
    }
  }

  document.addEventListener('DOMContentLoaded', init);

}());

/* SGLI Prototyp „Bildung“ – Filter-Logik (Vanilla JS, kein Backend)
   Regeln aus Figma („Regeln für Filter“, „Dynamische Ausgabe von Tags“, Node 2548:24966):

   Ampel für Detailfilter (bezogen auf die Angebote der gewählten Zielgruppe):
     unter 9 Angebote   → keine Detailfilter
     9 bis 20 Angebote  → Dauer und Thema
     über 20 Angebote   → alle Detailfilter (Klassenstufe, Thema, Format, Förderbedarf, Dauer, Sprache)
   Ohne gewählte Zielgruppe zeigt Figma keine Detailfilter (Frame „Bildung - Filter Default“).

   Tags in der Liste: 3 Slots. 2 dynamische Slots je Filterstatus, 1 Slot für die Dauer.
     ungefiltert        → Zielgruppen (max 2, Rest als +N) · Dauer
     Stufe 9–20         → Thema (max 2) · Dauer
     Stufe über 20      → Klassenstufe (max 2; ohne Klassenstufe: Thema) · Barrierefreiheit oder Sprache · Dauer
     Barrierefreiheit hat Vorrang vor Englisch.

   Gesetzte Chips tragen ein X und werden per Klick entfernt. Detailfilter-Chips mit Chevron öffnen ein Off-Canvas. */

(function () {
  'use strict';

  var D = window.SGLI_DATA;
  var SPRITE = '../dist/icons/sprite.svg';
  var PAGE_SIZE = 10;

  var state = {
    zielgruppe: null,   // String oder null (Einfachauswahl)
    detail: {},         // { thema: 'NS-Diktatur', dauer: 'Halbtag', … }
    page: 1
  };

  /* ---------- DOM ---------- */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var el = {
    categoryChips: $('[data-filter-category]'),
    detailRow: $('[data-filter-detail-row]'),
    detailChips: $('[data-filter-detail]'),
    count: $('[data-filter-count]'),
    reset: $('[data-filter-reset]'),
    list: $('[data-edu-list]'),
    empty: $('[data-edu-empty]'),
    moreWrap: $('[data-edu-more-wrap]'),
    more: $('[data-edu-more]'),
    offcanvas: $('[data-offcanvas]'),
    backdrop: $('[data-offcanvas-backdrop]'),
    ocTitle: $('[data-offcanvas-title]'),
    ocOptions: $('[data-offcanvas-options]'),
    ocApply: $('[data-offcanvas-apply]'),
    ocClear: $('[data-offcanvas-clear]'),
    ocClose: $('[data-offcanvas-close]')
  };

  var openFilterKey = null;
  var lastOpener = null;

  /* ---------- Helfer ---------- */
  function icon(name, cls) {
    return '<svg class="icon ' + (cls || '') + '" aria-hidden="true" focusable="false"><use href="' + SPRITE + '#icon-' + name + '"></use></svg>';
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function includes(arr, v) { return arr.indexOf(v) >= 0; }
  function filterDef(key) {
    for (var i = 0; i < D.DETAIL_FILTERS.length; i++) if (D.DETAIL_FILTERS[i].key === key) return D.DETAIL_FILTERS[i];
    return null;
  }
  function hasDetail() {
    for (var k in state.detail) if (state.detail[k]) return true;
    return false;
  }

  /* ---------- Filter-Auswertung ---------- */
  function matchesZielgruppe(a) {
    return !state.zielgruppe || includes(a.zielgruppen, state.zielgruppe);
  }
  function matchesDetail(a, key, val) {
    switch (key) {
      case 'klassenstufe': return includes(a.klassenstufe, val);
      case 'thema': return includes(a.thema, val);
      case 'format': return a.format === val;
      case 'foerderbedarf': return includes(a.foerderbedarf, val);
      case 'dauer': return a.dauerKat === val;
      case 'sprache': return includes(a.sprache, val);
      default: return true;
    }
  }
  function matches(a, ignoreKey) {
    if (!matchesZielgruppe(a)) return false;
    for (var k in state.detail) {
      if (!state.detail[k] || k === ignoreKey) continue;
      if (!matchesDetail(a, k, state.detail[k])) return false;
    }
    return true;
  }
  function results() { return D.ANGEBOTE.filter(function (a) { return matches(a); }); }
  function poolCount() { return D.ANGEBOTE.filter(matchesZielgruppe).length; }

  /* Ampel: 'none' | 'mid' | 'all' */
  function tier() {
    if (!state.zielgruppe) return 'none';
    var n = poolCount();
    if (n < 9) return 'none';
    if (n <= 20) return 'mid';
    return 'all';
  }
  function visibleDetailFilters() {
    var t = tier();
    if (!state.zielgruppe) return [];
    return D.DETAIL_FILTERS.filter(function (f) {
      if (state.detail[f.key]) return true;           // gesetzte Filter bleiben sichtbar
      if (t === 'all') return true;
      if (t === 'mid') return f.tier === 'mid';
      return false;
    });
  }

  /* ---------- Tags je Angebot (3 Slots) ---------- */
  function tagSlots(a) {
    var t = tier();
    if (!state.zielgruppe) return [{ items: a.zielgruppen, max: 2 }];
    if (t === 'all') {
      var slots = [{ items: a.klassenstufe.length ? a.klassenstufe : a.thema, max: 2 }];
      var extra = null;
      if (a.barrierefreiheit.length) extra = a.barrierefreiheit[0];
      else if (includes(a.sprache, 'Englisch') && includes(a.sprache, 'Deutsch')) extra = 'Auch auf Englisch';
      else if (!includes(a.sprache, 'Deutsch')) extra = 'Auf ' + a.sprache[0];
      if (extra) slots.push({ items: [extra], max: 1 });
      return slots;
    }
    return [{ items: a.thema, max: 2 }];
  }
  function renderTags(a) {
    var parts = [];
    tagSlots(a).forEach(function (slot) {
      var shown = slot.items.slice(0, slot.max);
      var rest = slot.items.length - shown.length;
      shown.forEach(function (item, i) {
        var html = '<span class="edu-item__tag">' + esc(item);
        if (i === shown.length - 1 && rest > 0) html += '<span class="edu-item__more">+' + rest + '</span>';
        html += '</span>';
        parts.push(html);
      });
    });
    return parts.join('<span class="edu-item__sep" aria-hidden="true">·</span>');
  }

  /* ---------- Rendering ---------- */
  function chipHtml(attrs, label, active, badge, iconName) {
    return '<button class="chip" type="button" aria-pressed="' + (active ? 'true' : 'false') + '" ' + attrs + '>' +
      '<span class="chip__label">' + esc(label) + '</span>' +
      (badge ? '<span class="chip__badge">' + esc(badge) + '</span>' : '') +
      (iconName ? icon(iconName, 'chip__icon') : '') +
      (active ? '<span class="sr-only">, Filter entfernen</span>' : '') +
      '</button>';
  }

  function renderChips() {
    el.categoryChips.innerHTML = D.ZIELGRUPPEN.map(function (zg) {
      var active = state.zielgruppe === zg;
      return '<li>' + chipHtml('data-zielgruppe="' + esc(zg) + '"', zg, active, null, active ? 'X' : null) + '</li>';
    }).join('');

    var filters = visibleDetailFilters();
    if (!filters.length) {
      el.detailRow.hidden = true;
      el.detailChips.innerHTML = '';
    } else {
      el.detailRow.hidden = false;
      el.detailChips.innerHTML = filters.map(function (f) {
        var val = state.detail[f.key];
        var attrs = 'data-detail="' + f.key + '"' + (val ? '' : ' aria-haspopup="dialog"');
        return '<li>' + chipHtml(attrs, f.label, !!val, val || null, val ? 'X' : 'CaretRight') + '</li>';
      }).join('');
    }
  }

  function countLabel(n) {
    if (n === 0) return 'Keine Angebote';
    if (n === 1) return '1 Angebot';
    return n + ' Angebote';
  }

  function renderList() {
    var all = results();
    var shown = all.slice(0, state.page * PAGE_SIZE);

    el.count.textContent = countLabel(all.length);
    el.reset.hidden = !(state.zielgruppe || hasDetail());

    el.list.innerHTML = shown.map(function (a) {
      var tags = renderTags(a);
      return '<li>' +
        '<a class="edu-item" href="#angebot-' + a.id + '">' +
          '<div class="edu-item__head">' +
            '<div class="edu-item__text">' +
              '<p class="edu-item__type module-label">' + esc(a.typ) + '</p>' +
              '<h3 class="edu-item__title">' + esc(a.titel) + '</h3>' +
              '<p class="edu-item__desc">' + esc(a.text) + '</p>' +
            '</div>' +
            icon('CaretSmallRight', 'edu-item__caret') +
          '</div>' +
          '<div class="edu-item__side">' +
            '<div class="edu-item__meta">' +
              '<div class="edu-item__tags">' + tags + '</div>' +
              '<div class="edu-item__duration">' + esc(a.dauer) + '</div>' +
            '</div>' +
            icon('CaretSmallRight', 'edu-item__caret') +
          '</div>' +
        '</a>' +
      '</li>';
    }).join('');

    el.empty.hidden = all.length > 0;
    el.moreWrap.hidden = shown.length >= all.length;
  }

  function render() {
    renderChips();
    renderList();
    if (openFilterKey) renderOffcanvasOptions();
  }

  /* ---------- Off-Canvas ---------- */
  function renderOffcanvasOptions() {
    var f = filterDef(openFilterKey);
    if (!f) return;
    var current = state.detail[f.key] || '';
    el.ocTitle.textContent = f.label;
    el.ocOptions.innerHTML = f.options.map(function (opt, i) {
      var n = D.ANGEBOTE.filter(function (a) { return matches(a, f.key) && matchesDetail(a, f.key, opt); }).length;
      var id = 'oc-' + f.key + '-' + i;
      return '<label class="choice choice--radio" for="' + id + '">' +
        '<input class="choice__input" type="radio" name="offcanvas-option" id="' + id + '" value="' + esc(opt) + '"' + (current === opt ? ' checked' : '') + (n === 0 ? ' disabled' : '') + '>' +
        '<span class="choice__box" aria-hidden="true"></span>' +
        '<span class="choice__label">' + esc(opt) + ' <span class="text-secondary">(' + n + ')</span></span>' +
        '</label>';
    }).join('');
    var n = results().length;
    el.ocApply.textContent = countLabel(n) + ' anzeigen';
    el.ocClear.hidden = !current;
  }

  function openOffcanvas(key, opener) {
    openFilterKey = key;
    lastOpener = opener || null;
    renderOffcanvasOptions();
    el.offcanvas.classList.add('is-open');
    el.backdrop.classList.add('is-open');
    el.offcanvas.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    window.setTimeout(function () { el.ocClose.focus(); }, 30);
  }

  function closeOffcanvas() {
    if (!openFilterKey) return;
    var key = openFilterKey;
    openFilterKey = null;
    el.offcanvas.classList.remove('is-open');
    el.backdrop.classList.remove('is-open');
    el.offcanvas.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    var target = el.detailChips.querySelector('[data-detail="' + key + '"]') || lastOpener;
    if (target && document.contains(target)) target.focus();
  }

  /* ---------- Events ---------- */
  el.categoryChips.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-zielgruppe]');
    if (!btn) return;
    var zg = btn.getAttribute('data-zielgruppe');
    state.zielgruppe = state.zielgruppe === zg ? null : zg;
    state.detail = {}; // Detailfilter hängen an der Zielgruppe
    state.page = 1;
    render();
  });

  el.detailChips.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-detail]');
    if (!btn) return;
    var key = btn.getAttribute('data-detail');
    if (state.detail[key]) {
      delete state.detail[key];
      state.page = 1;
      render();
    } else {
      openOffcanvas(key, btn);
    }
  });

  el.reset.addEventListener('click', function () {
    state.zielgruppe = null;
    state.detail = {};
    state.page = 1;
    render();
    el.categoryChips.querySelector('button').focus();
  });

  el.more.addEventListener('click', function () {
    var before = el.list.children.length;
    state.page += 1;
    renderList();
    var next = el.list.children[before];
    if (next) next.querySelector('a').focus();
  });

  el.ocOptions.addEventListener('change', function (e) {
    if (!openFilterKey || e.target.name !== 'offcanvas-option') return;
    state.detail[openFilterKey] = e.target.value;
    state.page = 1;
    render();
  });
  el.ocClear.addEventListener('click', function () {
    if (!openFilterKey) return;
    delete state.detail[openFilterKey];
    state.page = 1;
    render();
  });
  el.ocApply.addEventListener('click', closeOffcanvas);
  el.ocClose.addEventListener('click', closeOffcanvas);
  el.backdrop.addEventListener('click', closeOffcanvas);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openFilterKey) closeOffcanvas();
    /* Fokus im Off-Canvas halten */
    if (e.key === 'Tab' && openFilterKey) {
      var f = el.offcanvas.querySelectorAll('button:not([hidden]), input:not([disabled]), a[href]');
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Teaser-Slider (nur Vor/Zurück) ---------- */
  document.querySelectorAll('[data-slider]').forEach(function (slider) {
    var track = slider.querySelector('[data-slider-track]');
    var prev = slider.querySelector('[data-slider-prev]');
    var next = slider.querySelector('[data-slider-next]');
    function step() { var card = track.firstElementChild; return card ? card.getBoundingClientRect().width + 16 : 300; }
    function update() {
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    }
    prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  /* ---------- Start (optional ?zielgruppe=Schulen für Demo-Links) ---------- */
  var params = new URLSearchParams(window.location.search);
  var startZg = params.get('zielgruppe');
  if (startZg && includes(D.ZIELGRUPPEN, startZg)) state.zielgruppe = startZg;
  render();
})();

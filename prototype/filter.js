/* SGLI Prototyp „Bildung“ – Filter-Logik (Vanilla JS, kein Backend)
   Regeln aus Figma („Regeln für Filter“, „Dynamische Ausgabe von Tags“, Node 2548:24966):

   Ampel für Detailfilter (bezogen auf die Angebote der gewählten Zielgruppe):
     unter 9 Angebote   → keine Detailfilter
     9 bis 20 Angebote  → Dauer und Thema
     über 20 Angebote   → alle Detailfilter (Klassenstufe, Thema, Format, Förderbedarf, Dauer, Sprache)
   Ohne gewählte Zielgruppe zeigt Figma keine Detailfilter (Frame „Bildung - Filter Default“).

   Tags in der Liste: 3 Slots. 2 dynamische Slots je Filterschritt, 1 Slot für die Dauer.
     ungefiltert               → Zielgruppen (max 2, Rest als +N) · Dauer
     Zielgruppe gewählt        → Thema (max 2) · Dauer
     Zielgruppe + Detailfilter → Klassenstufe (sonst Thema, sonst Format; max 2) · Barrierefreiheit oder Sprache · Dauer
     Barrierefreiheit hat Vorrang vor Englisch. Das gefilterte Attribut wird als Tag übersprungen.

   Zielgruppen-Chips: Klick setzt, Klick auf den aktiven Chip (X) entfernt.
   Detailfilter-Chips: Chevron öffnet ein Off-Canvas. Gesetzt wird der Chip geteilt: Label + Badge öffnen das
   Off-Canvas erneut (Wert ändern), das X entfernt den Wert. */

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
    ocTitle: $('[data-offcanvas-title]'),
    ocLegend: $('[data-offcanvas-legend]'),
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

  /* ---------- Tags je Angebot (3 Slots) ----------
     Lesart B (entschieden 2026-09-11): die gesetzten Filter entscheiden, nicht die Ampelstufe.
       keine Zielgruppe          → Zielgruppen (max 2)
       Zielgruppe, kein Detail   → Thema (max 2)
       Zielgruppe + Detailfilter → Slot 1: Klassenstufe, sonst Thema, sonst Format (max 2)
                                   Slot 2: Barrierefreiheit, sonst Sprache
     Das Attribut, nach dem gerade gefiltert wird, wird übersprungen (wäre bei allen Treffern gleich). */
  function tagSlots(a) {
    if (!state.zielgruppe) return [{ items: a.zielgruppen, max: 2 }];
    if (!hasDetail()) return [{ items: a.thema, max: 2 }];

    var slots = [];
    var primary = [
      { key: 'klassenstufe', items: state.zielgruppe === 'Schulen' ? a.klassenstufe : [] }, /* Klassenstufe nur für Schulen */
      { key: 'thema', items: a.thema },
      { key: 'format', items: [a.format] }
    ];
    for (var i = 0; i < primary.length; i++) {
      if (!state.detail[primary[i].key] && primary[i].items.length) {
        slots.push({ items: primary[i].items, max: 2 });
        break;
      }
    }

    var extra = null;
    if (a.barrierefreiheit.length && !state.detail.foerderbedarf) extra = a.barrierefreiheit[0];
    else if (!state.detail.sprache) {
      if (includes(a.sprache, 'Englisch') && includes(a.sprache, 'Deutsch')) extra = 'Auch auf Englisch';
      else if (!includes(a.sprache, 'Deutsch')) extra = 'Auf ' + a.sprache[0];
    }
    if (extra) slots.push({ items: [extra], max: 1 });
    return slots;
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

  /* ---------- Motion ----------
     Dauer aus prototype.css (--motion-fast), damit JS-Timer und CSS-Transitions zusammenpassen.
     Bei prefers-reduced-motion entfällt der Crossfade der Liste komplett. */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function motionVar(name, fallback) {
    var v = parseInt(getComputedStyle(document.documentElement).getPropertyValue(name), 10);
    return reduceMotion.matches ? 0 : (isNaN(v) ? fallback : v);
  }
  function motionFast() { return motionVar('--motion-fast', 160); }
  function motionSlow() { return motionVar('--motion-slow', 480); }

  /* ---------- Rendering: Chips ----------
     Chips werden einmal gebaut und danach nur im Zustand aktualisiert (aria-pressed, Slots, Texte),
     damit die CSS-Transitions abspielen können. Ein innerHTML-Neuaufbau schneidet jede Animation ab.
     Slots (Badge, Icon, X-Button) wachsen und schrumpfen über grid-template-columns 0fr ↔ 1fr.
     Geteilter Chip: Label + Badge öffnen das Off-Canvas erneut, das X entfernt den Wert. */
  function slot(cls, inner) {
    return '<span class="chip__slot ' + cls + '"><span class="chip__slot-inner">' + inner + '</span></span>';
  }
  function setSlot(root, cls, open) {
    root.querySelector('.' + cls).classList.toggle('is-open', open);
  }

  function buildCategoryChips() {
    el.categoryChips.innerHTML = D.ZIELGRUPPEN.map(function (zg) {
      return '<li><button class="chip" type="button" aria-pressed="false" data-zielgruppe="' + esc(zg) + '">' +
        '<span class="chip__label">' + esc(zg) + '</span>' +
        slot('chip__slot--icon', icon('X', 'chip__icon')) +
        '<span class="sr-only" data-sr></span>' +
        '</button></li>';
    }).join('');
  }
  function updateCategoryChips() {
    el.categoryChips.querySelectorAll('[data-zielgruppe]').forEach(function (btn) {
      var active = state.zielgruppe === btn.getAttribute('data-zielgruppe');
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      setSlot(btn, 'chip__slot--icon', active);
      btn.querySelector('[data-sr]').textContent = active ? ', Filter entfernen' : '';
    });
  }

  function buildDetailChips(filters) {
    el.detailChips.innerHTML = filters.map(function (f) {
      return '<li class="chip-split" data-filter-key="' + f.key + '">' +
        '<button class="chip chip--split-main" type="button" aria-pressed="false" aria-haspopup="dialog" data-detail="' + f.key + '">' +
          '<span class="chip__label">' + esc(f.label) + '</span>' +
          slot('chip__slot--badge', '<span class="chip__badge"></span>') +
          slot('chip__slot--icon', icon('CaretRight', 'chip__icon')) +
          '<span class="sr-only" data-sr></span>' +
        '</button>' +
        slot('chip__slot--remove',
          '<button class="chip chip--split-remove focus-inset" type="button" aria-pressed="true" data-detail-remove="' + f.key + '" tabindex="-1" aria-hidden="true">' +
            icon('X', 'chip__icon') +
          '</button>') +
      '</li>';
    }).join('');
    el.detailChips.setAttribute('data-keys', filters.map(function (f) { return f.key; }).join(','));
  }
  function updateDetailChips(filters) {
    filters.forEach(function (f) {
      var li = el.detailChips.querySelector('[data-filter-key="' + f.key + '"]');
      var val = state.detail[f.key] || '';
      var main = li.querySelector('.chip--split-main');
      var remove = li.querySelector('.chip--split-remove');
      li.classList.toggle('is-active', !!val);
      main.setAttribute('aria-pressed', val ? 'true' : 'false');
      if (val) main.querySelector('.chip__badge').textContent = val; /* Text bleibt beim Ausblenden stehen */
      setSlot(main, 'chip__slot--badge', !!val);
      setSlot(main, 'chip__slot--icon', !val);
      main.querySelector('[data-sr]').textContent = val ? ', ändern' : '';
      setSlot(li, 'chip__slot--remove', !!val);
      remove.setAttribute('aria-label', f.label + ': ' + val + ' entfernen');
      remove.tabIndex = val ? 0 : -1;
      remove.setAttribute('aria-hidden', val ? 'false' : 'true');
    });
  }

  /* Detailfilter-Zeile klappt per CSS auf und zu (grid-template-rows). Während der Bewegung
     beschneidet is-animating den Inhalt, danach nicht mehr (Fokusring). Beim ersten Render ohne
     Animation, sonst bliebe is-animating hängen, weil ohne Zustandswechsel kein transitionend kommt. */
  var detailRowRendered = false;
  var detailRowTimer = null;
  function setDetailRow(open) {
    var row = el.detailRow;
    var wasOpen = row.classList.contains('is-open');
    if (detailRowRendered && wasOpen !== open) {
      row.classList.add('is-animating');
      clearTimeout(detailRowTimer);
      detailRowTimer = setTimeout(settleDetailRow, motionSlow() + 50); /* Fallback ohne transitionend */
    }
    row.classList.toggle('is-open', open);
    detailRowRendered = true;
  }
  function settleDetailRow() {
    clearTimeout(detailRowTimer);
    el.detailRow.classList.remove('is-animating');
  }
  el.detailRow.addEventListener('transitionend', function (e) {
    if (e.target === el.detailRow && e.propertyName === 'grid-template-rows') settleDetailRow();
  });

  function renderChips() {
    if (!el.categoryChips.children.length) buildCategoryChips();
    updateCategoryChips();

    var filters = visibleDetailFilters();
    var keys = filters.map(function (f) { return f.key; }).join(',');
    setDetailRow(filters.length > 0);
    /* Die Chip-Menge ändert sich nur mit der Zielgruppe (Ampel). Nur dann neu bauen. */
    if (keys !== el.detailChips.getAttribute('data-keys')) buildDetailChips(filters);
    updateDetailChips(filters);
  }

  function countLabel(n) {
    if (n === 0) return 'Keine Angebote';
    if (n === 1) return '1 Angebot';
    return n + ' Angebote';
  }

  /* ---------- Rendering: Liste ----------
     Filterwechsel: Liste blendet ab (is-updating), wird nach --motion-fast neu gebaut und blendet wieder ein.
     „Weitere laden“ baut sofort (immediate), damit der Fokus auf das erste neue Angebot gesetzt werden kann. */
  var listTimer = null;
  function renderList(immediate) {
    var all = results();
    el.count.textContent = countLabel(all.length);
    el.reset.classList.toggle('is-hidden', !(state.zielgruppe || hasDetail()));

    var delay = motionFast();
    if (immediate || !el.list.children.length || delay === 0) {
      window.clearTimeout(listTimer);
      el.list.classList.remove('is-updating');
      buildList(all);
      return;
    }
    el.list.classList.add('is-updating');
    window.clearTimeout(listTimer);
    listTimer = window.setTimeout(function () {
      buildList(results());
      el.list.classList.remove('is-updating');
    }, delay);
  }

  function buildList(all) {
    var shown = all.slice(0, state.page * PAGE_SIZE);

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
    if (openFilterKey) updateOffcanvasState();
  }

  /* ---------- Off-Canvas (natives <dialog>, Figma 2613:31418) ----------
     Optionen als filter-cell (Figma 2646:40456): Radio-Einfachauswahl, Trefferzahl rechts.
     Die Liste wird nur beim Öffnen gebaut. Bei Auswahl aktualisiert updateOffcanvasState() nur Zahlen,
     disabled und Button-Labels, damit der fokussierte Radio-Input erhalten bleibt (Pfeiltasten, Fokus-Trap). */
  function optionCount(f, opt) {
    return D.ANGEBOTE.filter(function (a) { return matches(a, f.key) && matchesDetail(a, f.key, opt); }).length;
  }

  function renderOffcanvasOptions() {
    var f = filterDef(openFilterKey);
    if (!f) return;
    var current = state.detail[f.key] || '';
    el.ocTitle.textContent = f.label;
    el.ocLegend.textContent = f.label;
    el.ocOptions.querySelectorAll('.filter-cell').forEach(function (n) { n.remove(); });
    el.ocOptions.insertAdjacentHTML('beforeend', f.options.map(function (opt, i) {
      var n = optionCount(f, opt);
      var id = 'oc-' + f.key + '-' + i;
      return '<label class="filter-cell" for="' + id + '">' +
        '<input class="filter-cell__input" type="radio" name="offcanvas-option" id="' + id + '" value="' + esc(opt) + '"' + (current === opt ? ' checked' : '') + (n === 0 ? ' disabled' : '') + '>' +
        '<span class="filter-cell__main">' +
          '<span class="filter-cell__indicator" aria-hidden="true"></span>' +
          '<span class="filter-cell__label">' + esc(opt) + '</span>' +
        '</span>' +
        '<span class="filter-cell__count"><span data-count>' + n + '</span><span class="sr-only"> Angebote</span></span>' +
        '</label>';
    }).join(''));
    updateOffcanvasState();
  }

  function updateOffcanvasState() {
    var f = filterDef(openFilterKey);
    if (!f) return;
    var current = state.detail[f.key] || '';
    el.ocOptions.querySelectorAll('.filter-cell').forEach(function (cell, i) {
      var n = optionCount(f, f.options[i]);
      var input = cell.querySelector('.filter-cell__input');
      var count = cell.querySelector('[data-count]');
      count.textContent = n;
      input.disabled = n === 0 && input.value !== current;
      input.checked = input.value === current;
    });
    el.ocApply.textContent = countLabel(results().length) + ' anzeigen';
    el.ocClear.disabled = !current;
  }

  function openOffcanvas(key, opener) {
    openFilterKey = key;
    lastOpener = opener || null;
    renderOffcanvasOptions();
    if (!el.offcanvas.open) el.offcanvas.showModal();
    /* Fokus auf den Titel (tabindex="-1"), nicht auf die erste Option: Screenreader lesen Kicker + Titel,
       Tab geht danach zum Close-Button und weiter zu den Optionen. Auf Touch bleibt nichts sichtbar,
       weil der Titel keinen Fokusring hat (Safari/Firefox setzen bei focus() sonst :focus-visible auf die Zelle). */
    el.ocTitle.focus({ preventScroll: true });
  }

  function closeOffcanvas() {
    if (el.offcanvas.open) el.offcanvas.close();
  }

  /* Ein Pfad für alle Schließwege (Close-Button, „anzeigen“, Escape, Backdrop): Fokus zurück zum Auslöser.
     Der Chip wurde inzwischen neu gerendert, deshalb über den Filterschlüssel suchen, Fallback lastOpener. */
  el.offcanvas.addEventListener('close', function () {
    var key = openFilterKey;
    openFilterKey = null;
    var target = (key && el.detailChips.querySelector('[data-detail="' + key + '"]')) || lastOpener;
    if (target && document.contains(target)) target.focus();
    lastOpener = null;
  });

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
    var remove = e.target.closest('[data-detail-remove]');
    if (remove) {
      var rkey = remove.getAttribute('data-detail-remove');
      delete state.detail[rkey];
      state.page = 1;
      render();
      var chip = el.detailChips.querySelector('[data-detail="' + rkey + '"]');
      if (chip) chip.focus();
      return;
    }
    var btn = e.target.closest('[data-detail]');
    if (!btn) return;
    openOffcanvas(btn.getAttribute('data-detail'), btn);
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
    renderList(true);
    var next = el.list.children[before];
    if (next) next.querySelector('a').focus();
  });

  /* Auswahl setzen oder, bei erneutem Klick auf die gewählte Option, wieder aufheben (entschieden 2026-09-23).
     Radios kennen kein natives Abwählen, daher: change setzt eine neue Option, click/Space/Enter auf der
     bereits gewählten Option entfernt den Wert. Die Liste wird nicht neu gebaut, der Fokus bleibt. */
  function setOption(value) {
    if (!openFilterKey) return;
    if (state.detail[openFilterKey] === value) delete state.detail[openFilterKey];
    else state.detail[openFilterKey] = value;
    state.page = 1;
    render();
  }
  el.ocOptions.addEventListener('change', function (e) {
    if (!openFilterKey || e.target.name !== 'offcanvas-option') return;
    if (state.detail[openFilterKey] !== e.target.value) setOption(e.target.value);
  });
  el.ocOptions.addEventListener('click', function (e) {
    var input = e.target.closest('.filter-cell__input');
    if (!input || input.disabled || !openFilterKey) return;
    if (state.detail[openFilterKey] === input.value) setOption(input.value); /* Abwählen */
  });
  el.ocOptions.addEventListener('keydown', function (e) {
    var input = e.target.closest('.filter-cell__input');
    if (!input || input.disabled || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault(); /* Enter würde sonst das Formular über den ersten Submit-Button schließen,
                           Space löst auf einem gewählten Radio kein click aus */
    setOption(input.value);
  });
  el.ocClear.addEventListener('click', function () {
    if (!openFilterKey) return;
    delete state.detail[openFilterKey];
    state.page = 1;
    render();
  });
  /* Close-Button und „anzeigen“ schließen über <form method="dialog">, Escape über das native cancel.
     Backdrop-Klick: der Klick landet auf dem <dialog> selbst, weil das Formular die Panelfläche füllt. */
  el.offcanvas.addEventListener('click', function (e) {
    if (e.target === el.offcanvas) closeOffcanvas();
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

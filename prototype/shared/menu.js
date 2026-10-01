/* SGLI Prototyp – Menü-Overlay (global für alle Prototypen)
   Figma: Navigation / Menu Overlay (2802:62629), Zeile navigation-cell-menu (2834:27277).
   Eine Quelle für alle Seiten: das Script baut das Menü-Markup und hängt es an <body>.

   Einbinden (Seite liegt in prototype/<name>/):
     <link rel="stylesheet" href="../shared/menu.css">
     <button class="btn btn--primary" type="button" data-menu-open>Menü</button>
     <script src="../shared/menu.js" data-current="haftbuch"></script>
   data-current = key der aktuellen Seite (haftbuch | bildung), setzt aria-current und das Quadrat.

   Verhalten: nativer <dialog> mit showModal() (Fokusfalle, Rest der Seite inert). „Schließen“, Escape und ein
   Klick auf den Link der aktuellen Seite schließen animiert. Links auf Seiten, die es im Prototyp nicht gibt,
   tun nichts. Die Choreografie liegt komplett in menu.css; das Script setzt nur .is-open, die Reihenfolge der
   sichtbaren Einträge (--i) und deren Anzahl (--menu-n). */

(function () {
  var script = document.currentScript;
  var current = script && script.getAttribute('data-current');
  var SPRITE = '../../dist/icons/sprite.svg';
  var CLOSE_MS = 1140; // = Ende der Abdunkelung beim Schließen (menu.css: --menu-c-dim-delay + --menu-d-dim)
  var HANDOFF_MS = 240; // Übergabe an die Suche: Inhalt blendet aus (menu.css: .menu.is-handoff)

  var ITEMS = [
    { label: 'Besuch' },
    { label: 'Ausstellung' },
    { label: 'Veranstaltungen' },
    { label: 'Haftbücher & Schicksale', key: 'haftbuch', href: '../haftbuch/' },
    { label: 'Bildung', key: 'bildung', href: '../angebote-filter/' },
    { label: 'Die Stiftung' }
  ];

  function icon(name) {
    return '<svg class="icon" aria-hidden="true" focusable="false"><use href="' + SPRITE + '#icon-' + name + '"></use></svg>';
  }
  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  var cells = ITEMS.map(function (item) {
    var isCurrent = item.key && item.key === current;
    return '<li class="menu__reveal">' +
      '<a class="nav-cell" href="' + (item.href || '#') + '"' +
        (isCurrent ? ' aria-current="page"' : '') +
        (item.href ? '' : ' data-menu-dummy') + '>' +
        '<span class="nav-cell__indicator" aria-hidden="true"></span>' +
        '<span class="nav-cell__label">' + esc(item.label) + '</span>' +
        '<span class="nav-cell__icon" aria-hidden="true">' +
          '<svg focusable="false"><use href="' + SPRITE + '#icon-ArrowRight"></use></svg>' +
        '</span>' +
      '</a></li>';
  }).join('');

  var hours = 'Heute geöffnet von 10-18:00 Uhr';

  var html =
    '<dialog class="menu" id="site-menu" aria-label="Menü">' +
      '<div class="menu__scrim" aria-hidden="true"></div>' +
      '<div class="menu__panel">' +
        // Kopf: wie .site-nav der Seiten (Figma Site Header im Overlay)
        '<header class="menu__head">' +
          '<a class="menu__logo" href="../startseite/" aria-label="Stiftung Gedenkstätte Lindenstraße – Startseite"><span class="logo-mark"></span></a>' +
          '<div class="menu__actions">' +
            '<p class="menu__hours">' + hours + '</p>' +
            '<div class="menu__buttons">' +
              '<div class="menu__icons">' +
                '<button class="btn btn--icon" type="button" aria-label="Sprache wechseln" data-modal-open="modal-language">' + icon('Translate') + '</button>' +
                '<button class="btn btn--icon" type="button" aria-label="Leichte Sprache"><span class="menu__mask" aria-hidden="true"></span></button>' +
                '<button class="btn btn--icon" type="button" aria-label="Suche öffnen" data-search-open>' + icon('MagnifyingGlass') + '</button>' +
              '</div>' +
              '<button class="btn btn--primary menu__close" type="button" data-menu-close autofocus>Schließen</button>' +
            '</div>' +
          '</div>' +
        '</header>' +

        '<div class="menu__body">' +
          // Phone/Tablet: Menu Utility Panel (Figma 2289:19252)
          '<div class="menu__utility">' +
            '<p class="menu__hours menu__reveal">' + hours + '</p>' +
            '<form class="menu__search menu__reveal" role="search" data-menu-search>' +
              '<div class="field">' +
                '<div class="field__box">' +
                  '<input class="field__input" id="menu-query" type="search" placeholder=" " autocomplete="off">' +
                  '<label class="field__label" for="menu-query">Suchbegriff eingeben</label>' +
                  '<svg class="icon field__icon" aria-hidden="true" focusable="false"><use href="' + SPRITE + '#icon-MagnifyingGlass"></use></svg>' +
                '</div>' +
              '</div>' +
            '</form>' +
            '<div class="menu__lang menu__reveal">' +
              '<button class="btn btn--icon" type="button" aria-label="Sprache wechseln" data-modal-open="modal-language">' + icon('Translate') + '</button>' +
              '<button class="btn btn--icon" type="button" aria-label="Leichte Sprache"><span class="menu__mask" aria-hidden="true"></span></button>' +
            '</div>' +
          '</div>' +

          '<nav class="menu__nav" aria-label="Hauptnavigation">' +
            '<ul class="menu__list" role="list">' + cells + '</ul>' +
          '</nav>' +

          // ab Tablet: Menu Feature Image (Figma 2262:17558), dekorativ
          '<figure class="menu__media"><img src="../shared/assets/menu-feature.jpg" alt="" decoding="async"></figure>' +
        '</div>' +

        // Abbinder (Figma Menu Footer 2262:17549 / Phone 2289:19279)
        '<footer class="menu__foot">' +
          '<div class="menu__foot-group">' +
            '<ul class="menu__links" role="list">' +
              '<li><a href="#" data-menu-dummy>Kontakt</a></li>' +
              '<li><a href="#" data-menu-dummy>Presse</a></li>' +
              '<li><a href="#" data-menu-dummy>Team</a></li>' +
            '</ul>' +
            '<ul class="menu__links menu__links--legal" role="list">' +
              '<li><a href="#" data-menu-dummy>Impressum</a></li>' +
              '<li><a href="#" data-menu-dummy>Datenschutz</a></li>' +
            '</ul>' +
          '</div>' +
          '<address class="menu__address">Lindenstraße 54/55, 14467 Potsdam</address>' +
        '</footer>' +
      '</div>' +
    '</dialog>';

  document.body.insertAdjacentHTML('beforeend', html);

  var dialog = document.getElementById('site-menu');
  var panel = dialog.querySelector('.menu__panel');
  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var trigger = null;
  var closeTimer = null;
  var skipFocus = false;

  // Reihenfolge nur über die sichtbaren Einträge zählen (Phone: Utility + Liste, Desktop: nur Liste)
  function indexItems() {
    var visible = Array.prototype.filter.call(dialog.querySelectorAll('.menu__reveal'), function (el) {
      return el.getClientRects().length > 0;
    });
    visible.forEach(function (el, i) { el.style.setProperty('--i', i); });
    dialog.style.setProperty('--menu-n', visible.length);
  }

  function lock() {
    var scrollbar = window.innerWidth - root.clientWidth;
    if (scrollbar > 0) root.style.paddingRight = scrollbar + 'px';
    root.classList.add('menu-lock');
  }
  function unlock() {
    root.classList.remove('menu-lock');
    root.style.paddingRight = '';
  }

  function open(btn) {
    if (dialog.open) return;
    trigger = btn || null;
    lock();
    dialog.showModal();
    panel.scrollTop = 0;
    indexItems();
    void dialog.offsetWidth; // Ausgangszustand festschreiben, sonst startet keine Transition
    requestAnimationFrame(function () { dialog.classList.add('is-open'); });
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  }

  function close() {
    if (!dialog.open || closeTimer) return;
    dialog.classList.remove('is-open');
    closeTimer = setTimeout(function () { dialog.close(); }, reduced.matches ? 0 : CLOSE_MS);
  }

  dialog.addEventListener('close', function () {
    clearTimeout(closeTimer);
    closeTimer = null;
    dialog.classList.remove('is-open');
    unlock();
    dialog.classList.remove('is-handoff', 'is-instant');
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
      if (!skipFocus) trigger.focus();
    }
    skipFocus = false;
  });

  /* Übergabe an eine andere Ebene mit gleichem Kopf (Suche): Inhalt blendet aus, Kopf und Fläche bleiben.
     next(trigger) öffnet die neue Ebene darüber und darf eine Funktion zurückgeben, die nach dem sofortigen
     Schließen des Menüs läuft. Der Fokus bleibt bei der neuen Ebene. */
  function handoff(next) {
    if (!dialog.open || closeTimer) { next(null); return; }
    dialog.classList.add('is-handoff');
    setTimeout(function () {
      var after = next(trigger);
      skipFocus = true;
      dialog.classList.add('is-instant');
      dialog.classList.remove('is-open');
      dialog.close();
      if (typeof after === 'function') after();
    }, reduced.matches ? 0 : HANDOFF_MS);
  }
  window.SGLI = window.SGLI || {};
  window.SGLI.menu = { handoff: handoff };

  // Escape: animiert schließen statt sofort (keydown abfangen, sonst schließt der Browser direkt)
  dialog.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
  });
  dialog.addEventListener('cancel', function (e) { e.preventDefault(); close(); });

  dialog.addEventListener('click', function (e) {
    if (e.target.closest('[data-menu-close]')) { close(); return; }
    var link = e.target.closest('a');
    if (!link) return;
    if (link.hasAttribute('data-menu-dummy')) { e.preventDefault(); return; } // Seite gibt es im Prototyp nicht
    if (link.getAttribute('aria-current') === 'page') { e.preventDefault(); close(); }
  });

  dialog.querySelector('[data-menu-search]').addEventListener('submit', function (e) { e.preventDefault(); });

  // Breakpoint-Wechsel bei offenem Menü: Reihenfolge neu zählen
  window.addEventListener('resize', function () { if (dialog.open) indexItems(); });

  document.querySelectorAll('[data-menu-open]').forEach(function (btn) {
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.setAttribute('aria-controls', 'site-menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function () { open(btn); });
  });
})();

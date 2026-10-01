/* SGLI Prototyp – Such-Overlay (global für alle Prototypen)
   Figma: search-overlay (2872:4913), Doku „Suche“ (2873:1631). Styles: search.css (braucht menu.css).
   Eine Quelle für alle Seiten: das Script baut den Dialog und hängt ihn an <body>.

   Einbinden (Seite liegt in prototype/<name>/), nach menu.js:
     <link rel="stylesheet" href="../shared/search.css">
     <button class="btn btn--icon" type="button" aria-label="Suche öffnen" data-search-open>…</button>
     <script src="../shared/search.js" data-current="haftbuch"></script>

   Öffnen über jeden [data-search-open]. Liegt der Auslöser im Menü, übergibt das Menü an die Suche
   (SGLI.menu.handoff): Menü-Inhalt blendet aus, Kopf und Fläche bleiben, die Fläche zieht sich auf die
   Suche zusammen. Fokus geht sofort ins Suchfeld, beim Schließen zurück zum Auslöser (aus dem Menü:
   zum Menü-Button der Seite).
   Schließen: „Schließen“, Escape, Klick auf die abgedunkelte Seite. Ohne Rückfrage.

   Dummy: Absenden mit Begriff schließt nur (Ergebnisseite gibt es im Prototyp nicht), leeres Feld tut nichts.
   „Häufig gesucht“ = redaktionelle Links aus Craft, ohne Zähler, als Button/Secondary (Chips bleiben dem
   Filtern vorbehalten). Links auf Prototyp-Seiten funktionieren, die anderen schließen nur. */

(function () {
  var script = document.currentScript;
  var current = script && script.getAttribute('data-current');
  var SPRITE = '../../dist/icons/sprite.svg';
  var CLOSE_MS = 1060; // = Ende der Abdunkelung beim Schließen (search.css: --search-c-dim-delay + --motion-dim)

  // In Craft gepflegt: die wichtigsten Links, ohne Zähler
  var LINKS = [
    { label: 'Haftbuch', key: 'haftbuch', href: '../haftbuch/' },
    { label: 'Bildungsangebote', key: 'bildung', href: '../angebote-filter/' },
    { label: 'Führungen' },
    { label: 'Öffnungszeiten' },
    { label: 'Anfahrt' }
  ];

  function icon(name) {
    return '<svg class="icon" aria-hidden="true" focusable="false"><use href="' + SPRITE + '#icon-' + name + '"></use></svg>';
  }

  var links = LINKS.map(function (l) {
    var here = l.key && l.key === current;
    return '<li><a class="btn btn--secondary" href="' + (l.href || '#') + '"' +
      (here ? ' aria-current="page"' : '') + (l.href ? '' : ' data-search-dummy') + '>' + l.label + '</a></li>';
  }).join('');

  var hours = 'Heute geöffnet von 10-18:00 Uhr';

  var html =
    '<dialog class="search" id="site-search" aria-label="Suche">' +
      '<div class="search__scrim" data-search-scrim aria-hidden="true"></div>' +
      '<div class="search__surface" aria-hidden="true"></div>' +
      '<div class="search__content">' +
        // Kopf: dieselben Klassen wie im Menü, damit er beim Wechsel stehen bleibt
        '<header class="menu__head">' +
          '<a class="menu__logo" href="#" data-search-dummy aria-label="Stiftung Gedenkstätte Lindenstraße – Startseite"><span class="logo-mark"></span></a>' +
          '<div class="menu__actions">' +
            '<p class="menu__hours">' + hours + '</p>' +
            '<div class="menu__buttons">' +
              '<div class="menu__icons">' +
                '<button class="btn btn--icon" type="button" aria-label="Sprache wechseln" data-modal-open="modal-language">' + icon('Translate') + '</button>' +
                '<button class="btn btn--icon" type="button" aria-label="Leichte Sprache"><span class="menu__mask" aria-hidden="true"></span></button>' +
                '<button class="btn btn--icon" type="button" aria-label="Zum Suchfeld" data-search-focus>' + icon('MagnifyingGlass') + '</button>' +
              '</div>' +
              '<button class="btn btn--primary menu__close" type="button" data-search-close>Schließen</button>' +
            '</div>' +
          '</div>' +
        '</header>' +
        '<div class="search__body">' +
          '<form class="search__form" role="search" action="#" data-search-form style="--i:0">' +
            '<label class="text-label-s search__kicker" for="site-search-q">Suche</label>' +
            '<div class="search__row">' +
              '<div class="search__field">' + icon('MagnifyingGlass') +
                '<input class="search__input" id="site-search-q" name="q" type="search" placeholder="Suchbegriff eingeben" autocomplete="off" enterkeyhint="search">' +
              '</div>' +
              '<button class="btn btn--primary" type="submit">Suchen</button>' +
            '</div>' +
          '</form>' +
          '<nav class="search__links" aria-labelledby="site-search-links" style="--i:1">' +
            '<p class="text-label-s search__links-title" id="site-search-links">Häufig gesucht</p>' +
            '<ul class="search__link-list" role="list">' + links + '</ul>' +
          '</nav>' +
        '</div>' +
      '</div>' +
    '</dialog>';

  document.body.insertAdjacentHTML('beforeend', html);

  var dialog = document.getElementById('site-search');
  var content = dialog.querySelector('.search__content');
  var input = dialog.querySelector('.search__input');
  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var trigger = null;
  var closeTimer = null;
  var padded = false;

  function measure() {
    dialog.style.setProperty('--search-h', content.offsetHeight + 'px');
  }

  function lock(padding) {
    var scrollbar = padding != null ? parseFloat(padding) || 0 : window.innerWidth - root.clientWidth;
    if (scrollbar > 0) { root.style.paddingRight = scrollbar + 'px'; padded = true; }
    root.classList.add('search-lock');
  }
  function unlock() {
    root.classList.remove('search-lock');
    if (padded) { root.style.paddingRight = ''; padded = false; }
  }

  function setExpanded(value) {
    if (trigger && trigger.hasAttribute('data-search-open')) trigger.setAttribute('aria-expanded', value);
  }

  function open(btn) {
    if (dialog.open) return;
    trigger = btn || null;
    lock();
    dialog.showModal();
    measure();
    input.focus();
    void dialog.offsetWidth; // Ausgangszustand festschreiben, sonst startet keine Transition
    requestAnimationFrame(function () { dialog.classList.add('is-open'); });
    setExpanded('true');
  }

  // Aus dem Menü: das Menü blendet seinen Inhalt aus und ruft uns in voller Höhe auf
  function openFromMenu() {
    window.SGLI.menu.handoff(function (menuTrigger) {
      var padding = root.style.paddingRight; // Scrollbar-Ausgleich des Menüs übernehmen
      trigger = menuTrigger;
      dialog.classList.add('is-from-menu');
      dialog.showModal();
      measure();
      input.focus();
      return function () {
        lock(padding);
        void dialog.offsetWidth;
        requestAnimationFrame(function () {
          dialog.classList.remove('is-from-menu');
          dialog.classList.add('is-open', 'is-handoff');
        });
      };
    });
  }

  function close() {
    if (!dialog.open || closeTimer) return;
    dialog.classList.remove('is-open', 'is-handoff');
    closeTimer = setTimeout(function () { dialog.close(); }, reduced.matches ? 0 : CLOSE_MS);
  }

  dialog.addEventListener('close', function () {
    clearTimeout(closeTimer);
    closeTimer = null;
    dialog.classList.remove('is-open', 'is-handoff', 'is-from-menu');
    unlock();
    setExpanded('false');
    if (trigger && trigger.isConnected) trigger.focus();
    trigger = null;
  });

  // Escape: animiert schließen statt sofort
  dialog.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
  });
  dialog.addEventListener('cancel', function (e) { e.preventDefault(); close(); });

  dialog.addEventListener('click', function (e) {
    if (e.target.closest('[data-search-close]') || e.target.hasAttribute('data-search-scrim')) { close(); return; }
    if (e.target.closest('[data-search-focus]')) { input.focus(); return; }
    var link = e.target.closest('a');
    if (!link) return;
    if (link.hasAttribute('data-search-dummy') || link.getAttribute('aria-current') === 'page') {
      e.preventDefault();
      if (link.closest('.search__links')) close();
    }
  });

  dialog.querySelector('[data-search-form]').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!input.value.trim()) { input.focus(); return; }
    close(); // Dummy: im echten Einsatz → Ergebnisseite mit ?q=
  });

  window.addEventListener('resize', function () { if (dialog.open) measure(); });

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-search-open]');
    if (!btn) return;
    var menu = document.getElementById('site-menu');
    if (menu && menu.open && menu.contains(btn) && window.SGLI && window.SGLI.menu) openFromMenu();
    else open(btn);
  });

  document.querySelectorAll('[data-search-open]').forEach(function (btn) {
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.setAttribute('aria-controls', 'site-search');
    btn.setAttribute('aria-expanded', 'false');
  });
})();

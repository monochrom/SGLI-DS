/* SGLI Prototyp – Seitenkopf: scrollt heraus, kommt beim Hochscrollen zurück
   Figma: navigation (1926:1842), Doku-Frame „Seitenkopf“ (2929:2012).

   Nicht fixiert. Oben steht der Kopf im Seitenfluss und scrollt mit dem Inhalt heraus.
   Hochscrollen (ab DELTA px am Stück): Der Kopf gleitet von oben herein und liegt über dem Inhalt.
   Runterscrollen: gleitet wieder weg. Ganz oben: wieder im Seitenfluss, ohne Animation.
   Ein Platzhalter hält die Kopfhöhe, damit die Seite nicht springt, wenn der Kopf fixed wird.
   Tastatur: Fokus im ausgeblendeten Kopf blendet ihn ein. Menü, Suche, Dialog offen (Scroll gesperrt): keine Änderung.
   Reduced Motion: reset.css verkürzt die Transition, der Kopf erscheint ohne Weg.

   Einbinden: <link rel="stylesheet" href="../shared/header.css"> + <script src="../shared/header.js"></script> */

(function () {
  var head = document.querySelector('.site-nav');
  if (!head) return;

  var DELTA = 8; // Mindestweg in eine Richtung, damit kleine Zitterbewegungen nichts auslösen
  var root = document.documentElement;
  var slot = document.createElement('div');
  slot.className = 'site-nav-slot';
  head.parentNode.insertBefore(slot, head);
  slot.appendChild(head);

  var state = 'static'; // static | shown | hidden
  var lastY = window.scrollY;
  var run = 0; // aufsummierter Weg in der aktuellen Richtung (+ runter, − hoch)

  function locked() {
    return root.classList.contains('menu-lock') || root.classList.contains('modal-lock');
  }

  function set(next) {
    if (next === state) return;
    if (next === 'static') {
      head.classList.remove('is-fixed', 'is-shown', 'is-hidden');
      slot.style.height = '';
    } else {
      if (state === 'static') {
        // Aus dem Seitenfluss lösen: erst unsichtbar oben parken, dann hereingleiten
        slot.style.height = head.offsetHeight + 'px';
        head.classList.add('is-fixed', 'is-hidden', 'is-parking');
        void head.offsetHeight;
        head.classList.remove('is-parking');
      }
      head.classList.toggle('is-shown', next === 'shown');
      head.classList.toggle('is-hidden', next === 'hidden');
    }
    state = next;
  }

  function onScroll() {
    var y = Math.max(0, window.scrollY);
    var d = y - lastY;
    lastY = y;
    if (locked()) return;
    if (y <= 0) { set('static'); run = 0; return; }

    if ((d > 0 && run < 0) || (d < 0 && run > 0)) run = 0;
    run += d;

    var h = slot.offsetHeight || head.offsetHeight;
    if (state === 'static') {
      if (run < -DELTA && y > h) set('shown');
    } else if (state === 'shown') {
      if (run > DELTA) set('hidden');
    } else if (run < -DELTA) {
      set('shown');
    }
    // Weggeglitten und wieder im Bereich des Kopfes (z. B. Sprung nach oben): zurück in den Seitenfluss
    if (state === 'hidden' && y < h) set('static');
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () {
    if (state !== 'static') slot.style.height = head.offsetHeight + 'px';
  });
  head.addEventListener('focusin', function () {
    if (state === 'hidden') set('shown');
  });
})();

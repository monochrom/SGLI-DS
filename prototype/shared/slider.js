/* SGLI Prototyp – Slider (teaser-slider, image-slider)
   Figma: teaser-slider (2017:2053), Doku-Frame „Slider“ (2930:2449).

   Markup: [data-slider] mit [data-slider-track] (Liste der Karten) und den Buttons [data-slider-prev] / [data-slider-next].
   - Pfeil schiebt um eine Karte. Am Anfang ist „zurück“ deaktiviert, am Ende „weiter“. Ende ist Ende, kein Loop.
   - Phone: keine Pfeile (CSS), nur Wischen. Die Karten rasten per scroll-snap ein.
   - Tastatur: Tab geht von Karte zu Karte, die fokussierte Karte wird ganz ins Bild geschoben.
     Pfeiltasten links/rechts springen zur vorigen/nächsten Karte, solange der Fokus in der Reihe ist.
   - Wird ein Pfeil deaktiviert, während er den Fokus hat, springt der Fokus auf den anderen Pfeil.
   - Reduced Motion: springt ohne Gleiten.

   Einbinden: <script src="../shared/slider.js"></script> */

(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  function behavior() { return reduce.matches ? 'auto' : 'smooth'; }

  document.querySelectorAll('[data-slider]').forEach(function (slider) {
    var track = slider.querySelector('[data-slider-track]');
    var prev = slider.querySelector('[data-slider-prev]');
    var next = slider.querySelector('[data-slider-next]');
    if (!track) return;
    var cards = Array.prototype.slice.call(track.children);

    function step() {
      var card = cards[0];
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card ? card.getBoundingClientRect().width + gap : track.clientWidth;
    }

    function update() {
      if (!prev || !next) return;
      var atStart = track.scrollLeft <= 2;
      var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
      var active = document.activeElement;
      prev.disabled = atStart;
      next.disabled = atEnd;
      if (active === next && atEnd && !atStart) prev.focus();
      if (active === prev && atStart && !atEnd) next.focus();
    }

    /* Nur schieben, wenn die Karte abgeschnitten ist. Ausrichtung am Anfang: Das ist immer ein Snap-Punkt,
       „nearest“ würde der Snap auf den vorigen Punkt zurückziehen und die Karte bliebe angeschnitten. */
    function reveal(card) {
      var c = card.getBoundingClientRect();
      var t = track.getBoundingClientRect();
      if (c.left >= t.left - 1 && c.right <= t.right + 1) return;
      card.scrollIntoView({ block: 'nearest', inline: 'start', behavior: behavior() });
    }

    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: behavior() }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: behavior() }); });

    track.addEventListener('focusin', function (e) {
      var card = e.target.closest('[data-slider-track] > *');
      if (card) reveal(card);
    });

    track.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      var i = cards.findIndex(function (c) { return c.contains(document.activeElement); });
      var j = i + (e.key === 'ArrowRight' ? 1 : -1);
      if (i < 0 || j < 0 || j >= cards.length) return;
      var target = cards[j].querySelector('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!target) return;
      e.preventDefault();
      target.focus({ preventScroll: true });
      reveal(cards[j]);
    });

    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
})();

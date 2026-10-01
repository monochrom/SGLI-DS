/* SGLI Prototyp – FAQ: weiches Auf- und Zuklappen
   Figma: faq-section (2165:2501), Doku-Frame „FAQ“ (2930:2730).

   Markup bleibt natives <details class="faq-item"> / <summary>: Browsersuche, Screenreader-Zustand und
   Bedienung ohne Script funktionieren weiter. Mehrere Fragen dürfen gleichzeitig offen sein.
   Das Script animiert nur die Höhe des <details> (Web Animations API), die Antwort blendet beim Öffnen ein.
   Beim Schließen bleibt [open] bis zum Ende der Animation; .is-closing tauscht das Icon sofort.
   Klick während einer laufenden Animation kehrt sie von der aktuellen Höhe aus um.
   Zeiten wie die Zeilen im Haftbuch: --motion-base / --ease-out, Text --motion-fast (src/styles/motion.css).
   Reduced Motion: kein Script-Eingriff, natives Auf- und Zuklappen.

   Einbinden: <script src="../shared/faq.js"></script> */

(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var css = getComputedStyle(document.documentElement);
  function ms(name, fallback) { return parseFloat(css.getPropertyValue(name)) || fallback; }
  var DURATION = ms('--motion-base', 260);
  var FADE = ms('--motion-fast', 160);
  var EASE = css.getPropertyValue('--ease-out').trim() || 'ease-out';

  document.querySelectorAll('details.faq-item').forEach(function (item) {
    var summary = item.querySelector('summary');
    var answer = item.querySelector('.faq-item__a');
    var anim = null;
    var closing = false;

    function finish() {
      if (closing) item.open = false;
      closing = false;
      item.classList.remove('is-closing');
      item.style.overflow = '';
      anim = null;
    }

    summary.addEventListener('click', function (e) {
      if (reduce.matches || typeof item.animate !== 'function') return;
      e.preventDefault();

      var start = item.offsetHeight; // bei laufender Animation: die aktuelle Höhe
      var open = !item.open || closing;
      if (anim) { anim.onfinish = null; anim.cancel(); }

      var end;
      if (open) {
        closing = false;
        item.classList.remove('is-closing');
        item.open = true;
        end = item.offsetHeight;
        if (answer) answer.animate({ opacity: [0, 1] }, { duration: FADE, delay: DURATION / 3, easing: EASE, fill: 'backwards' });
      } else {
        item.open = false;
        end = item.offsetHeight;
        item.open = true;
        closing = true;
        item.classList.add('is-closing');
      }

      item.style.overflow = 'hidden';
      anim = item.animate({ height: [start + 'px', end + 'px'] }, { duration: DURATION, easing: EASE });
      anim.onfinish = finish;
    });
  });
})();

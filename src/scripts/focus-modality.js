/* SGLI – Bedienart für Fokus-Zustände (Foundation)
   Setzt <html data-focus-modality="keyboard|pointer"> je nach letzter Bedienung.
   Hintergrund: Browser zeigen :focus-visible bei Textfeldern auch nach Mausklick. Formularfelder brauchen
   deshalb eine eigene Unterscheidung (input.css): Tastatur = Doppelring, Maus/Touch = ruhiger 2-px-Rahmen.
   Buttons, Links und Chips brauchen das nicht, dort reicht :focus-visible (focus.css).

   - Tab (auch Shift+Tab) → keyboard. Normale Tastenanschläge (Tippen im Feld) ändern nichts,
     sonst käme der Ring beim Schreiben nach einem Klick zurück.
   - pointerdown (Maus, Touch, Stift) → pointer.
   - Ohne Script oder vor der ersten Bedienung fehlt das Attribut: CSS zeigt dann den Doppelring (sicherer Fallback,
     WCAG 2.4.7).

   Einbinden: <script src="…/src/scripts/focus-modality.js" defer></script> */

(function () {
  var root = document.documentElement;

  function set(modality) {
    if (root.getAttribute('data-focus-modality') !== modality) {
      root.setAttribute('data-focus-modality', modality);
    }
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Tab') set('keyboard');
  }, true);

  document.addEventListener('pointerdown', function () {
    set('pointer');
  }, true);
})();

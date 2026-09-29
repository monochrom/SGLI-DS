/* SGLI – Bedienart für Fokus-Zustände (Foundation)
   Setzt <html data-focus-modality="keyboard|pointer"> je nach letzter Bedienung.
   Hintergrund: Browser setzen :focus-visible nicht nur bei Tastaturbedienung, sondern auch bei Textfeldern
   nach Mausklick und bei programmatischem focus() (Safari/Firefox, auch auf Touch: Dialog öffnet →
   Fokus auf „Schließen“ → Ring, obwohl niemand die Tastatur benutzt hat).
   focus.css blendet deshalb bei data-focus-modality="pointer" jeden Fokusring aus, Formularfelder zeigen
   dann den ruhigen 2-px-Rahmen (input.css). Entschieden 2026-09-29: kein Fokuszustand, den der Nutzer
   nicht selbst per Tastatur ausgelöst hat.

   - Tab (auch Shift+Tab) → keyboard.
   - Pfeile, Home/End, Bild↑/↓ → keyboard, außer in Textfeldern und Selects (dort bewegen sie nur den Cursor
     bzw. den Wert). So bekommt z. B. eine Radio-Gruppe, die nach einem Klick per Pfeil bedient wird, den Ring.
   - Alle anderen Tasten (Tippen, Enter, Leertaste, Escape) ändern nichts, sonst käme der Ring beim Schreiben
     nach einem Klick zurück oder beim Schließen per Escape auf den Auslöser.
   - pointerdown (Maus, Touch, Stift) → pointer.
   - Ohne Script oder vor der ersten Bedienung fehlt das Attribut: CSS zeigt dann den Ring (sicherer Fallback,
     WCAG 2.4.7).

   Einbinden (jede Seite mit Fokuszuständen, früh im Dokument):
   <script src="…/src/scripts/focus-modality.js"></script> */

(function () {
  var root = document.documentElement;
  var NAV_KEYS = /^(Arrow(Up|Down|Left|Right)|Home|End|PageUp|PageDown)$/;
  var TEXT_TYPES = /^(text|search|email|url|tel|password|number|date|datetime-local|month|week|time)$/;

  function set(modality) {
    if (root.getAttribute('data-focus-modality') !== modality) {
      root.setAttribute('data-focus-modality', modality);
    }
  }

  function isTextEntry(el) {
    if (!el) return false;
    if (el.isContentEditable || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') return true;
    return el.tagName === 'INPUT' && TEXT_TYPES.test(el.type);
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Tab') set('keyboard');
    else if (NAV_KEYS.test(event.key) && !isTextEntry(event.target)) set('keyboard');
  }, true);

  document.addEventListener('pointerdown', function () {
    set('pointer');
  }, true);
})();

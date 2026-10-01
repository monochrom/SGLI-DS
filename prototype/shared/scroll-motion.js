/* SGLI Prototyp – Scroll-Motion
   Alle Bewegungen hängen direkt an der Scroll-Position (keine Einmal-Animation, keine Dauer, keine
   Kurve): Runterscrollen spielt vorwärts, Hochscrollen rückwärts. Fortschritt 0…1, linear.

   Markup (Werte stehen am Element, damit sie im Prototyp justierbar bleiben):

   1. Wachsen mit dem Scrollen der Seite (Hero-Form und Hero-Bild)
      <div data-motion="scale" data-motion-from="0.75" data-motion-range="0.9">
      Fortschritt = scrollY / (Viewporthöhe × range). Skaliert von „from“ auf 1 (= Design-Größe).

   2. Wachsen, sobald das Element ins Bild kommt (Ornament „Die Stiftung“)
      <div data-motion="scale" data-motion-ref="self" data-motion-from="0.75" data-motion-range="0.6">
      Fortschritt = (Viewporthöhe − Oberkante des Elements) / (Viewporthöhe × range).
      Gemessen wird die Lage ohne Skalierung, der Drehpunkt kommt aus transform-origin im CSS.

   3. Bild-Schwenk (Vollbild-Foto über „Bildungsangebote“)
      <div data-motion="pan" data-motion-zoom="1.12" data-motion-distance="40"><img …></div>
      Bild leicht vergrößert (Puffer gegen Ränder), wandert von −distance nach +distance px.
      Fortschritt = (Viewporthöhe − Oberkante des Containers) / Viewporthöhe.

   4. Auffächern (Haftbuch-Motiv, 4 Ebenen)
      <div data-motion="fan"> mit einem [data-fan-anchor] (bleibt stehen) und [data-fan-layer]-Ebenen.
      Ausgangslage: alle Ebenen deckungsgleich auf dem Anker. Sie wandern gleichzeitig zu ihrer
      CSS-Position (Ziel). Start, wenn die Oberkante des Containers 150 px über dem unteren Rand liegt,
      Ende nach weiteren 0,9 Viewporthöhen.

   5. Bildrahmen rücken in ihre Lage (teaser-timeline)
      <img data-motion="drift" data-motion-range="0.8"> mit dem Startversatz im CSS: --drift-y (px).
      Das Element startet um --drift-y nach unten versetzt und steigt beim Reinscrollen in seine Lage.
      Unterschiedliche Werte je Bild = unterschiedliche Geschwindigkeit, die Collage baut sich auf.
      Fortschritt = (Viewporthöhe − Oberkante ohne Versatz) / (Viewporthöhe × range).
      Bewegt wird nur der Rahmen, der Bildinhalt wird nicht beschnitten oder gezoomt (dokumentarische Bilder).
      Werte je Breakpoint im CSS, damit sich Bilder mit kleinen Abständen nicht überlappen.

   Reduzierte Bewegung: keine Transformation, alles steht in der Endlage (Design-Zustand).
   Geschrieben wird nur über die einzelnen Properties scale/translate (bzw. transform am Pan-Bild),
   damit Positionierungen im CSS (transform, translate) erhalten bleiben.

   Einbinden: <script src="../shared/scroll-motion.js"></script> am Ende von <body>. */

(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var FAN_START_DELAY = 150; // px: erst wenn die Form schon größtenteils im Bild ist
  var FAN_RANGE = 0.9;       // Viewporthöhen, gemeinsam für alle Ebenen (synchrones Auffächern)

  function clamp(v) { return Math.min(Math.max(v, 0), 1); }
  function num(el, name, fallback) {
    var v = parseFloat(el.getAttribute(name));
    return isNaN(v) ? fallback : v;
  }

  // Oberkante ohne Skalierung: scale verschiebt die Box um den Drehpunkt (transform-origin).
  function layoutTop(el, rect) {
    var h = el.offsetHeight;
    if (!h) return rect.top;
    var oy = parseFloat(getComputedStyle(el).transformOrigin.split(' ')[1]) / h;
    if (isNaN(oy)) oy = 0.5;
    return rect.top - oy * (h - rect.height);
  }

  var items = [];

  document.querySelectorAll('[data-motion="scale"]').forEach(function (el) {
    var from = num(el, 'data-motion-from', 0.75);
    var range = num(el, 'data-motion-range', 1);
    var self = el.getAttribute('data-motion-ref') === 'self';
    items.push({
      update: function (vh) {
        var p = self
          ? clamp((vh - layoutTop(el, el.getBoundingClientRect())) / (vh * range))
          : clamp(window.scrollY / (vh * range));
        el.style.scale = String(from + (1 - from) * p);
      },
      reset: function () { el.style.scale = ''; }
    });
  });

  document.querySelectorAll('[data-motion="pan"]').forEach(function (box) {
    var img = box.querySelector('img');
    if (!img) return;
    var zoom = num(box, 'data-motion-zoom', 1.12);
    var dist = num(box, 'data-motion-distance', 40);
    items.push({
      update: function (vh) {
        var p = clamp((vh - box.getBoundingClientRect().top) / vh);
        img.style.transform = 'scale(' + zoom + ') translateX(' + (-dist + dist * 2 * p) + 'px)';
      },
      reset: function () { img.style.transform = ''; }
    });
  });

  document.querySelectorAll('[data-motion="fan"]').forEach(function (box) {
    var anchor = box.querySelector('[data-fan-anchor]');
    var layers = Array.prototype.slice.call(box.querySelectorAll('[data-fan-layer]'));
    if (!anchor || !layers.length) return;
    items.push({
      update: function (vh) {
        var base = Math.max((vh - box.getBoundingClientRect().top - FAN_START_DELAY) / vh, 0);
        var rest = 1 - Math.min(base / FAN_RANGE, 1);
        layers.forEach(function (el) {
          // offsetLeft/Top = Lage im Layout ohne Transformation, also die Zielposition aus dem CSS
          var dx = (anchor.offsetLeft - el.offsetLeft) * rest;
          var dy = (anchor.offsetTop - el.offsetTop) * rest;
          el.style.translate = dx + 'px ' + dy + 'px';
        });
      },
      reset: function () { layers.forEach(function (el) { el.style.translate = ''; }); }
    });
  });

  document.querySelectorAll('[data-motion="drift"]').forEach(function (el) {
    var range = num(el, 'data-motion-range', 0.8);
    var current = 0; // aktueller Versatz, wird von der gemessenen Lage abgezogen
    items.push({
      update: function (vh) {
        var start = parseFloat(getComputedStyle(el).getPropertyValue('--drift-y')) || 0;
        var top = el.getBoundingClientRect().top - current;
        current = start * (1 - clamp((vh - top) / (vh * range)));
        el.style.translate = '0 ' + current + 'px';
      },
      reset: function () { current = 0; el.style.translate = ''; }
    });
  });

  if (!items.length) return;

  var ticking = false;
  function update() {
    ticking = false;
    if (reduce.matches) return;
    var vh = window.innerHeight || 1;
    items.forEach(function (item) { item.update(vh); });
  }
  function request() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }
  function applyPreference() {
    if (reduce.matches) items.forEach(function (item) { item.reset(); });
    else update();
  }

  applyPreference();
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  window.addEventListener('load', request); // Bilder ändern Höhen und damit die Lage der Elemente
  if (reduce.addEventListener) reduce.addEventListener('change', applyPreference);
})();

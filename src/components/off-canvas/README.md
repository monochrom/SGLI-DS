# Off-Canvas

Figma: Doku „Off-Canvas“ (`2613:31418`) und Doku „Forms“ (`2746:24535`) auf 🎨 Foundations.

| Panel | Desktop | Phone |
|---|---|---|
| Filter | `2710:23917` | `2710:24111` |
| Kontakt | `2746:26620` | `2753:30067` |
| Anmeldung | `2746:26818` | `2753:30157` |
| Bestätigung | `2747:29871` | `2746:28162` |

Ein Panel für Filter und Formulare. Natives `<dialog>` mit `showModal()`: Top-Layer, Escape, Fokus-Trap und inerter Hintergrund kommen vom Browser.

## Aufbau

| | Phone (Default) | Desktop ab lg (1024) |
|---|---|---|
| Position | Bottom Sheet, max. 85 % Viewporthöhe | rechts, 520 breit, volle Höhe, Divider links |
| Panel-Padding | 0 | 24 |
| Kopf (`.offcanvas__head`) | Padding 24 16 16, Divider unten | Padding unten 16, Divider unten |
| Abstand Kopf → Body | 24 | 48 |
| Body (`.offcanvas__body`) | scrollt allein, seitlich 16 | scrollt allein, ohne Padding |
| Fuß (`.offcanvas__foot`) | Divider oben, Padding 24 16, Buttons untereinander (Gap 12), Primary volle Breite, Secondary zentriert | Divider oben, Padding oben 24, Buttons nebeneinander (Gap 16) |

Kopf = section-header (Variante Phone/off-canvas, `2613:27966`): Kicker Label-S `text/secondary`, Titel H3 (fest 24 px wie im Figma-Modus Phone, auf allen Breakpoints), Close = Button/Icon mit `.offcanvas__close`: ohne Rahmen wie im Modal und Menü (Figma zeigt noch den Rahmen). Die ganze Fläche (auch Hover) schließt rechts bündig mit Trennlinie und Inhalt ab, das X sitzt oben auf der Oberkante des Kopfs (Kicker bzw. Titel). Die Fläche ragt dafür um ihren Innenabstand nach oben ins Padding. Der Button bleibt im Fluss (kein absolute). Lange Titel laufen so nie unter das X, und die Kopfhöhe bleibt gleich.

Fokusringe außen (6 px) bleiben im Scroll-Bereich sichtbar: Der Body hat unten Luft in Ringbreite und läuft auf Desktop um die Ringbreite über den Rand (negativer Margin, gleiches Padding innen).

## Markup (Formular mit Bestätigung)

```html
<button class="btn btn--primary" type="button" data-offcanvas-open="offcanvas-kontakt" aria-haspopup="dialog">Zum Kontaktformular</button>

<dialog class="offcanvas" id="offcanvas-kontakt" aria-labelledby="offcanvas-kontakt-title" data-offcanvas-confirm="modal-discard">
  <div class="offcanvas__view" data-offcanvas-view="form">
    <header class="offcanvas__head">
      <div class="offcanvas__heading">
        <p class="text-label-s offcanvas__kicker">Kontakt</p>
        <h2 class="text-h3 offcanvas__title" id="offcanvas-kontakt-title" tabindex="-1">Schreiben Sie uns!</h2>
      </div>
      <button class="btn btn--icon offcanvas__close" type="button" data-offcanvas-close aria-label="Kontaktformular schließen">
        <svg class="icon" aria-hidden="true" focusable="false"><use href="sprite.svg#icon-X"></use></svg>
      </button>
    </header>
    <form class="offcanvas__form" data-form novalidate action="…" method="post">
      <div class="offcanvas__body">
        <div class="form">…</div>              <!-- siehe src/components/form -->
      </div>
      <footer class="offcanvas__foot">
        <button class="btn btn--primary" type="submit">Absenden</button>
        <button class="btn btn--secondary" type="button" data-offcanvas-close>Abbrechen</button>
      </footer>
    </form>
  </div>

  <div class="offcanvas__view" data-offcanvas-view="success" hidden>
    <header class="offcanvas__head">
      <div class="offcanvas__heading">
        <h2 class="text-h3 offcanvas__title" id="offcanvas-kontakt-success-title" tabindex="-1">Vielen Dank</h2>
      </div>
      <button class="btn btn--icon offcanvas__close" type="button" data-offcanvas-close aria-label="Schließen">…</button>
    </header>
    <div class="offcanvas__body">
      <div class="offcanvas__success">
        <svg class="icon offcanvas__success-icon" aria-hidden="true" focusable="false"><use href="sprite.svg#icon-CheckCircle"></use></svg>
        <div class="offcanvas__success-text" data-offcanvas-announce>
          <h3 class="text-h6">Ihre Anfrage wurde erfolgreich gesendet.</h3>
          <p class="text-body-m">Wir haben Ihre Nachricht erhalten …</p>
        </div>
      </div>
    </div>
    <footer class="offcanvas__foot offcanvas__foot--center">
      <button class="btn btn--primary" type="button" data-offcanvas-close>Schließen</button>
    </footer>
  </div>
</dialog>
```

Dazu einmal pro Seite das Rückfrage-Modal `#modal-discard` (Markup in `src/components/modal/README.md`, Buttons `value="cancel"` / `value="discard"`). Vollständige Beispiele: `off-canvas.html`, Prototyp `prototype/angebote-filter/index.html`.

Filter: statt der Views ein `<form class="offcanvas__form" method="dialog">` mit Kopf, Body (filter-cells) und Fuß. Der Filter im Prototyp steuert sein Panel selbst (`filter.js`) und fragt nicht nach.

## Verhalten (`off-canvas.js`)

| | |
|---|---|
| Öffnen | `data-offcanvas-open="id"` am Auslöser (Delegation) oder `SGLI.offcanvas.open(id, opener)`. Fokus auf den Titel (kein Ring), Tab führt zum Close-Button und dann durchs Formular |
| Schließen | Close-Button, „Abbrechen“ (beide `data-offcanvas-close`), Escape, Klick auf den Backdrop, `SGLI.offcanvas.close(id)`. Fokus zurück zum Auslöser |
| Rückfrage | Enthält das Panel ein geändertes Formular (`form[data-dirty="true"]`, setzt `form.js`), öffnet jeder Schließweg zuerst das Modal aus `data-offcanvas-confirm` (Standard `modal-discard`). „Verwerfen“ schließt das Panel, „Weiter bearbeiten“, Escape und Backdrop im Modal bleiben im Formular. Ohne `modal.js` fällt es auf `window.confirm` zurück |
| Bestätigung | Nach gültigem Absenden (`sgli:form-success` aus `form.js`) wechselt das Panel zur View `success`: gleiches Panel, Fokus auf den neuen Titel, der Text aus `[data-offcanvas-announce]` wird über eine unsichtbare Live-Region vorgelesen. „Schließen“ fragt nicht nach |
| Neu öffnen | Nach Bestätigung oder Verwerfen startet das nächste Öffnen leer mit der ersten View. Zurückgesetzt wird beim Öffnen, nicht beim Schließen, damit man den Wechsel beim Rausfahren nicht sieht |
| Hintergrund | `html:has(dialog.offcanvas[open])` sperrt das Scrollen, `scrollbar-gutter: stable` verhindert den Sprung |
| API | `SGLI.offcanvas.open(id, opener)`, `.close(id)` (mit Rückfrage), `.forceClose(id)`, `.showView(id, name)` |
| Motion | Familie „Randfläche“ aus `src/styles/motion.css` wie Menü: abdunkeln (320 ms), Fläche nach 240 ms in 520 ms vom Rand. Schließen: Fläche 680 ms, Abdunkelung zuletzt (ab 580 ms). Reduced Motion: ohne Bewegung |

Craft: `sgli:form-success` am `<form>` abfangen (`preventDefault()`), per `fetch` senden und danach `SGLI.offcanvas.showView('offcanvas-kontakt', 'success')` aufrufen. Serverseitige Fehler analog als Error-State am Feld zeigen (Klassen siehe `form/README.md`).

## Tokens

- Fläche `color/bg/card`, Backdrop `color/neutral/alpha/900-40`, Divider `color/divider/default`
- Bestätigung: Icon CheckCircle 48 in `color/feedback/success`, H6 + Body-M `color/text/secondary`, Gap 12 (Desktop 16 zwischen Icon und Text)
- Abstände `space-8/12/16/24/48`

## Abweichungen von Figma und Hinweise

- Phone-Panels Kontakt und Anmeldung folgen dem Muster des Filter-Panels. Die Figma-Frames (`2753:30067`, `2753:30157`) zeigen Padding 20 und „Section header / Mobile“.
- Figma legt den Sticky Footer im Desktop-Frame in den Body, beim Filter daneben. Im Code liegt er immer neben dem Body (eine Struktur).
- Der Kopftitel ist fest 24 px wie die Figma-Instanz `section-header Breakpoint=Phone` in allen Panels und wie im Modal.
- Zwischen 768 und 1023 ist das Sheet so breit wie der Viewport, Formularreihen stehen dort schon nebeneinander (Container Query ab 440 px).

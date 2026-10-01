# Modal

Figma: `modal` (2859:132) auf 💎 Components, Doku-Frame „Modal“ (2860:1449) auf 🎨 Foundations.

Zentrierter Dialog für kurze Entscheidungen. Liegt über allem, auch über einem offenen Off-Canvas oder dem Menü.

## Varianten

| Figma | Klasse | Inhalt |
|---|---|---|
| `type=confirm` | `.modal.modal--confirm` + `role="alertdialog"` | Kopf, Intro, Button-Gruppe (Primary + Secondary) |
| `type=language` | `.modal.modal--language` | Kopf, Sprachliste (Optik filter-cell, als Links) |
| `Breakpoint=Phone` | Default | Breite Viewport − 32, Padding 16, Buttons untereinander |
| `Breakpoint=Desktop` | ab lg (1024) | Breite 520, Padding 24, Buttons nebeneinander |
| `Show Kicker` | `.modal__kicker` weglassen | |

## Markup

```html
<dialog class="modal modal--confirm" id="modal-confirm" role="alertdialog"
        aria-labelledby="modal-confirm-title" aria-describedby="modal-confirm-text">
  <div class="modal__close-row">
    <button class="btn btn--icon modal__close" type="button" data-modal-close value="cancel" aria-label="Schließen">
      <svg class="icon" aria-hidden="true" focusable="false"><use href="sprite.svg#icon-X"></use></svg>
    </button>
  </div>
  <div class="modal__content">
    <div class="modal__text">
      <div class="modal__head">
        <p class="text-label-s modal__kicker">Kontakt</p>            <!-- optional -->
        <h2 class="text-h3 modal__title" id="modal-confirm-title">Eingaben verwerfen?</h2>
      </div>
      <p class="text-body-m modal__intro" id="modal-confirm-text">Wenn Sie das Formular jetzt schließen, gehen Ihre Eingaben verloren.</p>
    </div>
    <div class="modal__actions">
      <button class="btn btn--primary" type="button" data-modal-close value="cancel" autofocus>Weiter bearbeiten</button>
      <button class="btn btn--secondary" type="button" data-modal-close value="discard">Verwerfen</button>
    </div>
  </div>
</dialog>
```

Sprachauswahl: statt `.modal__text` / `.modal__actions` ein `<ul class="modal__list">` mit

```html
<li><a class="modal__option" href="/de/…" hreflang="de" lang="de" aria-current="true">
  <span class="modal__option-main"><span class="modal__indicator" aria-hidden="true"></span><span class="modal__option-label">Deutsch</span></span>
  <span class="modal__option-code" aria-hidden="true">DE</span>
</a></li>
```

Sprachname immer in der eigenen Sprache (`lang`), aktuelle Sprache mit `aria-current="true"`. Vollständiges Beispiel: `modal.html`.

## Verhalten (`modal.js`)

| | |
|---|---|
| Öffnen | `data-modal-open="id"` am Auslöser (Delegation, funktioniert auch in später erzeugtem Markup) oder `SGLI.modal.open(id, opener)` |
| Fokus | beim Öffnen auf `[autofocus]` bzw. die aktuelle Option, beim Schließen zurück zum Auslöser. Ring nur bei Tastaturbedienung (`focus-modality.js`), nach Tippen/Klick bleibt er aus |
| Schließen | `[data-modal-close]` (Rückgabewert = `value`), Escape und Backdrop-Klick = `"cancel"` |
| Rückfrage | `SGLI.modal.confirm(id, opener).then(v => …)`: `"discard"` = Verwerfen, `"cancel"` = Weiter bearbeiten (auch Escape, Backdrop, Close) |
| Hintergrund | `showModal()`: Seite inert, Tab bleibt im Dialog. `html.modal-lock` sperrt das Scrollen und gleicht die Scrollbar aus |
| Hoher Inhalt | nur `.modal__content` scrollt, Close-Zeile bleibt |
| Motion | Familie „zentrierter Dialog“ aus `src/styles/motion.css`: Seite dunkelt ab (320 ms), der Dialog fällt nach 120 ms 16 px von oben und blendet ein (300 ms). Schließen: Dialog hebt sich und blendet aus (200 ms), Abdunkelung zuletzt. Kein Weg über den Bildschirm, weil das Modal an keinem Rand hängt. Reduced Motion: nur Einblenden |

## Tokens

- Fläche `color/bg/card`, Backdrop `color/neutral/alpha/900-40`, Linien `color/divider/default`
- Titel: Heading/H3 im Typography-Modus **Phone** (24 px) auf allen Breakpoints, wie der Off-Canvas-Kopf. Im CSS fest `1.5rem`, weil `--font-size-h3` ab md wächst.
- Intro Body/M `color/text/secondary`, Kicker Label-S `color/text/secondary`
- Abstände `space-8/12/16/24/40` (Kopf → Inhalt: confirm 40, language Phone 24 / ab lg 40), Close-Button = Button/Icon ohne Rahmen (Figma-Override wie im Menü)

## Hinweise

- Die Zeilen der Sprachauswahl nutzen die Tokens `color/filter-cell/*`.
- `--motion-*` sind keine Figma-Variablen, sondern Foundation-CSS (`src/styles/motion.css`).
- Umschaltpunkt Phone → Desktop bei lg (1024), gleich wie Button-Größe und Off-Canvas. Zwischen 768 und 1023 steht das Modal 520 breit mit Phone-Innenleben.
- Fokusring der Sprachzeilen innen (Scroll-Container), alle anderen außen. Auf Phone hat `.modal__content` seitlich 6 px Luft für den Außenring der Buttons.

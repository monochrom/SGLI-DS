# Form

Figma: Doku „Forms“ (`2746:24535`) auf 🎨 Foundations, Kontakt `2746:26620`, Anmeldung `2746:26818`. Felder: Input-Sets (`1647:6622`), Checkbox `1859:171`, Radio `1859:182`, Toggle `1846:179`.

Layout und Verhalten von Formularen. Die Felder selbst sind die Core Components `input`, `checkbox` und `toggle`; `form.css` regelt nur Abstände und Anordnung, `form.js` Toggle-Abschnitte, Validierung und den Dirty-Zustand. Formulare stehen im Off-Canvas (`src/components/off-canvas`), funktionieren aber auch frei auf der Seite.

## Spacing (beide Breakpoints gleich)

| | |
|---|---|
| Abschnitte untereinander (`.form`) | 32 |
| Überschrift H6 → Felder (`.form__section`) | 24 |
| Felder / Reihen untereinander (`.form__group`) | 24 |
| Zwei Felder in einer Reihe (`.form__row`) | nebeneinander Gap 16 ab 440 px Formularbreite (Container Query), sonst untereinander Gap 24 |
| Anrede-Radios (`.form__radios`) | nebeneinander Gap 8, umbrechend |
| Toggle-Zeile (`.form__toggle-row`) | H6 links, Toggle rechts, Gap 24, Felder 24 darunter |
| Pflichtfeld-Hinweis (`.form__note`) | Caption `text/secondary`, Gap 8, Link unterstrichen |
| Einwilligung (`.form__consent`) | Checkbox mit `.choice--caption`, Box an der ersten Zeile |
| Feld → Fehlermeldung | 4 (aus `input.css`) |

## Markup

```html
<form data-form novalidate action="…" method="post">
  <div class="form">

    <section class="form__section" aria-labelledby="k-daten">
      <h3 class="text-h6 form__title" id="k-daten">Ihre Kontaktdaten</h3>
      <fieldset class="form__radios">
        <legend class="sr-only">Anrede</legend>
        <label class="choice choice--radio"><input class="choice__input" type="radio" name="anrede" value="frau"><span class="choice__box" aria-hidden="true"></span><span class="choice__label">Frau</span></label>
        …
      </fieldset>
      <div class="form__group">
        <div class="form__row">
          <div class="field"><div class="field__box">
            <input class="field__input" id="k-vorname" name="vorname" type="text" placeholder=" " autocomplete="given-name" required>
            <label class="field__label" for="k-vorname">Vorname <span aria-hidden="true">*</span></label>
          </div></div>
          …
        </div>
      </div>
    </section>

    <!-- Optionaler Abschnitt mit Toggle -->
    <section class="form__section form__section--toggle" aria-labelledby="k-gruppe">
      <div class="form__toggle-row">
        <h3 class="text-h6 form__title" id="k-gruppe">Gruppenbesuch</h3>
        <label class="toggle">
          <input class="toggle__input" type="checkbox" role="switch" name="gruppenbesuch" value="ja"
                 aria-labelledby="k-gruppe" aria-controls="k-gruppe-felder" data-form-toggle checked>
          <span class="toggle__track" aria-hidden="true"></span>
        </label>
      </div>
      <div class="form__collapse is-open" id="k-gruppe-felder">
        <div class="form__collapse-inner">
          <fieldset class="form__group">
            <legend class="sr-only">Gruppenbesuch</legend>
            …Felder…
          </fieldset>
        </div>
      </div>
    </section>

    <div class="form__note">
      <p><span aria-hidden="true">*</span> Pflichtfelder</p>
      <p>Die von Ihnen übermittelten Daten werden gemäß unserer <a href="/datenschutz">Datenschutzerklärung</a> gespeichert …</p>
    </div>
    <div class="form__consent">
      <label class="choice choice--caption"><input class="choice__input" id="k-einwilligung" type="checkbox" name="einwilligung" value="ja" required><span class="choice__box" aria-hidden="true"></span><span class="choice__label">Hiermit erteile ich meine Einwilligung …</span></label>
    </div>
  </div>
</form>
```

Vollständige Beispiele (Kontakt, Anmeldung, Fehler): `form.html`.

- Pflichtfelder: `required` am Feld, im Label ein `*` mit `aria-hidden="true"` (Screenreader melden „erforderlich“ über `required`).
- Überschriften: im Off-Canvas ist der Panel-Titel `h2`, die Abschnitte `h3` mit Klasse `.text-h6`.
- Zwei Felder nebeneinander nur für kurze Paare: Vorname + Nachname, E-Mail + Telefon, PLZ + Stadt, Datum + Uhrzeit.

## Verhalten (`form.js`, greift für `form[data-form]`)

| | |
|---|---|
| Toggle-Abschnitte | `[data-form-toggle]` mit `aria-controls` auf `.form__collapse`. Aus: zugeklappt, `inert`, `<fieldset disabled>` (Felder werden nicht geprüft und nicht gesendet). An: klappt auf (`--motion-base`), Fokus bleibt am Toggle |
| Dirty | jede Eingabe setzt `form.dataset.dirty = "true"`; das Off-Canvas fragt dann vor dem Schließen nach |
| Validierung | beim Absenden, `novalidate` + eigene Meldungen. Fehlerhafte Felder: `.field--error` bzw. `.choice--error`, `aria-invalid="true"`, Meldung (`.field__error` / `.choice__error`) per `aria-describedby`, WarningCircle rechts in der Box (nicht bei Select und Datum, die dort schon ihr Icon haben). Das erste fehlerhafte Feld bekommt den Fokus und wird mittig gescrollt. Ein Fehler verschwindet, sobald das Feld gültig ist |
| Meldungen | Standardtexte in `form.js` (Pflichtfeld, Auswahl, Einwilligung, E-Mail, Zahl). Eigene Texte per `data-error-required="…"` und `data-error-type="…"` am Feld |
| Erfolg | Event `sgli:form-success` (bubbles, cancelable, `detail.formData`) am `<form>`, danach ist das Formular nicht mehr dirty |
| Datum / Uhrzeit | Klick auf die Box öffnet den nativen Picker (`showPicker()`) |
| API | `SGLI.form.validate(form)` → erstes fehlerhaftes Feld oder `null`, `SGLI.form.reset(form)`, `SGLI.form.init(form)` |

## Craft-Hinweise

- `autocomplete`: `given-name`, `family-name`, `email`, `tel`, `organization`, `street-address`, `postal-code`, `address-level2`.
- Feldnamen im Beispiel: `anrede`, `vorname`, `nachname`, `email`, `telefon`, `institution`, `adresse`, `plz`, `stadt`, `anliegen`, `nachricht`, `einwilligung`; Anmeldung zusätzlich `gruppenbesuch`, `teilnehmende`, `themen`, `vorkenntnisse`, `beduerfnisse`, `einschraenkungen`, `sprache`, `datum`, `uhrzeit`, `alt-datum`, `alt-uhrzeit`, `anmerkung`.
- Optionen der Selects (Anliegen, Einschränkungen, Sprache) sind Platzhalter, Figma zeigt nur die Labels. Inhalte pflegt die Redaktion.
- Serverseitige Fehler mit denselben Klassen und ARIA-Attributen ausgeben, dann greift das Zurücksetzen beim Korrigieren automatisch.

## Abweichungen von Figma und Hinweise

- Einwilligungstext: Kontakt spricht von „Anfrage“, Anmeldung von „Buchungsanfrage“. Figma nutzt im Kontakt den Text der Anmeldung.
- Error-State von Select und Datum ohne WarningCircle, dort sitzt Caret bzw. Kalender/Uhr.
- Toggle-Abschnitte (Gruppenbesuch, Besondere Bedürfnisse) starten wie in Figma auf „On“.
- Anrede ist nicht Pflicht (kein `*` in Figma).

# Input

Figma: `Input Text` (1649:52), `Input Select` (1658:6475), `Input Search` (1658:6517), `Input Date` (1840:204), `Textarea` (1658:6547).

Ein CSS für alle fünf: `.field` mit Modifiern `.field--select`, `.field--textarea`, `.field--date`. Search und Text unterscheiden sich nur durch Icon und `type`.

## States

| Figma State | HTML/CSS |
|---|---|
| Default | leeres Feld, Label steht als Platzhalter mittig (Label-M, text/secondary) |
| Focused | `:focus-within` auf der Box: Doppelring, Label wird Label-S oben, text/primary |
| Filled | `:not(:placeholder-shown)`: Label bleibt Label-S oben, text/secondary; Wert Label-M text/primary |
| Focused Filled | beides |
| Error | `.field--error`: Rahmen und Label feedback/error, Icon WarningCircle, Fehlertext Caption darunter (Gap 4) |
| Disabled | `disabled` am Input oder `.field--disabled`: Opacity 40 % |

## Markup

```html
<div class="field">
  <div class="field__box">
    <input class="field__input" id="name" type="text" placeholder=" " autocomplete="name">
    <label class="field__label" for="name">Name</label>
  </div>
</div>
```

Pflicht: `placeholder=" "` (ein Leerzeichen), sonst greift die Floating-Logik nicht. Label muss nach dem Input stehen.

Fehler:

```html
<div class="field field--error">
  <div class="field__box">
    <input class="field__input" id="mail" type="email" placeholder=" " aria-invalid="true" aria-describedby="mail-error">
    <label class="field__label" for="mail">E-Mail</label>
    <svg class="icon field__icon field__icon--error" aria-hidden="true"><use href="/dist/icons/sprite.svg#icon-WarningCircle"></use></svg>
  </div>
  <p class="field__error" id="mail-error">Bitte eine gültige E-Mail-Adresse eingeben.</p>
</div>
```

Select: natives `<select>`, erste Option `value=""` gilt als leer. Icon CaretDown wird per CSS positioniert. Erkennung nutzt `:has()`; für ältere Browser `.field--floated` per JS setzen.

Date: natives `type="date"`. Da Browser immer ein Datumsformat anzeigen, steht das Label bei `.field--date` immer oben. Für einen Custom-Datepicker später eigene Komponente.

## Tokens

- Box: `border-default` in `color/border/default`, Padding-X `space-8`, Höhe 48 (Textarea min 100), Radius keiner
- Label-M (Wert, Platzhalter), Label-S (schwebendes Label), Caption (Fehlertext)
- Farben: `color/text/primary`, `color/text/secondary`, `color/feedback/error`, `color/icon/primary`, Fokus `color/border/focus-inner|outer`
- Icons 24 px (`size-icon-lg`): MagnifyingGlass, CalendarBlank, CaretDown, WarningCircle

## Hinweise

- Das schwebende Label ist echtes `<label for>`, daher barrierefrei ohne zusätzliche ARIA.
- Autofill-Hintergrund der Browser überschreibt die transparente Box. Bei Bedarf `-webkit-autofill` behandeln, wenn der Craft-Developer die Formulare baut.
- Hilfetext `.field__hint` ist vorbereitet, in Figma nicht vorhanden.

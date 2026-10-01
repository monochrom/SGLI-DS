# Checkbox & Radio

Figma: `Checkbox` (1859:171), `Radio` (1859:182). Ein CSS für beide: `.choice`, Radio mit `.choice--radio`.

## Markup

```html
<label class="choice">
  <input class="choice__input" type="checkbox" name="agb" required>
  <span class="choice__box" aria-hidden="true"></span>
  <span class="choice__label">Ich akzeptiere die Datenschutzerklärung</span>
</label>

<fieldset class="choice-group">
  <legend class="choice-group__legend">Format</legend>
  <label class="choice choice--radio"><input class="choice__input" type="radio" name="format" value="fuehrung"><span class="choice__box" aria-hidden="true"></span><span class="choice__label">Führung</span></label>
  <label class="choice choice--radio"><input class="choice__input" type="radio" name="format" value="workshop"><span class="choice__box" aria-hidden="true"></span><span class="choice__label">Workshop</span></label>
</fieldset>

<!-- Einwilligung: langer Text in Caption -->
<label class="choice choice--caption">
  <input class="choice__input" type="checkbox" name="consent" required>
  <span class="choice__box" aria-hidden="true"></span>
  <span class="choice__label">Hiermit erteile ich meine Einwilligung, …</span>
</label>
```

| Figma | HTML/CSS |
|---|---|
| Unchecked / Unselected | – |
| Checked / Selected | `:checked` |
| Focused Off / On | `:focus-visible`, Ring um die ganze Zeile per `:has()` |
| Error | `.choice--error` oder `aria-invalid="true"`, Fehlertext `.choice__error` |
| Disabled | `disabled`, Opacity 40 % |
| Label Caption (Einwilligung in Forms) | `.choice--caption` |

## Tokens

Box 16 × 16, `border-default` in `color/border/default`, gewählt `color/text/primary`. Label **Label-M** (seit 2026-09-23, vorher Caption), Gap `space-8`. Die Box sitzt mittig zur ersten Textzeile (`margin-top: calc((1lh - 16px) / 2)`), so bleibt sie auch bei mehrzeiligem Label oben. Radio `radius-full`, Punkt 6 px. Error `color/feedback/error`, Radio-Rahmen 1.5 px wie in Figma.

Haken und Punkt sind wie in Figma an `color/bg/module` gebunden (Figma-Korrektur vom 2026-09-10), so schalten sie mit dem Kontext um.

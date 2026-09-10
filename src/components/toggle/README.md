# Toggle

Figma: `Toggle` (1846:179). States Off, On, Focused Off, Focused On, Error, Disabled.

## Markup

```html
<label class="toggle">
  <input class="toggle__input" type="checkbox" role="switch" name="newsletter">
  <span class="toggle__track" aria-hidden="true"></span>
  <span class="toggle__label">Newsletter abonnieren</span>
</label>
```

Ohne sichtbares Label: `<span class="toggle__label sr-only">…</span>`.

| Figma | HTML/CSS |
|---|---|
| Off / On | `:checked` |
| Focused | `:focus-visible` am Input, Ring auf dem Track |
| Error | `.toggle--error` oder `aria-invalid="true"` |
| Disabled | `disabled`, Opacity 40 % |

## Tokens

Track 44 × 24 `radius-full`, Padding `space-4`, Thumb 16. Farben `color/toggle/track-off`, `track-on`, `thumb`, Error `color/feedback/error`. Fokus global.

## Hinweise

- `role="switch"` macht aus der Checkbox einen Schalter für Screenreader.
- Kontrast von `toggle/track-off` auf surface-200 bis 400 und secondary-400 liegt unter 3:1 (Lint-Befund, in Figma zu lösen).

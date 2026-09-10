# Chip

Figma: `Chip` (2301:85). Props Label, Count, Badge, Icon, State (Default, Hover, Active, Focused, Disabled), Viewport (Desktop, Phone).

## Markup

```html
<ul class="chip-group">
  <li><button class="chip" type="button" aria-pressed="true"><span class="chip__label">Alle</span><span class="chip__badge">38</span></button></li>
  <li><button class="chip" type="button" aria-pressed="false"><span class="chip__label">Führungen</span><span class="chip__badge">12</span></button></li>
</ul>
```

| Figma | HTML/CSS |
|---|---|
| Default | `aria-pressed="false"` |
| Hover | `:hover` (Vorschau `.is-hover`) |
| Active | `aria-pressed="true"` (oder `.is-active` für Links) |
| Focused | `:focus-visible`, global |
| Disabled | `disabled`, Opacity 40 % |
| Badge | `.chip__badge` mit Zahl |
| Icon | `.chip__icon`, 20 px, CaretRight (Default) oder X (Active, entfernen) |
| Viewport Phone | Default, min-height 44 |
| Viewport Desktop | ab lg (1024), min-height 40 |

## Tokens

Padding `space-8` / `space-12`, Gap `space-6`, Label-M. Farben `color/chip/{bg,bg-hover,bg-active,fg,fg-active,badge-bg,badge-bg-active,badge-fg,badge-fg-active}`, Rahmen `color/border/default`. Kein Radius.

## Hinweise

- `aria-pressed` ist die richtige Semantik für Filter-Toggles. Für Chips, die navigieren, `<a class="chip">` ohne `aria-pressed`.
- Das Toggle-Verhalten in der Vorschau ist ein Fünfzeiler; im Prototyp wird die Filterlogik darauf aufgebaut.

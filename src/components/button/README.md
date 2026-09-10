# Button

Figma: `Button/Primary` (1604:84), `Button/Secondary` (1604:5083), `Button/Icon` (1604:5185) auf 💎 Components.

## Varianten

| Figma | Klasse | Beschreibung |
|---|---|---|
| Button/Primary | `.btn.btn--primary` | Flächenbutton, Hintergrund `color/button/primary/bg` |
| Button/Secondary | `.btn.btn--secondary` | Textbutton mit 1 px Unterstrich in Textfarbe |
| Button/Icon | `.btn.btn--icon` | Quadrat mit 1 px Rahmen, Icon 24 px, braucht `aria-label` |

## States

| Figma State | HTML/CSS |
|---|---|
| Default | – |
| Hover | `:hover` (Vorschau: `.is-hover`) |
| Pressed | `:active` (Vorschau: `.is-active`) |
| Focused | `:focus-visible`, global aus `src/styles/focus.css`: innen 2 px `border/focus-inner`, außen 4 px `border/focus-outer` |
| Disabled | `disabled` bzw. `aria-disabled="true"`, Opacity 40 % wie in Figma |

## Size

Figma `Size=Mobile` ist die größere Variante (Touch): Padding-Y 18, Icon-Button 49 px. `Size=Desktop`: Padding-Y 16, Icon-Button 45 px. Mobile ist Default, Desktop ab Breakpoint lg (1024 px). Der Umschaltpunkt steht in `button.css` in einer einzigen Media Query.

## Tokens

- Typo: Text Style Label-S (`font-family-mono`, 500, `font-size-label-s`, LH 108 %, LS 10 %, uppercase)
- Padding: `space-16` / `space-18` vertikal, `space-20` horizontal, Secondary `space-10` vertikal
- Farben: `color/button/primary/{bg,bg-hover,bg-pressed,fg}`, `color/button/secondary/{fg,fg-hover,fg-pressed}`, `color/button/icon/{border,bg-hover,bg-pressed,fg}`. Alle wechseln mit `data-context`.
- Radius: `radius-none`. Buttons sind rechteckig.

## Markup

```html
<button class="btn btn--primary" type="button">Tickets buchen</button>
<a class="btn btn--secondary" href="/ausstellung">Mehr erfahren</a>
<button class="btn btn--icon" type="button" aria-label="Weiter">
  <svg class="icon" aria-hidden="true"><use href="/dist/icons/sprite.svg#icon-ArrowRight"></use></svg>
</button>
```

Modifier `.btn--block` für volle Breite.

## Hinweise

- Disabled per Opacity senkt den Kontrast unter AA. Das ist Design-Entscheidung aus Figma und für deaktivierte Elemente WCAG-konform (Ausnahme 1.4.3).
- Buttons mit Icon plus Label gibt es in Figma nicht als Set. Bei Bedarf `.btn--primary` mit `.icon` als Kind, Gap 8 ist vorbereitet.
- Secondary als Link: `<a>` funktioniert identisch, Unterstrich kommt aus dem Border, nicht aus `text-decoration`.

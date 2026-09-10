# SGLI Design System

Design System der Gedenkstätte Lindenstraße (SGLI). Quelle ist die Figma-Datei „SGLI – Design“ (ZK Team). Dieses Repo liefert Tokens, Foundations, Core Components und Doku für die Umsetzung in Craft CMS.

## Quickstart

```
nvm use
npm install
npm run build        # tokens + lint + icon sprite
npm run docs         # Styleguide auf http://localhost:4321/docs/
```

## Was drin ist

| Ordner | Inhalt |
|---|---|
| `tokens/` | Design Tokens im DTCG-Format (W3C), aus Figma exportiert |
| `dist/css/` | generierte CSS Custom Properties: `tokens.css`, `contexts.css`, `typography.css`, `layout.css`, `text-styles.css`, `index.css` |
| `dist/icons/sprite.svg` | SVG-Sprite aller genutzten Icons (Phosphor + 4 Custom-Carets) |
| `src/styles/` | Foundations: Fonts, Reset, Base, Kontexte, Grid, Section, Fokus, Icons, Cut-Edges |
| `src/components/` | Core Components (folgen in Phase B) |
| `assets/fonts/` | Switzer (400/600 + Italic), IBM Plex Mono (500), woff2, self-hosted |
| `assets/icons/` | Einzel-SVGs |
| `docs/` | statischer Styleguide |
| `scripts/` | Export (Figma, read-only), Build, Lint, Sprite |

## Einbinden

Alles in einer Datei:

```html
<link rel="stylesheet" href="/src/styles/index.css">
```

Oder nur die Tokens (z. B. wenn Craft eigene Basis-Styles hat):

```html
<link rel="stylesheet" href="/dist/css/index.css">
```

## Konzepte in Kürze

- **Kontexte statt Themes.** Ein Modul bekommt `data-context="primary-900"` (oder surface-100 … secondary-400) und alle semantischen Farben stellen sich darauf ein. Ohne Attribut gilt surface-50.
- **Mobile first.** Phone-Werte in `:root`, Tablet ab 768px, Desktop ab 1024px. Weitere Breakpoints (480, 1280, 1440) sind als Tokens vorbereitet.
- **Text Styles** als Klassen `.text-h1` … `.text-label-s` und als Element-Mapping (`h1`–`h6`, `p`, `blockquote`, `small`).
- **Fokus** doppelter Ring innen 2px / außen 4px, nur bei `:focus-visible`.
- **Icons** per `<svg class="icon"><use href="/dist/icons/sprite.svg#icon-ArrowRight"></use></svg>`.

Details, Entscheidungen und offene Punkte: [PLAN.md](PLAN.md). Arbeitsregeln: [CLAUDE.md](CLAUDE.md).

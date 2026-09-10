# Figma ↔ Repo Mapping

Datei „SGLI – Design“, fileKey `Nm1wSBrrniedJI8ojcjZIp`. Figma ist Master, read-only.

## Regel

Figma-Name wird nur normalisiert: Slash → Punkt (Token) bzw. Bindestrich (CSS), Kleinschreibung, Leerzeichen → Bindestrich. Nie umbenannt.

| Figma | Token-Pfad | CSS |
|---|---|---|
| `color/neutral/900` (Primitives) | `color.neutral.900` | `--color-neutral-900` |
| `color/neutral/alpha/900-20` | `color.neutral.alpha.900-20` | `--color-neutral-alpha-900-20` (hex8) |
| `color/text/primary` (Semantic) | `color.text.primary` | `--color-text-primary: var(--color-neutral-900)` |
| Semantic-Mode `primary-900` | `tokens/semantic/context/primary-900.json` | `[data-context="primary-900"] { … }` |
| `space/16` | `space.16` | `--space-16: 16px` |
| `radius/md`, `border/focus-outer`, `size/icon/md` | analog | `--radius-md`, `--border-focus-outer`, `--size-icon-md` |
| `z/modal` | `z.modal` | `--z-modal: 1400` |
| `viewport/desktop` | `viewport.desktop` | `--viewport-desktop: 1440px` (Artboard, kein Breakpoint) |
| `font-family/Switzer` | `font.family.sans` | `--font-family-sans: Switzer, system-ui, sans-serif` |
| `font-family/IBM Plex Mono` | `font.family.mono` | `--font-family-mono` |
| Schriftschnitt aus Text Style (Regular / Medium / Semibold) | `font.weight.{regular,medium,semibold}` | `--font-weight-semibold: 600` |
| `font-size/h1` (Mode Phone / Tablet / Desktop) | `font-size.h1` in `phone.json` / `tablet.json` / `desktop.json` | `--font-size-h1` in `:root` / `@media (min-width: 768px)` / `@media (min-width: 1024px)`, in rem |
| Text Style Line-Height (%) | `line-height.h1` | `--line-height-h1: 1.2` (unitless) |
| Text Style Letter-Spacing (%) | `letter-spacing.h1` | `--letter-spacing-h1: -0.02em` |
| Text Style `Heading/H1` | `text-style.h1` | `.text-h1` und Element `h1` |
| `section-spacing/y/default` (Layout) | `section-spacing.y.default` | `--section-spacing-y-default: var(--space-64)` + Media |
| Grid Style `Desktop` (12 / 24 / 40) | `grid.desktop.{columns,gutter,margin}` | `--grid-desktop-gutter` … und aktive `--grid-gutter` je Breakpoint |
| – (nur Repo) | `breakpoint.{sm,md,lg,xl,2xl}` | `--breakpoint-md: 768px` (Doku; Media Queries stehen fest im CSS) |
| Component `cut-edges` (position, color) | – | `.cut-edges--before` / `--after` + `data-context` |
| Icon-Component `ArrowRight` | `assets/icons/ArrowRight.svg` | `<use href="sprite.svg#icon-ArrowRight">` |

## Bewusste Abweichungen

- **Semantic `color/accent/highlight`** ist nicht im Repo, weil Primitives denselben Pfad haben und der Wert in allen 7 Kontexten identisch ist. `--color-accent-highlight` kommt aus den Primitives.
- **Line-Height / Letter-Spacing** werden aus den Text Styles gelesen, nicht aus den Typography-Variablen. Seit dem Scan vom 2026-09-10 sind beide identisch. H1 Letter-Spacing steht im Style als −2 px und wird als −2 % geführt (Entscheidung).
- **Shadows** (Effect Styles shadow-sm/md/lg) sind vorerst nicht im Repo.
- **Tablet-Grid** (12 / 16 / 24) existiert nur im Repo.
- **Breakpoints** existieren nur im Repo. Figma-Modes Tablet/Desktop sind an md/lg gebunden.

## Node-IDs

| Was | ID |
|---|---|
| Seite Foundations | `1179:2` |
| Seite Components | `16:4` |
| Seite Modules | `1266:3189` |
| Seite Templates | `2522:55919` |
| Icon-Frame (Phosphor-Set) | `1744:9209` |
| cut-edges Component-Set | `2072:9560` |
| Collection Primitives | `VariableCollectionId:1177:2` |
| Collection Semantic | `VariableCollectionId:1177:750` |
| Collection Typography | `VariableCollectionId:1177:776` |
| Collection Layout | `VariableCollectionId:1966:1816` |

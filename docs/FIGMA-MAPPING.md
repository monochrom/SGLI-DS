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

- **Font-Fallbacks:** Figma liefert `Switzer` / `IBM Plex Mono`, das Repo ergänzt `system-ui, sans-serif` bzw. `ui-monospace, monospace`.
- **Semantic `color/accent/highlight`** ist nicht im Repo, weil Primitives denselben Pfad haben und der Wert in allen 7 Kontexten identisch ist. `--color-accent-highlight` kommt aus den Primitives.
- **Line-Height / Letter-Spacing** werden aus den Text Styles gelesen, nicht aus den Typography-Variablen. Seit dem Scan vom 2026-09-10 sind beide identisch. H1 Letter-Spacing steht im Style als −2 px und wird als −2 % geführt (Entscheidung).
- **Shadows** (Effect Styles shadow-sm/md/lg) sind vorerst nicht im Repo.
- **Tablet-Grid** (12 / 16 / 24) existiert nur im Repo.
- **Breakpoints** existieren nur im Repo. Figma-Modes Tablet/Desktop sind an md/lg gebunden.
- **Varianten-Property `Breakpoint`** heißt seit 2026-09-30 in allen Component-Sets gleich, Werte `Desktop | Phone` (selten `Tablet`). Ausnahme: faq-section hat zusätzlich `Desktop Centered` (Layout, nicht Breakpoint).
- **Modulfarbe:** Ohne `data-context` greifen die Werte von surface-50 (erster Figma-Mode). Module tragen immer `data-context`, Voreinstellung in Craft ist `surface-100`.

## Node-IDs

| Was | ID |
|---|---|
| Seite Foundations | `1179:2` |
| Seite Components | `16:4` |
| Seite Modules | `1266:3189` |
| Seite Templates | `2522:55919` |
| Icon-Frame (Phosphor-Set) | `1744:9209` |
| cut-edges Component-Set | `2072:9560` |
| Doku-Frame Cut-Edges (Foundations) | `2898:1948` |
| Doku-Frame Section-Spacing (Foundations, unter „Foundations“) | `2909:1850` |
| modal Component-Set (confirm / language × Desktop / Phone) | `2859:132` |
| Doku-Frame Modal (Foundations) | `2860:1449` |
| search-overlay Component-Set (Desktop / Phone), Modules | `2872:4913` |
| Doku-Frame Off-Canvas (Foundations) | `2613:31418` |
| Off-Canvas Filter Desktop / Phone | `2710:23917` / `2710:24111` |
| section-header Variante off-canvas | `2613:27966` |
| Doku-Frame Forms (Foundations) | `2746:24535` |
| Off-Canvas Kontakt Desktop / Phone | `2746:26620` / `2753:30067` |
| Off-Canvas Anmeldung Desktop / Phone | `2746:26818` / `2753:30157` |
| Off-Canvas Bestätigung Desktop / Phone | `2747:29871` / `2746:28162` |
| Input-Sets (Text, Select, Search, Date, Textarea) | `1647:6622` |
| Icon Clock / CheckCircle | `1583:1135` / `1583:1160` |
| Doku-Frame Suche (Foundations) | `2873:1631` |
| Doku-Frame Seitenkopf (Foundations) | `2929:2012` |
| Doku-Frame Menü (Foundations) | `2929:2253` |
| Doku-Frame Slider (Foundations) | `2930:2449` |
| Doku-Frame FAQ (Foundations) | `2930:2730` |
| Doku-Frame Marquee (Foundations) | `2930:2885` |
| Doku-Frame Fokus (Foundations, rechts neben Section-Spacing) | `2932:2853` |
| Doku-Frame Motion (Foundations, rechts neben Section-Spacing) | `2932:2974` |
| navigation (Seitenkopf) Component-Set | `1926:1842` |
| Navigation / Menu Overlay Component-Set | `2802:62629` |
| teaser-slider / faq-section / marquee Component-Sets | `2017:2053` / `2165:2501` / `2146:14` |
| Icon Pause / Play | `1583:492` / `1583:429` |
| Collection Primitives | `VariableCollectionId:1177:2` |
| Collection Semantic | `VariableCollectionId:1177:750` |
| Collection Typography | `VariableCollectionId:1177:776` |
| Collection Layout | `VariableCollectionId:1966:1816` |

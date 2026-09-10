# SGLI Design System – Analyse & Repo-Plan

Stand: 2026-09-10 (Feedback eingearbeitet, Figma am 2026-09-10 neu gescannt)
Quelle: Figma „SGLI – Design“ (fileKey `Nm1wSBrrniedJI8ojcjZIp`), gelesen per Figma MCP (Plugin-API, **read-only**).

---

## 0. Arbeitsregeln

- Arbeitsbereich ist ausschließlich `00_DesignSystem/` und seine Unterordner. Keine anderen Ordner lesen, durchsuchen oder referenzieren.
- Die Figma-Datei wird **nur gelesen, nie verändert**.
- Figma ist Master für Werte. Bei Line-Height und Letter-Spacing ist der **Text Style** Master (Prozent), nicht die Variable.
- Erst planen, dann bauen. Bei Unklarheit fragen.
- Scan vom 2026-09-10 hat `body-l`-Korrektur und `font-family`-Variablen bestätigt (siehe 1.2/1.3).

---

## 1. Was in Figma liegt

### 1.1 Seitenstruktur (relevant)

| Seite | Inhalt |
|---|---|
| 🎨 Foundations (`1179:2`) | Brand-Farben, Farbskalen, Semantic Colors, WCAG-Kontrastmatrix, Font Family, Font Sizes, Spacing, Doku-Boards für Buttons, Form Fields, Radio/Checkbox, Toggle, Chip |
| 💎 Components (`16:4`) | 14 Component-Sets (Button, Inputs, Toggle, Checkbox, Radio, Chip) + Phosphor-Icon-Set (mehrere hundert Einzel-Components) |
| 🗄️ Modules (`1266:3189`) | ~60 Modul-Component-Sets (Navigation, Hero, Teaser, Text, Image, List, Form, Filter, Search, Contact, Cut-Edges) |
| 🏗️ Templates (`2522:55919`) | 5 Seitentemplates |

### 1.2 Variable Collections (4 Collections, 193 Variablen, Scan 2026-09-10)

| Collection | ID | Modes | Variablen | Zweck |
|---|---|---|---|---|
| **Primitives** | `VariableCollectionId:1177:2` | Default | 100 | Rohwerte: Farben, Spacing, Radius, Border, Sizes, z-Index, Viewports |
| **Semantic** | `VariableCollectionId:1177:750` | surface-50, surface-100, surface-200, surface-300, surface-400, primary-900, secondary-400 | 47 | Rollen-Tokens (text, bg, divider, border, interactive, accent, feedback, icon, button, toggle, chip); alle als Alias auf Primitives |
| **Typography** | `VariableCollectionId:1177:776` | Desktop, Tablet, Phone | 41 | font-family (2), font-size (13), line-height (13), letter-spacing (13) |
| **Layout** | `VariableCollectionId:1966:1816` | Desktop, Tablet, Phone | 5 | section-spacing x/y als Alias auf `space/*` |

**Wichtig:** Die 7 Semantic-Modes sind keine Light/Dark-Themes, sondern **Modul-Hintergrund-Kontexte**. Jedes Modul bekommt einen Hintergrund (`color/bg/module`) und alle Rollen-Tokens lösen sich dagegen auf. Die fünf `surface-*` Modes unterscheiden sich fast nur in `bg/module` und `bg/inset`; `primary-900` ist der einzige echte Invers-Kontext (helle Schrift auf Dunkelviolett), `secondary-400` ist Grün mit dunkler Schrift. Das Component-Set `cut-edges` hat exakt dieselben 7 Farb-Varianten.

#### Primitives im Detail

- **color/neutral** 0–900 (11 Stufen, warmes Off-White `#fffdf9` bis `#1a1917`)
- **color/primary** 50–900 (Violett, Brand `#201747` = 900)
- **color/secondary** 50–900 (Grün, `#89b399` = 400)
- **color/surface** 50–400 (5 warme Papiertöne, `#fffdf9` … `#d8d3cc`)
- **color/accent/highlight** `#eaff00`
- **color/success|warning|error** je `strong`, `bg`, `dark`
- **color/neutral/alpha/900-{0,5,10,20,40,60}** und **alpha/0-{…}** (Overlays/Divider)
- **space** 0, 2, 4, 6, 8, 10, 12, 16, 18, 20, 24, 32, 40, 48, 64, 80, 96, 112 (wertbasierte Namen)
- **radius** none 0, sm 4, md 8, lg 12, full 9999
- **border** default 1, focus-inner 2, focus-outer 4
- **size/control** sm 36, md 44, lg 52 · **size/icon** sm 16, md 20, lg 24 · **size/touch/min** 44
- **z** base 0, dropdown 1000, sticky 1100, overlay 1300, modal 1400, toast 1500
- **viewport** phone 375, tablet 768, desktop 1440 (Artboard-Breiten, keine Breakpoints)

#### Typography-Variablen (Desktop / Tablet / Phone), Scan 2026-09-10

- **font-family/Switzer** = „Switzer“, **font-family/IBM Plex Mono** = „IBM Plex Mono“ (STRING, in allen Modes gleich). Im Repo zusätzlich Rollen-Alias `font.family.sans` → Switzer, `font.family.mono` → IBM Plex Mono.
- Namen sind jetzt durchgängig `body-s` / `body-m` (kein `body-l` mehr). `line-height/quote` und `letter-spacing/quote` existieren.
- Line-Height-Variablen stimmen jetzt mit den Text Styles überein (display 100, body-m 150). Kein Konflikt mehr.

| Stil | font-size D/T/P | line-height % | letter-spacing (Variable, unitless) |
|---|---|---|---|
| display | 112 / 88 / 64 | 100 | −2 |
| h1 | 64 / 64 / 42 | 120 | −2 / −2 / −1 |
| h2 | 48 / 40 / 32 | 120 | 0 |
| h3 | 32 / 28 / 24 | 120 | 0 |
| h4 | 24 / 22 / 20 | 120 | 0 |
| h5 | 20 / 19 / 18 | 135 | 0 |
| h6 | 18 / 18 / 18 | 140 | 0 |
| body-m | 18 / 18 / 16 | 150 | 0 |
| body-s | 16 / 16 / 14 | 140 | 0 |
| caption | 13 | 140 | 0 |
| label-m | 16 / 16 / 15 | 120 | 0 |
| label-s | 12 | 108 | 10 |
| quote | 32 / 28 / 24 | 120 | 0 |

### 1.3 Text Styles (13) = Master für Line-Height und Letter-Spacing, Scan 2026-09-10

Font: **Switzer** (Semibold für Headings, Regular für Body) und **IBM Plex Mono Medium** für Label-S. Alle Styles sind an `font-family/*` und `font-size/*` gebunden; alle außer Display und Label-S zusätzlich an `letter-spacing/*`. Line-Height ist in keinem Style gebunden (gewollt, Style ist Master).

| Style | Font | Size (Desktop) | LH | LS im Style | Sonstiges |
|---|---|---|---|---|---|
| Display | Switzer Semibold | 112 | 100 % | **−2 %** | |
| Heading/H1 | Switzer Semibold | 64 | 120 % | **−2 px** | |
| Heading/H2 | Switzer Semibold | 48 | 120 % | 0 px | |
| Heading/H3 | Switzer Semibold | 32 | 120 % | 0 px | |
| Heading/H4 | Switzer Semibold | 24 | 120 % | 0 px | |
| Heading/H5 | Switzer Semibold | 20 | 135 % | 0 px | |
| Heading/H6 | Switzer Semibold | 18 | 140 % | 0 px | |
| Body/M | Switzer Regular | 18 | 150 % | 0 px | |
| Body/S | Switzer Regular | 16 | 140 % | 0 px | gebunden an `letter-spacing/body-s` (body-l behoben) |
| Caption | Switzer Regular | 13 | 140 % | 0 px | |
| Label-M | Switzer Regular | 16 | 120 % | 0 px | |
| Label-S | IBM Plex Mono Medium | 12 | 108 % | **10 %** | UPPERCASE |
| Quote | Switzer Regular | 32 | 120 % | 0 px | |

Heading/H1 hat Letter-Spacing im Style als `−2 px` hinterlegt (Einheit Pixel, weil an die Variable gebunden), Display als `−2 %`. **Bestätigt 2026-09-10: H1 = −2 %** (`-0.02em`), analog zu Display. Alle Nullwerte sind einheitenunabhängig.

### 1.3a Semantic-Tokens (47), Scan 2026-09-10

Gruppen: `text/{primary,secondary}`, `bg/{page,card,inset,module}`, `divider/default`, `border/{default,focus-inner,focus-outer}`, `interactive`, `interactive-hover`, `interactive-secondary`, `interactive-secondary-hover`, `accent/highlight`, `feedback/{error,error-bg,success,success-bg,warning,warning-bg,info,info-bg}`, `icon/primary`, `button/primary/{bg,bg-hover,bg-pressed,fg}`, `button/secondary/{fg,fg-hover,fg-pressed}`, `button/icon/{border,bg-hover,bg-pressed,fg}`, `toggle/{track-off,track-on,thumb}`, `chip/{bg,bg-hover,bg-active,fg,fg-active,badge-bg,badge-bg-active,badge-fg,badge-fg-active}`.

Kontext-Unterschiede: `surface-100…400` weichen vom Default nur bei `bg/module` und `bg/inset` ab. `primary-900` invertiert 40 von 47 Tokens. `secondary-400` weicht nur bei `bg/module` und `bg/inset` (neutral/100) ab. `bg/page` ist in allen Kontexten `surface/100`.

Layout: `section-spacing/y/default` 112/96/64, `y/compact` 64/48/32, `x/default` 40/24/16, `y/none` und `x/none` 0 (jeweils Desktop/Tablet/Phone, Alias auf `space/*`).

### 1.4 Effect Styles (3) und Grid Styles (2)

- **shadow-sm** 0 8 18 rgba(22,19,51,.25) · **shadow-md** 0 12 24 rgba(22,19,51,.40) · **shadow-lg** 0 16 48 rgba(22,19,51,.40). Farbe ist hart codiert, nicht als Variable. Bleibt so, wird als 3 Composite-Tokens exportiert.
- **Grid Desktop** 12 Spalten, Gutter 24, Margin 40 · **Grid Phone** 12 Spalten, Gutter 8, Margin 16. Kein Tablet-Grid (Vorschlag: 12 / 16 / 24, siehe Abschnitt 5).

### 1.5 Komponenten-Inventar

**Core Components (💎):** Button/Primary, Button/Secondary, Button/Icon (je State × Size), Input Text, Input Select, Input Search, Input Date, Textarea (je 6 States), Toggle, Checkbox, Radio, Chip (State × Viewport, Badge/Icon/Count). Icons = Phosphor-Set (Namen identisch mit `@phosphor-icons`), plus 4 Custom-Icons `CaretSmall{Left,Right,Up,Down}`.

**Modules (🗄️):** navigation, footer, hero-{home,exhibition,timeline,default,biography}, hero-back-navigation, section-header (4 Typen), teaser-{grid,stacked,event-list,search,slider,feature,timeline,row,event-today,block}, teaser-card-{static,inline,box}, text-{intro,block-1col,block-2col,content-grid,row,box,section,block,grid-item,columns-item}, quote, marquee, faq-section/faq-item, image-{section,slider,asymmetric,double,triple,fullwidth,text-single,text-double}, list-{default,cell,item,item-education,team-section,team-card,row-inline}, downloads-section, newsletter-form, filter, education-filter, search, contact-section, visit-info, price-row, tag, metadata, **cut-edges** (7 Farben × before/after).

Fast alle Module haben `Breakpoint: Desktop | Phone` (selten Tablet) und ein `cut-edges` Boolean.

---

## 2. Auffälligkeiten und wie wir damit umgehen

| # | Befund | Umgang |
|---|---|---|
| 1 | line-height in Text Styles nicht an Variablen gebunden | Gewollt: Text Style ist Master. Werte sind seit dem Scan identisch mit den Variablen. |
| 2 | Wertkonflikte Style ↔ Variable | **Behoben** (Scan 10.09.): display 100, body-m 150 in Style und Variable. |
| 3 | Namensdrift `body-l` | **Behoben** (Scan 10.09.): `body-s`/`body-m` durchgängig, Body/S an `letter-spacing/body-s` gebunden. |
| 4 | Keine `font-family`-Variablen | **Behoben** (Scan 10.09.): `font-family/Switzer`, `font-family/IBM Plex Mono`. `font-weight` wird aus den Styles abgeleitet (400/500/600). |
| 4a | H1 Letter-Spacing im Style `−2 px`, Display `−2 %` | **Bestätigt:** im Code beides −2 % (`-0.02em`). |
| 5 | Scope-Hygiene (`ALL_SCOPES`) | Nur Figma-Kosmetik, wir ändern Figma nicht. Keine Auswirkung auf Code. |
| 6 | Shadows nicht tokenisiert | Vorerst nicht im Repo (Entscheidung 10.09.). Werte sind in 1.4 dokumentiert. |
| 7 | Kein Tablet-Grid-Style | Tablet-Grid im Repo definieren (Vorschlag 12 / 16 / 24), Bestätigung offen. |
| 8 | Breakpoint-Semantik | **Entschieden:** Tablet ab 768, Desktop ab 1024, iterativ nachschärfen. `viewport/*` bleibt Artboard-Breite. |
| 9 | Variables REST API Enterprise-only | Datei liegt im ZK Team (Pro). Export läuft über wiederholbares, rein lesendes MCP-Script. |

---

## 3. Entscheidungen (Feedback 2026-09-10)

| Thema | Entscheidung |
|---|---|
| Zielstack | **Craft CMS**, Umsetzung durch einen Developer. Danilo liefert Design System und voraussichtlich Components/Module plus QA (final nächste Woche). |
| Architektur | Framework-neutral, generisch: Tokens als DTCG-JSON, Build mit Style Dictionary v4 zu CSS Custom Properties, Komponenten als HTML + CSS (BEM) + leichtes Vanilla-JS. Kein Twig, kein React. Craft-Templates entstehen beim Developer auf dieser Basis. |
| Line-Height / Letter-Spacing | Prozent. Text Style ist Source of Truth. Im CSS: line-height unitless (`1.5`), letter-spacing in `em` (`-0.02em`, `0.1em`). |
| Font-Family | Aus den neuen Figma-Variablen. Fonts als woff2 im Repo (Switzer 400/600, IBM Plex Mono 500), `@font-face` lokal, keine externen Requests. |
| Breakpoints | Mobile first. `sm 480`, `md 768` (Tablet), `lg 1024` (Desktop), `xl 1280`, `2xl 1440`. Nur `md` und `lg` sind an Figma-Modes gebunden; `sm`, `xl`, `2xl` sind angelegt und leer, damit im Code leicht justiert werden kann. |
| Icons | SVG. Alle genutzten Phosphor-Icons plus 4 Custom-Carets als Einzeldateien unter `assets/icons/`, daraus `dist/icons/sprite.svg` (`<symbol>`) für `<use href>`. Kein npm-Paket, da sich das Set nicht mehr vergrößert. |
| Prototyp (Phase C) | Seite **Bildungsangebote** auf Basis von Danilos fertigem Figma-Template (Node-ID folgt). Statische Dummy-Daten, Chips per Vanilla-JS filterbar. Kein Backend. Ziel ist der Kundentest der Filterlogik. Erst nach Phase A und B. |

---

## 4. Repo-Struktur

Repo-Wurzel = dieses Verzeichnis `00_DesignSystem/`.

```
00_DesignSystem/
├── README.md                     Zweck, Quickstart, Figma-Link, Sync-Ablauf
├── CLAUDE.md                     Arbeitsregeln (nur dieser Ordner, Figma read-only, fileKey, Naming, Build)
├── PLAN.md                       dieses Dokument
├── package.json                  scripts: tokens:export, tokens:build, tokens:lint, icons:sprite, docs
├── .nvmrc · .gitignore · .editorconfig
│
├── tokens/                       ▶ Source of Truth im Repo (DTCG JSON, aus Figma exportiert)
│   ├── $metadata.json            Collection-Reihenfolge, Mode-Zuordnung
│   ├── primitives/
│   │   ├── color.json            neutral, primary, secondary, surface, accent, feedback, alpha
│   │   ├── space.json · radius.json · border.json
│   │   ├── size.json             control, icon, touch
│   │   ├── z-index.json
│   │   └── viewport.json         Artboard-Breiten, nur Referenz
│   ├── semantic/
│   │   ├── color.json            Default-Kontext (= Mode surface-50)
│   │   └── context/              je ein Override-File pro Semantic-Mode
│   │       ├── surface-100.json … surface-400.json
│   │       ├── primary-900.json
│   │       └── secondary-400.json
│   ├── typography/
│   │   ├── font.json             family (aus Figma-Variablen) + weight
│   │   ├── phone.json · tablet.json · desktop.json    font-size je Breakpoint
│   │   └── text-styles.json      13 Composite-Tokens; LH/LS in % aus den Text Styles
│   ├── layout/
│   │   ├── breakpoints.json      sm 480, md 768, lg 1024, xl 1280, 2xl 1440
│   │   ├── grid.json             columns/gutter/margin je Breakpoint
│   │   └── phone.json · tablet.json · desktop.json    section-spacing
│   └── effects/
│       └── shadow.json           sm/md/lg als composite shadow tokens
│
├── scripts/
│   ├── figma-export.mjs          rein lesendes Plugin-API-Script → tokens/*.json
│   ├── build-tokens.mjs          Style-Dictionary-Config + Custom-Formats (contexts, breakpoints)
│   ├── lint-tokens.mjs           Alias-Auflösung, Kontrast AA je Kontext, Naming-Diff zu Figma
│   └── build-sprite.mjs          assets/icons/*.svg → dist/icons/sprite.svg
│
├── dist/                         ▶ generiert, wird committed (Konsumenten ohne Node-Build)
│   ├── css/
│   │   ├── tokens.css            :root { --color-neutral-900: … } Primitives + Semantic-Default
│   │   ├── contexts.css          [data-context="primary-900"] { … } für alle 7 Modes
│   │   ├── typography.css        --font-size-h1 mobile first + @media md/lg
│   │   ├── layout.css            --section-spacing-y, Grid-Variablen, Breakpoint-Doku
│   │   └── index.css             importiert alles oben
│   ├── icons/sprite.svg
│   └── json/tokens.flat.json     für Tooling / Doku
│
├── src/                          ▶ handgeschriebenes CSS/HTML/JS auf Basis der Tokens
│   ├── styles/
│   │   ├── fonts.css             @font-face Switzer (400/600), IBM Plex Mono (500)
│   │   ├── reset.css
│   │   ├── base.css              html/body, Headings → Text Styles
│   │   ├── text-styles.css       .text-display … .text-label-s (1:1 Figma Text Styles)
│   │   ├── context.css           .context-* Klassen setzen data-context + bg/module
│   │   ├── cut-edges.css         „Der Schnitt“ (clip-path / mask), before/after, 7 Farben
│   │   ├── grid.css              12-Spalten-Container
│   │   ├── focus.css             Fokusring inner 2px / outer 4px (WCAG 2.2)
│   │   └── index.css
│   ├── components/               1:1 zu 💎 Components, je Ordner:
│   │   │                         name.css · name.html (alle States) · README.md
│   │   ├── button/               primary, secondary, icon
│   │   ├── input-text/ · input-select/ · input-search/ · input-date/ · textarea/
│   │   ├── toggle/ · checkbox/ · radio/
│   │   ├── chip/ · tag/
│   │   └── icon/                 <svg><use href="sprite.svg#name"> Wrapper
│   ├── modules/                  1:1 zu 🗄️ Modules, gleiche Ordnerkonvention, nach Bedarf
│   └── templates/
│       └── bildungsangebote.html Prototyp (Phase C)
│
├── assets/
│   ├── fonts/switzer/ · fonts/ibm-plex-mono/     woff2
│   ├── logo/                     SVG
│   └── icons/                    alle genutzten Phosphor-Icons + CaretSmall{Left,Right,Up,Down}.svg
│
└── docs/                         ▶ Living Styleguide, statisch
    ├── index.html
    ├── foundations/              colors, contexts, typography, spacing, grid, breakpoints, icons, contrast-matrix
    ├── components/ · modules/
    ├── FIGMA-MAPPING.md          Figma-Name ↔ Token ↔ CSS ↔ Node-ID
    └── CHANGELOG.md
```

### 4.1 Naming-Konvention (durchgängig)

| Ebene | Figma | DTCG-Pfad | CSS |
|---|---|---|---|
| Primitive | `color/neutral/900` | `color.neutral.900` | `--color-neutral-900` |
| Semantic | `color/text/primary` | `color.text.primary` | `--color-text-primary` |
| Typo | `font-size/h1` | `font-size.h1` | `--font-size-h1` |
| Layout | `section-spacing/y/default` | `section-spacing.y.default` | `--section-spacing-y-default` |
| Breakpoint | – (nur Repo) | `breakpoint.md` | `--breakpoint-md` (Doku) + `@media (min-width: 768px)` |
| Text Style | `Heading/H1` | `text-style.heading.h1` | `.text-h1` |
| Kontext-Mode | `primary-900` | `context.primary-900` | `[data-context="primary-900"]` |

Regel: Figma-Name wird nur normalisiert (Slash → Punkt/Bindestrich, lowercase), nie umbenannt. Damit bleibt der Diff Figma ↔ Repo maschinell prüfbar.

### 4.2 Modes → CSS

- **Semantic-Modes** → `data-context` Attribut auf dem Modul-Wrapper. `contexts.css` überschreibt nur die Tokens, die sich vom Default unterscheiden.
- **Typography/Layout-Modes** → mobile first: Phone-Werte in `:root`, Tablet ab `md` (768) und Desktop ab `lg` (1024) per `@media`. Werte in `rem`, line-height unitless, letter-spacing in `em`.
- **Text Styles** → Utility-Klassen plus Mapping auf `h1`–`h6`, `p`, `blockquote` in `base.css`.

---

## 5. Vorgehen in Phasen

| Phase | Ergebnis |
|---|---|
| **0 Aufräumen** | erledigt 2026-09-10: Memory bereinigt, PLAN.md überarbeitet |
| **1 Figma-Scan** | erledigt 2026-09-10: alle 4 Collections, 13 Text Styles, 3 Effect Styles, 2 Grid Styles gelesen; Tabellen aktualisiert |
| **A Foundations** | **erledigt 2026-09-10:** git init, package.json, CLAUDE.md, README; `tokens/**/*.json` (DTCG) per Export-Script; `dist/css/*` + `dist/json/tokens.flat.json` per Style Dictionary; Lint mit Kontrast-Matrix; `src/styles/*` (fonts, reset, base, context, grid, section, focus, icon, cut-edges); Fonts self-hosted; 18 Icons als SVG + Sprite; `docs/index.html` Styleguide, `docs/FIGMA-MAPPING.md`, `docs/CHANGELOG.md`. Noch nicht committed. |
| **B Core Components** | **erledigt 2026-09-10:** `src/components/{button,input,toggle,checkbox,chip,tag}/` je CSS + Vorschau-HTML + README; alle States aus Figma, alle 7 Kontexte in jeder Vorschau; `docs/components.html`. Offen: Danilos Sichtprüfung gegen Figma, dann Barrierefreiheits-Check. |
| **C Prototyp Bildungsangebote** | nötige Module + eine HTML-Seite mit Dummy-Daten und Vanilla-JS-Filter, für den Kundentest |
| **D Module / Docs / Übergabe** | nach Entscheidung über den Lieferumfang (nächste Woche) |

---

## 6. Kontrast-Befunde aus dem Lint (2026-09-10, in Figma zu klären)

`npm run tokens:lint` prüft 31 Paare je Kontext gegen WCAG 2.2 AA (Text 4.5:1, UI 3:1). Stand nach Nachscan 2026-09-10 (text/secondary in surface-400 und secondary-400 auf neutral/700 gelöst): surface-50, surface-100 und primary-900 sind sauber. Verbleibende Befunde:

| Kontext | Paar | Ist | Soll |
|---|---|---|---|
| surface-200 | `color/toggle/track-off` (neutral/400) auf `bg/module` | 2.85 | 3.0 |
| surface-300 | `color/toggle/track-off` auf `bg/module` | 2.49 | 3.0 |
| surface-300 | `color/interactive-secondary` (secondary/600) auf `bg/module` | 3.96 | 4.5 |
| surface-400 | `color/toggle/track-off` auf `bg/module` | 2.23 | 3.0 |
| surface-400 | `color/interactive-secondary` auf `bg/module` | 3.54 | 4.5 |
| surface-400 | `color/feedback/error` (error/dark) auf `bg/module` | 4.35 | 4.5 |
| secondary-400 | `color/interactive-secondary` auf `bg/module` | 2.25 | 4.5 |
| secondary-400 | `color/toggle/track-off` auf `bg/module` | 1.42 | 3.0 |
| secondary-400 | `color/feedback/error` auf `bg/module` | 2.76 | 4.5 |

Vorschlag: In den Modes surface-200/300/400 und secondary-400 dunklere Aliase setzen (`toggle/track-off` → neutral/500 oder 600, `interactive-secondary` → secondary/700 oder 800, `feedback/error` in surface-400 und secondary-400 → dunkler als error/dark, ggf. neutral/900). Divider (alpha 20 %) sind dekorativ und werden nur informativ gelistet.

## 7. To-dos

- [ ] **Cut-Edges bei den Modulen schärfen.** Entschieden 2026-09-10: Keile belegen eigenen Platz, rechteckiger Container um die Shape, Höhe der Shape bestimmt Höhe des Containers (kein Overlap). Hinter den Cut-Edges steckt weitere Funktionalität, Danilo brieft dazu gesondert, bevor die Module gebaut werden. `.cut-edges--overlap` bleibt bis dahin ungenutzt.
- [ ] **Barrierefreiheits-Check** (WCAG 2.2 AA / BFSG): Kontrast-Befunde aus Abschnitt 6 in Figma lösen, dann Lint erneut; Fokus-Reihenfolge, Tastaturbedienung, Zoom 200 %/400 %, Reflow, Screenreader-Semantik der Core Components und Module. Als eigener Schritt nach Phase B einplanen.
- [ ] Danilo prüft Styleguide (`npm run docs` → http://localhost:4321/docs/ und /docs/components.html).
- [ ] Commit über die GitHub-App (macht Danilo).
- [x] Phase B Core Components: Button (Primary/Secondary/Icon), Inputs, Toggle, Checkbox, Radio, Chip, Tag.
- [ ] Phase C Prototyp Bildungsangebote: wartet auf Danilos Template-Node-ID und das Cut-Edges-Briefing.

## 8. Entschieden (nicht mehr offen)

Entschieden am 2026-09-10:

1. **H1 Letter-Spacing:** −2 % wie Display (`-0.02em`).
2. **Tablet-Grid:** 12 Spalten, Gutter 16, Margin 24.
3. **Shadows:** vorerst nicht im Repo. Kommen erst, wenn eine Komponente sie braucht.
4. **Prototyp (Phase C):** wird später auf Basis von Danilos fertigem Bildungsangebote-Template umgesetzt, nicht jetzt. Erst Foundations, dann Core Components.

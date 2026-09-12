# Changelog

## 2026-09-12 – Bugfix Chip-Badge-Höhe

- `chip.css`: `.chip__badge` hatte eigenes vertikales Padding + Caption-Line-Height unabhängig von `--chip-min-h`. Ab Desktop (≥1024px, `--chip-min-h: 40px`) war der Badge-Content (~26px) größer als der Chip-Innenraum (22px) und drückte den Chip auf ~44px auf – Chips mit Badge/Value wurden sichtbar höher als Chips ohne (aufgefallen im Prototyp „Bildung", Filterzeile). Fix: `.chip__badge` bekommt eine feste, aus `--chip-min-h` abgeleitete Höhe statt vertikalem Padding, passt dadurch an jedem Breakpoint exakt in den Chip.

## 2026-09-10 – Phase B Core Components

- Figma-Sets ausgelesen (read-only): Button/Primary, Button/Secondary, Button/Icon, Input Text, Input Select, Input Search, Input Date, Textarea, Toggle, Checkbox, Radio, Chip, tag.
- `src/components/button` (Primary, Secondary, Icon; Mobile/Desktop-Größe ab lg), `input` (fünf Feldtypen, schwebendes Label, Error, Disabled), `toggle` (role=switch), `checkbox` (Checkbox + Radio, Fokusring um die Zeile), `chip` (aria-pressed, Badge, Icon), `tag`.
- `src/components/index.css` bündelt alle Komponenten. `docs/components.html` bettet die Vorschauen ein. Jede Vorschau zeigt alle 7 Kontexte.
- `focus.css`: Radius am Fokusring entfernt (Komponenten sind rechteckig).
- Nachscan Semantic: `text/secondary` in surface-400 und secondary-400 jetzt `neutral/700` (AA). Checkbox/Radio-Innenfarbe auf `bg/module` (in Figma korrigiert), Tag-Text `text/primary` wie in Figma.

## 2026-09-10 – Phase A Foundations

- Repo angelegt (git, Node 24, Style Dictionary 4.4).
- Figma neu gescannt (read-only): 4 Collections (193 Variablen), 13 Text Styles, 3 Effect Styles, 2 Grid Styles.
- Tokens als DTCG-JSON: Primitives, Semantic (Default + 6 Kontexte), Typography (Font, Größen je Breakpoint, LH/LS aus Text Styles, 13 Composite-Styles), Layout (Section-Spacing, Breakpoints, Grid).
- Build: `dist/css/{tokens,contexts,typography,layout,text-styles,index}.css`, `dist/json/tokens.flat.json`.
- Lint mit WCAG-Kontrastmatrix je Kontext. 10 Befunde, die in Figma zu klären sind (siehe PLAN.md).
- Foundations-CSS: fonts, reset, base, context, grid, section, focus, icon, cut-edges.
- Fonts self-hosted: Switzer 400/600 (+ Italic), IBM Plex Mono 500.
- Icons: 18 genutzte Icons als SVG + Sprite.
- Styleguide `docs/index.html`, Mapping `docs/FIGMA-MAPPING.md`.

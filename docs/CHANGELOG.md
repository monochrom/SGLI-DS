# Changelog

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

# SGLI Design System – Arbeitsregeln

Repo für das Design System der Gedenkstätte Lindenstraße (SGLI), Agentur Zum Kuckuck. Umsetzung der Website in Craft CMS durch einen Developer; dieses Repo liefert Tokens, Foundations, Komponenten und Doku.

## Harte Regeln

- **Arbeitsbereich ist nur dieser Ordner** (`00_DesignSystem/`) und seine Unterordner. Keine anderen Ordner lesen, durchsuchen oder referenzieren.
- **Figma ist Master und read-only.** Datei „SGLI – Design“, fileKey `Nm1wSBrrniedJI8ojcjZIp`, ZK Team (Pro). Nur lesende MCP-Calls. Nie Variablen, Styles oder Nodes in Figma verändern.
- **Text Styles sind Master für Line-Height und Letter-Spacing** (Prozent). Bei Abweichung zur Variable gilt der Style.
- Erst planen (`PLAN.md`), dann bauen. Bei Unklarheit fragen.

## Struktur

| Pfad | Inhalt |
|---|---|
| `tokens/` | DTCG-JSON, aus Figma exportiert. Source of Truth im Repo. |
| `scripts/figma-export.figma.js` | Rein lesendes Plugin-API-Script für den Export (läuft über Figma MCP `use_figma`, Teil per `EXPORT_PART`). |
| `scripts/build-tokens.mjs` | Style Dictionary v4 → `dist/css/*.css`, `dist/json/tokens.flat.json` |
| `scripts/lint-tokens.mjs` | Alias-Check, Naming, WCAG-Kontrast je Kontext |
| `scripts/build-sprite.mjs` | `assets/icons/*.svg` → `dist/icons/sprite.svg` |
| `dist/` | generiert, wird committed |
| `src/styles/` | handgeschriebene Foundations (fonts, reset, base, context, cut-edges, grid, focus) |
| `src/components/` | Core Components (HTML + CSS + README je Ordner) |
| `docs/` | statischer Styleguide |

## Befehle

```
npm run tokens:build   # dist/css + dist/json
npm run tokens:lint    # Kontrast-Matrix, Alias-Check (--strict für Exit 1)
npm run icons:sprite   # dist/icons/sprite.svg
npm run build          # alles
npm run docs           # lokaler Server auf http://localhost:4321
```

## Naming

Figma-Name → nur normalisiert, nie umbenannt: `color/neutral/900` → Token `color.neutral.900` → CSS `--color-neutral-900`. Text Style `Heading/H1` → `.text-h1`. Semantic-Mode `primary-900` → `[data-context="primary-900"]`.

Einheiten im CSS: font-size `rem`, Spacing/Radius/Border/Size `px` (1:1 Figma), line-height unitless, letter-spacing `em`.

## Breakpoints (mobile first)

`sm 480` · `md 768` (Figma Tablet) · `lg 1024` (Figma Desktop) · `xl 1280` · `2xl 1440`. Nur md und lg tragen Figma-Werte, die anderen sind zum Nachjustieren vorbereitet.

## Sync-Ablauf Figma → Repo

1. `scripts/figma-export.figma.js` per MCP (read-only) mit `EXPORT_PART` = primitives | semantic | typography | layout ausführen.
2. Ergebnis in die passenden `tokens/**/*.json` schreiben.
3. `npm run build`, Diff in `dist/` prüfen, `PLAN.md`/`docs/CHANGELOG.md` nachziehen.

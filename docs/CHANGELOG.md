# Changelog

Änderungen an Tokens, Foundations, Komponenten und Prototypen. Quelle der Gestaltung ist die Figma-Datei „SGLI – Design“.

## 2026-10-01 – Startseite, Links

- Neu: `prototype/startseite/` nach Figma „Startseite“ `2522:59485` (Desktop `2522:59486`, Phone `2522:59498`), responsiv mit Tablet-Zwischenstufe. Neun Module: hero-home, teaser-grid, teaser-stacked (Cut-Edges), teaser-event-list, teaser-search, teaser-timeline, image-fullwidth, teaser-slider, teaser-feature. `prototype/index.html` leitet auf die Startseite weiter.
- Scroll-gekoppelte Bewegungen in `prototype/shared/scroll-motion.js`: Hero-Grundriss und Hero-Bild wachsen mit dem Scrollen, Haftbuch-Collage fächert auf, Vollbild-Foto schwenkt, Ornament „Die Stiftung“ wächst, Timeline-Bildrahmen steigen in ihre Lage (`drift`, Startseite und Haftbuch). Hover-Zoom der Teaser-Bilder (110 %, 0,4 s) als Ausnahme von „Zustände nur Farbe“. Reduced Motion: Endlage.
- Logos in Seitenkopf, Menü (`shared/menu.js`) und Footer verlinken auf die Startseite. `haftbuch/haftbuch.js` übernimmt einen Suchbegriff aus `?q=` (Suchfeld der Startseite).
- Links: Links haben immer die Textfarbe ihrer Umgebung und sind unterstrichen, keine eigene Linkfarbe. Hover nur mit Maus: Unterstrich wird kräftiger (1 → 2 px), nie ein Farbwechsel. Klickbare Titel und Footer-Links bekommen beim Hover einen dünnen Unterstrich (1 px). Code: `src/styles/base.css` (`--link-underline`, `--link-underline-hover`, `--link-underline-offset`), `form.css`, Prototypen und `shared/menu.css`. Behoben: Buttons als Links (`<a class="btn btn--primary">`) verloren beim Hover ihr Label. Geprüft: alle 108 Buttons in den drei Prototypen ≥ 4,5:1 beim Hover.

## 2026-09-30 – Tokens, Kontraste, Section-Spacing, Cut-Edges

- Tokens: voller Abgleich aller vier Figma-Collections (Primitives 100, Semantic 58, Typography 41, Layout 5). Neu: `color/filter-cell/*` (bg-hover, bg-pressed, bg-active, fg-active, count-active, status) und `color/navigation-menu/*` (fg, border, border-hover, border-pressed, indicator). Lokale Ersatzwerte in `modal.css`, `prototype.css` und `menu.css` entfernt, `--color-filter-cell-status` für den aktiven Indikator.
- Kontraste je Modulfarbe: `toggle/track-off` surface-200/300/400 → neutral/500, secondary-400 → neutral/700; `interactive-secondary` surface-300/400 → secondary/700 (Hover secondary/800), secondary-400 → secondary/900 (Hover neutral/900); `feedback/error` surface-400 und secondary-400 → neutral/900. Lint: 233 Tokens, 0 Verstöße in allen 7 Kontexten.
- Bewusst nicht übernommen: Semantic `color/accent/highlight` (gleicher Pfad wie das Primitive). Font-Fallbacks (`sans-serif`, `ui-monospace`) nur im Repo.
- Neu `src/styles/section.css`: Jedes Modul liest `--section-pt`, `--section-pb`, `--section-px` (Standard von `:root`), die Regeln setzen sie am Modul. Module = direkte Kinder von `<main>` oder `.modules`, immer mit `data-context`. Regeln: gleiche Farbe hintereinander → oben ohne; Ausnahme nach `.section--hero-home`, `.section--hero-media`, `.section--bleed`, `.section--flush-y` → oben Standard; `.section--text` unten kompakt; `.section--bleed` rundum ohne; `.cut-edges` oben und unten kompakt; `.section--hero-media` und `.section--hero-text:has(.hero-back)` oben ohne. `.section--compact`, `--flush-y`, `--flush-x` setzen die Properties statt direkt `padding`. Styleguide-Abschnitt „Section-Spacing“ mit Live-Werten.
- Cut-Edges: letztes Modul in `<main>`/`.modules` ohne Keil unten. `.cut-edges--tilt` kippt um die linke obere Ecke, das rechte Ende fällt in die Endlage. Linear an die Scroll-Position gekoppelt (Parallax-Faktor `--cut-tilt-factor` 0.25, Beginn `--cut-tilt-offset` 30vh über dem unteren Rand), Keilhöhe über `cqw` (Modul ist Container). Styleguide mit Reglern für Start und Parallax-Faktor.
- `src/styles/context.css`: Voreinstellung der Modulfarbe in Craft ist surface-100.
- Prototypen: Seitenkopf scrollt heraus und kommt beim Hochscrollen zurück (`shared/header.js`, `header.css`). Slider in `shared/slider.js` (Ende ist Ende, Fokus wechselt vom deaktivierten Pfeil auf den anderen, Tab und Pfeiltasten schieben die Karte ins Bild). FAQ klappt animiert (`shared/faq.js`), mehrere Fragen offen. Ampel im Filter 1–3 / 4–8 / ab 9 als Konstante `AMPEL`.

## 2026-09-29 – Formulare, Modal, Motion, Fokus

- Neu `src/components/off-canvas/`: Panel mit Views (Formular → Bestätigung), Bestätigungsblock (CheckCircle 48 `feedback/success`). `off-canvas.js`: `data-offcanvas-open`, `SGLI.offcanvas.open/close/forceClose/showView`, Fokus auf den Titel, Fokus-Rückgabe, alle Schließwege mit Rückfrage über das Modal `modal-discard`, sobald Eingaben da sind. Scroll-Sperre per `html:has(dialog.offcanvas[open])`. Close-Button ohne Rahmen, Kopftitel fest 24 px.
- Neu `src/components/form/`: Abschnitte 32, Felder 24, Reihen ab 440 px Formularbreite zweispaltig, Anrede-Radios, Toggle-Abschnitte (aus = `inert` + `fieldset disabled`), Pflichtfeld-Hinweis, Einwilligung. `form.js`: Dirty-Tracking, Validierung mit eigenen Meldungen (`aria-invalid`, `aria-describedby`, Fokus aufs erste Fehlerfeld), Event `sgli:form-success`.
- Neu `src/components/modal/`: natives `<dialog>` + `showModal()`, `type = confirm | language`, `data-modal-open`, `SGLI.modal.open/close/confirm`, Escape und Backdrop = `cancel`.
- Neu `src/styles/motion.css`: Bewegung zeigt, woran eine Ebene hängt. Randflächen (Off-Canvas, Menü, Suche) kommen von ihrem Rand, Modal fällt kurz von oben (16 px), Änderungen vor Ort nur Farbe/Größe. Reihenfolge: abdunkeln → Fläche → Inhalt, schließen umgekehrt. `--motion-fast/base/slow` und `--ease-out` zentral.
- Neu `src/scripts/focus-modality.js`: setzt `<html data-focus-modality="keyboard|pointer">`. Bei Maus/Touch kein Fokusring, auch nicht bei programmatischem Fokus. Tastatur: Doppelring außen. Formularfelder bei Maus/Touch mit ruhigem 2-px-Rahmen.
- Input: Wert-Schrift mindestens 16 px (iOS zoomt sonst, `maximum-scale` wäre ein WCAG-Verstoß). Box exakt 48 px. Textarea nach Figma (Padding 8, Wert ab 27), Platzhalter im Fokus, Uhrzeit als `type="time"` mit Icon Clock. Globaler Fokusring am inneren `<input>` zurückgesetzt.
- Checkbox/Radio: Label Label-M, Box an der ersten Zeile, `.choice--caption` für Einwilligungstexte.
- Icons Clock und CheckCircle, Sprite jetzt 20 Icons.
- Cut-Edges: Restfläche neben dem Keil trägt die Fläche des Nachbarmoduls (automatisch über `data-context` der Geschwister, manuell per `--cut-before-bg` / `--cut-after-bg`). Keile als Verläufe statt `clip-path`, 1 px Überlappung gegen die Haarlinie.
- Prototypen: Menü-Overlay, Such-Overlay und Sprachauswahl in `prototype/shared/`, Kontaktformular im Off-Canvas in „angebote-filter“, Prototyp „haftbuch“, Footer mit Social-Icons.

## 2026-09-23 – Button: kein Hover auf Touch

- `button.css`: `:hover` für Primary, Secondary und Icon in `@media (hover: hover)`. Auf Touch blieb der Hover-Zustand nach dem Tippen kleben. `.is-hover`-Vorschau bleibt aktiv.
- Behoben: `.btn:disabled:hover` färbte disabled Secondary/Icon-Buttons bei Hover. Hover und Pressed schließen Disabled per `:not()` aus.

## 2026-09-12 – Chip-Badge-Höhe

- `chip.css`: `.chip__badge` hat eine feste, aus `--chip-min-h` abgeleitete Höhe statt vertikalem Padding. Chips mit Badge waren ab Desktop höher als Chips ohne.

## 2026-09-10 – Core Components

- `src/components/button` (Primary, Secondary, Icon; Größe ab lg), `input` (fünf Feldtypen, schwebendes Label, Error, Disabled), `toggle` (role=switch), `checkbox` (Checkbox + Radio), `chip` (aria-pressed, Badge, Icon), `tag`.
- `src/components/index.css` bündelt alle Komponenten. `docs/components.html` bettet die Vorschauen ein, jede Vorschau zeigt alle 7 Kontexte.

## 2026-09-10 – Foundations

- Tokens als DTCG-JSON aus Figma: Primitives, Semantic (Default + 6 Kontexte), Typography (Font, Größen je Breakpoint, LH/LS aus Text Styles, 13 Composite-Styles), Layout (Section-Spacing, Breakpoints, Grid).
- Build mit Style Dictionary 4: `dist/css/{tokens,contexts,typography,layout,text-styles,index}.css`, `dist/json/tokens.flat.json`. Lint mit WCAG-Kontrastmatrix je Kontext.
- Foundations-CSS: fonts, reset, base, context, grid, section, focus, icon, cut-edges.
- Fonts self-hosted: Switzer 400/600 (+ Italic), IBM Plex Mono 500. Icons als SVG + Sprite.
- Styleguide `docs/index.html`, Mapping `docs/FIGMA-MAPPING.md`.

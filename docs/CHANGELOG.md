# Changelog

## 2026-09-29 – Cut-Edge kippt beim Scrollen

- Cut-Edges (Foundation): neuer Modifier `.cut-edges--tilt` für den oberen Keil. Die Diagonale dreht sich beim Runterscrollen um ihren tiefsten Punkt unten rechts von 60 % der Keilhöhe (≈ 6,7°) in die Figma-Endlage (≈ 11°), an den Scroll gekoppelt (Scroll-Driven Animation, Bereich: Oberkante 10 vh → 60 vh über dem unteren Rand), rückwärts beim Hochscrollen. Der Keil bleibt ein Dreieck, der Streifen behält seine Höhe. Start per `--cut-tilt-start` einstellbar. Firefox (keine Scroll-Driven Animations) und „Bewegung reduzieren“: Endlage.
- Motion: neue Kurve `--ease-scroll` (weich rein, weich aus) für an den Scroll gekoppelte Bewegung.
- Doku: Demo mit Regler für den Startwert. Prototyp „angebote-filter“: erster Keil (text-content-grid) kippt.

## 2026-09-29 – Bildung: Module unter der Liste nach Figma

- Prototyp „angebote-filter“ gegen die neue Section Bildung (`2522:59510`, Desktop `2522:59511`, Phone `2522:59552`) abgeglichen: text-content-grid, image-text-single, contact-section, teaser-slider, faq-section, teaser-feature, Footer. Details und offene Figma-Punkte in `prototype/angebote-filter/README.md`.
- Modulbilder mit `height: auto`, sonst gewinnt das `height`-Attribut gegen `aspect-ratio` (Bilder waren hochkant oder zu hoch).
- Cut-Edges (Foundation): Die Restfläche neben dem Keil trägt jetzt die Fläche des Nachbarmoduls (before → Modul davor, after → Modul danach), vorher schien der Seitenhintergrund durch. Erkennung automatisch über `data-context` der Geschwister (`+` / `:has(+ …)`), manuell per `--cut-before-bg` / `--cut-after-bg`. Keile deshalb als Verläufe mit geglätteter harter Kante statt `clip-path`, unabhängig von der Modulhöhe. Keil und Fläche überlappen 1 px, keine Haarlinie mehr an der Kante. Overlap-Variante bleibt durchsichtig.
- Footer in beiden Prototypen (angebote-filter, haftbuch) nach Figma: Social-Icons, „Newsletter“, Phone mit Logo 160 × 49 und 44-px-Zeilen für Links, Social und Meta-Links. Icons liegen jetzt auch in `prototype/shared/assets/`.

## 2026-09-29 – Fokus nur auf Wunsch, Feinschliff Modal, Menü, Timeline

- Fokus (Foundation): Bei Maus/Touch zeigt nichts mehr einen Fokusring, auch nicht, wenn ein Script den Fokus setzt (Menü/Modal öffnen → „Schließen“ bzw. aktuelle Option) oder Safari/Firefox `:focus-visible` von sich aus setzen. `focus.css` blendet den Ring bei `data-focus-modality="pointer"` aus, Komponenten mit Ring am Nachbarelement (Toggle, Checkbox/Radio, filter-cell, nav-cell) tragen `:root:not([data-focus-modality="pointer"])`. `focus-modality.js`: Pfeile, Home/End, Bild↑/↓ zählen als Tastatur (außer in Textfeldern/Selects). Script jetzt auf allen Seiten (Doku, alle Komponenten-Vorschauen). Tastatur unverändert: Doppelring außen.
- Input: Wert-Schrift mindestens 16 px (Phone vorher Label-M 15 px). iOS zoomt beim Antippen in Felder unter 16 px. Zoom per `maximum-scale` abzuschalten wäre ein WCAG-Verstoß (1.4.4, sperrt auf Android das Pinch-Zoom). Zeilenhöhe bleibt, Feld bleibt 48 px.
- Modal nach Figma: Abstand Kopf → Inhalt 40 (confirm auf allen Breakpoints, language ab lg), language Phone 24. Vorher 32 bzw. 24.
- Menü (nav-cell): aktuelle Seite mit normaler Linie `navigation-menu/border` statt dunkler Linie (dunkel nur bei Hover/Fokus, Figma current / active), Phone 16 zwischen Quadrat und Label.
- Off-Canvas: Close-Button ohne Rahmen (`.offcanvas__close`), einheitlich mit Modal und Menü. Die ganze Fläche schließt rechts bündig mit Trennlinie und Inhalt ab (auch der Hover), das X sitzt oben auf Höhe des Kickers (im Fluss, nicht absolut). Figma section-header off-canvas `2613:27966` zeigt noch den Rahmen.
- Prototyp „haftbuch“: Teaser-Timeline Phone zeigt das Bildpaar wieder nebeneinander (208 × 277 + 127 × 170). Vorher hielt das Honecker-Bild seine natürliche Breite als Minimum (`min-width: auto`) und drückte das Mauerfall-Bild auf 0. „Filter zurücksetzen“ setzt den Fokus bei Touch/Maus auf die Bereichsüberschrift statt ins Suchfeld (öffnete auf dem Phone die Tastatur), bei Tastatur weiter ins Suchfeld.

## 2026-09-29 – Formulare im Off-Canvas (Kontakt, Anmeldung, Bestätigung)

- Neu `src/components/off-canvas/` (CSS, JS, Vorschau, README): Panel aus dem Prototyp zur Komponente gemacht, dazu Views (Formular → Bestätigung), Bestätigungsblock (CheckCircle 48 `feedback/success`), `.offcanvas__foot--center`. `off-canvas.js`: `data-offcanvas-open`, `SGLI.offcanvas.open/close/forceClose/showView`, Fokus auf den Titel, Fokus-Rückgabe, alle Schließwege (Close, Abbrechen, Escape, Backdrop) mit Rückfrage über das Modal `modal-discard`, sobald Eingaben da sind. Scroll-Sperre per `html:has(dialog.offcanvas[open])`. Figma: Forms `2746:24535`.
- Neu `src/components/form/` (CSS, JS, Vorschau, README): Abschnitte 32, Felder 24, Reihen ab 440 px Formularbreite zweispaltig (Gap 16), Anrede-Radios, Toggle-Abschnitte (aufklappend, aus = `inert` + `fieldset disabled`), Pflichtfeld-Hinweis, Einwilligung. `form.js`: Dirty-Tracking, Validierung beim Absenden mit eigenen Meldungen (Error-State, `aria-invalid`, `aria-describedby`, Fokus aufs erste Fehlerfeld), Event `sgli:form-success`, nativer Picker für Datum/Uhrzeit.
- Checkbox/Radio: Label **Label-M** statt Caption (Figma), Box oben an der ersten Zeile (`align-items: flex-start`, `1lh`), neu `.choice--caption` für Einwilligungstexte.
- Input: Textarea nach Figma (Padding 8 rundum, Label 8 von außen, Wert ab 27). Ein echter Platzhalter erscheint im Fokus in `text/secondary` (Figma State Focused). Uhrzeit = `type="time"` mit `.field--date` und Icon Clock.
- Icons Clock und CheckCircle aus dem Figma-Icon-Frame (`1583:1135`, `1583:1160`), Sprite jetzt 20 Icons.
- Off-Canvas-Kopf: Titel fest 24 px (Figma-Instanz section-header Breakpoint=Phone in allen Panels, wie Modal). Im Filter vorher H3-Token.
- Prototyp „angebote-filter“: „Zum Kontaktformular“ (contact-section) und „Kontakt“ (faq-section) öffnen das Kontaktformular im Off-Canvas, nach dem Absenden die Bestätigung. Panel-CSS kommt aus der Komponente, `prototype.css` behält nur die filter-cell-Fallbacks. Filter unverändert (eigenes Script, keine Rückfrage).

## 2026-09-29 – Such-Overlay im Prototyp

- `prototype/shared/search.css` + `search.js`: Such-Overlay nach Figma `search-overlay` (2872:4913), in beiden Prototypen über die Lupe im Seitenkopf. Motion wie Menü (`motion.css`).
- Lupe im Menü-Kopf wechselt zur Suche (entschieden mit Danilo): `SGLI.menu.handoff()` in `menu.js`, das Menü zieht sich zur Suche zusammen, Kopf bleibt pixelgenau stehen, eine Ebene.
- „Häufig gesucht“ = redaktionell in Craft gepflegte Links ohne Zähler, als Button/Secondary statt Chips (entschieden mit Danilo: Chips nur zum Filtern). Figma-Komponente und Doku „Suche“ angepasst.

## 2026-09-29 – Motion vereinheitlicht, Such-Overlay als Spec

- Neu `src/styles/motion.css` (Foundation, noch keine Figma-Variablen). Regel: Bewegung zeigt, woran eine Ebene hängt. Randflächen (Off-Canvas, Menü, Suche) kommen von ihrem Rand, zentrierte Dialoge (Modal) fallen nur kurz von oben, Änderungen vor Ort nur Farbe/Größe. Reihenfolge immer: abdunkeln → Fläche → Inhalt, schließen umgekehrt, Abdunkelung zuletzt. Master der Ebenen-Werte ist das Menü (Kurven, 320 / 240 / 520 / 680 ms).
- `--motion-fast/base/slow` und `--ease-out` kommen jetzt aus `motion.css`, die Kopien in `prototype.css` und `haftbuch.css` sind entfernt (Werte unverändert).
- Menü (`prototype/shared/menu.css`) liest Kurven und Flächenzeiten aus `motion.css`, optisch unverändert.
- Off-Canvas (Prototyp „angebote-filter“) nach dem Menü: erst abdunkeln, Panel startet nach 240 ms (520 ms, Flächenkurve). Schließen: Panel 680 ms, Abdunkelung zuletzt (ab 580 ms, gesamt 900 ms). Vorher liefen beide gleichzeitig 480 ms.
- Modal: kurzer Fall von oben (16 px) statt 8 px nach oben. Öffnen: abdunkeln, Dialog nach 120 ms in 300 ms. Schließen: Dialog hebt sich in 200 ms, Abdunkelung zuletzt. Figma-Doku „Modal“ um die Bewegung ergänzt.
- Figma (Freigabe von Danilo, keine Variablen angelegt): Komponenten-Set `search-overlay` `2872:4913` im Rahmen „Search Overlay“ `2872:4778` auf 🗄️ Modules, `Breakpoint = Desktop | Phone`, Prop `Show Suggestions`. Kopf wie Menü-Overlay (Schließen statt Menü), Suchfeld wie der Kopf der Ergebnisseite, optional „Häufig gesucht“ mit Chips. Doku-Frame „Suche“ `2873:1631` auf 🎨 Foundations (Aufbau, Verhalten, Bewegung). Noch nicht im Code.

## 2026-09-29 – Modal (Rückfrage + Sprachauswahl)

- Figma (Schreibfreigabe von Danilo nur für diesen Fall, keine Variablen angelegt): Komponenten-Set `modal` `2859:132` auf 💎 Components, `type = confirm | language` × `Breakpoint = Desktop | Phone`, Props `Text` und `Show Kicker`. Close-Button ohne Rahmen (Override wie im Menü). Doku-Frame „Modal“ `2860:1449` auf 🎨 Foundations.
- Neu `src/components/modal/` (CSS, JS, Vorschau, README): natives `<dialog>` + `showModal()`, `data-modal-open`, `SGLI.modal.open/close/confirm`, Fokus auf `[autofocus]` bzw. aktuelle Sprache, Fokus-Rückgabe, Scroll-Sperre, Escape und Backdrop = `cancel`. In `src/components/index.css` gebündelt, Sektion in `docs/components.html`.
- Prototypen: `prototype/shared/language.js` baut die Sprachauswahl (Deutsch vorausgewählt, English, Español). Sprach-Button im Seitenkopf beider Prototypen und im Menü-Overlay öffnet sie. Dummy: jede Option schließt nur.

## 2026-09-29 – Input: Fokus nach Bedienart, Höhe

- Neu `src/scripts/focus-modality.js`: setzt `<html data-focus-modality="keyboard|pointer">` (Tab → keyboard, pointerdown → pointer; normales Tippen ändert nichts). Einbinden auf jeder Seite mit Formularfeldern.
- `input.css`, Fokus in zwei Stufen (entschieden mit Danilo): **Tastatur** und Fallback ohne JS = Doppelring **außen** um die Box wie bei Buttons und Chips (2 px `focus-inner` am Rahmen, darum 4 px `focus-outer`), die Innenfläche bleibt voll. **Maus/Touch** = kein Ring, Rahmen 2 px in `focus-outer` (1 px Rahmen + 1 px Inset-Schatten), Error bleibt rot. Grund: Browser setzen `:focus-visible` bei Textfeldern auch nach Klick, der Doppelring wirkte dort zu laut. WCAG 2.4.7 verlangt den deutlichen Indikator nur für die Tastatur.
- **Figma nachziehen:** Input-Sets Focused / Focused Filled zeigen den Ring innen (z. B. `1658:6496`) → außen. Neue Variante für den Maus-Fokus (2-px-Rahmen) anlegen.
- Nebenbefund behoben: Das `<input>`/`<select>` in der Box bekam zusätzlich den globalen `:focus-visible`-Ring aus `focus.css` (heller Innenrahmen um das Eingabefeld, aufgefallen im Prototyp „Haftbuch“). `.field__input:focus-visible` setzt ihn zurück, den Ring zeigt nur die Box.
- Nebenbefund behoben: Die Box war 50 statt 48 px hoch, weil die Input-Paddings den 1-px-Rahmen nicht einrechneten. Paddings leer 13/14 (vorher 14/15), gefüllt 22/5 (vorher 23/6), Label-Top 5 innen = 6 von außen. Gilt für Text, Search, Date und Select. Textarea unverändert bis auf das um 1 px höhere schwebende Label.

## 2026-09-23 – Button: kein Hover auf Touch

- `button.css`: `:hover` für Primary, Secondary und Icon liegt jetzt in `@media (hover: hover)`. Auf Touch blieb der Hover-Zustand nach dem Tippen kleben, bis woanders getippt wurde (gleiches Muster wie `filter-cell` im Prototyp). `.is-hover`-Vorschau bleibt überall aktiv.
- Nebenbefund behoben: die Disabled-Reset-Regel `.btn:disabled:hover` überstimmte per Spezifität die Variantenregeln und färbte disabled Secondary/Icon-Buttons bei Hover mit `button/primary/bg`. Hover und Pressed schließen Disabled jetzt direkt per `:not()` aus, der Reset-Block entfällt.

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

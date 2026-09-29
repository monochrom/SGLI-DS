# Prototyp „Bildung“ – Filter- und Tag-System

Gekapselter Klick-Prototyp für die Abstimmung mit dem Kunden. Quelle: Figma „SGLI – Design“, Section **Bildung** (`2522:59510`, vorher `2548:24966`; Desktop `2522:59511`, Phone `2522:59552`) mit den Frames „Bildung - Filter Default / Zielgruppe / Detail“, „Bildung - Mobile“, „Regeln für Filter“ und „Dynamische Ausgabe von Tags“.

Der Prototyp liegt **nur** in `prototype/angebote-filter/`. Er liest Tokens, Foundations und Core Components aus `../../src` und `../../dist`, ändert dort aber nichts.

## Starten

```
npm run docs          # im Repo-Root, Server auf http://localhost:4321
open http://localhost:4321/prototype/angebote-filter/
```

Ein Server ist nötig, weil die Icons aus dem SVG-Sprite (`dist/icons/sprite.svg`) per `<use href>` geladen werden. Demo-Link mit vorgewählter Zielgruppe: `…/prototype/angebote-filter/?zielgruppe=Schulen`.

## Dateien

| Datei | Inhalt |
|---|---|
| `KUNDENABSTIMMUNG-FILTER.md` | Checkliste für das Kundengespräch und optimierte Filterliste je Zielgruppe (Stand 2026-09-11, noch nicht im Prototyp umgesetzt) |
| `SPEC-FILTER.md` | Spezifikation für den Developer: Datenmodell, URL-Zustand, Ampel, Chips, Off-Canvas, Tag-Slots, offene Punkte |
| `index.html` | Template „Bildung“: navigation, hero-default, education-filter + list-item-education, text-content-grid (cut-edges, primary-900), image-text-single, contact-section, teaser-slider, faq-section, teaser-feature, footer, Off-Canvas Filter und Kontakt als natives `<dialog>`, Rückfrage-Modal |
| `prototype.css` | Modul-CSS des Prototypen (BEM, nur Tokens, mobile first: Phone → md 768 → lg 1024), inkl. filter-cell. Das Panel selbst kommt seit 2026-09-29 aus `src/components/off-canvas/` |
| `filter.js` | Filter-Logik, Tag-Slots, Off-Canvas (`showModal`), „Weitere laden“, Slider-Pfeile (Vanilla JS) |
| `data.js` | 47 Dummy-Angebote mit allen Filter-Attributen (erfunden, Titel an Figma angelehnt) |
| `../shared/assets/` | Social-Icons Instagram, Facebook, LinkedIn für den Footer (Kopie aus `haftbuch/assets/icons`, als Maske mit `currentColor`) |
| `assets/img/` | Logo (SVG, Farbe über `currentColor`) und Bilder aus Figma, verkleinert auf 1200 px |

## Umgesetzte Regeln

**Ampel für Detailfilter** (Bezugsgröße: Angebote der gewählten Zielgruppe)

| Angebote | Detailfilter |
|---|---|
| unter 9 | keine |
| 9 bis 20 | Thema, Dauer |
| über 20 | Klassenstufe, Thema, Format, Förderbedarf, Dauer, Sprache |

Dummy-Daten so verteilt, dass alle drei Stufen vorkommen: Schulen 29 · Erwachsenenbildung 15 · Hochschulen 13 · Aus- und Weiterbildung 9 · Inklusion 7.

**Tags in der Liste** (3 Slots, Slot 3 immer Dauer; Lesart B, entschieden 2026-09-11)

| Filterschritt | Slot 1 + 2 |
|---|---|
| ungefiltert | Zielgruppen (max 2, Rest `+N`) |
| Zielgruppe gewählt | Thema (max 2) |
| Zielgruppe + Detailfilter | Klassenstufe (nur Schulen), sonst Thema, sonst Format (max 2) · Barrierefreiheit, sonst Sprache („Auch auf Englisch“) |

Das Attribut, nach dem gerade gefiltert wird, wird als Tag übersprungen, weil es bei allen Treffern gleich wäre. Beispiel: Filter Klassenstufe = Oberstufe zeigt Thema · Sprache statt Klassenstufe · Sprache.

**Chips**

- Zielgruppe: Klick setzt den Filter (Chip aktiv mit X), erneuter Klick auf das X entfernt ihn. Einfachauswahl.
- Detailfilter mit Chevron: Klick öffnet das Off-Canvas (Figma `2613:31418`). Desktop: Panel rechts, 520 px, volle Höhe, Divider links. Phone: Bottom Sheet von unten, maximal 85 % der Viewporthöhe. Hintergrund `color/bg/card`, Backdrop `neutral/alpha/900-40`. Gesetzter Wert erscheint als Badge im Chip. Der Chip ist dann geteilt: Klick auf Label oder Badge öffnet das Off-Canvas erneut zum Ändern, Klick auf das X entfernt den Wert (entschieden 2026-09-11).

**Off-Canvas** (umgesetzt 2026-09-22 nach der Figma-Doku)

- Natives `<dialog>` mit `showModal()`: Top-Layer, Escape, Fokus-Trap und inerter Hintergrund kommen vom Browser. Schließen über Close-Button, Escape, Backdrop-Klick und „N Angebote anzeigen“ (alle über `<form method="dialog">` bzw. das `close`-Event). Fokus geht beim Öffnen auf den Titel (`h2` mit `tabindex="-1"`, ohne Fokusring), beim Schließen zurück zum auslösenden Chip. Entschieden 2026-09-23, vorher auf die gewählte bzw. erste aktive Option: Safari und Firefox setzen bei programmatischem `focus()` `:focus-visible`, auf Touch erschien dadurch der Fokusring auf der Zelle und das Sheet scrollte dorthin. Der Titel ist nicht interaktiv, Screenreader lesen Kicker und Titel, Tab führt zum Close-Button und weiter zu den Optionen.
- Hover-Zustände (filter-cell, geteilte Chips, Reset-Link, Listentitel, Footer-Links) liegen in `@media (hover: hover)`. Auf Touch bleibt `:hover` nach dem Tippen am Element kleben, bis woanders getippt wird; eine abgewählte Zelle sähe sonst aus wie gehovert. Die Core Components in `src/components/` nutzen noch `:hover` ohne Media Query (offen, siehe Abschnitt Annahmen).
- Kopf = section-header (Variante Phone/off-canvas): Kicker „Genauer filtern“ (Label-S), Titel = Filtername (H3), Close (Button/Icon). Nur der Body scrollt, Kopf und Fuß bleiben stehen. Hintergrund ist gesperrt (`body:has(dialog[open])`), `scrollbar-gutter: stable` gegen den Layout-Sprung.
- Optionen als **filter-cell** (Figma `2646:40456`): Zeile 52 px mit Indikator 12 × 12, Label-M, Trefferzahl (Caption) rechts, Divider unten. States hover / pressed / on / focused / disabled. Einfachauswahl (Radio), obwohl der Indikator quadratisch ist, siehe Annahme 8.
- Fuß: Primary „N Angebote anzeigen“, Secondary „Auswahl löschen“ (immer sichtbar, ohne Wert `disabled`). Phone gestapelt in voller Breite, Desktop nebeneinander.
- Slide-in mit `@starting-style` (Phone von unten, Desktop von rechts, `--motion-slow` 480 ms, Backdrop blendet in derselben Zeit), ohne bei `prefers-reduced-motion`. 260 ms war zu schnell für ein Panel, das den ganzen Viewport quert (entschieden 2026-09-23). Browser ohne `@starting-style` zeigen den Dialog ohne Animation.
- Auswahl wirkt sofort (Liste dahinter aktualisiert sich). Bei Auswahl wird die Optionsliste nicht neu gebaut, nur Zahlen und Buttons, damit der Tastaturfokus auf der Option bleibt.
- Erneuter Klick auf die gewählte Option hebt die Auswahl auf (entschieden 2026-09-23). Tastatur: Leertaste und Enter wählen und wählen ab, Pfeiltasten wechseln die Option. Enter schließt den Dialog nicht.
- „Filter zurücksetzen“ erscheint, sobald ein Filter gesetzt ist. Zähler-Tag zeigt die Trefferzahl (`aria-live`).
- Liste zeigt 10 Angebote, „Weitere Angebote laden“ holt die nächsten 10.

**Kontaktformular im Off-Canvas** (2026-09-29)

- „Zum Kontaktformular“ (contact-section) und „Kontakt“ (faq-section) öffnen das Kontakt-Panel (Figma Forms `2746:24535`, Kontakt `2746:26620` / `2753:30067`). Komponenten `off-canvas` und `form` aus `src/components/`, gesteuert von `off-canvas.js` und `form.js`.
- Absenden ohne Netzwerk: Pflichtfelder werden geprüft (Fehler am Feld, Fokus aufs erste), danach zeigt dasselbe Panel die Bestätigung „Vielen Dank“. Das nächste Öffnen beginnt leer.
- Mit Eingaben fragt jeder Schließweg (Close, Abbrechen, Escape, Backdrop) zuerst mit dem Modal „Eingaben verwerfen?“. Der Filter schließt weiter ohne Rückfrage.
- Anmeldung und Bestätigung sind im Styleguide (`src/components/off-canvas/off-canvas.html`), im Prototyp nur Kontakt (entschieden 2026-09-23).
- Seit 2026-09-29 gilt für Panel und Motion die Komponente: Kopftitel fest 24 px (wie Figma-Instanz Phone/off-canvas), Scroll-Sperre `html:has(dialog.offcanvas[open])`, Motion wie Menü (`motion.css`). Die Absätze oben zu 480 ms und `body:has(…)` sind damit überholt.

**Motion** (2026-09-23)

- Prototyp-lokale Werte in `prototype.css`: `--motion-fast` 160 ms (Farbe, Opazität), `--motion-base` 260 ms (Größe, Chip-Slots, Häkchen), `--motion-slow` 480 ms (Detailfilter-Zeile, Off-Canvas, Backdrop), `--ease-out`. Kandidaten für Tokens in Figma und `tokens/`. Reduced Motion greift global über `reset.css`.
- Chips werden einmal gebaut und danach nur im Zustand aktualisiert (kein `innerHTML` bei jedem Klick), sonst könnte keine Transition abspielen. Badge, Icon und X-Button sitzen in Slots, die per `grid-template-columns` 0fr ↔ 1fr wachsen und schrumpfen, mit Fade. Geschlossene Slots sind `visibility: hidden`, der X-Button zusätzlich `tabindex="-1"` und `aria-hidden`.
- Der Detailfilter-Chip hat immer die geteilte Struktur (Label, Badge-Slot, Caret-Slot, X-Slot); inaktiv sieht er aus wie ein einfacher Chip mit Caret.
- Ergebnisliste: Crossfade beim Filterwechsel (abblenden, nach `--motion-fast` neu bauen, einblenden). „Weitere laden“ baut sofort, damit der Fokus auf das erste neue Angebot springen kann.
- filter-cell: Farbwechsel weich, der Indikator rastet beim Anwählen mit kleinem Überschwinger ein.
- Detailfilter-Zeile klappt auf und zu (entschieden 2026-09-23, vorher nur Fade bei sofortigem Höhensprung): Wrapper `.edu-filter__collapse` mit `grid-template-rows` 0fr ↔ 1fr über `--motion-slow`, der Inhalt blendet in der zweiten Hälfte ein. Der Abstand zur Zielgruppen-Zeile liegt als `padding-top` auf der inneren `__row` statt als `gap` auf `__content`, damit er zu nicht stehen bleibt (ein Grid-Gap bleibt bei 0fr-Track erhalten, ein negativer `margin-top` verkleinert den Track nicht). Zu = `visibility: hidden` statt `hidden`, sonst kann nichts animieren. `overflow: hidden` liegt nur zu und während der Bewegung (`is-animating`, JS entfernt sie nach `transitionend`), damit der Fokusring der Chips offen nicht beschnitten wird. „Filter zurücksetzen“ blendet ein und aus (`is-hidden` mit `visibility`).

## Annahmen

Bestätigt am 2026-09-11: 1, 2, 3, 6. Entschieden: 4 (geteilter Chip), 5 (Lesart B).

1. **Ohne Zielgruppe keine Detailfilter.** Figma „Filter Default“ zeigt bei 47 Angeboten nur die Zielgruppen-Zeile, obwohl die Ampel bei über 20 alle Detailfilter vorsähe. Umgesetzt wie in Figma.
2. **Ampel-Bezugsgröße** ist die Trefferzahl der Zielgruppe, nicht die aktuell gefilterte Zahl. Sonst würde ein gesetzter Detailfilter (z. B. Thema → 7 Treffer) seine eigene Zeile ausblenden. Gesetzte Detailfilter bleiben immer sichtbar.
3. **Zielgruppe ist Einfachauswahl**, Detailfilter je ein Wert. In Figma ist immer nur ein Chip aktiv.
4. ~~Klick auf einen aktiven Detail-Chip entfernt den Wert.~~ **Entschieden 2026-09-11: geteilter Chip.** Label öffnet das Off-Canvas erneut, X entfernt.
5. ~~Tag-Slots hängen an der Ampel-Stufe.~~ **Entschieden 2026-09-11: Lesart B.** Die gesetzten Filter entscheiden. Erst nach einem Detailfilter wechseln die Tags auf Klassenstufe und Barrierefreiheit/Sprache; das gefilterte Attribut wird übersprungen.
6. ~~**Off-Canvas-Inhalt** ist laut Briefing leer erlaubt. Radio-Liste als Platzhalter.~~ **Umgesetzt 2026-09-22** nach der Figma-Doku Off-Canvas (`2613:31418`) mit filter-cell (`2646:40456`). Trefferzahl je Option ist in Figma vorgesehen.
7. Öffnungszeiten in der Navigation nutzen IBM Plex Mono **Medium** (Figma: Regular, nicht im Repo geladen). Teaser-Slider hat nur Vor/Zurück, kein Autoplay. Navigation vom Haftbuch übernommen (2026-09-29): Phone nur Logo + Menü, ab 768 drei Icons (Sprache, Leichte Sprache, Suche), ab 1024 zusätzlich die Öffnungszeit.
8. **filter-cell** (entschieden 2026-09-22): Einfachauswahl bleibt, obwohl der Indikator in Figma quadratisch ist (Checkbox-Optik). Der aktive Indikator ist in Figma hartkodiert #CDDC39 (kein Token); der Prototyp nutzt `color/accent/highlight`. Die Tokens `color/filter-cell/bg-hover|bg-pressed|bg-active|fg-active` gibt es in Figma (Semantic), aber noch nicht in `tokens/`; sie stehen als lokale Fallbacks in `prototype.css`. Fokusring: Figma zeigt nur den äußeren 4-px-Ring, der im Zustand On unsichtbar wäre (primary-900 auf primary-900); der Prototyp ergänzt den inneren Ring aus `focus.css`.
9. **Hover nur bei `(hover: hover)`** (entschieden 2026-09-23): Im Prototyp umgesetzt. Offen für das Design System: `button.css`, `chip.css` und `base.css` (Links) nutzen noch `:hover` ohne Media Query. Empfehlung: dort genauso umstellen, die `.is-hover`-Klassen für den Styleguide bleiben davon unberührt.

## Module unter der Liste: Abgleich mit Figma (2026-09-29)

Abgeglichen mit Desktop `2522:59511` und Phone `2522:59552`. Behoben:

- **Bilder** (image-section, image-text, teaser-card, teaser-feature): `height: auto`. Das `height`-Attribut am `img` schlug `aspect-ratio`, die Bilder waren dadurch hochkant (Bild + Text, Phone überall) bzw. zu hoch (Feature 675 statt 483).
- **text-content-grid**: Padding y compact (Desktop 64 statt 112), alle Blöcke mit Gap 80, Kopf 6 von 12 Spalten (vorher 660 px), Label + H2 Gap 16, Intro Gap 24. Spalten-Texte der dritten Zeile Body/M statt Body/S, Phone Spalten-Gap 40.
- **Bild + Text**: Bild 4:3, Phone Gap 40 und Text ohne Innenabstand.
- **Kontakt**: Kicker „Kontakt“ wurde vom Intro-Selektor als H6 mitgestylt (größer, fett), jetzt eigene Klasse `.contact__text`. Zwei gleiche Spalten mit Gap 64 (vorher 12er-Raster), H2 → Text 16, Adresse → Button 48, Phone Karte Padding 16, Gap 48. E-Mail in text/primary statt Link-Farbe.
- **Teaser-Slider**: erste Karte bündig mit dem Kopf (vorher sprang die Spur per Scroll-Snap an den Rand, dadurch war auch „Zurück“ nicht deaktiviert). Karten oben bündig (Grid verteilte die Resthöhe), Abstände 80/64 exakt. Phone: Karten 260 breit, Bild 321:241, Kopf Gap 24, keine Pfeile.
- **FAQ** (Aufbau wie haftbuch): Kicker „Ihr Besuch“ wurde wie beim Kontakt mitgestylt (`.faq__text`). Kein Divider oben, Frage ohne eigenes Padding, Liste Gap 16, Antwort 16 unter der Frage, Button 40 unter dem Text, Padding unten 0 (teaser-feature folgt in derselben Fläche).
- **Teaser-Feature**: Phone Bild oben über die volle Kartenbreite, Text darunter (x 16, unten 32), Deko darf oben über die Karte ragen. Deko auf beiden Breiten 71 % der Bildbreite, mittig, leicht nach rechts.
- **Footer**: Aufbau aus Figma (wie haftbuch) mit Social-Icons und „Newsletter“, Divider innerhalb der Ränder statt randlos. Phone: Logo 160 × 49, Link- und Meta-Zeilen 44 hoch (Touch-Ziel), Social-Icons Gap 24, Meta-Links in text/secondary.
- **Cut-Edges** (Foundation `src/styles/cut-edges.css`): Die Fläche neben dem unteren Keil ist jetzt das Beige von image-text (surface-300), oben die Fläche der Liste (surface-100), vorher Seitenhintergrund. Dazu 1 px Überlappung zwischen Keil und Fläche gegen die Haarlinie.

## Offene Punkte an Figma (Bildung-Template, Stand 2026-09-29)

1. image-text-single Desktop: Textspalte ist so hoch wie das Bild und schneidet ab (`overflow: clip`, Inhalt mittig). Kicker „Gruppen“ und das Ende von „Beratung und Kontakt“ sind dadurch unsichtbar. Der Prototyp zeigt den ganzen Text, die Sektion wird dadurch höher (827 statt 725).
2. text-content-grid Phone: Padding y zeigt 112 (Desktop-Wert, Mode fehlt). Der Prototyp nutzt wie Desktop `section-spacing/y/compact` (Phone 32). text-row Phone ist 350 statt 343 breit.
3. faq-section Phone: anderer Kicker und Titel („Fragen & Antworten“ / „Gut zu wissen vor Ihrem Besuch“), Intro-Text und Kontakt-Button fehlen, obwohl `Show Description=true`. Frage in H6 statt H5. Der Prototyp nutzt auf allen Breiten den Desktop-Inhalt.
4. teaser-slider Phone: dritte Karte ist eine `teaser-card-box` („Für Hochschulen“, „BUTTON LABEL“), die auf Desktop fehlt. Der Prototyp zeigt nur Projektkarten.
5. Button/Secondary hat eine 44-px-Trefffläche (hit-visual 34), die Core Component ist 34 hoch. Dadurch sind Slider- und Feature-Sektion im Prototyp 10 px niedriger.

## Offene Punkte an Figma (Off-Canvas-Doku `2613:31418`, Stand 2026-09-22)

1. Frame „Spacing-Tokens“ (`2640:26526`) enthält nur den kopierten Text aus „Allgemein“ plus verschachtelte Geisterframes „Typo“ und „Komponenten“, keine Spacing-Werte. Vorschlag: Panel-Padding 24 (Desktop) / 0 (Phone), Header-Padding 24 16 16 (Phone), Gap Header→Body 48 / 24, filter-cell 16 / 8, Footer-Padding 24, Button-Gap 16 / 12.
2. Frame „Responsive-Verhalten“ (`2640:26547`) ist ebenfalls eine Kopie von „Allgemein“. Es fehlt: Desktop rechtes Panel 520 px volle Höhe mit Divider links, Phone Bottom Sheet 85 %, Umschaltpunkt (im Prototyp lg 1024), Buttons gestapelt.
3. „Allgemein“ Punkt 2 („am unteren Viewport-Rand, max 85 %“) gilt nur für Phone; die Usage Notes sagen das korrekt.
4. Backdrop-Klick widersprüchlich: „Allgemein“ nur ohne Datenverlust, Usage Notes „immer“. Vorschlag: Backdrop schließt immer, bei Formularen mit Eingaben vorher Rückfrage. Der Filter schließt ohne Einschränkung.
5. filter-cell Indikator „On“ hartkodiert #CDDC39, an keine Variable gebunden, in keiner Palette. Vorschlag: Token `color/filter-cell/indicator-active` anlegen (accent/highlight oder neutral/0).
6. section-header `Breakpoint=Desktop, type=off-canvas` (`2613:27966`) existiert, wird aber in keiner Preview genutzt (alle nutzen Phone/off-canvas, wie die Usage Notes fordern). Löschen oder die Phone-Variante breakpoint-los benennen.
7. Quadratischer Indikator bei Einfachauswahl. Entweder runder Indikator oder in der Doku explizit „Einfachauswahl trotz Quadrat“ vermerken.
8. Bestätigungs-Off-Canvas: Sticky Action Footer liegt neben dem Body (`2715:30201`), bei Filter/Kontakt/Buchung innerhalb. Eine Struktur für den Developer.
9. Filter-Preview Phone: Backdrop 1080 hoch bei 812-Frame; in der Gesamtansicht fehlt der Text der letzten Zeile „Biografien“ (im Einzel-Render vorhanden). Instanz-Override prüfen.
10. Typografie-Angabe „Kicker 10 px Phone“: die Phone-Preview nutzt 12 px. Doku oder Komponente anpassen. Ebenso Label-M in filter-cell: Figma zeigt 16 px auf Phone, der Text Style (Master) sagt 15 px; der Prototyp folgt dem Text Style, die Zeile ist auf Phone deshalb 51 statt 52 px hoch.
11. Ein „Filter Spec“-Block fehlt (Kontakt und Buchung haben einen): Kicker, Einfach-/Mehrfachauswahl, Trefferzahl-Regel, Verhalten von „Auswahl löschen“ ohne Wert, sofortige Wirkung vs. Anwenden per Button. Der Prototyp setzt: sofortige Wirkung, „anzeigen“ schließt nur, „Auswahl löschen“ ohne Wert disabled.

## Nicht im Scope

Detailseiten der Angebote, Buchungs-Off-Canvas (Anmeldung, nur im Styleguide), echtes Absenden der Formulare, Cut-Edges-Feinschliff (offenes Briefing, siehe `PLAN.md`).

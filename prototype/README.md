# Prototyp „Bildung“ – Filter- und Tag-System

Gekapselter Klick-Prototyp für die Abstimmung mit dem Kunden. Quelle: Figma „SGLI – Design“, Section **Bildung** (`2548:24966`) mit den Frames „Bildung - Filter Default / Zielgruppe / Detail“, „Bildung - Mobile“, „Regeln für Filter“ und „Dynamische Ausgabe von Tags“.

Der Prototyp liegt **nur** in `prototype/`. Er liest Tokens, Foundations und Core Components aus `../src` und `../dist`, ändert dort aber nichts.

## Starten

```
npm run docs          # im Repo-Root, Server auf http://localhost:4321
open http://localhost:4321/prototype/
```

Ein Server ist nötig, weil die Icons aus dem SVG-Sprite (`dist/icons/sprite.svg`) per `<use href>` geladen werden. Demo-Link mit vorgewählter Zielgruppe: `…/prototype/?zielgruppe=Schulen`.

## Dateien

| Datei | Inhalt |
|---|---|
| `KUNDENABSTIMMUNG-FILTER.md` | Checkliste für das Kundengespräch und optimierte Filterliste je Zielgruppe (Stand 2026-09-11, noch nicht im Prototyp umgesetzt) |
| `SPEC-FILTER.md` | Spezifikation für den Developer: Datenmodell, URL-Zustand, Ampel, Chips, Off-Canvas, Tag-Slots, offene Punkte |
| `index.html` | Template „Bildung“: navigation, hero-default, education-filter + list-item-education, text-content-grid (cut-edges, primary-900), image-text-single, contact-section, teaser-slider, faq-section, teaser-feature, footer, Off-Canvas als natives `<dialog>` |
| `prototype.css` | Modul-CSS des Prototypen (BEM, nur Tokens, mobile first: Phone → md 768 → lg 1024), inkl. Off-Canvas und filter-cell |
| `filter.js` | Filter-Logik, Tag-Slots, Off-Canvas (`showModal`), „Weitere laden“, Slider-Pfeile (Vanilla JS) |
| `data.js` | 47 Dummy-Angebote mit allen Filter-Attributen (erfunden, Titel an Figma angelehnt) |
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

- Natives `<dialog>` mit `showModal()`: Top-Layer, Escape, Fokus-Trap und inerter Hintergrund kommen vom Browser. Schließen über Close-Button, Escape, Backdrop-Klick und „N Angebote anzeigen“ (alle über `<form method="dialog">` bzw. das `close`-Event). Fokus geht beim Öffnen auf die gewählte, sonst erste aktive Option, beim Schließen zurück zum auslösenden Chip.
- Kopf = section-header (Variante Phone/off-canvas): Kicker „Genauer filtern“ (Label-S), Titel = Filtername (H3), Close (Button/Icon). Nur der Body scrollt, Kopf und Fuß bleiben stehen. Hintergrund ist gesperrt (`body:has(dialog[open])`), `scrollbar-gutter: stable` gegen den Layout-Sprung.
- Optionen als **filter-cell** (Figma `2646:40456`): Zeile 52 px mit Indikator 12 × 12, Label-M, Trefferzahl (Caption) rechts, Divider unten. States hover / pressed / on / focused / disabled. Einfachauswahl (Radio), obwohl der Indikator quadratisch ist, siehe Annahme 8.
- Fuß: Primary „N Angebote anzeigen“, Secondary „Auswahl löschen“ (immer sichtbar, ohne Wert `disabled`). Phone gestapelt in voller Breite, Desktop nebeneinander.
- Slide-in mit `@starting-style` (Phone von unten, Desktop von rechts, `--motion-slow` 480 ms, Backdrop blendet in derselben Zeit), ohne bei `prefers-reduced-motion`. 260 ms war zu schnell für ein Panel, das den ganzen Viewport quert (entschieden 2026-09-23). Browser ohne `@starting-style` zeigen den Dialog ohne Animation.
- Auswahl wirkt sofort (Liste dahinter aktualisiert sich). Bei Auswahl wird die Optionsliste nicht neu gebaut, nur Zahlen und Buttons, damit der Tastaturfokus auf der Option bleibt.
- Erneuter Klick auf die gewählte Option hebt die Auswahl auf (entschieden 2026-09-23). Tastatur: Leertaste und Enter wählen und wählen ab, Pfeiltasten wechseln die Option. Enter schließt den Dialog nicht.
- „Filter zurücksetzen“ erscheint, sobald ein Filter gesetzt ist. Zähler-Tag zeigt die Trefferzahl (`aria-live`).
- Liste zeigt 10 Angebote, „Weitere Angebote laden“ holt die nächsten 10.

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
7. Öffnungszeiten in der Navigation nutzen IBM Plex Mono **Medium** (Figma: Regular, nicht im Repo geladen). Teaser-Slider hat nur Vor/Zurück, kein Autoplay. Mobile Navigation reduziert auf Suche + Menü wie im Figma-Mobile-Frame.
8. **filter-cell** (entschieden 2026-09-22): Einfachauswahl bleibt, obwohl der Indikator in Figma quadratisch ist (Checkbox-Optik). Der aktive Indikator ist in Figma hartkodiert #CDDC39 (kein Token); der Prototyp nutzt `color/accent/highlight`. Die Tokens `color/filter-cell/bg-hover|bg-pressed|bg-active|fg-active` gibt es in Figma (Semantic), aber noch nicht in `tokens/`; sie stehen als lokale Fallbacks in `prototype.css`. Fokusring: Figma zeigt nur den äußeren 4-px-Ring, der im Zustand On unsichtbar wäre (primary-900 auf primary-900); der Prototyp ergänzt den inneren Ring aus `focus.css`.

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

Menü, Suche, Sprachwechsel, Detailseiten der Angebote, Kontaktformular-, Buchungs- und Bestätigungs-Off-Canvas (in Figma dokumentiert, Panel-Grundgerüst ist dafür vorbereitet), Cut-Edges-Feinschliff (offenes Briefing, siehe `PLAN.md`).

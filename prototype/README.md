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
| `index.html` | Template „Bildung“: navigation, hero-default, education-filter + list-item-education, text-content-grid (cut-edges, primary-900), image-text-single, contact-section, teaser-slider, faq-section, teaser-feature, footer, Off-Canvas |
| `prototype.css` | Modul-CSS des Prototypen (BEM, nur Tokens, mobile first: Phone → md 768 → lg 1024) |
| `filter.js` | Filter-Logik, Tag-Slots, Off-Canvas, „Weitere laden“, Slider-Pfeile (Vanilla JS) |
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

**Tags in der Liste** (3 Slots, Slot 3 immer Dauer)

| Filterstatus | Slot 1 + 2 |
|---|---|
| ungefiltert | Zielgruppen (max 2, Rest `+N`) |
| Stufe 9 bis 20 | Thema (max 2) |
| Stufe über 20 | Klassenstufe (max 2; ohne Klassenstufe: Thema) · Barrierefreiheit oder Sprache. Barrierefreiheit vor „Auch auf Englisch“. |

**Chips**

- Zielgruppe: Klick setzt den Filter (Chip aktiv mit X), erneuter Klick auf das X entfernt ihn. Einfachauswahl.
- Detailfilter mit Chevron: Klick öffnet das Off-Canvas (Hintergrund `color/bg/card`, von rechts, 480 px, auf Phone volle Breite). Gesetzter Wert erscheint als Badge im Chip plus X; Klick entfernt den Wert.
- „Filter zurücksetzen“ erscheint, sobald ein Filter gesetzt ist. Zähler-Tag zeigt die Trefferzahl (`aria-live`).
- Liste zeigt 10 Angebote, „Weitere Angebote laden“ holt die nächsten 10.

## Annahmen (bitte bestätigen)

1. **Ohne Zielgruppe keine Detailfilter.** Figma „Filter Default“ zeigt bei 47 Angeboten nur die Zielgruppen-Zeile, obwohl die Ampel bei über 20 alle Detailfilter vorsähe. Umgesetzt wie in Figma.
2. **Ampel-Bezugsgröße** ist die Trefferzahl der Zielgruppe, nicht die aktuell gefilterte Zahl. Sonst würde ein gesetzter Detailfilter (z. B. Thema → 7 Treffer) seine eigene Zeile ausblenden. Gesetzte Detailfilter bleiben immer sichtbar.
3. **Zielgruppe ist Einfachauswahl**, Detailfilter je ein Wert. In Figma ist immer nur ein Chip aktiv.
4. **Klick auf einen aktiven Detail-Chip entfernt den Wert** (das X ist die Affordance). Zum Ändern den Chip erneut öffnen. Alternative wäre ein geteilter Chip (Label öffnet, X entfernt).
5. **Tag-Slots hängen an der Ampel-Stufe**, nicht daran, ob ein Detailfilter gesetzt ist („je Filterungs-Schritt“ in Figma). Bei Stufe „über 20“ ohne Klassenstufe-Daten (nicht Schulen) fällt Slot 1 auf Thema zurück.
6. **Off-Canvas-Inhalt** ist laut Briefing leer erlaubt. Damit sich ein Wert setzen lässt, enthält er eine Radio-Liste (Core Component Radio) mit Trefferzahl je Option, „N Angebote anzeigen“ und „Auswahl löschen“. Ist als Platzhalter gekennzeichnet und leicht zu entfernen.
7. Öffnungszeiten in der Navigation nutzen IBM Plex Mono **Medium** (Figma: Regular, nicht im Repo geladen). Teaser-Slider hat nur Vor/Zurück, kein Autoplay. Mobile Navigation reduziert auf Suche + Menü wie im Figma-Mobile-Frame.

## Nicht im Scope

Menü, Suche, Sprachwechsel, Detailseiten der Angebote, Kontaktformular, Cut-Edges-Feinschliff (offenes Briefing, siehe `PLAN.md`).

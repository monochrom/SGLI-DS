# Prototyp – Startseite

Hauptseite der Prototypen. `http://localhost:4321/prototype/` leitet hierher weiter (`npm run docs`, URL mit Schrägstrich am Ende).
Logos in Seitenkopf, Menü und Footer aller Prototypen führen zur Startseite.

Figma: Section „Startseite“ `2522:59485` (Templates), Desktop `2522:59486`, Phone `2522:59498`.

## Dateien

| Datei | Inhalt |
|---|---|
| `index.html` | Seite mit 9 Modulen zwischen Seitenkopf und Footer |
| `startseite.css` | Modul-CSS. Kopf, Slider, Feature, Footer unverändert aus `angebote-filter/prototype.css`, Timeline aus `haftbuch/haftbuch.css`, neue Module darunter |
| `assets/img/` | Bilder aus Figma (JPG, Hero und Collage-Dokument als WebP mit Transparenz), Logo und Timeline-Bilder aus `haftbuch` |
| `../shared/scroll-motion.js` | Scroll-gekoppelte Bewegungen aus dem alten Prototyp (siehe unten) |

## Module

| Modul | Figma Desktop / Phone | Kontext | Hinweis |
|---|---|---|---|
| hero-home | `2522:59488` / `2522:59500` | surface-100 | `section--hero-home`, oben immer Standard |
| teaser-grid | `2522:59489` / `2522:59501` | surface-100 | Karte = teaser-card-static wie im Slider |
| teaser-stacked | `2522:59490` / `2522:59502` | surface-300 | mit Cut-Edges (oben kippt), Abstand compact |
| teaser-event-list | `2522:59491` / `2522:59503` | secondary-400 | Karten fest auf surface-50 |
| teaser-search | `2522:59492` / `2522:59504` | surface-100 | Suchfeld schickt `?q=` an `../haftbuch/` |
| teaser-timeline | `2522:59493` / `2522:59505` | surface-200 | Aufbau wie haftbuch |
| image-fullwidth | `2522:59494` / `2522:59506` | surface-100 | randlos (`section--bleed`) |
| teaser-slider | `2522:59495` / `2522:59507` | primary-900 | mit Button „Zur Übersicht“ links, Pfeile rechts |
| teaser-feature | `2522:59496` / `2522:59508` | surface-100 | Karte bg/inset (= surface-200) |

## Bewegung aus dem alten Prototyp

Quelle: `sgli-prototype.netlify.app` (`js/main.js`, `css/styles.css`). Übernommen sind nur die Animationen, mit den Parametern 1:1.
Alle Scroll-Bewegungen sind linear an die Scroll-Position gekoppelt: runter = vorwärts, hoch = rückwärts. Keine Dauer, keine Kurve.

| Element | Bewegung | Parameter | Bezug |
|---|---|---|---|
| Grundriss-Linie im Hero | wächst | 75 → 100 %, über 0,9 Viewporthöhen, Drehpunkt oben Mitte | Seiten-Scroll ab 0 |
| Hero-Bild | wächst | 60 → 100 %, über 1,15 Viewporthöhen, Drehpunkt oben Mitte | Seiten-Scroll ab 0 |
| Collage Haftbücher (teaser-search) | Flächen fächern auf | Ebenen 2–4 starten deckungsgleich unter dem Dokument und wandern gleichzeitig zu ihrer Position. Start 150 px nach Eintritt der Oberkante, Ende nach 0,9 Viewporthöhen | Lage der Collage |
| Vollbild-Foto (image-fullwidth) | Schwenk | Bild 112 %, wandert von −40 px nach +40 px, solange die Oberkante vom unteren zum oberen Rand läuft | Lage des Bildes |
| Ornament „Die Stiftung“ | wächst | 75 → 100 %, über 0,6 Viewporthöhen, Drehpunkt Mitte | Lage des Ornaments |
| Timeline-Bilder (teaser-timeline) | Rahmen steigen in ihre Lage | starten tiefer (Desktop 32 / 16 / 80 / 40 px, Phone 16 / 8 / 24 / 12 px), steigen über 0,8 Viewporthöhen unterschiedlich schnell, nur der Rahmen bewegt sich. **Neu, nicht aus dem alten Prototyp** (2026-10-01), auch im Haftbuch | Lage des Bildes |
| Teaser-Bilder (Grid, Ausstellungen, Slider) | Hover-Zoom | 110 %, 0,4 s ease-out | Hover über die Karte |

- Werte stehen als `data-motion-*` am Element und lassen sich im HTML justieren.
- Reduzierte Bewegung: alles steht in der Endlage, kein Hover-Zoom.
- Hover-Zoom nur mit echtem Hover (Maus, Trackpad). Er ist eine Ausnahme von der Motion-Regel „Zustände nur Farbe“, entschieden mit Danilo am 2026-10-01.
- Auf allen Breakpoints aktiv. Der alte Prototyp war nur Desktop, die Phone-Werte sind dieselben.
- Alle Werte sind Richtwerte, dokumentiert in Figma „Motion“ `2932:2974`, Abschnitt „Bewegung der Module“ (mit optionalen Modulen und „Ohne Bewegung“).
- Nicht aus dem alten Prototyp: der kippende obere Keil an teaser-stacked. Das ist die Cut-Edges-Regel des Design Systems (`.cut-edges--tilt`).

## Annahmen und Abweichungen von Figma

1. **Tablet (768–1023):** Figma hat keinen Tablet-Frame. Hero ab 768 im Desktop-Aufbau (Bild 16 : 9, Text rechts), Teaser-Grid ab 768 dreispaltig, Event-Karten ab 768 mit Button rechts. Ausstellungen, Veranstaltungen und Collage bleiben bis 1023 gestapelt.
2. **teaser-stacked Phone:** Figma zeigt auf dem Phone keine Keile. Im Code trägt das Modul die Keile auf allen Breakpoints, weil Cut-Edges ein Schalter am Modul sind. Abstand oben und unten compact (Regel 4), Figma zeigt default.
3. **teaser-search Desktop:** Inhalt vertikal mittig zur Collage statt 198 px von oben (Unterschied ca. 25 px bei 1440).
4. **Timeline:** gleiche Bilder wie im Haftbuch. Phone-Anordnung wie dort (Bildpaar Honecker + Mauerfall, darunter Panzer). Figma Startseite Phone zeigt Panzer + Mauerfall als Paar und Honecker einzeln.
5. **Hero Phone:** Primary-Button volle Breite. Innenabstand 16 aus der Komponente, Figma 18.
6. **Grundriss-Linie im Hero:** ab 768 wie Figma an Ober- und Unterkante des Heros gebunden, Breite aus dem Seitenverhältnis (vorher an der Breite: die Spitze ragte 22 px über den Hero und wurde abgeschnitten). Phone wie Figma an der Breite, der Hero schneidet nur seitlich ab, die Spitze darf ins nächste Modul laufen (gleiche Farbe).
7. **Slider Phone:** Button „Zur Übersicht“, ab 768 „Zur Übersicht der Angebote“ (wie Figma Phone und Desktop).
8. **Suche Haftbücher:** Feld aus der Komponente Input Search (schwebendes Label). Absenden öffnet das Haftbuch mit dem Begriff, die Liste ist dort gefiltert.
9. **Links:** Recherche, Haftbücher, Bildung und Slider-Karten führen zu den anderen Prototypen. Alle übrigen Links sind Dummys.

## Offene Punkte an Figma

1. teaser-slider Phone (`2522:59507`): Kopf zeigt den Text von teaser-grid („Gedenkstätte Lindenstraße erleben / Spuren entdecken“). Im Code der Desktop-Text („Bildungsangebote / Geschichte verstehen und einordnen“).
2. teaser-grid: Label „Gedenkstätte LIndenstrasse erleben“ (großes I, ss). Im Code „Lindenstraße“, Versalien über CSS.
3. teaser-stacked: „Die Dauerausstellung — den historische Ort erleben.“ Gemeint ist wohl „den historischen Ort“. Im Code wie Figma.
4. teaser-stacked Phone ohne Cut-Edges (siehe Abweichung 2): angleichen oder bewusst so?
5. teaser-event-list: Kartenfläche hart `color/surface/50`, kein Semantic-Token.

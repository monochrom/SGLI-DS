# Prototyp „Haftbuch“ – Recherche-Liste

Responsiver Klick-Prototyp der Seite „Recherche im Haftbuch“. Quelle: Figma „SGLI – Design“, Section **haftbuch** (`2834:26220`) mit den Frames „Recherche - Desktop“ (`2834:26221`) und „Recherche - Phone“ (`2834:26228`). Zeilen nach der Komponente **list-cell-haftbuch** (`2311:5`).

Der Prototyp liegt nur in `prototype/haftbuch/`. Er liest Tokens, Foundations und Core Components aus `../../src` und `../../dist`, ändert dort aber nichts.

## Starten

```
npm run docs          # im Repo-Root, Server auf http://localhost:4321
open http://localhost:4321/prototype/haftbuch/
```

Ein Server ist nötig, weil die Icons aus dem SVG-Sprite (`dist/icons/sprite.svg`) per `<use href>` geladen werden.

## Dateien

| Datei | Inhalt |
|---|---|
| `index.html` | navigation, hero-default, haftbuch-list, teaser-timeline (image-count=4), faq-section (primary-900), Footer |
| `haftbuch.css` | Modul-CSS (BEM, nur Tokens, mobile first: Phone → md 768 → lg 1024). Nav, Hero, FAQ, Motion-Werte aus `angebote-filter` übernommen |
| `haftbuch.js` | Liste rendern, Auf- und Zuklappen, Suche, Zeitraum, Anfangsbuchstabe, „Weitere Ergebnisse laden“ |
| `data.js` | 124 **erfundene** Einträge (fester Seed, jede Ladung gleich). Strafnormen sind typische Tatbestände der drei Zeitschichten |
| `assets/img/` | Logo (aus `angebote-filter`) und die vier Timeline-Bilder aus Figma, verkleinert auf 1200 px als JPG |
| `assets/icons/` | Icons aus Figma, die noch nicht im Sprite sind: EasyLanguage, InstagramLogo, FacebookLogo, LinkedinLogo (Dateien unverändert, im CSS als Maske mit `currentColor`) |

## Zustände der Zeile (list-cell-haftbuch)

| Zustand | Desktop (ab 1024) | Phone |
|---|---|---|
| Default | Name · Geburtsdatum · Geburtsort · Haftzeitraum, Divider 20 %, kein Icon | Name · Geburtsdatum, Plus-Icon, Divider 20 % |
| hover | Divider wird `border/default` (100 %), Plus erscheint. Nur mit `@media (hover: hover)` | – |
| open | Divider 100 %, Minus. Panel in Spalte 4–12 auf `bg/card`, Fläche 24 px nach links verlängert, Labels 1–2, Werte ab 3, Button „Zur Biografie“ rechts | Minus. Karte über volle Breite, `bg/card`, Padding 16, Felder untereinander (Label über Wert): Geburtsort, Haftzeitraum, Verurteilungsdatum, Strafnormen, Strafmaß. Button darunter |

- Die ganze Zeile ist ein `<button aria-expanded aria-controls>`. Enter und Leertaste klappen auf und zu. Tastaturfokus zeigt auf Desktop das Plus wie beim Hover. Der Fokusring liegt außen wie überall im System (braucht 6 px, der Seitenrand ist mindestens 16). Suchfeld und Zeitraum: Tastatur = Doppelring außen, Klick = 2-px-Rahmen (`src/scripts/focus-modality.js`).
- Screenreader lesen die Zeile als „Dahms, Erich, geboren am 24.10.1905 in Guben (Kleinstadt), Haftzeitraum …“. Der Spaltenkopf ist `aria-hidden`, die Kontextwörter stehen als `sr-only` in den Zellen.
- Auf- und Zuklappen: `grid-template-rows` 0fr ↔ 1fr über `--motion-base` (260 ms), Inhalt blendet in der zweiten Hälfte ein, Plus dreht beim Öffnen in die Waagerechte und wird zum Minus. Muster wie die Detailfilter-Zeile in `angebote-filter`. Reduced Motion schaltet ohne Animation.

## Annahmen (bitte bestätigen)

1. **Mehrere Zeilen gleichzeitig offen.** Öffnen einer Zeile schließt die anderen nicht.
2. **Suche, Zeitraum und Buchstaben funktionieren** mit den Dummy-Daten, obwohl nur das Aufklappen beauftragt war. Suche: Teilstring in „Name, Vorname“ und „Vorname Name“, Groß-/Kleinschreibung und Umlaute egal, 200 ms Verzögerung. Zeitraum: die drei Zeitschichten mit Haft (NS, SBZ, SED). Buchstabe: Einfachauswahl, erneuter Klick hebt auf.
3. **Buchstaben ohne Treffer sind `disabled`** (Chip-State Disabled). In Figma sind alle 26 aktiv.
4. **„Filter zurücksetzen“** erscheint neben der Trefferzahl, sobald ein Filter gesetzt ist. Der Link ist in Figma angelegt, aber ausgeblendet (`reset-filter-link`).
5. **Trefferzahl** zeigt die echte Anzahl der Dummy-Daten (124), nicht „493“ aus Figma.
6. **Tablet (768–1023)** nutzt das Phone-Layout der Liste mit Tablet-Abständen. Die beiden Suchfelder stehen ab 768 nebeneinander. Figma hat keinen Tablet-Frame.
7. **Spaltenbreiten Desktop:** Geburtsort und Haftzeitraum je eine Spalte breiter als in Figma (6–8, 9–11 statt 6–7, 9–10 mit fester Breite), damit die Texte ab 1024 px nicht in das Icon laufen. Werte im Panel dürfen umbrechen (lange Strafnormen).
8. **FAQ:** Figma zeigt nur die erste Antwort. Die übrigen Antworten sind als Platzhaltertext markiert.

## Entschieden

- **2026-09-29:** Geburtsort und Haftzeitraum stehen auf dem Phone oben im aufgeklappten Panel, weil die Phone-Zeile nur Name und Geburtsdatum zeigt. Figma zeigte sie auf dem Phone nirgends. Danilo zieht Figma nach. Auf dem Desktop bleiben sie in der Zeile und sind im Panel ausgeblendet.

- **2026-09-29:** „Zur Biografie“ gibt es nur bei Einträgen mit ausgearbeiteter Biografie, das sind sehr wenige. Dummy-Daten: jeder vierte Eintrag (`biography: true`, 31 von 124). Ohne Biografie entfällt nur der Button, die Card bleibt gleich (Infos linksbündig, Desktop gleiche Höhe, Phone endet nach „Strafmaß“).

## Offene Punkte an Figma

1. **Phone-Panel um Geburtsort und Haftzeitraum ergänzen** (siehe Entschieden, im Prototyp umgesetzt).
2. **Kein Fokus-State** für list-cell-haftbuch. Umgesetzt: Doppelring außen, Plus sichtbar.
3. **Desktop-Panel:** Fläche als absolutes Rechteck „Card background – responsive padding“ (`color/surface/50`), Phone-Panel als Frame-Fill `color/bg/card`. Gleicher Wert, aber zwei verschiedene Variablen. Umgesetzt: überall `bg/card`.
4. **Divider-Farbe open Phone** bleibt 20 %, Desktop open 100 %. Bitte bestätigen, dass das gewollt ist.
5. **Label „VerurteilungsDatum:“** hat ein großes D mitten im Wort (wegen Uppercase unsichtbar). Umgesetzt als „Verurteilungsdatum:“.
6. **Buchstaben-Chips 33 × 35** sind kleiner als der Chip aus den Core Components (Desktop 40, Phone 44 hoch). Auf dem Phone liegt die Trefferfläche damit unter 44 px (WCAG 2.2 AA verlangt 24 px, das ist erfüllt).
7. **Icons nicht im Sprite:** EasyLanguage (Navigation) sowie Instagram, Facebook, LinkedIn (Footer). Kandidaten für `assets/icons/` + `npm run icons:sprite`.
8. **Icon-Buttons der Navigation** sind in Figma ohne Rahmen, die Core Component `btn--icon` hat einen. Im Prototyp lokal ausgeblendet.
9. **Footer** hat gegenüber `angebote-filter` neue Elemente (Social-Icons, „Newsletter“, Divider oben). `angebote-filter` ist noch auf altem Stand.

# Prototyp „Bildung“ – Filter- und Tag-System

Klick-Prototyp des Templates „Bildung“ mit Filter- und Tag-System. Quelle: Figma „SGLI – Design“, Section **Bildung** (`2522:59510`; Desktop `2522:59511`, Phone `2522:59552`) mit den Frames „Bildung - Filter Default / Zielgruppe / Detail“, „Bildung - Mobile“, „Regeln für Filter“ und „Dynamische Ausgabe von Tags“.

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
| `SPEC-FILTER.md` | Spezifikation für die Umsetzung: Datenmodell, URL-Zustand, Ampel, Chips, Off-Canvas, Tag-Slots, Craft-Empfehlung |
| `index.html` | Template „Bildung“: navigation, hero-default, education-filter + list-item-education, text-content-grid (cut-edges, primary-900), image-text-single, contact-section, teaser-slider, faq-section, teaser-feature, footer, Off-Canvas Filter und Kontakt als natives `<dialog>`, Rückfrage-Modal |
| `prototype.css` | Modul-CSS des Prototypen (BEM, nur Tokens, mobile first: Phone → md 768 → lg 1024), inkl. filter-cell. Das Panel selbst kommt aus `src/components/off-canvas/` |
| `filter.js` | Filter-Logik, Tag-Slots, Off-Canvas (`showModal`), „Weitere laden“ (Vanilla JS). Slider, FAQ und Seitenkopf liegen in `../shared/` |
| `data.js` | 47 Dummy-Angebote mit allen Filter-Attributen (erfunden, Titel an Figma angelehnt) |
| `../shared/assets/` | Social-Icons Instagram, Facebook, LinkedIn für den Footer (als Maske mit `currentColor`) |
| `assets/img/` | Logo (SVG, Farbe über `currentColor`) und Bilder aus Figma, verkleinert auf 1200 px |

## Umgesetzte Regeln

**Ampel für Detailfilter** (Bezugsgröße: Angebote der gewählten Zielgruppe)

| Angebote | Detailfilter |
|---|---|
| 1 bis 3 | keine |
| 4 bis 8 | Thema, Dauer |
| ab 9 | Klassenstufe, Thema, Format, Förderbedarf, Dauer, Sprache |

- Ohne gewählte Zielgruppe gibt es keine Detailfilter (wie Figma „Filter Default“).
- Bezugsgröße ist die Trefferzahl der Zielgruppe, nicht die aktuell gefilterte Zahl. Sonst würde ein gesetzter Detailfilter seine eigene Zeile ausblenden. Gesetzte Detailfilter bleiben immer sichtbar.
- Zielgruppe ist Einfachauswahl, Detailfilter je ein Wert.

Dummy-Daten so verteilt, dass alle drei Stufen vorkommen: Schulen 29 · Erwachsenenbildung 15 · Hochschulen 13 (alle Detailfilter) · Aus- und Weiterbildung 7 (Thema, Dauer) · Inklusion 3 (keine).

**Tags in der Liste** (3 Slots, Slot 3 immer Dauer; die gesetzten Filter entscheiden, nicht die Ampelstufe)

| Filterschritt | Slot 1 + 2 |
|---|---|
| ungefiltert | Zielgruppen (max 2, Rest `+N`) |
| Zielgruppe gewählt | Thema (max 2) |
| Zielgruppe + Detailfilter | Klassenstufe (nur Schulen), sonst Thema, sonst Format (max 2) · Barrierefreiheit, sonst Sprache („Auch auf Englisch“) |

Das Attribut, nach dem gerade gefiltert wird, wird als Tag übersprungen, weil es bei allen Treffern gleich wäre. Beispiel: Filter Klassenstufe = Oberstufe zeigt Thema · Sprache statt Klassenstufe · Sprache.

**Chips**

- Zielgruppe: Klick setzt den Filter (Chip aktiv mit X), erneuter Klick auf das X entfernt ihn. Einfachauswahl.
- Detailfilter mit Chevron: Klick öffnet das Off-Canvas (Figma `2613:31418`). Desktop: Panel rechts, 520 px, volle Höhe, Divider links. Phone: Bottom Sheet von unten, maximal 85 % der Viewporthöhe. Hintergrund `color/bg/card`, Backdrop `neutral/alpha/900-40`. Gesetzter Wert erscheint als Badge im Chip. Der Chip ist dann geteilt: Klick auf Label oder Badge öffnet das Off-Canvas erneut zum Ändern, Klick auf das X entfernt den Wert.

**Off-Canvas**

- Natives `<dialog>` mit `showModal()`: Top-Layer, Escape, Fokus-Trap und inerter Hintergrund kommen vom Browser. Schließen über Close-Button, Escape, Backdrop-Klick und „N Angebote anzeigen“ (alle über `<form method="dialog">` bzw. das `close`-Event). Fokus geht beim Öffnen auf den Titel (`h2` mit `tabindex="-1"`, ohne Fokusring), beim Schließen zurück zum auslösenden Chip. Nicht auf die erste Option: Safari und Firefox setzen bei programmatischem `focus()` `:focus-visible`, auf Touch erschiene der Fokusring auf der Zelle und das Sheet scrollte dorthin. Der Titel ist nicht interaktiv, Screenreader lesen Kicker und Titel, Tab führt zum Close-Button und weiter zu den Optionen.
- Hover-Zustände (filter-cell, geteilte Chips, Reset-Link, Listentitel, Footer-Links) liegen in `@media (hover: hover)`. Auf Touch bleibt `:hover` nach dem Tippen am Element kleben, bis woanders getippt wird; eine abgewählte Zelle sähe sonst aus wie gehovert. `button.css` und `base.css` machen es genauso, `chip.css` nutzt `:hover` ohne Media Query.
- Kopf = section-header (Variante Phone/off-canvas): Kicker „Genauer filtern“ (Label-S), Titel = Filtername (fest 24 px wie in allen Panels), Close (Button/Icon). Nur der Body scrollt, Kopf und Fuß bleiben stehen. Hintergrund ist gesperrt (`html:has(dialog.offcanvas[open])`), `scrollbar-gutter: stable` gegen den Layout-Sprung.
- Optionen als **filter-cell** (Figma `2646:40456`): Zeile 52 px mit Indikator 12 × 12, Label-M, Trefferzahl (Caption) rechts, Divider unten. States hover / pressed / on / focused / disabled. Einfachauswahl (Radio), obwohl der Indikator quadratisch ist.
- Fuß: Primary „N Angebote anzeigen“, Secondary „Auswahl löschen“ (immer sichtbar, ohne Wert `disabled`). Phone gestapelt in voller Breite, Desktop nebeneinander.
- Bewegung wie das Menü (`src/styles/motion.css`): Phone von unten, Desktop von rechts, Backdrop blendet mit. Ohne Bewegung bei `prefers-reduced-motion`.
- Auswahl wirkt sofort (Liste dahinter aktualisiert sich). Bei Auswahl wird die Optionsliste nicht neu gebaut, nur Zahlen und Buttons, damit der Tastaturfokus auf der Option bleibt.
- Erneuter Klick auf die gewählte Option hebt die Auswahl auf. Tastatur: Leertaste und Enter wählen und wählen ab, Pfeiltasten wechseln die Option. Enter schließt den Dialog nicht.
- „Filter zurücksetzen“ erscheint, sobald ein Filter gesetzt ist. Zähler-Tag zeigt die Trefferzahl (`aria-live`).
- Liste zeigt 10 Angebote, „Weitere Angebote laden“ holt die nächsten 10.

**Kontaktformular im Off-Canvas**

- „Zum Kontaktformular“ (contact-section) und „Kontakt“ (faq-section) öffnen das Kontakt-Panel (Figma Forms `2746:24535`, Kontakt `2746:26620` / `2753:30067`). Komponenten `off-canvas` und `form` aus `src/components/`, gesteuert von `off-canvas.js` und `form.js`.
- Absenden ohne Netzwerk: Pflichtfelder werden geprüft (Fehler am Feld, Fokus aufs erste), danach zeigt dasselbe Panel die Bestätigung „Vielen Dank“. Das nächste Öffnen beginnt leer.
- Mit Eingaben fragt jeder Schließweg (Close, Abbrechen, Escape, Backdrop) zuerst mit dem Modal „Eingaben verwerfen?“. Der Filter schließt ohne Rückfrage.
- Anmeldung und Bestätigung sind im Styleguide (`src/components/off-canvas/off-canvas.html`), im Prototyp nur Kontakt.

**Motion**

- Zeiten und Kurven aus `src/styles/motion.css` (`--motion-fast` 160 ms für Farbe und Opazität, `--motion-base` 260 ms für Größe, Chip-Slots, Häkchen, `--motion-slow` 480 ms für die Detailfilter-Zeile). Reduced Motion greift global über `reset.css`.
- Chips werden einmal gebaut und danach nur im Zustand aktualisiert (kein `innerHTML` bei jedem Klick), sonst könnte keine Transition abspielen. Badge, Icon und X-Button sitzen in Slots, die per `grid-template-columns` 0fr ↔ 1fr wachsen und schrumpfen, mit Fade. Geschlossene Slots sind `visibility: hidden`, der X-Button zusätzlich `tabindex="-1"` und `aria-hidden`.
- Der Detailfilter-Chip hat immer die geteilte Struktur (Label, Badge-Slot, Caret-Slot, X-Slot); inaktiv sieht er aus wie ein einfacher Chip mit Caret.
- Ergebnisliste: Crossfade beim Filterwechsel (abblenden, nach `--motion-fast` neu bauen, einblenden). „Weitere laden“ baut sofort, damit der Fokus auf das erste neue Angebot springen kann.
- filter-cell: Farbwechsel weich, der Indikator rastet beim Anwählen mit kleinem Überschwinger ein.
- Detailfilter-Zeile klappt auf und zu: Wrapper `.edu-filter__collapse` mit `grid-template-rows` 0fr ↔ 1fr über `--motion-slow`, der Inhalt blendet in der zweiten Hälfte ein. Der Abstand zur Zielgruppen-Zeile liegt als `padding-top` auf der inneren `__row` statt als `gap` auf `__content`, damit er zu nicht stehen bleibt (ein Grid-Gap bleibt bei 0fr-Track erhalten, ein negativer `margin-top` verkleinert den Track nicht). Zu = `visibility: hidden` statt `hidden`, sonst kann nichts animieren. `overflow: hidden` liegt nur zu und während der Bewegung (`is-animating`, JS entfernt sie nach `transitionend`), damit der Fokusring der Chips offen nicht beschnitten wird. „Filter zurücksetzen“ blendet ein und aus (`is-hidden` mit `visibility`).

## Abweichungen von Figma

1. Öffnungszeiten in der Navigation nutzen IBM Plex Mono **Medium** (Figma: Regular, nicht im Repo geladen). Navigation: Phone nur Logo + Menü, ab 768 drei Icons (Sprache, Leichte Sprache, Suche), ab 1024 zusätzlich die Öffnungszeit. Teaser-Slider hat nur Vor/Zurück, kein Autoplay.
2. filter-cell: Der aktive Indikator nutzt `color/filter-cell/status`. Figma zeigt als Fokus nur den äußeren 4-px-Ring, der im Zustand On unsichtbar wäre (primary-900 auf primary-900); der Code ergänzt den inneren Ring aus `focus.css`.
3. image-text-single Desktop: In Figma ist die Textspalte so hoch wie das Bild und schneidet ab. Der Code zeigt den ganzen Text, die Sektion wird dadurch höher (827 statt 725).
4. text-content-grid Phone: Padding y wie Desktop `section-spacing/y/compact` (Figma zeigt 112). text-row Phone 343 breit (Figma 350).
5. faq-section Phone: Kicker, Titel, Intro-Text und Kontakt-Button wie auf Desktop (Figma Phone zeigt andere Texte und keinen Button).
6. teaser-slider: nur Projektkarten (Figma Phone zeigt als dritte Karte eine `teaser-card-box`).
7. Button/Secondary ist 34 hoch wie die Core Component (Figma: 44-px-Trefffläche). Slider- und Feature-Sektion sind dadurch 10 px niedriger.

## Nicht im Scope

Detailseiten der Angebote, Buchungs-Off-Canvas (Anmeldung, nur im Styleguide), echtes Absenden der Formulare.

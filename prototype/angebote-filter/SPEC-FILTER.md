# Spezifikation Filter- und Tag-System „Bildung“

Stand 2026-09-11. Abgeleitet aus Figma „SGLI – Design“, Section Bildung (`2548:24966`), Boards „Regeln für Filter“ und „Dynamische Ausgabe von Tags“, plus den Entscheidungen vom 2026-09-11. Referenzimplementierung: `prototype/filter.js` und `prototype/data.js`. Zielsystem Craft CMS, die Regeln sind aber CMS-neutral formuliert.

---

## 1. Datenmodell

Entry-Typ **Angebot** (Section „Bildungsangebote“, Channel). Felder:

| Feld | Typ | Pflicht | Werte / Hinweis |
|---|---|---|---|
| `titel` | Text | ja | |
| `teaser` | Text, kurz | ja | 1 bis 2 Sätze, Anzeige in der Liste |
| `typ` | Kategorie (1) | ja | Workshop, Führung, Projekttag, Digitale Spurensuche, Zeitzeug:innengespräch, Seminar, Fortbildung. Anzeige als Label über dem Titel. |
| `zielgruppen` | Kategorie (n) | ja, mind. 1 | Schulen, Aus- und Weiterbildung, Hochschulen, Erwachsenenbildung, Inklusion |
| `thema` | Kategorie (n) | ja, mind. 1 | NS-Diktatur, Sowjetische Besatzung, SED-Diktatur, Friedliche Revolution, Demokratiegeschichte, Menschenrechte, Justiz und Haft, Biografien |
| `klassenstufe` | Kategorie (n) | nur bei Zielgruppe Schulen | Grundschule (ab Kl. 4), Sekundarstufe I, Oberstufe, Berufsschule |
| `format` | Kategorie (1) | ja | identisch mit `typ`, kann dasselbe Feld sein. Im Prototyp getrennt, weil Figma beides zeigt. Empfehlung: ein Feld. |
| `foerderbedarf` | Kategorie (n) | nein | Leichte Sprache, Gebärdensprache (DGS), Sehbeeinträchtigung, Kognitive Beeinträchtigung, Mobilität |
| `dauerText` | Text | ja | Anzeige, z. B. „4 Std.“, „Mehrtägig“ |
| `dauerKategorie` | Kategorie (1) | ja | Bis 2 Std., 2 bis 4 Std., Halbtag, Ganztag oder mehrtägig. Filterwert. Alternativ aus einem Minutenfeld ableiten (siehe 7). |
| `sprache` | Kategorie (n) | ja, mind. 1 | Deutsch, Englisch, Polnisch, Russisch |
| `barrierefreiheit` | Kategorie (n) | nein | Leichte Sprache, DGS, Audiodeskription, Stufenlos. Anzeige-Tag, kein Filter. |

Die Kategorie-Gruppen sind die Optionslisten der Filter. Reihenfolge der Optionen = Reihenfolge im Off-Canvas.

---

## 2. Filterzustand und URL

Der Zustand liegt vollständig in der URL, damit Zurück-Button, Teilen und Indexierung funktionieren.

```
/bildung                                   ungefiltert
/bildung?zielgruppe=schulen
/bildung?zielgruppe=schulen&thema=ns-diktatur&dauer=halbtag
/bildung?zielgruppe=schulen&seite=2        Paginierung
```

| Parameter | Kardinalität | Regel |
|---|---|---|
| `zielgruppe` | 0 oder 1 | Einfachauswahl. Wechsel der Zielgruppe löscht alle Detailfilter. |
| `klassenstufe`, `thema`, `format`, `foerderbedarf`, `dauer`, `sprache` | je 0 oder 1 | Einfachauswahl je Filter. Nur gültig, wenn `zielgruppe` gesetzt ist. Ohne Zielgruppe ignorieren. |
| `seite` | optional | 10 Angebote pro Seite, „Weitere Angebote laden“ hängt die nächsten 10 an (progressive enhancement: ohne JS ist es ein Link auf `seite=n+1`). |

Ungültige Werte (Slug existiert nicht) werden ignoriert, nicht als Fehler behandelt.

---

## 3. Trefferberechnung

Zwei Mengen pro Request:

| Menge | Definition | Verwendung |
|---|---|---|
| **Pool** | alle Angebote mit `zielgruppen` enthält `zielgruppe`. Ohne Zielgruppe: alle Angebote. | Ampel (Abschnitt 4) |
| **Treffer** | Pool, zusätzlich alle gesetzten Detailfilter erfüllt (UND-Verknüpfung) | Liste, Zähler, Tags |

Matching je Filter:

| Filter | Bedingung |
|---|---|
| `klassenstufe` | Wert in `klassenstufe` (n) |
| `thema` | Wert in `thema` (n) |
| `format` | Wert = `format` |
| `foerderbedarf` | Wert in `foerderbedarf` (n) |
| `dauer` | Wert = `dauerKategorie` |
| `sprache` | Wert in `sprache` (n) |

Zähler: `0 → „Keine Angebote“`, `1 → „1 Angebot“`, sonst `„N Angebote“`. Leerzustand zeigt Hinweistext und den Link „Filter zurücksetzen“.

---

## 4. Ampel: welche Detailfilter angeboten werden

Bezugsgröße ist **Pool**, nicht Treffer. Damit blendet ein gesetzter Detailfilter nie seine eigene Zeile aus.

| Bedingung | Zeile „Genauer filtern“ |
|---|---|
| keine Zielgruppe gesetzt | nicht anzeigen (Figma „Filter Default“) |
| Pool < 9 | nicht anzeigen |
| 9 ≤ Pool ≤ 20 | Thema, Dauer |
| Pool > 20 | Klassenstufe, Thema, Format, Förderbedarf, Dauer, Sprache |

Reihenfolge der Chips wie in der letzten Zeile. Ein **gesetzter** Detailfilter bleibt immer sichtbar, auch wenn die Ampel ihn gerade nicht anbieten würde (kann nur nach Datenänderung zwischen zwei Requests vorkommen).

Die Schwellen 9 und 20 gehören in eine Konfiguration (Craft: `config/sgli.php` oder ein Global Set), nicht in Templates.

Empfehlung: Klassenstufe und Förderbedarf nur anbieten, wenn sie für die Zielgruppe sinnvoll sind (Klassenstufe → Schulen, Förderbedarf → Inklusion). Ist in Figma nicht festgelegt und im Prototyp nicht umgesetzt. Entscheidung offen.

---

## 5. Chips

| Chip | Zustand | Aussehen (Core Component Chip) | Klick |
|---|---|---|---|
| Zielgruppe | inaktiv | Rahmen, Label | setzt `zielgruppe`, löscht alle Detailfilter |
| Zielgruppe | aktiv | gefüllt, Label + X | entfernt `zielgruppe` und alle Detailfilter |
| Detailfilter | inaktiv | Rahmen, Label + CaretRight | öffnet Off-Canvas |
| Detailfilter | aktiv | gefüllt, Label + Badge (gewählter Wert) + X, **geteilt** | Label/Badge: öffnet Off-Canvas mit vorbelegter Auswahl. X: entfernt den Wert. |

Geteilter Chip: zwei `<button>` nebeneinander, die wie ein Chip aussehen (kein verschachtelter Button). Beide sind eigenständig fokussierbar. Accessible Names: „Thema, Sowjetische Besatzung, ändern“ und „Thema: Sowjetische Besatzung entfernen“.

„Filter zurücksetzen“ erscheint, sobald `zielgruppe` oder ein Detailfilter gesetzt ist, und führt auf `/bildung`.

Phone (unter 1024 px): Chip-Zeilen scrollen horizontal, kein Umbruch, Label steht über der Zeile. Desktop: Label 144 px links, Chips brechen um.

---

## 6. Off-Canvas

Figma: Doku „Off-Canvas“ (`2613:31418`), Filter-Panel Desktop `2710:23917`, Phone `2710:24111`, Komponente filter-cell `2646:40456`. Stand 2026-09-22.

**Aufbau**: Backdrop (`neutral/alpha/900-40`), Panel (`color/bg/card`), section-header (Variante Phone/off-canvas: Kicker „Genauer filtern“ Label-S, Titel = Filtername H3, Close Button/Icon 45 px), scrollender Content-Bereich, sticky Action-Bereich.

| | Desktop (ab lg 1024) | Phone |
|---|---|---|
| Panel | rechts, 520 px, volle Höhe, Padding 24, Divider links | unten verankert, volle Breite, max. 85 % Viewporthöhe, kein Panel-Padding |
| Kopf | Padding 0 0 16, Abstand zum Body 48 | Padding 24 16 16, Abstand zum Body 24 |
| Body | Padding 0, scrollt allein | Padding-inline 16, scrollt allein |
| Fuß | Divider oben, Padding-top 24, Buttons nebeneinander (Gap 16), Size Desktop | Divider oben, Padding 24 16, Buttons gestapelt in voller Breite (Gap 12), Size Mobile |

**filter-cell** (eine Zeile je Option, 52 px): Padding 16/8, Gap 24, Divider unten. Links Indikator 12 × 12 (1 px `border/default`) und Label (Label-M), Gap 12. Rechts Trefferzahl (Caption, `text/secondary`). States: hover `filter-cell/bg-hover`, pressed `filter-cell/bg-pressed`, on `filter-cell/bg-active` + `filter-cell/fg-active` + Indikator gefüllt (`accent/highlight`, siehe README Annahme 8), focused 4 px `border/focus-outer` (plus innerer Ring), disabled Opacity 40 %. Einfachauswahl: `<input type="radio">` je Zeile, `name` je Filter, Fieldset mit Legend = Filtername.

**Verhalten**

- Natives `<dialog>` mit `showModal()`. Damit: Top-Layer, Escape, Fokus-Trap, Hintergrund inert. Zusätzlich Scroll-Lock auf `body` und `scrollbar-gutter: stable`.
- Schließen über Close-Button, Escape, Backdrop-Klick und „N Angebote anzeigen“. Alle Wege laufen über das `close`-Event des Dialogs; dort Fokus zurück zum auslösenden Chip (über den Filterschlüssel suchen, der Chip wird beim Rendern ersetzt).
- Fokus beim Öffnen auf den Titel (`h2` mit `tabindex="-1"`, kein Fokusring, da nicht interaktiv). Nicht auf die erste Option: Safari und Firefox setzen bei programmatischem `focus()` `:focus-visible`, auf Touch erschiene der Ring auf der Zelle. Tab führt vom Titel zum Close-Button und weiter zu den Optionen.
- Hover-Zustände nur in `@media (hover: hover)`. Auf Touch bleibt `:hover` nach dem Tippen kleben, eine abgewählte Zelle sähe sonst aus wie gehovert.
- Trefferzahl je Option: Anzahl der Angebote, die alle **anderen** gesetzten Filter erfüllen und diese Option. Optionen mit 0 Treffern deaktiviert. Kostet eine Count-Query je Option.
- Auswahl wirkt sofort (Liste dahinter aktualisiert sich). Bei Auswahl nur Zahlen, `disabled` und Button-Labels aktualisieren, die Optionsliste nicht neu bauen (Fokus bliebe sonst nicht auf dem Radio).
- Gewählte Option per erneutem Klick abwählbar (entschieden 2026-09-23). Radios kennen das nativ nicht: `change` setzt eine neue Option; `click`, Leertaste und Enter auf der bereits gewählten Option entfernen den Wert. Enter im Optionsbereich mit `preventDefault`, sonst schließt die implizite Formular-Submission den Dialog.
- „Auswahl löschen“ immer sichtbar, ohne gesetzten Wert `disabled`; Klick entfernt den Wert, Dialog bleibt offen.
- Slide-in 240 ms (Phone von unten, Desktop von rechts) über `@starting-style`; bei `prefers-reduced-motion` keine Transition.
- Ohne JS: Formular mit Submit, das die URL setzt.

**Tokens**: `color/filter-cell/bg-hover|bg-pressed|bg-active|fg-active` sind in Figma neu (Semantic) und müssen in `tokens/` nachgezogen werden. Der Indikator-Wert für „on“ ist in Figma hartkodiert, Token fehlt.

---

## 7. Tags in der Liste (3 Slots)

Slot 3 ist immer `dauerText`, rechtsbündig. Slot 1 und 2 hängen vom **Filterschritt** ab (Lesart B). Ein Attribut, nach dem gerade gefiltert wird, wird übersprungen, weil es bei allen Treffern gleich wäre.

| Filterschritt | Slot 1 | Slot 2 |
|---|---|---|
| keine Zielgruppe | `zielgruppen`, max 2 | leer |
| Zielgruppe, kein Detailfilter | `thema`, max 2 | leer |
| Zielgruppe + mind. 1 Detailfilter | erstes nicht gefiltertes, nicht leeres Attribut aus: `klassenstufe` (nur Zielgruppe Schulen), `thema`, `format`; max 2 | `barrierefreiheit[0]`, wenn vorhanden und nicht nach Förderbedarf gefiltert; sonst Sprache, wenn nicht nach Sprache gefiltert |

Sprache in Slot 2: „Auch auf Englisch“, wenn Deutsch und Englisch enthalten sind; „Auf Polnisch“ bzw. „Auf Russisch“, wenn Deutsch fehlt; sonst nichts.

Darstellung: Werte innerhalb eines Slots und zwischen Slots mit Mittelpunkt getrennt. Sind mehr Werte vorhanden als `max`, folgt `+N` in `text/secondary` hinter dem letzten Wert. Caption-Größe.

Beispiele (aus dem Prototyp verifiziert):

| Zustand | Ergebnis |
|---|---|
| ungefiltert | Schulen · Aus- und Weiterbildung +1 · 4 Std. |
| Schulen | NS-Diktatur · Justiz und Haft · 4 Std. |
| Schulen + Dauer | Oberstufe · Berufsschule · Auch auf Englisch · 4 Std. |
| Schulen + Klassenstufe | NS-Diktatur · Justiz und Haft · Auch auf Englisch · 4 Std. |
| Schulen + Sprache | Oberstufe · Berufsschule · 4 Std. |
| Hochschulen + Thema | Seminar · Auch auf Englisch · 4 Std. |

Pseudocode:

```
slots = []
if zielgruppe == null:            slots.push(zielgruppen, max 2)
elif keinDetailfilter:            slots.push(thema, max 2)
else:
  for attr in [klassenstufe (nur Schulen), thema, format]:
    if not gefiltert(attr) and attr nicht leer: slots.push(attr, max 2); break
  if barrierefreiheit and not gefiltert(foerderbedarf): slots.push(barrierefreiheit[0])
  elif not gefiltert(sprache): slots.push(spracheTag(sprache))   # kann leer sein
slots.push(dauerText)
```

---

## 8. Liste und Paginierung

- Sortierung: redaktionell (Craft Structure oder Feld `sortierung`), nicht nach Datum. Im Prototyp: Reihenfolge in `data.js`.
- 10 pro Seite. Button „Weitere Angebote laden“ (Button/Primary, zentriert) hängt die nächsten 10 an und verschwindet, wenn alle gezeigt sind. Fokus nach dem Nachladen auf das erste neue Element.
- Listenelement (Figma `list-item-education`): Desktop 12-Spalten-Grid, Inhalt Spalte 1 bis 7, Meta Spalte 9 bis 12, CaretSmallRight 32 px rechts. Phone: gestapelt, Caret neben dem Titel. Das ganze Element ist ein Link zur Detailseite.

---

## 9. Craft-Umsetzung, Empfehlung

- Ein Controller oder Twig-Template liest die Query-Parameter, validiert sie gegen die Kategorie-Slugs und baut zwei Element-Queries: `pool` (count) und `treffer` (paginiert).
- Ampel und Tag-Slots als Twig-Makros oder als kleiner PHP-Service im Modul, damit die Logik testbar ist. Schwellen aus der Config.
- Nachladen ohne Reload wahlweise mit Sprig (htmx). Ohne JS muss alles über Links und ein Formular funktionieren.
- Caching: Ergebnisseiten sind über die URL eindeutig, also normal cachebar. Bei Änderungen an Angeboten invalidieren.
- Redaktionsleitfaden: Felder aus Abschnitt 1 vollständig pflegen. Fehlende Werte lassen Tag-Slots leer und können Filter aus der Ampel entfernen.

---

## 10. Offene Punkte

1. Klassenstufe und Förderbedarf nur für passende Zielgruppen anbieten (Abschnitt 4)?
2. `typ` und `format` zu einem Feld zusammenlegen?
3. Dauer als Kategorie pflegen oder aus Minuten ableiten?
4. ~~Trefferzahlen im Off-Canvas gewünscht?~~ In Figma vorgesehen (2026-09-22).
5. ~~Gestaltung des Off-Canvas-Inhalts in Figma.~~ Dokumentiert in `2613:31418` (2026-09-22). Offene Punkte an Figma: siehe `README.md`.

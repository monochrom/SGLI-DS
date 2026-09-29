# Prototyp – Shared: Menü-Overlay

Ein Menü für alle Prototypen (`angebote-filter`, `haftbuch`). Über das Menü kommt man von einem Prototyp zum anderen.

Figma: Navigation / Menu Overlay `2802:62629` (Desktop `2802:62628`, Phone `2802:62627`), Zeile navigation-cell-menu `2834:27277`.

## Dateien

| Datei | Inhalt |
|---|---|
| `menu.css` | Layout, Zellen-Status, Choreografie (Zeiten als Custom Properties oben) |
| `menu.js` | Baut das Markup (eine Quelle), öffnet und schließt den `<dialog>` |
| `assets/menu-feature.jpg` | Bild aus Figma (Menu Feature Image) |
| `assets/EasyLanguage.svg` | Icon Leichte Sprache (noch nicht im Sprite) |

## Einbinden

```html
<link rel="stylesheet" href="../shared/menu.css">
<button class="btn btn--primary" type="button" data-menu-open>Menü</button>
<script src="../../src/scripts/focus-modality.js"></script>
<script src="../shared/menu.js" data-current="haftbuch"></script>
```

`data-current` = `haftbuch` oder `bildung`. Setzt `aria-current="page"` und das Quadrat vor dem Eintrag.

## Verhalten

- **Öffnen:** Seite dunkelt ab (wie beim Off-Canvas). Dann wächst die Fläche von oben, leer. Dann die Einträge nacheinander von oben nach unten (Einblenden, Trennlinie zieht von links nach rechts). Dann öffnet sich das Bild von links nach rechts. Zum Schluss blendet der Abbinder ein. Gesamt ca. 1,8 s, bedienbar nach ca. 0,7 s.
- **Schließen:** „Schließen“ oder Escape, umgekehrte Reihenfolge: Inhalt und Bild blenden aus, die Fläche fährt nach oben zu, zuletzt geht die Abdunkelung weg (ca. 1,1 s). Klick auf die aktuelle Seite schließt ebenfalls.
- **Zelle:** Hover blendet den Pfeil ein und vergrößert ihn (16 → 24), Linie wird dunkel. Pressed: Linie primary-700. Tastaturfokus: Doppelring außen, Innenabstand wie Figma.
- **Reduzierte Bewegung:** nur kurzes Ein- und Ausblenden der ganzen Fläche.
- Links auf Seiten, die es im Prototyp nicht gibt (Besuch, Ausstellung, Footer-Links), tun nichts.
- Phone bis 767: nur Liste, ohne Bild. Ab 768: Liste und Bild, beide Spalten im Figma-Verhältnis 628 : 668. Kopf: Icon-Buttons ab 768, Öffnungszeit erst ab 1024 (die Icons sind wichtiger, die Öffnungszeit wandert zuerst ins Menü). Über der Liste stehen darum bis 767 Öffnungszeit, Suche und Sprach-Buttons, von 768 bis 1023 nur die Öffnungszeit. Menüpunkte in H3, erst ab 1440 in H2; lange Punkte dürfen umbrechen.

## Abweichungen von Figma / offene Punkte

1. **Tippfehler in Figma:** Button „SChliessen“ (Desktop) und „Schließsen“ (Phone), Adresse „Lindenstraßse“ bzw. „Lindenstrase“. Im Code: „Schließen“, „Lindenstraße 54/55“.
2. **Kopf Phone:** Overlay-Logo 140 × 43 und Kopfhöhe 72 in Figma, Seitenkopf 131 × 40. Im Code wie der Seitenkopf, damit „Schließen“ genau auf „Menü“ liegt.
3. **Footer Phone:** Figma hat Innenabstand 24 links/rechts, die Liste darüber 16. Im Code 16 (Grid-Rand), damit alles bündig ist.
4. **Desktop-Schrift:** Figma zeigt nur 1440 mit H2. Zwischen 1024 und 1439 nutzt der Code H3 (entschieden 2026-09-29). Bei 1440 bricht „Haftbücher & Schicksale“ als aktuelle Seite (Quadrat davor) um, wie in Figma.
5. **Tokens:** `color/navigation-menu/*` gibt es in Figma, aber noch nicht in `tokens/`. `menu.css` trägt sie lokal. Motion-Zeiten sind Kandidaten für Tokens.
6. **Tablet:** Figma hat keinen Tablet-Frame. Ab 768 stehen Liste und Bild nebeneinander (entschieden 2026-09-29), Abbinder bleibt bis 1023 wie Phone. Kopf wie der Seitenkopf: Icons ab 768, Öffnungszeit ab 1024 (entschieden 2026-09-29).
7. **Kopf Bildung:** Der Seitenkopf im Prototyp „angebote-filter“ hatte zwei Icon-Buttons. Er ist jetzt vom Haftbuch übernommen (drei Icons mit Leichte Sprache), wie das Overlay (entschieden 2026-09-29).
8. **Niedrige Desktop-Viewports:** Ist der Viewport niedriger als der Inhalt, scrollt das Menü. 1024 × 768 passt mit H3 ohne Scrollen.

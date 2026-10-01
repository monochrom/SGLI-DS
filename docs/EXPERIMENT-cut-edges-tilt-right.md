# Protokoll: Cut-Edge kippt rechts, Parallax

Stand 2026-09-30 · Status: **entschieden und umgesetzt, V3** (Danilo: „wir nehmen rechts kippen“, dann: an die Scroll-Position gekoppelt mit fester Geschwindigkeit)

## Verlauf

1. **Bis 2026-09-30, V1:** Drehpunkt unten rechts, das linke Ende steigt. An den Scroll gekoppelt (CSS Scroll-Driven Animation, `view-timeline`), Bereich „Oberkante 10 vh → 60 vh über dem unteren Rand“, Kurve `--ease-scroll` (Tempo nicht gleichmäßig). Firefox: Endlage.
2. **2026-09-30, Experiment:** Modifier `.cut-edges--tilt-right` (Drehpunkt oben links) plus Test-Schalter im Styleguide und im Prototyp (`prototype/shared/experiment-tilt.js`). Live verglichen, entschieden: rechts.
3. **2026-09-30, V2 (verworfen):** Rechts kippt, Auslöser bei 30 %, aber **nicht** an den Scroll gekoppelt: Script `src/scripts/cut-edges-tilt.js` (IntersectionObserver, `data-cut-tilt="start|end"`) löst eine CSS-Transition mit fester Dauer aus (`--motion-cut-tilt: 1200ms`, `--ease-cut-tilt: cubic-bezier(0.45, 0, 0.25, 1)`). Missverständnis: lief automatisch ab. Script und Tokens wieder gelöscht, Code in Git nicht committed (nur in diesem Protokoll beschrieben).
4. **2026-09-30, V3 (aktuell):** Rechts kippt, an die Scroll-Position gekoppelt, **linear** mit festem Verhältnis (Parallax-Faktor), Beginn bei 30 vh.

## V3 – was wo steht

| Datei | Inhalt |
|---|---|
| `src/styles/cut-edges.css` | Block „Kippen“: `@property --cut-tilt`, `@keyframes cut-tilt` (start → 1), `.cut-edges--tilt { --cut-tilt-start: 0.6; --cut-tilt-factor: 0.25; --cut-tilt-offset: 30vh }`, Hintergrund des oberen Keils (Grundfläche `--cut-color`, Nachbar-Dreieck `to bottom left` oben verankert, Höhe `var(--cut-tilt) * 100%`). In `@supports (animation-timeline: view())` + `prefers-reduced-motion: no-preference`: `container-type: inline-size` und `view-timeline` am Modul, am `::before` `animation: cut-tilt linear both`, `animation-range: cover offset cover calc(offset + (1 − start) × 100cqw × 280/1440 / factor)`. |
| `src/styles/motion.css` | `--ease-scroll` entfernt (linear braucht keine Kurve). Keine neuen Tokens. |
| `docs/index.html` | Text „Kippen beim Scrollen“ neu, zweiter Regler „Parallax-Faktor“ (`#cut-tilt-factor` → `--cut-tilt-factor`), Kommentar an `.cut-demo--tilt`. |
| `prototype/angebote-filter/index.html` | unverändert gegenüber V1 (nutzt `.cut-edges--tilt`, kein Script nötig). |
| Figma `2898:1948` | Abschnitt Bewegung: drei Standbilder (Drehpunkt oben links, rechtes Ende fällt), Bildunterschriften und Stichpunkte. Für V1 zurückzeichnen: Drehpunkt unten rechts, linkes Ende steigt. |
| gelöscht | `prototype/shared/experiment-tilt.js`, Regel `.cut-edges--tilt-right`, Doku-Schalter `.cut-tilt-pivot`, `src/scripts/cut-edges-tilt.js`, `--motion-cut-tilt`, `--ease-cut-tilt`. |

Stellschrauben (alle am Modul `.cut-edges--tilt` überschreibbar): `--cut-tilt-factor` (Tempo: Anteil der Scrollstrecke), `--cut-tilt-offset` (wann es beginnt), `--cut-tilt-start` (Startwinkel).

Geprüft 2026-09-30 in Chromium, Kante am rechten Rand, gemessen vs. erwartet:

| Viewport | Beginn | Scrollweg | Verlauf der Kante |
|---|---|---|---|
| 1440 × 900 | 270 px über dem Rand | 448 px | 168 → 196 → 224 → 252 → 279, je +112 px Scroll, genau linear |
| 390 × 844 | 253 px | 121 px | 45 → 53 → 61 → 68 → 75, genau linear |
| „Bewegung reduzieren“ | – | – | immer Endlage |

Keine JS-Fehler. Safari (ab 26 mit Scroll-Driven Animations) und Firefox (Endlage) nicht getestet.

## Zurück zu V1 (links kippt, Kurve, Bereich 10 → 60 vh)

In `src/styles/cut-edges.css` den Block ab `/* Kippen (.cut-edges--tilt …` bis vor `/* Entschieden 2026-09-10` durch den V1-Code unten ersetzen, `--ease-scroll` in `motion.css` wieder einfügen (Zeile unten), Styleguide-Text und Faktor-Regler zurück, CHANGELOG, PLAN.md §7 Regel 6, Figma-Doku Abschnitt Bewegung. Oder: `git show 2204fef:src/styles/cut-edges.css`.

`  --ease-scroll: cubic-bezier(0.4, 0, 0.2, 1);    /* an den Scroll gekoppelt: weich rein, weich aus (Cut-Edge-Kippen) */` (unter `--ease-content`)

Nur die Richtung zurück (links kippt, Parallax bleibt): im Block nur das `background` des oberen Keils durch das aus V1 ersetzen (`to top right`, `--cut-color` vor `--cut-before-bg`, `left bottom`, Grundfläche `--cut-before-bg`).

### V1-Code `cut-edges.css`

```css
/* Kippen beim Scrollen (.cut-edges--tilt, nur der obere Keil): Die Diagonale dreht sich um ihren
   tiefsten Punkt unten rechts in die Figma-Endlage (280/1440 ≈ 11°). Start bei --cut-tilt-start der
   Keilhöhe (0.6 ≈ 6,7°). Der Keil bleibt ein Dreieck, der Streifen behält seine Höhe (kein Layoutsprung).
   Umsetzung: Der Verlauf wird unten verankert und in der Höhe von start auf 100 % gezogen, darüber
   liegt die Nachbarfläche. Die Drehung ist an den Scroll gekoppelt (Scroll-Driven Animation): von
   „Oberkante 10 vh über dem unteren Rand“ bis „Oberkante 60 vh darüber“ (knapp über der Mitte),
   rückwärts beim Hochscrollen.
   Ohne Unterstützung (Firefox) oder bei reduzierter Bewegung: Endlage, wie ohne Modifier. */
@property --cut-tilt {
  syntax: "<number>";
  inherits: false;
  initial-value: 1;
}

@keyframes cut-tilt {
  from { --cut-tilt: var(--cut-tilt-start); }
  to   { --cut-tilt: 1; }
}

@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .cut-edges--tilt {
      --cut-tilt-start: 0.6;
      view-timeline: --cut-tilt block;
    }

    .cut-edges--tilt.cut-edges--before::before {
      background:
        linear-gradient(to top right,
          var(--cut-color) calc(50% - 0.5px), var(--cut-before-bg) calc(50% + 0.5px))
          left bottom / 100% calc(var(--cut-tilt) * 100%) no-repeat,
        var(--cut-before-bg);
      animation: cut-tilt var(--ease-scroll) both;
      animation-timeline: --cut-tilt;
      animation-range: cover 10vh cover 60vh;
    }
  }
}
```

Git: V1 ist der Stand von Commit `2204fef` (letzter Commit vor diesem Protokoll), z. B. `git show 2204fef:src/styles/cut-edges.css`.

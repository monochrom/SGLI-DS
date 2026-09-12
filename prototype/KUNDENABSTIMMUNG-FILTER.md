# Kundenabstimmung Filter-System „Bildung“

Stand 2026-09-11. Grundlage: Filtertabelle des Kunden (Screenshot vom 2026-09-11), Figma-Regeln, Prototyp. Der Kunde hat die Hoheit über alle Wordings. Alles unten sind Vorschläge zur Abstimmung.

---

## A. Checkliste für das Kundengespräch

### Mengen und Regeln

- [ ] **Wie viele Angebote gibt es real je Zielgruppe?** Heute und voraussichtlich in 12 Monaten. Entscheidet, ob die Ampel greift. Unter 9 Angeboten je Zielgruppe gibt es nie Detailfilter.
- [ ] Ampel-Schwellen **9 und 20** bestätigen oder an die realen Mengen anpassen.
- [ ] Regel für die Stufe 9 bis 20: **die zwei relevantesten Filter je Zielgruppe**, die im Bestand tatsächlich trennen (mindestens zwei Optionen mit Treffern), statt fest „Thema und Dauer“. Die Reihenfolge der Chips ist die Priorität und wird je Zielgruppe festgelegt.
- [ ] **Einfachauswahl** je Filter und je Zielgruppe bestätigen (keine Mehrfachauswahl, kein Kombinieren von Zielgruppen).
- [ ] Reihenfolge der Zielgruppen-Chips: Schulen, Aus- und Weiterbildung, Hochschulen, Erwachsenenbildung, Inklusion.

### Struktur der Filter

- [ ] **Fachbereich harmonisieren** zu einer Liste für Aus- und Weiterbildung und Hochschulen. Welche Optionen bei welcher Zielgruppe erscheinen, ergibt sich aus den Treffern von selbst.
- [ ] **„sonstige“ streichen.** Angebote ohne Fachbereich stehen in der ungefilterten Liste.
- [ ] **Sprache nur als Abweichung** anbieten („Auch auf Englisch“). Ein Filter „deutsch“ trennt nichts. Weitere Sprachen geplant, etwa Polnisch?
- [ ] **Dauer aus Minuten ableiten**, Grenzen eindeutig: bis 2 Stunden, über 2 bis 4 Stunden, über 4 Stunden, mehrtägig. Zu welcher Klasse gehören genau 2 Stunden?
- [ ] **Förderbedarf und Bedarfe** sind dieselbe Liste. Eine Gruppe, ein Label oder je Zielgruppe ein eigenes Label?
- [ ] **Klassenstufen-Granularität**: 5./6. und 7./8. gepaart, 9 und 10 einzeln. Absicht (Abschlussjahrgänge)? Kein Angebot für Grundschule (Klasse 4)?

### Überschneidungen zwischen Zielgruppen

- [ ] **Berufsschule** (Schulen, Klassenstufe) und **Auszubildende** (Aus- und Weiterbildung, Altersgruppe) meinen dieselben Menschen. Wo liegt das Angebot, oder doppelt verschlagworten?
- [ ] **Studierende** unter Aus- und Weiterbildung kollidiert mit der Zielgruppe Hochschulen. Streichen oder Absicht (duale Studiengänge)?
- [ ] **Inklusion als eigene Zielgruppe** beibehalten? Der Unterfilter darf nicht „Zielgruppe“ heißen, weil die erste Zeile schon „Angebote für“ ist. Vorschlag „Einrichtung“ mit Schule, Werkstatt, Erwachsenenbildung.
- [ ] **Redaktionsregel**: Ein inklusives Schulangebot wird unter Schulen (mit Förderbedarf) und unter Inklusion (mit Einrichtung Schule) verschlagwortet. Einverstanden?

### Wording (Kundenhoheit)

- [ ] Thema: **„DDR“** (Kunde) oder „SED-Diktatur“ (Figma-Dummy)?
- [ ] Formate: Singular in Chips („Führung“) oder Plural wie in der Tabelle („Führungen“)?
- [ ] Bezeichnung des variablen Filters: Titel der Sonderausstellung als Chip-Label oder „Sonderausstellung“?
- [ ] Zeilen-Labels „Angebote für“ und „Genauer filtern“ bestätigen.
- [ ] Bedarfe-Liste: „emotionale und soziale Entwicklung“ ist lang für einen Chip-Badge. Kurzform gewünscht?

### Variabler Filter Sonderausstellung

- [ ] Redaktionsprozess: Wer legt das Thema an, wer entfernt es nach Ausstellungsende?
- [ ] Position in der Thema-Liste (erste oder letzte Option) und Kennzeichnung.

### Liste und Tags

- [ ] **Leitattribut je Zielgruppe** für Tag-Slot 1 bestätigen: Schulen Klassenstufe, Aus- und Weiterbildung Fachbereich, Hochschulen Fachbereich, Erwachsenenbildung Thema, Inklusion Bedarfe.
- [ ] **Barrierefreiheits-Tags** fehlen in der Kundentabelle. Vokabular abstimmen: Leichte Sprache, DGS, Audiodeskription, stufenlos. Sind das Angebotsmerkmale, die die Redaktion pflegt?
- [ ] Sortierung der Liste: redaktionell, alphabetisch, nach Format?
- [ ] Anzahl je Ladeschritt (10) bestätigen.

### Off-Canvas

- [ ] Trefferzahlen je Option anzeigen?
- [ ] Gestaltung des Inhalts in Figma steht aus.

---

## B. Optimierte Filterliste je Zielgruppe

Reihenfolge = Priorität = Anzeigereihenfolge der Chips. Stufe 9 bis 20 zeigt die ersten zwei Filter, die im Bestand trennen. Optionen ohne Treffer erscheinen nicht. Kundenwording beibehalten, Änderungen markiert mit ⟶.

### Schulen

| Filter | Optionen |
|---|---|
| Klassenstufe | 5./6. Klasse · 7./8. Klasse · 9. Klasse · 10. Klasse · Oberstufe · Berufsschule |
| Thema | NS-Diktatur · Sowjetische Besatzung · DDR · Friedliche Revolution · [Sonderausstellung, variabel] |
| Format | Führung · Digitale Spurensuche · Workshop · Zeitzeug:innengespräch |
| Förderbedarf | Lernen · Sehen · Hören · emotionale und soziale Entwicklung · Autismus · Deutsch als Zweitsprache |
| Dauer | bis 2 Stunden · über 2 bis 4 Stunden · über 4 Stunden · mehrtägig ⟶ aus Minuten abgeleitet |
| Sprache | Auch auf Englisch ⟶ statt deutsch/englisch |

### Aus- und Weiterbildung

| Filter | Optionen |
|---|---|
| Fachbereich | Medizin und Pflege · Polizei und Justiz · Pädagogik und soziale Arbeit · Militär ⟶ harmonisierte Liste, ohne „sonstige“ |
| Altersgruppe | Auszubildende · Erwachsene ⟶ ohne „Studierende“ (Hochschulen) |
| Thema | wie Schulen |
| Format | Führung · Digitale Spurensuche · Workshop · Zeitzeug:innengespräch |
| Dauer | bis 2 Stunden · über 2 bis 4 Stunden · über 4 Stunden |

### Hochschulen

| Filter | Optionen |
|---|---|
| Fachbereich | Geschichtswissenschaften · Medizin und Pflege · Recht und Justiz · Pädagogik und soziale Arbeit ⟶ harmonisierte Liste, ohne „sonstige“ |
| Thema | wie Schulen |
| Format | Führung · Workshop · Zeitzeug:innengespräch |
| Dauer | bis 2 Stunden · über 2 bis 4 Stunden · über 4 Stunden |
| Sprache | Auch auf Englisch |

### Erwachsenenbildung

| Filter | Optionen |
|---|---|
| Thema | wie Schulen |
| Format | Führung · Workshop · Zeitzeug:innengespräch |
| Dauer | bis 2 Stunden · über 2 bis 4 Stunden · über 4 Stunden |
| Sprache | Auch auf Englisch |

### Inklusion

| Filter | Optionen |
|---|---|
| Bedarfe | Lernen · Sehen · Hören · emotionale und soziale Entwicklung · Autismus · Deutsch als Zweitsprache ⟶ dieselbe Gruppe wie Förderbedarf |
| Einrichtung ⟶ statt „Zielgruppe“ | Schule · Werkstatt · Erwachsenenbildung |
| Thema | wie Schulen |
| Format | Führung · Workshop · Zeitzeug:innengespräch |
| Dauer | bis 2 Stunden · über 2 bis 4 Stunden · über 4 Stunden |

### Gemeinsame Kategoriegruppen im CMS

Eine Gruppe je Dimension, die Zielgruppen nutzen Teilmengen davon. Welche Optionen sichtbar sind, steuert der Bestand, nicht eine Liste je Zielgruppe.

| Gruppe | Optionen (Gesamtmenge) | Genutzt von |
|---|---|---|
| Thema | NS-Diktatur, Sowjetische Besatzung, DDR, Friedliche Revolution, Sonderausstellung (variabel) | alle |
| Format | Führung, Digitale Spurensuche, Workshop, Zeitzeug:innengespräch | alle |
| Dauer | bis 2 Std., über 2 bis 4 Std., über 4 Std., mehrtägig (abgeleitet aus Minuten) | alle |
| Sprache | Englisch (weitere bei Bedarf) | Schulen, Hochschulen, Erwachsenenbildung |
| Bedarf | Lernen, Sehen, Hören, emotionale und soziale Entwicklung, Autismus, Deutsch als Zweitsprache | Schulen (Förderbedarf), Inklusion (Bedarfe) |
| Klassenstufe | 5./6., 7./8., 9., 10., Oberstufe, Berufsschule | Schulen |
| Fachbereich | Geschichtswissenschaften, Medizin und Pflege, Recht und Justiz, Polizei und Justiz, Pädagogik und soziale Arbeit, Militär ⟶ Kunde entscheidet die Endliste | Aus- und Weiterbildung, Hochschulen |
| Altersgruppe | Auszubildende, Erwachsene | Aus- und Weiterbildung |
| Einrichtung | Schule, Werkstatt, Erwachsenenbildung | Inklusion |
| Barrierefreiheit (nur Tag) | Leichte Sprache, DGS, Audiodeskription, stufenlos ⟶ mit Kunde abstimmen | Liste, Slot 2 |

### Leitattribut für Tag-Slot 1 in der Liste

| Zielgruppe | Slot 1 | Fallback |
|---|---|---|
| Schulen | Klassenstufe | Thema, Format |
| Aus- und Weiterbildung | Fachbereich | Thema, Format |
| Hochschulen | Fachbereich | Thema, Format |
| Erwachsenenbildung | Thema | Format |
| Inklusion | Bedarfe | Thema, Format |

Slot 2 bleibt Barrierefreiheit vor Sprache, Slot 3 die Dauer. Das gerade gefilterte Attribut wird übersprungen.

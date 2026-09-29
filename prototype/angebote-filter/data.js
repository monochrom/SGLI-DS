/* SGLI Prototyp „Bildung“ – Dummy-Daten
   Statische Angebote für den Kundentest der Filterlogik. Kein Backend.
   Jedes Angebot trägt alle Attribute, die die Filter kennen. Werte sind erfunden, Titel angelehnt an Figma. */

window.SGLI_DATA = (function () {
  var ZIELGRUPPEN = ['Schulen', 'Aus- und Weiterbildung', 'Hochschulen', 'Erwachsenenbildung', 'Inklusion'];

  /* Detail-Filter in der Reihenfolge aus Figma. tier: ab welcher Stufe der Ampel sie erscheinen.
     'mid' = ab 9 Angeboten (Thema, Dauer), 'all' = ab 21 Angeboten (alle). */
  var DETAIL_FILTERS = [
    { key: 'klassenstufe', label: 'Klassenstufe', tier: 'all', options: ['Grundschule (ab Kl. 4)', 'Sekundarstufe I', 'Oberstufe', 'Berufsschule'] },
    { key: 'thema', label: 'Thema', tier: 'mid', options: ['NS-Diktatur', 'Sowjetische Besatzung', 'SED-Diktatur', 'Friedliche Revolution', 'Demokratiegeschichte', 'Menschenrechte', 'Justiz und Haft', 'Biografien'] },
    { key: 'format', label: 'Format', tier: 'all', options: ['Führung', 'Workshop', 'Projekttag', 'Digitale Spurensuche', 'Zeitzeug:innengespräch', 'Seminar', 'Fortbildung'] },
    { key: 'foerderbedarf', label: 'Förderbedarf', tier: 'all', options: ['Leichte Sprache', 'Gebärdensprache (DGS)', 'Sehbeeinträchtigung', 'Kognitive Beeinträchtigung', 'Mobilität'] },
    { key: 'dauer', label: 'Dauer', tier: 'mid', options: ['Bis 2 Std.', '2 bis 4 Std.', 'Halbtag', 'Ganztag oder mehrtägig'] },
    { key: 'sprache', label: 'Sprache', tier: 'all', options: ['Deutsch', 'Englisch', 'Polnisch', 'Russisch'] }
  ];

  /* Kurzschreibweise: o(typ, titel, text, attribute) */
  var id = 0;
  function o(typ, titel, text, a) {
    id += 1;
    return {
      id: id,
      typ: typ,
      titel: titel,
      text: text,
      zielgruppen: a.zg || [],
      thema: a.thema || [],
      klassenstufe: a.ks || [],
      format: a.format || typ,
      foerderbedarf: a.fb || [],
      dauer: a.dauer || '2 Std.',
      dauerKat: a.dk || '2 bis 4 Std.',
      sprache: a.sprache || ['Deutsch'],
      barrierefreiheit: a.bf || []
    };
  }

  var T_JUSTIZ = 'Der Workshop beleuchtet politisch motivierte Justiz und Haft im NS-Staat und zeigt das Zusammenspiel von NS-Justiz, Gestapo und SS als zentrale Akteure des Repressionsapparats.';
  var T_FUEHRUNG = 'Die Führungen vermitteln die Geschichte der Lindenstraße 54/55 als Ort politischer und rassistischer Verfolgung, Inhaftierung und zugleich als Ort der Demokratiegeschichte.';
  var T_GRAPHIC = 'Mit der Graphic Novel „UNVERGESSEN“ erkunden Teilnehmende sechs Biografien von NS-Verfolgten und die Geschichte der Gedenkstätte zwischen 1933 und 1945 anhand historischer Quellen.';
  var T_APP = 'Mit der App Actionbound erkunden Teilnehmende die Gedenkstätte interaktiv, arbeiten mit historischen Quellen und vertiefen ihre Erkenntnisse anschließend in einem gemeinsamen Rundgang.';
  var T_DDR = 'Anhand von Haftakten, Fotografien und Berichten ehemaliger Inhaftierter erarbeiten Teilnehmende, wie das Ministerium für Staatssicherheit in der Lindenstraße Untersuchungshaft organisierte.';
  var T_SBZ = 'Das Angebot nimmt die Jahre 1945 bis 1952 in den Blick, als der sowjetische Geheimdienst NKWD/MGB die Lindenstraße als Untersuchungsgefängnis nutzte.';
  var T_REVOLUTION = 'Ausgehend von der Besetzung des Gebäudes im Dezember 1989 fragen Teilnehmende nach dem Zusammenhang von Erinnerung, Demokratie und bürgerschaftlichem Engagement.';
  var T_ZEITZEUGE = 'Im Gespräch mit einem ehemaligen Inhaftierten erfahren Teilnehmende aus erster Hand, wie politische Haft den Alltag und das weitere Leben geprägt hat. Mit moderierter Vor- und Nachbereitung.';
  var T_FORTBILDUNG = 'Die Fortbildung stellt Konzepte und Materialien der Gedenkstätte vor und erprobt Methoden für die Arbeit mit heterogenen Lerngruppen am historischen Ort.';
  var T_LEICHT = 'Der Rundgang in Leichter Sprache erklärt in kurzen Sätzen, was in der Lindenstraße passiert ist. Es gibt viele Pausen und Zeit für Fragen.';

  var ANGEBOTE = [
    /* ---------- Schulen (Kern, sorgt für > 20) ---------- */
    o('Workshop', 'Im Namen des Deutschen Volkes – Workshop zur NS-Justiz', T_JUSTIZ, { zg: ['Schulen', 'Aus- und Weiterbildung', 'Hochschulen'], thema: ['NS-Diktatur', 'Justiz und Haft'], ks: ['Oberstufe', 'Berufsschule'], dauer: '4 Std.', dk: 'Halbtag', sprache: ['Deutsch', 'Englisch'] }),
    o('Führung', 'Geschichte erleben', T_FUEHRUNG, { zg: ['Schulen', 'Hochschulen', 'Erwachsenenbildung'], thema: ['NS-Diktatur', 'Sowjetische Besatzung', 'SED-Diktatur'], ks: ['Sekundarstufe I', 'Oberstufe'], dauer: '2 Std.', dk: 'Bis 2 Std.', sprache: ['Deutsch', 'Englisch'] }),
    o('Workshop', 'Bilder der Verfolgung – Workshop mit der Graphic Novel UNVERGESSEN', T_GRAPHIC, { zg: ['Schulen', 'Aus- und Weiterbildung'], thema: ['NS-Diktatur', 'Biografien'], ks: ['Sekundarstufe I', 'Oberstufe'], dauer: '4 Std.', dk: 'Halbtag' }),
    o('Digitale Spurensuche', 'Multimediale Spurensuchen mit der App Actionbound', T_APP, { zg: ['Schulen'], thema: ['NS-Diktatur', 'SED-Diktatur'], ks: ['Sekundarstufe I', 'Oberstufe'], dauer: '6 Std.', dk: 'Ganztag oder mehrtägig' }),
    o('Projekttag', 'Verhört, verurteilt, vergessen? Ein Projekttag zur Untersuchungshaft der Stasi', T_DDR, { zg: ['Schulen'], thema: ['SED-Diktatur', 'Justiz und Haft'], ks: ['Oberstufe'], dauer: '6 Std.', dk: 'Ganztag oder mehrtägig' }),
    o('Führung', 'Die Lindenstraße im Nationalsozialismus', T_FUEHRUNG, { zg: ['Schulen', 'Erwachsenenbildung'], thema: ['NS-Diktatur'], ks: ['Sekundarstufe I', 'Oberstufe'], dauer: '1,5 Std.', dk: 'Bis 2 Std.', sprache: ['Deutsch', 'Englisch'] }),
    o('Führung', 'Vom Geheimdienstgefängnis zum Ort der Demokratie', T_REVOLUTION, { zg: ['Schulen', 'Erwachsenenbildung'], thema: ['Sowjetische Besatzung', 'Friedliche Revolution', 'Demokratiegeschichte'], ks: ['Oberstufe', 'Berufsschule'], dauer: '2 Std.', dk: 'Bis 2 Std.' }),
    o('Workshop', 'Haft und Alltag – Quellenarbeit mit Haftakten', T_DDR, { zg: ['Schulen', 'Hochschulen'], thema: ['SED-Diktatur', 'Justiz und Haft'], ks: ['Oberstufe'], dauer: '3 Std.', dk: '2 bis 4 Std.' }),
    o('Zeitzeug:innengespräch', 'Erinnern aus erster Hand – Gespräch mit einem ehemaligen Häftling', T_ZEITZEUGE, { zg: ['Schulen', 'Erwachsenenbildung'], thema: ['SED-Diktatur', 'Biografien'], ks: ['Sekundarstufe I', 'Oberstufe'], dauer: '2 Std.', dk: 'Bis 2 Std.' }),
    o('Workshop', 'Menschenrechte gestern und heute', 'Ausgehend von Haftbiografien diskutieren Schüler:innen, welche Rechte in der Lindenstraße verletzt wurden und was sie heute für unser Zusammenleben bedeuten.', { zg: ['Schulen'], thema: ['Menschenrechte', 'Demokratiegeschichte'], ks: ['Sekundarstufe I'], dauer: '3 Std.', dk: '2 bis 4 Std.', sprache: ['Deutsch', 'Englisch'] }),
    o('Führung', 'Erster Blick – Rundgang für Grundschulklassen', 'Altersgerecht und behutsam: Der Rundgang stellt den Ort und einzelne Lebensgeschichten vor und lässt viel Raum für Fragen der Kinder.', { zg: ['Schulen'], thema: ['Biografien', 'Demokratiegeschichte'], ks: ['Grundschule (ab Kl. 4)'], dauer: '1,5 Std.', dk: 'Bis 2 Std.' }),
    o('Workshop', 'Wer war eigentlich …? Biografisches Arbeiten mit Fotografien', 'In Kleingruppen recherchieren Schüler:innen zu einer Person, die in der Lindenstraße inhaftiert war, und stellen ihre Ergebnisse als Plakat oder kurzen Audiobeitrag vor.', { zg: ['Schulen'], thema: ['Biografien', 'NS-Diktatur'], ks: ['Grundschule (ab Kl. 4)', 'Sekundarstufe I'], dauer: '4 Std.', dk: 'Halbtag' }),
    o('Digitale Spurensuche', 'Lindenstraße digital – Recherche mit dem Online-Archiv', 'Mit Tablets erschließen Schüler:innen digitalisierte Akten und Fotos, prüfen Quellen kritisch und dokumentieren ihre Funde in einer gemeinsamen Zeitleiste.', { zg: ['Schulen', 'Hochschulen'], thema: ['SED-Diktatur', 'Sowjetische Besatzung'], ks: ['Oberstufe'], dauer: '4 Std.', dk: 'Halbtag' }),
    o('Projekttag', 'Revolution vor der Haustür – Potsdam 1989', T_REVOLUTION, { zg: ['Schulen'], thema: ['Friedliche Revolution', 'Demokratiegeschichte'], ks: ['Sekundarstufe I', 'Oberstufe'], dauer: '6 Std.', dk: 'Ganztag oder mehrtägig' }),
    o('Workshop', 'Zwischen Zeilen – Briefe aus der Haft', 'Anhand von Briefen und Kassibern untersuchen Teilnehmende, wie Inhaftierte Kontakt nach außen hielten und welche Rolle Zensur spielte.', { zg: ['Schulen', 'Erwachsenenbildung'], thema: ['Sowjetische Besatzung', 'SED-Diktatur', 'Biografien'], ks: ['Oberstufe', 'Berufsschule'], dauer: '3 Std.', dk: '2 bis 4 Std.' }),
    o('Führung', 'Rundgang in Leichter Sprache', T_LEICHT, { zg: ['Schulen', 'Inklusion', 'Erwachsenenbildung'], thema: ['NS-Diktatur', 'SED-Diktatur'], ks: ['Sekundarstufe I'], fb: ['Leichte Sprache', 'Kognitive Beeinträchtigung'], bf: ['Leichte Sprache'], dauer: '1,5 Std.', dk: 'Bis 2 Std.' }),
    o('Führung', 'Rundgang mit Gebärdensprachdolmetschung', 'Der Rundgang wird von einer Dolmetscherin für Deutsche Gebärdensprache begleitet. Anmeldung bitte mindestens vier Wochen vorher.', { zg: ['Schulen', 'Inklusion', 'Erwachsenenbildung'], thema: ['NS-Diktatur', 'SED-Diktatur'], ks: ['Sekundarstufe I', 'Oberstufe'], fb: ['Gebärdensprache (DGS)'], bf: ['DGS'], dauer: '2 Std.', dk: 'Bis 2 Std.' }),
    o('Workshop', 'Tastbar – Der Ort für blinde und sehbehinderte Gruppen', 'Mit Tastmodellen, Hörstationen und beschreibenden Führungen wird die Architektur und Geschichte des Gefängnisses erfahrbar.', { zg: ['Schulen', 'Inklusion'], thema: ['NS-Diktatur', 'Sowjetische Besatzung'], ks: ['Sekundarstufe I', 'Oberstufe'], fb: ['Sehbeeinträchtigung'], bf: ['Audiodeskription'], dauer: '2 Std.', dk: 'Bis 2 Std.' }),
    o('Workshop', 'Democracy Lab – Discussing the Past in English', 'An English-language workshop on political persecution and democratic change at Lindenstraße, designed for bilingual and international classes.', { zg: ['Schulen', 'Hochschulen'], thema: ['Demokratiegeschichte', 'Menschenrechte'], ks: ['Oberstufe'], dauer: '3 Std.', dk: '2 bis 4 Std.', sprache: ['Englisch'] }),
    o('Führung', 'Zwiedzanie w języku polskim', 'Führung durch die Dauerausstellung auf Polnisch, für Austauschgruppen und Schulpartnerschaften.', { zg: ['Schulen', 'Erwachsenenbildung'], thema: ['NS-Diktatur', 'SED-Diktatur'], ks: ['Sekundarstufe I', 'Oberstufe'], dauer: '2 Std.', dk: 'Bis 2 Std.', sprache: ['Polnisch', 'Deutsch'] }),
    o('Projekttag', 'Ein Tag, zwei Diktaturen', 'Vergleichender Projekttag zu Haft und Verfolgung in NS-Zeit und DDR mit Quellenstationen, Rundgang und abschließender Diskussion.', { zg: ['Schulen'], thema: ['NS-Diktatur', 'SED-Diktatur'], ks: ['Oberstufe', 'Berufsschule'], dauer: '6 Std.', dk: 'Ganztag oder mehrtägig' }),
    o('Workshop', 'Comic-Werkstatt: Geschichte zeichnen', 'Nach einer Einführung in die Graphic Novel „Grenzlinien“ entwickeln Schüler:innen eigene Bildgeschichten zu einer Haftbiografie.', { zg: ['Schulen'], thema: ['SED-Diktatur', 'Biografien'], ks: ['Grundschule (ab Kl. 4)', 'Sekundarstufe I'], dauer: '4 Std.', dk: 'Halbtag' }),
    o('Workshop', 'Berufsschul-Workshop: Recht, Willkür und Verantwortung', 'Für Auszubildende in Verwaltung, Justiz und Pflege: Was bedeutet berufliche Verantwortung in einer Diktatur, und was folgt daraus für heute?', { zg: ['Schulen', 'Aus- und Weiterbildung'], thema: ['Justiz und Haft', 'Menschenrechte'], ks: ['Berufsschule'], dauer: '4 Std.', dk: 'Halbtag' }),
    o('Führung', 'Kurzführung für Schulklassen', 'Kompakter Überblick über die drei Nutzungsphasen des Hauses für Klassen mit wenig Zeit, zum Beispiel im Rahmen einer Potsdam-Exkursion.', { zg: ['Schulen'], thema: ['NS-Diktatur', 'Sowjetische Besatzung', 'SED-Diktatur'], ks: ['Sekundarstufe I', 'Oberstufe'], dauer: '1 Std.', dk: 'Bis 2 Std.', sprache: ['Deutsch', 'Englisch'] }),
    o('Digitale Spurensuche', 'Podcast-Werkstatt: Stimmen aus der Lindenstraße', 'Schüler:innen produzieren kurze Audiobeiträge zu Biografien ehemaliger Häftlinge und lernen dabei Grundlagen der Quellenkritik und des Interviews.', { zg: ['Schulen'], thema: ['Biografien', 'SED-Diktatur'], ks: ['Oberstufe'], dauer: '6 Std.', dk: 'Ganztag oder mehrtägig' }),
    o('Projekttag', 'Mehrtägiges Projekt: Ausstellung selbst gemacht', 'In drei Tagen erarbeiten Klassen eine kleine Ausstellung zu einem selbst gewählten Thema, die anschließend in der Schule gezeigt werden kann.', { zg: ['Schulen'], thema: ['Demokratiegeschichte', 'Biografien'], ks: ['Sekundarstufe I', 'Oberstufe'], dauer: 'Mehrtägig', dk: 'Ganztag oder mehrtägig' }),
    o('Workshop', 'Was ist gerecht? Philosophieren mit Kindern', 'Über Beispiele aus der Geschichte des Hauses kommen Kinder ins Gespräch über Regeln, Strafe und Gerechtigkeit.', { zg: ['Schulen'], thema: ['Menschenrechte', 'Demokratiegeschichte'], ks: ['Grundschule (ab Kl. 4)'], dauer: '2 Std.', dk: 'Bis 2 Std.' }),
    o('Führung', 'Rundgang mit Fokus Frauenhaft', 'Der thematische Rundgang stellt Biografien inhaftierter Frauen in den Mittelpunkt und fragt nach geschlechtsspezifischen Erfahrungen politischer Haft.', { zg: ['Schulen', 'Hochschulen', 'Erwachsenenbildung'], thema: ['Biografien', 'Sowjetische Besatzung', 'SED-Diktatur'], ks: ['Oberstufe'], dauer: '2 Std.', dk: 'Bis 2 Std.' }),
    o('Workshop', 'Fake oder Fakt? Quellenkritik am historischen Ort', 'Anhand von Propagandamaterial und Akten trainieren Schüler:innen, Quellen einzuordnen und Manipulation zu erkennen.', { zg: ['Schulen'], thema: ['SED-Diktatur', 'Demokratiegeschichte'], ks: ['Sekundarstufe I', 'Oberstufe'], dauer: '3 Std.', dk: '2 bis 4 Std.' }),

    /* ---------- Hochschulen (9 bis 20) ---------- */
    o('Seminar', 'Seminar: Justiz im Nationalsozialismus – Fallakten lesen', 'Studierende arbeiten mit Urteilen und Ermittlungsakten des Volksgerichtshofs und diskutieren juristische Kontinuitäten nach 1945.', { zg: ['Hochschulen'], thema: ['NS-Diktatur', 'Justiz und Haft'], dauer: '4 Std.', dk: 'Halbtag' }),
    o('Seminar', 'Public History: Gedenkstätten als Lernorte', 'Das Seminar reflektiert Konzepte historisch-politischer Bildung an Gedenkstätten und bezieht die Praxis der Lindenstraße ein.', { zg: ['Hochschulen', 'Aus- und Weiterbildung'], thema: ['Demokratiegeschichte'], dauer: '6 Std.', dk: 'Ganztag oder mehrtägig', sprache: ['Deutsch', 'Englisch'] }),
    o('Workshop', 'Forschungswerkstatt: Sowjetische Militärtribunale', T_SBZ, { zg: ['Hochschulen'], thema: ['Sowjetische Besatzung', 'Justiz und Haft'], dauer: '4 Std.', dk: 'Halbtag', sprache: ['Deutsch', 'Russisch'] }),
    o('Führung', 'Fachführung für Lehramtsstudierende', 'Die Führung verbindet den Rundgang mit einem Blick hinter die Kulissen der pädagogischen Arbeit und der Ausstellungsentwicklung.', { zg: ['Hochschulen'], thema: ['NS-Diktatur', 'SED-Diktatur', 'Demokratiegeschichte'], dauer: '2 Std.', dk: 'Bis 2 Std.' }),
    o('Zeitzeug:innengespräch', 'Oral History in der Praxis – Interviewführung mit Zeitzeug:innen', T_ZEITZEUGE, { zg: ['Hochschulen'], thema: ['Biografien', 'SED-Diktatur'], dauer: '3 Std.', dk: '2 bis 4 Std.' }),
    o('Seminar', 'Architecture of Repression – English Seminar', 'An English-language seminar on the spatial history of the Lindenstraße prison across three political systems.', { zg: ['Hochschulen'], thema: ['NS-Diktatur', 'Sowjetische Besatzung', 'SED-Diktatur'], dauer: '3 Std.', dk: '2 bis 4 Std.', sprache: ['Englisch'] }),

    /* ---------- Aus- und Weiterbildung (9 bis 20) ---------- */
    o('Fortbildung', 'Lehrkräftefortbildung: Gedenkstätte als außerschulischer Lernort', T_FORTBILDUNG, { zg: ['Aus- und Weiterbildung'], thema: ['Demokratiegeschichte', 'NS-Diktatur', 'SED-Diktatur'], dauer: '6 Std.', dk: 'Ganztag oder mehrtägig' }),
    o('Fortbildung', 'Fortbildung: Inklusive Vermittlung am historischen Ort', 'Für Pädagog:innen und Multiplikator:innen: Methoden für heterogene Gruppen, Leichte Sprache und barrierearme Materialien.', { zg: ['Aus- und Weiterbildung', 'Inklusion'], thema: ['Menschenrechte', 'Demokratiegeschichte'], fb: ['Leichte Sprache', 'Kognitive Beeinträchtigung'], bf: ['Leichte Sprache'], dauer: '4 Std.', dk: 'Halbtag' }),
    o('Workshop', 'Workshop für Polizei und Justiz: Rechtsstaat und Willkür', 'Anhand historischer Fallbeispiele reflektieren Teilnehmende ihre eigene Rolle in Rechtsstaat und Verwaltung.', { zg: ['Aus- und Weiterbildung'], thema: ['Justiz und Haft', 'Menschenrechte'], dauer: '4 Std.', dk: 'Halbtag' }),
    o('Fortbildung', 'Graphic Novels im Unterricht – Fortbildung zu UNVERGESSEN und Grenzlinien', 'Die Fortbildung stellt beide Graphic Novels der Stiftung vor und zeigt Einsatzmöglichkeiten in Geschichte, Deutsch und Kunst.', { zg: ['Aus- und Weiterbildung'], thema: ['Biografien', 'NS-Diktatur', 'SED-Diktatur'], dauer: '3 Std.', dk: '2 bis 4 Std.' }),
    o('Führung', 'Teamtag: Führung und Gespräch für Kollegien', 'Ein halber Tag für Schulkollegien oder Teams aus Verwaltung und Wirtschaft: Rundgang, Impuls und moderierter Austausch.', { zg: ['Aus- und Weiterbildung', 'Erwachsenenbildung'], thema: ['Demokratiegeschichte', 'Menschenrechte'], dauer: '4 Std.', dk: 'Halbtag' }),

    /* ---------- Erwachsenenbildung (9 bis 20) ---------- */
    o('Führung', 'Öffentliche Führung am Wochenende', T_FUEHRUNG, { zg: ['Erwachsenenbildung'], thema: ['NS-Diktatur', 'Sowjetische Besatzung', 'SED-Diktatur'], dauer: '1,5 Std.', dk: 'Bis 2 Std.', sprache: ['Deutsch', 'Englisch'] }),
    o('Führung', 'Themenführung: Die Lindenstraße 1945 bis 1952', T_SBZ, { zg: ['Erwachsenenbildung', 'Hochschulen'], thema: ['Sowjetische Besatzung', 'Justiz und Haft'], dauer: '2 Std.', dk: 'Bis 2 Std.', sprache: ['Deutsch', 'Russisch'] }),
    o('Workshop', 'Familiengeschichte erforschen – Recherche-Workshop', 'Für Angehörige und Interessierte: Wo finde ich Akten, wie lese ich sie, und welche Stellen helfen weiter?', { zg: ['Erwachsenenbildung'], thema: ['Biografien', 'SED-Diktatur', 'Sowjetische Besatzung'], dauer: '3 Std.', dk: '2 bis 4 Std.' }),
    o('Zeitzeug:innengespräch', 'Abendgespräch mit Zeitzeug:innen', T_ZEITZEUGE, { zg: ['Erwachsenenbildung'], thema: ['SED-Diktatur', 'Biografien', 'Friedliche Revolution'], dauer: '2 Std.', dk: 'Bis 2 Std.' }),

    /* ---------- Inklusion (unter 9) ---------- */
    o('Workshop', 'Workshop in Leichter Sprache: Was ist Freiheit?', T_LEICHT, { zg: ['Inklusion'], thema: ['Menschenrechte', 'Demokratiegeschichte'], fb: ['Leichte Sprache', 'Kognitive Beeinträchtigung'], bf: ['Leichte Sprache'], dauer: '2 Std.', dk: 'Bis 2 Std.' }),
    o('Führung', 'Barrierefreier Rundgang mit Rollstuhl und Rollator', 'Der Rundgang führt über stufenlose Wege durch das Haus und den Hof. Der Zellentrakt wird per Video und Audio erschlossen.', { zg: ['Inklusion', 'Erwachsenenbildung'], thema: ['NS-Diktatur', 'SED-Diktatur'], fb: ['Mobilität'], bf: ['Stufenlos'], dauer: '1,5 Std.', dk: 'Bis 2 Std.' }),
    o('Führung', 'Rundgang mit Audiodeskription', 'Für blinde und sehbehinderte Besucher:innen beschreibt die Führung Räume, Objekte und Bilder ausführlich und bietet Tastobjekte an.', { zg: ['Inklusion'], thema: ['NS-Diktatur', 'Sowjetische Besatzung', 'SED-Diktatur'], fb: ['Sehbeeinträchtigung'], bf: ['Audiodeskription'], dauer: '2 Std.', dk: 'Bis 2 Std.' })
  ];

  return { ZIELGRUPPEN: ZIELGRUPPEN, DETAIL_FILTERS: DETAIL_FILTERS, ANGEBOTE: ANGEBOTE };
})();

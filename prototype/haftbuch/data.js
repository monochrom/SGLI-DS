/* SGLI Prototyp „Haftbuch“ – Dummy-Daten
   ERFUNDEN. Namen, Daten und Urteile sind zufällig kombiniert und beziehen sich auf keine reale Person.
   Die Strafnormen sind typische Tatbestände der drei Zeitschichten, damit der Prototyp plausibel wirkt.
   Deterministisch erzeugt (fester Seed): jede Seitenladung zeigt dieselben Einträge. */

(function () {
  const surnames = [
    'Adler', 'Albrecht', 'Bach', 'Bauer', 'Becker', 'Brandt', 'Dahms', 'Dietrich', 'Ebert', 'Engel',
    'Fischer', 'Franke', 'Graf', 'Günther', 'Hahn', 'Hartmann', 'Heinrich', 'Illing', 'Jahn', 'Jung',
    'Kaiser', 'Keller', 'Klein', 'Krüger', 'Lange', 'Lehmann', 'Lorenz', 'Möller', 'Neumann', 'Nowak',
    'Otto', 'Paul', 'Peters', 'Richter', 'Roth', 'Schulz', 'Schröder', 'Seidel', 'Thiele', 'Ulrich',
    'Vogel', 'Voigt', 'Wagner', 'Walter', 'Winkler', 'Zimmermann', 'Zander'
  ];
  const firstnames = [
    'Erich', 'Bruno', 'Walter', 'Kurt', 'Herbert', 'Gerhard', 'Werner', 'Helmut', 'Otto', 'Paul',
    'Friedrich', 'Hans', 'Karl', 'Wilhelm', 'Günter', 'Heinz', 'Dieter', 'Manfred', 'Rolf', 'Siegfried',
    'Gertrud', 'Erna', 'Hildegard', 'Margarete', 'Elisabeth', 'Charlotte', 'Irmgard', 'Ursula', 'Christa', 'Renate'
  ];
  const places = [
    'Potsdam (Großstadt)', 'Guben (Kleinstadt)', 'Brandenburg an der Havel (Mittelstadt)', 'Werder (Havel) (Kleinstadt)',
    'Beelitz (Kleinstadt)', 'Rathenow (Mittelstadt)', 'Berlin (Großstadt)', 'Treuenbrietzen (Kleinstadt)',
    'Michendorf (Dorf)', 'Caputh (Dorf)', 'Nauen (Kleinstadt)', 'Teltow (Kleinstadt)', 'Cottbus (Großstadt)',
    'Belzig (Kleinstadt)', 'Ketzin (Dorf)'
  ];

  /* Zeitschichten: Haftjahre, typische Strafnormen und Strafmaße */
  const periods = {
    ns: {
      from: 1933, to: 1944,
      statutes: ['§ 2 Heimtückegesetz', '§ 83 RStGB Vorbereitung zum Hochverrat', '§ 5 KSSVO Wehrkraftzersetzung', '§ 175 RStGB'],
      sentences: ['8 Monate', '1 Jahr 6 Monate', '3 Jahre', '5 Jahre Zuchthaus', 'Todesurteil']
    },
    sbz: {
      from: 1945, to: 1951,
      statutes: ['Art. 58-6 Spionage', 'Art. 58-10 Antisowjetische Propaganda', 'Art. 58-11 Gruppenbildung', 'Art. 58-14 Sabotage'],
      sentences: ['10 Jahre', '15 Jahre', '25 Jahre', 'Todesurteil']
    },
    sed: {
      from: 1952, to: 1989,
      statutes: ['§ 213 StGB-DDR Ungesetzlicher Grenzübertritt', '§ 106 StGB-DDR Staatsfeindliche Hetze', '§ 220 StGB-DDR Öffentliche Herabwürdigung', '§ 249 StGB-DDR Asoziales Verhalten'],
      sentences: ['1 Jahr', '1 Jahr 8 Monate', '2 Jahre 6 Monate', '4 Jahre']
    }
  };
  const periodKeys = ['ns', 'sbz', 'sbz', 'sed', 'sed']; /* Gewichtung wie in der Gedenkstätte: SBZ und DDR überwiegen */

  /* Mulberry32: kleiner, deterministischer Zufallsgenerator */
  let seed = 1946;
  function rand() {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];
  const int = (min, max) => min + Math.floor(rand() * (max - min + 1));
  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (d) => `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
  const addDays = (d, days) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);

  const entries = [];
  const seen = new Set();
  let id = 1;
  while (entries.length < 124) {
    const surname = pick(surnames);
    const firstname = pick(firstnames);
    const key = surname + firstname;
    if (seen.has(key)) continue;
    seen.add(key);

    const periodKey = pick(periodKeys);
    const p = periods[periodKey];
    const arrest = new Date(int(p.from, p.to), int(0, 11), int(1, 28));
    const born = new Date(arrest.getFullYear() - int(17, 62), int(0, 11), int(1, 28));
    const conviction = addDays(arrest, -int(1, 40));
    const release = addDays(arrest, int(40, 900));

    entries.push({
      id: id++,
      surname,
      firstname,
      born: fmt(born),
      birthplace: pick(places),
      period: periodKey,
      custody: `${fmt(arrest)} - ${fmt(release)}`,
      conviction: fmt(conviction),
      statute: pick(p.statutes),
      sentence: pick(p.sentences)
    });
  }

  /* Nur wenige Einträge haben eine ausgearbeitete Biografie: jeder vierte (25 %), nur dort gibt es
     „Zur Biografie“. Über die id statt rand(), damit die übrigen Dummy-Daten unverändert bleiben. */
  entries.forEach((e) => { e.biography = e.id % 4 === 0; });

  entries.sort((a, b) => a.surname.localeCompare(b.surname, 'de') || a.firstname.localeCompare(b.firstname, 'de'));

  window.HAFTBUCH = entries;
})();

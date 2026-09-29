/* SGLI Prototyp „Haftbuch“ – Liste, Auf- und Zuklappen, Suche und Filter (Vanilla JS)
   Figma: haftbuch-list 2473:10373, list-cell-haftbuch 2311:5 (Default / hover / open).
   Daten: window.HAFTBUCH aus data.js (erfunden). */

(function () {
  const PAGE_SIZE = 10;
  const SPRITE = '../../dist/icons/sprite.svg';
  const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const entries = window.HAFTBUCH || [];
  const state = { query: '', period: '', letter: '', visible: PAGE_SIZE };

  const el = {
    form: document.querySelector('[data-hb-form]'),
    heading: document.getElementById('hb-heading'),
    query: document.querySelector('[data-hb-query]'),
    period: document.querySelector('[data-hb-period]'),
    alpha: document.querySelector('[data-hb-alpha]'),
    count: document.querySelector('[data-hb-count]'),
    reset: document.querySelector('[data-hb-reset]'),
    table: document.querySelector('.hb-table'),
    list: document.querySelector('[data-hb-list]'),
    empty: document.querySelector('[data-hb-empty]'),
    moreWrap: document.querySelector('[data-hb-more-wrap]'),
    more: document.querySelector('[data-hb-more]')
  };

  /* ---------- Suche: Groß-/Kleinschreibung und Umlaute egal, „Vorname Name“ und „Name, Vorname“ ---------- */
  const normalize = (s) => s.toLocaleLowerCase('de').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss');
  entries.forEach((e) => {
    e.search = normalize(`${e.surname}, ${e.firstname} ${e.firstname} ${e.surname}`);
    e.initial = normalize(e.surname).charAt(0).toUpperCase();
  });

  function matches(e, ignoreLetter) {
    if (state.period && e.period !== state.period) return false;
    if (state.query && !e.search.includes(normalize(state.query))) return false;
    if (!ignoreLetter && state.letter && e.initial !== state.letter) return false;
    return true;
  }

  /* ---------- Buchstaben (Chip): Einfachauswahl, erneuter Klick hebt auf.
     Buchstaben ohne Treffer (bei aktueller Suche und Zeitraum) sind disabled. ---------- */
  const letterButtons = LETTERS.map((letter) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.className = 'chip hb-letter';
    btn.type = 'button';
    btn.textContent = letter;
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', () => {
      state.letter = state.letter === letter ? '' : letter;
      update();
    });
    li.append(btn);
    el.alpha.append(li);
    return btn;
  });

  function updateLetters() {
    const available = new Set(entries.filter((e) => matches(e, true)).map((e) => e.initial));
    if (state.letter && !available.has(state.letter)) state.letter = '';
    letterButtons.forEach((btn) => {
      const letter = btn.textContent;
      btn.disabled = !available.has(letter);
      btn.setAttribute('aria-pressed', String(state.letter === letter));
    });
  }

  /* ---------- Zeile (list-cell-haftbuch, Type=Item) ---------- */
  function icon(name, extra) {
    return `<svg class="icon ${extra}" aria-hidden="true" focusable="false"><use href="${SPRITE}#icon-${name}"></use></svg>`;
  }

  function rowHTML(e) {
    const sid = `hb-summary-${e.id}`;
    const did = `hb-details-${e.id}`;
    return `
      <button class="hb-row__summary" type="button" id="${sid}" aria-expanded="false" aria-controls="${did}">
        <span class="hb-row__name text-h6">${e.surname}, ${e.firstname}</span>
        <span class="hb-row__cell hb-row__birth"><span class="sr-only">geboren am </span>${e.born}</span>
        <span class="hb-row__cell hb-row__place"><span class="sr-only">in </span>${e.birthplace}</span>
        <span class="hb-row__cell hb-row__custody"><span class="sr-only">, Haftzeitraum </span>${e.custody}</span>
        <span class="hb-row__icon">${icon('Plus', 'icon--plus')}${icon('Minus', 'icon--minus')}</span>
      </button>
      <div class="hb-row__collapse" id="${did}">
        <div class="hb-row__collapse-inner">
          <div class="hb-row__panel">
            <dl class="hb-details">
              <div class="hb-details__field hb-details__field--phone"><dt>Geburtsort:</dt><dd>${e.birthplace}</dd></div>
              <div class="hb-details__field hb-details__field--phone"><dt>Haftzeitraum:</dt><dd>${e.custody}</dd></div>
              <div class="hb-details__field"><dt>Verurteilungsdatum:</dt><dd>${e.conviction}</dd></div>
              <div class="hb-details__field"><dt>Strafnormen:</dt><dd>${e.statute}</dd></div>
              <div class="hb-details__field"><dt>Strafmaß:</dt><dd>${e.sentence}</dd></div>
            </dl>
            ${e.biography ? `<a class="btn btn--primary hb-row__bio" href="#">Zur Biografie<span class="sr-only"> von ${e.firstname} ${e.surname}</span></a>` : ''}
          </div>
        </div>
      </div>`;
  }

  function createRow(e) {
    const li = document.createElement('li');
    li.className = 'hb-row';
    li.innerHTML = rowHTML(e);
    return li;
  }

  /* ---------- Auf- und Zuklappen ----------
     Mehrere Zeilen dürfen gleichzeitig offen sein. is-animating hält overflow: hidden nur während der
     Bewegung (Fokusring des Buttons bleibt offen unbeschnitten), transitionend räumt auf. */
  function toggle(row, open) {
    const summary = row.querySelector('.hb-row__summary');
    const collapse = row.querySelector('.hb-row__collapse');
    const isOpen = open ?? summary.getAttribute('aria-expanded') !== 'true';
    summary.setAttribute('aria-expanded', String(isOpen));

    if (reduceMotion.matches) {
      row.classList.toggle('is-open', isOpen);
      return;
    }
    row.classList.add('is-animating');
    row.classList.toggle('is-open', isOpen);
    const done = (event) => {
      if (event.target !== collapse || event.propertyName !== 'grid-template-rows') return;
      row.classList.remove('is-animating');
      collapse.removeEventListener('transitionend', done);
    };
    collapse.addEventListener('transitionend', done);
  }

  el.list.addEventListener('click', (event) => {
    const summary = event.target.closest('.hb-row__summary');
    if (summary) toggle(summary.closest('.hb-row'));
  });

  /* ---------- Liste rendern ---------- */
  let results = [];

  function render(append) {
    const from = append ? el.list.children.length : 0;
    const slice = results.slice(from, state.visible);
    if (!append) el.list.replaceChildren();
    const frag = document.createDocumentFragment();
    slice.forEach((e) => frag.append(createRow(e)));
    el.list.append(frag);

    el.empty.hidden = results.length > 0;
    el.moreWrap.hidden = state.visible >= results.length;
    return el.list.children[from];
  }

  function updateMeta() {
    const n = results.length;
    el.count.textContent = `${n.toLocaleString('de-DE')} ${n === 1 ? 'Eintrag' : 'Einträge'}`;
    el.reset.classList.toggle('is-hidden', !(state.query || state.period || state.letter));
  }

  /* Crossfade wie in angebote-filter: abblenden, nach --motion-fast neu bauen, einblenden */
  let fadeTimer;
  function update() {
    updateLetters();
    results = entries.filter((e) => matches(e));
    state.visible = PAGE_SIZE;
    updateMeta();

    clearTimeout(fadeTimer);
    if (reduceMotion.matches) { render(false); return; }
    el.table.classList.add('is-updating');
    fadeTimer = setTimeout(() => {
      render(false);
      el.table.classList.remove('is-updating');
    }, 160);
  }

  /* ---------- Eingaben ---------- */
  let queryTimer;
  el.query.addEventListener('input', () => {
    clearTimeout(queryTimer);
    queryTimer = setTimeout(() => {
      state.query = el.query.value.trim();
      update();
    }, 200);
  });
  el.form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearTimeout(queryTimer);
    state.query = el.query.value.trim();
    update();
  });
  el.period.addEventListener('change', () => {
    state.period = el.period.value;
    update();
  });
  el.reset.addEventListener('click', () => {
    state.query = '';
    state.period = '';
    state.letter = '';
    el.query.value = '';
    el.period.value = '';
    update();
    /* Der Button verschwindet, der Fokus braucht ein neues Ziel. Tastatur: ins Suchfeld (weiter tippen).
       Maus/Touch: auf die Bereichsüberschrift, sonst öffnet das Suchfeld auf dem Phone die Tastatur. */
    if (document.documentElement.getAttribute('data-focus-modality') === 'pointer') {
      el.heading.focus({ preventScroll: true });
    } else {
      el.query.focus();
    }
  });

  /* „Weitere Ergebnisse laden“: sofort anhängen, Fokus auf die erste neue Zeile */
  el.more.addEventListener('click', () => {
    state.visible += PAGE_SIZE;
    const first = render(true);
    if (first) first.querySelector('.hb-row__summary').focus();
  });

  /* Start ohne Crossfade */
  updateLetters();
  results = entries.filter((e) => matches(e));
  updateMeta();
  render(false);
})();

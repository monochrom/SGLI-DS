/* SGLI Prototyp – Sprachauswahl (global für alle Prototypen)
   Figma: modal, type=language (2859:82 Desktop / 2859:107 Phone), Doku „Modal“ (2860:1449).
   Eine Quelle für alle Seiten: das Script baut den Dialog und hängt ihn an <body>.
   Öffnen über jeden Button mit data-modal-open="modal-language" (Seitenkopf und Menü-Overlay).

   Einbinden (Seite liegt in prototype/<name>/), nach modal.js:
     <script src="../../src/components/modal/modal.js"></script>
     <script src="../shared/language.js"></script>

   Dummy: Deutsch ist vorausgewählt. Ein Klick auf eine Sprache schließt den Dialog nur, es gibt keine
   Übersetzung. Im echten Einsatz führt jede Option per href auf dieselbe Seite in der anderen Sprache. */

(function () {
  var SPRITE = '../../dist/icons/sprite.svg';
  var LANGS = [
    { code: 'de', label: 'Deutsch', current: true },
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' }
  ];

  var options = LANGS.map(function (l) {
    return '<li><a class="modal__option" href="#" hreflang="' + l.code + '" lang="' + l.code + '"' +
      (l.current ? ' aria-current="true"' : '') + '>' +
      '<span class="modal__option-main">' +
        '<span class="modal__indicator" aria-hidden="true"></span>' +
        '<span class="modal__option-label">' + l.label + '</span>' +
      '</span>' +
      '<span class="modal__option-code" aria-hidden="true">' + l.code.toUpperCase() + '</span>' +
    '</a></li>';
  }).join('');

  var html =
    '<dialog class="modal modal--language" id="modal-language" aria-labelledby="modal-language-title">' +
      '<div class="modal__close-row">' +
        '<button class="btn btn--icon modal__close" type="button" data-modal-close aria-label="Schließen">' +
          '<svg class="icon" aria-hidden="true" focusable="false"><use href="' + SPRITE + '#icon-X"></use></svg>' +
        '</button>' +
      '</div>' +
      '<div class="modal__content">' +
        '<div class="modal__head">' +
          '<p class="text-label-s modal__kicker">Sprache · <span lang="en">Language</span></p>' +
          '<h2 class="text-h3 modal__title" id="modal-language-title">Sprache wählen</h2>' +
        '</div>' +
        '<ul class="modal__list">' + options + '</ul>' +
      '</div>' +
    '</dialog>';

  document.body.insertAdjacentHTML('beforeend', html);
  var dialog = document.getElementById('modal-language');
  if (window.SGLI && window.SGLI.modal) window.SGLI.modal.init(dialog);

  dialog.addEventListener('click', function (e) {
    var option = e.target.closest('.modal__option');
    if (!option) return;
    e.preventDefault();
    window.SGLI.modal.close(dialog, option.getAttribute('hreflang'));
  });
})();

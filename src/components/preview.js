// Vorschau-Helfer: klont ein <template> in alle 7 Kontexte. Nur für die Komponenten-Vorschauen.
(function () {
  var CONTEXTS = ['surface-50', 'surface-100', 'surface-200', 'surface-300', 'surface-400', 'primary-900', 'secondary-400'];
  document.querySelectorAll('[data-preview-contexts]').forEach(function (host) {
    var tpl = host.querySelector('template');
    if (!tpl) return;
    CONTEXTS.forEach(function (ctx) {
      var box = document.createElement('div');
      box.setAttribute('data-context', ctx);
      box.appendChild(tpl.content.cloneNode(true));
      host.appendChild(box);
    });
  });
})();

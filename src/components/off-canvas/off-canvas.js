/* SGLI – Off-Canvas (Vanilla, ohne Abhängigkeiten)
   Figma: Doku „Off-Canvas“ (2613:31418) und „Forms“ (2746:24535). Markup und Klassen siehe README.md.

   Öffnen:    <button data-offcanvas-open="id" aria-haspopup="dialog">   oder   SGLI.offcanvas.open('id', opener)
   Schließen: [data-offcanvas-close], Escape, Klick auf den Backdrop, SGLI.offcanvas.close('id')
              Alle Wege laufen über close(): enthält das Panel ein geändertes Formular (form[data-dirty]),
              fragt zuerst das Modal „Eingaben verwerfen?“ (data-offcanvas-confirm="modal-id", Standard
              "modal-discard", braucht modal.js). „Verwerfen“ schließt, alles andere bleibt im Formular.
   Views:     mehrere [data-offcanvas-view="name"] im Panel, sichtbar ist immer eine. SGLI.offcanvas.showView('id', 'name').
              Meldet form.js ein gültiges Formular (Event sgli:form-success), wechselt das Panel zur View
              "success", falls vorhanden. Beim nächsten Öffnen startet das Panel wieder leer mit der ersten View.

   Verhalten: natives <dialog> mit showModal() (Top-Layer, Hintergrund inert, Tab bleibt im Panel).
   Fokus beim Öffnen und beim View-Wechsel auf den Titel (tabindex="-1"), beim Schließen zurück zum Auslöser.
   Der Filter im Prototyp nutzt dasselbe CSS, aber sein eigenes Script, und wird hier nicht angefasst. */

(function () {
  var DEFAULT_CONFIRM = 'modal-discard';
  var openers = new WeakMap();
  var needsReset = new WeakSet();

  function get(target) {
    return typeof target === 'string' ? document.getElementById(target) : target;
  }
  function views(dialog) {
    return Array.prototype.slice.call(dialog.querySelectorAll('[data-offcanvas-view]'));
  }
  function activeView(dialog) {
    return dialog.querySelector('[data-offcanvas-view]:not([hidden])') || dialog;
  }
  function titleOf(dialog) {
    return activeView(dialog).querySelector('.offcanvas__title');
  }
  function isDirty(dialog) {
    return !!dialog.querySelector('form[data-dirty="true"]');
  }
  function focusTitle(dialog) {
    var title = titleOf(dialog);
    if (title) title.focus({ preventScroll: true });
  }

  // Unsichtbare Live-Region je Panel: liest die Bestätigung vor, auch wenn der Fokus auf dem Titel liegt
  function live(dialog) {
    var region = dialog.querySelector('[data-offcanvas-live]');
    if (!region) {
      region = document.createElement('p');
      region.className = 'sr-only';
      region.setAttribute('role', 'status');
      region.setAttribute('data-offcanvas-live', '');
      dialog.appendChild(region);
    }
    return region;
  }

  function showView(target, name, focus) {
    var dialog = get(target);
    if (!dialog) return;
    views(dialog).forEach(function (view) {
      view.hidden = view.getAttribute('data-offcanvas-view') !== name;
    });
    var view = activeView(dialog);
    var body = view.querySelector('.offcanvas__body');
    if (body) body.scrollTop = 0;
    var title = titleOf(dialog);
    if (title && title.id) dialog.setAttribute('aria-labelledby', title.id);
    var announce = view.querySelector('[data-offcanvas-announce]');
    live(dialog).textContent = announce ? announce.textContent.replace(/\s+/g, ' ').trim() : '';
    if (focus !== false) focusTitle(dialog);
  }

  // Zurück auf Anfang: Formulare leeren (inkl. Fehler und Toggle-Abschnitte über form.js), erste View
  function reset(dialog) {
    dialog.querySelectorAll('form').forEach(function (form) {
      if (window.SGLI && window.SGLI.form) window.SGLI.form.reset(form);
      else { form.reset(); delete form.dataset.dirty; }
    });
    var first = views(dialog)[0];
    if (first) showView(dialog, first.getAttribute('data-offcanvas-view'), false);
    live(dialog).textContent = '';
  }

  function open(target, opener) {
    var dialog = get(target);
    if (!dialog || dialog.open) return dialog;
    init(dialog);
    if (needsReset.has(dialog)) { needsReset.delete(dialog); reset(dialog); }
    openers.set(dialog, opener || document.activeElement);
    dialog.showModal();
    focusTitle(dialog);
    return dialog;
  }

  function forceClose(target) {
    var dialog = get(target);
    if (dialog && dialog.open) dialog.close();
  }

  function close(target) {
    var dialog = get(target);
    if (!dialog || !dialog.open) return;
    if (!isDirty(dialog)) { dialog.close(); return; }

    var modal = document.getElementById(dialog.getAttribute('data-offcanvas-confirm') || DEFAULT_CONFIRM);
    var discard = function () { needsReset.add(dialog); dialog.close(); };
    if (modal && window.SGLI && window.SGLI.modal) {
      window.SGLI.modal.confirm(modal, document.activeElement).then(function (value) {
        if (value === 'discard') discard();
      });
    } else if (window.confirm('Eingaben verwerfen?')) {
      discard();
    }
  }

  function onClose(e) {
    var dialog = e.currentTarget;
    // Nach der Bestätigung beginnt das nächste Öffnen mit einem leeren Formular.
    // Zurückgesetzt wird erst dann, sonst sähe man den Wechsel während die Fläche rausfährt.
    var first = views(dialog)[0];
    if (first && first.hidden) needsReset.add(dialog);
    var opener = openers.get(dialog);
    openers.delete(dialog);
    if (opener && opener.isConnected && typeof opener.focus === 'function') opener.focus();
  }

  function onClick(e) {
    var dialog = e.currentTarget;
    var btn = e.target.closest('[data-offcanvas-close]');
    if (btn && dialog.contains(btn)) { e.preventDefault(); close(dialog); return; }
    // Backdrop: Klick auf den <dialog> selbst außerhalb seiner Fläche
    if (e.target === dialog) {
      var r = dialog.getBoundingClientRect();
      var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) close(dialog);
    }
  }

  function init(dialog) {
    if (!dialog || dialog.dataset.offcanvasReady) return;
    dialog.dataset.offcanvasReady = 'true';
    dialog.addEventListener('close', onClose);
    dialog.addEventListener('click', onClick);
    /* Escape: selbst abfangen statt das native cancel abzuwarten. Chrome überspringt cancel bei
       wiederholtem Escape ohne Nutzeraktion und würde dann ohne Rückfrage schließen. */
    dialog.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      e.preventDefault();
      close(dialog);
    });
    dialog.addEventListener('cancel', function (e) { e.preventDefault(); close(dialog); });
    dialog.addEventListener('sgli:form-success', function (e) {
      if (e.defaultPrevented) return;
      if (dialog.querySelector('[data-offcanvas-view="success"]')) showView(dialog, 'success');
    });
  }

  // Delegation, damit auch Auslöser funktionieren, die erst später ins DOM kommen
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-offcanvas-open]');
    if (!trigger) return;
    var dialog = get(trigger.getAttribute('data-offcanvas-open'));
    if (!dialog) return;
    e.preventDefault();
    open(dialog, trigger);
  });

  window.SGLI = window.SGLI || {};
  window.SGLI.offcanvas = { open: open, close: close, forceClose: forceClose, showView: showView, init: init };
})();

/* SGLI – Form (Vanilla, ohne Abhängigkeiten)
   Figma: Doku „Forms“ (2746:24535), Input-Sets (1647:6622). Markup und Klassen siehe README.md.
   Greift für jedes <form data-form>.

   Toggle-Abschnitte: input[data-form-toggle][aria-controls="id"] blendet .form__collapse#id ein und aus.
                      Aus = zu, inert, Felder im <fieldset disabled> (werden nicht gesendet). Fokus bleibt am Toggle.
   Dirty:             jede Eingabe setzt form.dataset.dirty = "true" (off-canvas.js fragt dann vor dem Schließen).
   Validierung:       beim Absenden, eigene Meldungen statt Browser-Bubbles (novalidate). Fehlerhafte Felder
                      bekommen den Error-State (.field--error / .choice--error, aria-invalid, Meldung per
                      aria-describedby), das erste bekommt den Fokus. Ein Fehler verschwindet beim Korrigieren.
                      Eigene Texte: data-error-required und data-error-type am Feld.
   Erfolg:            Event "sgli:form-success" (bubbles, cancelable, detail.formData) am <form>.
                      Im Prototyp gibt es kein Netzwerk; in Craft hier absenden (fetch) und danach
                      SGLI.offcanvas.showView(…, 'success') aufrufen bzw. das Event per preventDefault() anhalten.
   API:               SGLI.form.validate(form), SGLI.form.reset(form), SGLI.form.init(form) */

(function () {
  var MSG = {
    required: 'Bitte füllen Sie dieses Feld aus.',
    select: 'Bitte wählen Sie eine Option aus.',
    choice: 'Bitte wählen Sie eine Option aus.',
    consent: 'Bitte bestätigen Sie Ihre Einwilligung.',
    email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein, zum Beispiel name@beispiel.de.',
    number: 'Bitte geben Sie eine Zahl ein.',
    min: 'Bitte geben Sie eine Zahl ab {min} ein.',
    max: 'Bitte geben Sie eine Zahl bis {max} ein.',
    other: 'Bitte prüfen Sie Ihre Eingabe.'
  };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');

  function message(el) {
    var v = el.validity;
    if (v.valueMissing) {
      if (el.dataset.errorRequired) return el.dataset.errorRequired;
      if (el.type === 'checkbox') return MSG.consent;
      if (el.type === 'radio') return MSG.choice;
      if (el.tagName === 'SELECT') return MSG.select;
      return MSG.required;
    }
    if (el.dataset.errorType) return el.dataset.errorType;
    if (v.typeMismatch && el.type === 'email') return MSG.email;
    if (v.badInput) return MSG.number;
    if (v.rangeUnderflow) return MSG.min.replace('{min}', el.min);
    if (v.rangeOverflow) return MSG.max.replace('{max}', el.max);
    return MSG.other;
  }

  // Sprite-Pfad für das WarningCircle: data-sprite am Formular, sonst vom ersten Icon der Seite übernommen
  function spriteUrl(form) {
    if (form.dataset.sprite) return form.dataset.sprite;
    var use = document.querySelector('use[href*="sprite.svg"]');
    return use ? use.getAttribute('href').split('#')[0] : 'sprite.svg';
  }

  function describedBy(el, id, add) {
    var ids = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    ids = ids.filter(function (x) { return x !== id; });
    if (add) ids.push(id);
    if (ids.length) el.setAttribute('aria-describedby', ids.join(' '));
    else el.removeAttribute('aria-describedby');
  }

  // Wo Fehler und Meldung hängen: Feld (.field), Einzel-Checkbox (.choice) oder Radio-Gruppe (fieldset)
  function hostOf(el) {
    if (el.type === 'radio') return { kind: 'group', node: el.closest('fieldset') || el.closest('.choice') };
    if (el.closest('.field')) return { kind: 'field', node: el.closest('.field') };
    return { kind: 'choice', node: el.closest('.choice') };
  }
  function groupInputs(el) {
    return el.type === 'radio' && el.form ? Array.prototype.slice.call(el.form.querySelectorAll('input[type="radio"][name="' + el.name + '"]')) : [el];
  }
  function errorId(el) {
    return (el.type === 'radio' ? el.name : (el.id || el.name)) + '-error';
  }

  function setError(el, text) {
    var host = hostOf(el);
    if (!host.node) return;
    var id = errorId(el);
    var msg = document.getElementById(id);
    if (!msg) {
      msg = document.createElement('p');
      msg.id = id;
      msg.setAttribute('data-form-error', '');
      if (host.kind === 'field') {
        msg.className = 'field__error';
        host.node.appendChild(msg);
      } else {
        msg.className = 'choice__error';
        host.node.insertAdjacentElement('afterend', msg);
      }
    }
    msg.textContent = text;
    if (host.kind === 'field') {
      host.node.classList.add('field--error');
      // WarningCircle rechts in der Box. Select und Datum haben dort schon ihr Icon (Caret, Kalender, Uhr).
      var box = host.node.querySelector('.field__box');
      var hasIcon = host.node.classList.contains('field--select') || host.node.classList.contains('field--date');
      if (box && !hasIcon && !box.querySelector('.field__icon--error')) {
        box.insertAdjacentHTML('beforeend', '<svg class="icon field__icon field__icon--error" aria-hidden="true" focusable="false"><use href="' + spriteUrl(el.form) + '#icon-WarningCircle"></use></svg>');
      }
    } else if (host.kind === 'choice') {
      host.node.classList.add('choice--error');
    } else {
      host.node.querySelectorAll('.choice').forEach(function (c) { c.classList.add('choice--error'); });
    }
    groupInputs(el).forEach(function (input) {
      input.setAttribute('aria-invalid', 'true');
      describedBy(input, id, true);
    });
  }

  function clearError(el) {
    var host = hostOf(el);
    var id = errorId(el);
    var msg = document.getElementById(id);
    if (msg && msg.hasAttribute('data-form-error')) msg.remove();
    if (host.node) {
      host.node.classList.remove('field--error', 'choice--error');
      host.node.querySelectorAll('.choice--error').forEach(function (c) { c.classList.remove('choice--error'); });
      var icon = host.node.querySelector('.field__icon--error');
      if (icon) icon.remove();
    }
    groupInputs(el).forEach(function (input) {
      input.removeAttribute('aria-invalid');
      describedBy(input, id, false);
    });
  }

  function controls(form) {
    var seen = {};
    return Array.prototype.filter.call(form.elements, function (el) {
      if (!el.willValidate || el.closest('[inert]')) return false;
      if (el.type === 'radio') { if (seen[el.name]) return false; seen[el.name] = true; }
      return true;
    });
  }

  function isValid(el) {
    if (el.type !== 'radio') return el.checkValidity();
    return groupInputs(el).every(function (input) { return input.checkValidity(); });
  }

  // Prüft alle aktiven Felder, setzt oder löscht Fehler und liefert das erste fehlerhafte Feld
  function validate(form) {
    var first = null;
    controls(form).forEach(function (el) {
      if (isValid(el)) { clearError(el); return; }
      setError(el, message(el));
      if (!first) first = el;
    });
    return first;
  }

  function focusField(el) {
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: 'center', behavior: reduceMotion && reduceMotion.matches ? 'auto' : 'smooth' });
  }

  /* ---------- Toggle-Abschnitte ---------- */
  function syncToggle(toggle, animate) {
    var panel = document.getElementById(toggle.getAttribute('aria-controls'));
    if (!panel) return;
    var on = toggle.checked;
    var changed = panel.classList.contains('is-open') !== on;
    if (animate && changed && !(reduceMotion && reduceMotion.matches)) {
      // Während der Bewegung schneidet overflow den Inhalt ab, danach nicht mehr (Fokusringe außen)
      panel.classList.add('is-animating');
      var done = function () { panel.classList.remove('is-animating'); panel.removeEventListener('transitionend', done); };
      panel.addEventListener('transitionend', done);
      window.setTimeout(done, 600);
    }
    panel.classList.toggle('is-open', on);
    panel.inert = !on;
    panel.querySelectorAll('fieldset').forEach(function (fs) { fs.disabled = !on; });
    if (!on) panel.querySelectorAll('[aria-invalid="true"]').forEach(clearError);
  }
  function syncToggles(form, animate) {
    form.querySelectorAll('[data-form-toggle]').forEach(function (t) { syncToggle(t, animate); });
  }

  function reset(form) {
    form.reset();
    form.querySelectorAll('[aria-invalid="true"]').forEach(clearError);
    delete form.dataset.dirty;
    syncToggles(form, false);
  }

  function init(form) {
    if (form.dataset.formReady) return;
    form.dataset.formReady = 'true';
    form.noValidate = true;
    syncToggles(form, false);

    form.addEventListener('change', function (e) {
      if (e.target.matches('[data-form-toggle]')) syncToggle(e.target, true);
    });

    ['input', 'change'].forEach(function (type) {
      form.addEventListener(type, function (e) {
        var el = e.target;
        if (!el.form) return;
        form.dataset.dirty = 'true';
        if (el.getAttribute('aria-invalid') === 'true') {
          if (isValid(el)) clearError(el);
          else if (type === 'change') setError(el, message(el));
        }
      });
    });

    // Nativer Reset (z. B. <button type="reset">): Werte setzt der Browser erst nach dem Event zurück
    form.addEventListener('reset', function () {
      window.setTimeout(function () {
        form.querySelectorAll('[aria-invalid="true"]').forEach(clearError);
        delete form.dataset.dirty;
        syncToggles(form, false);
      }, 0);
    });

    // Datum und Uhrzeit: Klick auf die Box öffnet den nativen Picker (das Icon ist nur Deko)
    form.addEventListener('click', function (e) {
      var box = e.target.closest('.field--date .field__box');
      if (!box) return;
      var input = box.querySelector('.field__input');
      if (input && !input.disabled && typeof input.showPicker === 'function') {
        try { input.showPicker(); } catch (err) { /* ohne Nutzeraktion oder im iframe nicht erlaubt */ }
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var first = validate(form);
      if (first) { focusField(first); return; }
      delete form.dataset.dirty;
      form.dispatchEvent(new CustomEvent('sgli:form-success', {
        bubbles: true,
        cancelable: true,
        detail: { formData: new FormData(form) }
      }));
    });
  }

  function initAll() { document.querySelectorAll('form[data-form]').forEach(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll);
  else initAll();

  window.SGLI = window.SGLI || {};
  window.SGLI.form = { init: init, validate: validate, reset: reset };
})();

/* SGLI – Modal (Vanilla, ohne Abhängigkeiten)
   Figma: modal (2859:132). Markup und Klassen siehe README.md.

   Öffnen:   <button data-modal-open="modal-id">   oder   SGLI.modal.open('modal-id', opener)
   Schließen: [data-modal-close] (value = Rückgabewert), Escape, Klick auf den Backdrop, SGLI.modal.close()
   Rückfrage: SGLI.modal.confirm('modal-id', opener).then(function (value) { … })
              value = value des geklickten [data-modal-close]-Buttons, sonst "cancel"
              (Escape, Backdrop und Close zählen als Abbruch = „Weiter bearbeiten“).

   Verhalten: natives <dialog> mit showModal() (Top-Layer über Off-Canvas und Menü, Rest der Seite inert,
   Tab bleibt im Dialog). Fokus beim Öffnen auf [autofocus] bzw. die aktuelle Option (aria-current),
   sonst auf den ersten Button. Beim Schließen zurück zum auslösenden Element. Seite scrollt nicht,
   solange ein Modal offen ist. */

(function () {
  var root = document.documentElement;
  var openers = new WeakMap();
  var resolvers = new WeakMap();
  var lockCount = 0;
  var padded = false;

  function lock() {
    if (lockCount++ > 0) return;
    var scrollbar = window.innerWidth - root.clientWidth;
    if (scrollbar > 0) { root.style.paddingRight = scrollbar + 'px'; padded = true; }
    root.classList.add('modal-lock');
  }
  function unlock() {
    if (--lockCount > 0) return;
    lockCount = 0;
    root.classList.remove('modal-lock');
    if (padded) { root.style.paddingRight = ''; padded = false; }
  }

  function get(target) {
    return typeof target === 'string' ? document.getElementById(target) : target;
  }

  function open(target, opener) {
    var dialog = get(target);
    if (!dialog || dialog.open) return dialog;
    openers.set(dialog, opener || document.activeElement);
    dialog.returnValue = '';
    dialog.showModal();
    lock();
    var first = dialog.querySelector('[autofocus], [aria-current="true"]') || dialog.querySelector('button, a[href]');
    if (first) first.focus();
    return dialog;
  }

  function close(target, value) {
    var dialog = get(target);
    if (dialog && dialog.open) dialog.close(value || 'cancel');
  }

  function confirm(target, opener) {
    return new Promise(function (resolve) {
      var dialog = open(target, opener);
      if (dialog) resolvers.set(dialog, resolve);
      else resolve('cancel');
    });
  }

  function onClose(e) {
    var dialog = e.currentTarget;
    unlock();
    var resolve = resolvers.get(dialog);
    if (resolve) { resolvers.delete(dialog); resolve(dialog.returnValue || 'cancel'); }
    var opener = openers.get(dialog);
    openers.delete(dialog);
    if (opener && opener.isConnected && typeof opener.focus === 'function') opener.focus();
  }

  function onClick(e) {
    var dialog = e.currentTarget;
    var btn = e.target.closest('[data-modal-close]');
    if (btn && dialog.contains(btn)) { close(dialog, btn.value || 'cancel'); return; }
    // Backdrop: Klick auf den <dialog> selbst außerhalb seiner Fläche
    if (e.target === dialog) {
      var r = dialog.getBoundingClientRect();
      var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) close(dialog, 'cancel');
    }
  }

  function init(dialog) {
    if (dialog.dataset.modalReady) return;
    dialog.dataset.modalReady = 'true';
    dialog.addEventListener('close', onClose);
    dialog.addEventListener('click', onClick);
    // Escape: einheitlicher Rückgabewert "cancel"
    dialog.addEventListener('cancel', function (e) { e.preventDefault(); close(dialog, 'cancel'); });
  }

  function initAll() { document.querySelectorAll('dialog.modal').forEach(init); }

  // Delegation, damit auch Trigger funktionieren, die erst später ins DOM kommen (z. B. im Menü-Overlay)
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-modal-open]');
    if (!trigger) return;
    var dialog = get(trigger.getAttribute('data-modal-open'));
    if (!dialog) return;
    e.preventDefault();
    init(dialog);
    open(dialog, trigger);
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll);
  else initAll();

  window.SGLI = window.SGLI || {};
  window.SGLI.modal = { open: function (t, o) { var d = get(t); if (d) init(d); return open(d, o); }, close: close, confirm: function (t, o) { var d = get(t); if (d) init(d); return confirm(d, o); }, init: init };
})();

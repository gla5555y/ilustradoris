(function () {
  /* ---------- Size selector on product pages ---------- */
  document.querySelectorAll('[data-product]').forEach(function (root) {
    var dataEl = root.querySelector('[data-variants]');
    if (!dataEl) return;
    var variants = JSON.parse(dataEl.textContent);
    var idInput = root.querySelector('input[name="id"]');
    var priceEl = root.querySelector('.pdp-price');
    var buyBtn = root.querySelector('.pdp-buy');
    var groups = root.querySelectorAll('.pdp-variants');

    function selected() {
      return Array.prototype.map.call(groups, function (g) {
        var on = g.querySelector('[aria-checked="true"]');
        return on ? on.dataset.value : null;
      });
    }
    function update() {
      var opts = selected();
      var match = variants.filter(function (v) {
        return v.options.every(function (o, i) { return opts[i] === null || opts[i] === o; });
      })[0];
      if (!match) return;
      idInput.value = match.id;
      priceEl.textContent = match.price;
      buyBtn.disabled = !match.available;
      buyBtn.textContent = match.available ? buyBtn.dataset.buy : buyBtn.dataset.soldout;
      var url = new URL(window.location.href);
      url.searchParams.set('variant', match.id);
      history.replaceState(null, '', url.toString());
    }
    groups.forEach(function (g) {
      var buttons = Array.prototype.slice.call(g.querySelectorAll('.pdp-variant'));
      function pick(btn, focus) {
        buttons.forEach(function (b) {
          var on = b === btn;
          b.setAttribute('aria-checked', on ? 'true' : 'false');
          b.tabIndex = on ? 0 : -1;
        });
        if (focus) btn.focus();
        update();
      }
      buttons.forEach(function (b, i) {
        b.addEventListener('click', function () { pick(b); });
        b.addEventListener('keydown', function (e) {
          var step = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 0;
          if (!step) return;
          e.preventDefault();
          pick(buttons[(i + step + buttons.length) % buttons.length], true);
        });
      });
    });

    /* Drawers: only one open at a time (fallback for browsers without <details name>) */
    var drawers = root.querySelectorAll('.pdp-accordion details');
    drawers.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        drawers.forEach(function (o) { if (o !== d && o.open) o.open = false; });
      });
    });

    /* Entrance (class set inline by the product section): header color grows down, then the artwork fades in */
    if (root.classList.contains('pdp-enter')) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { root.classList.add('is-running'); });
      });
      setTimeout(function () { root.classList.remove('pdp-enter', 'is-running'); }, 1400);
    }
  });
})();

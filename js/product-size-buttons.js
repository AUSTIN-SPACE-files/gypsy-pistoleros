// product-size-buttons.js
// Replaces the native size <select> on single-product pages with a horizontal
// row of size buttons. The select stays in the DOM and live so all three
// Stimulus controllers (variations-options, variations-price, inventory-form)
// keep firing via a synthetic change event.

(function () {
  'use strict';

  function syncActive(row, value) {
    row.querySelectorAll('.v0-size-btn').forEach(function (btn) {
      btn.classList.toggle('v0-size-btn--active', btn.dataset.value === value);
    });
  }

  function initSizeButtons() {
    if (!document.querySelector('.website-page-single-feature')) return;

    document.querySelectorAll('[data-controller~="cart--salable-item"]').forEach(function (form) {
      if (form.dataset.v0SizeDone) return;

      form.querySelectorAll('select[name^="cart_item[option_"]').forEach(function (select) {
        select.classList.add('v0-select-hidden');

        var row = document.createElement('div');
        row.className = 'v0-size-row';

        Array.from(select.options).forEach(function (option) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'v0-size-btn';
          btn.dataset.value = option.value;
          btn.textContent = option.text.replace(/\s*-\s*Out of stock$/i, '');

          if (option.disabled) {
            btn.classList.add('v0-size-btn--oos');
            btn.disabled = true;
          } else {
            btn.addEventListener('click', function () {
              select.value = btn.dataset.value;
              select.dispatchEvent(new Event('change', { bubbles: true }));
              syncActive(row, btn.dataset.value);
            });
          }

          if (option.value === select.value) {
            btn.classList.add('v0-size-btn--active');
          }

          row.appendChild(btn);
        });

        var cell = select.closest('td.item-option-select') || select.parentNode;
        cell.appendChild(row);

        // Re-sync active class when Stimulus controllers update the selection
        select.addEventListener('change', function () {
          syncActive(row, select.value);
        });
      });

      form.dataset.v0SizeDone = '1';
    });
  }

  document.addEventListener('DOMContentLoaded', initSizeButtons);
  document.addEventListener('turbo:load', initSizeButtons);
}());

// product-size-buttons.js
// Replaces the native size <select> on single-product pages with a horizontal
// row of size buttons. The select stays in the DOM and live so all three
// Stimulus controllers (variations-options, variations-price, inventory-form)
// keep firing via a synthetic change event.
// Also: relabels the add-to-cart button to "Add to Cart" and mirrors price above it.

(function () {
  'use strict';

  function syncActive(row, value) {
    row.querySelectorAll('.v0-size-btn').forEach(function (btn) {
      btn.classList.toggle('v0-size-btn--active', btn.dataset.value === value);
    });
  }

  function fillPriceLine(line, cartBtn) {
    var saleTagEl = cartBtn.querySelector('.sale-tag-text');
    var oldPriceEl = cartBtn.querySelector('.old-price');
    var nowText = '';
    for (var i = cartBtn.childNodes.length - 1; i >= 0; i--) {
      var node = cartBtn.childNodes[i];
      if (node.nodeType === 3 && node.textContent.trim()) {
        nowText = node.textContent.trim();
        break;
      }
    }
    line.innerHTML = '';
    if (saleTagEl && oldPriceEl) {
      var saleSpan = document.createElement('span');
      saleSpan.className = 'v0-sale-tag';
      saleSpan.textContent = saleTagEl.textContent.trim();
      line.appendChild(saleSpan);
      var oldSpan = document.createElement('span');
      oldSpan.className = 'v0-old-price';
      oldSpan.textContent = oldPriceEl.textContent.trim();
      line.appendChild(oldSpan);
    }
    var nowSpan = document.createElement('span');
    nowSpan.className = 'v0-now-price';
    nowSpan.textContent = nowText;
    line.appendChild(nowSpan);
  }

  function initSizeButtons() {
    if (!document.querySelector('.website-page-single-feature')) return;

    document.querySelectorAll('[data-controller~="cart--salable-item"]').forEach(function (form) {
      if (form.dataset.v0SizeDone) return;

      var selects = [];

      form.querySelectorAll('select[name^="cart_item[option_"]').forEach(function (select) {
        select.classList.add('v0-select-hidden');
        selects.push(select);

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

        select.addEventListener('change', function () {
          syncActive(row, select.value);
        });
      });

      // ── Cart button relabel + price mirror ──────────────────────────────
      var cartBtn = form.querySelector('button.add-to-cart');
      if (cartBtn && !cartBtn.classList.contains('v0-cart-relabel')) {
        // Build price line and insert immediately before the button
        var priceLine = document.createElement('div');
        priceLine.className = 'v0-price-line';
        fillPriceLine(priceLine, cartBtn);
        cartBtn.parentNode.insertBefore(priceLine, cartBtn);

        // Insert label as first child; CSS hides native button text via font-size:0
        var labelSpan = document.createElement('span');
        labelSpan.className = 'v0-cart-label';
        labelSpan.textContent = 'Add to Cart';
        cartBtn.insertBefore(labelSpan, cartBtn.firstChild);
        cartBtn.classList.add('v0-cart-relabel');

        // Keep price line in sync on select change (Stimulus price refresh)
        selects.forEach(function (sel) {
          sel.addEventListener('change', function () {
            fillPriceLine(priceLine, cartBtn);
          });
        });

        // MutationObserver as backstop for direct DOM updates by Stimulus
        var observer = new MutationObserver(function () {
          fillPriceLine(priceLine, cartBtn);
        });
        observer.observe(cartBtn, { childList: true, subtree: true, characterData: true });
      }

      form.dataset.v0SizeDone = '1';
    });
  }

  document.addEventListener('DOMContentLoaded', initSizeButtons);
  document.addEventListener('turbo:load', initSizeButtons);
}());

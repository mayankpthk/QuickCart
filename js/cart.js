/* ═══════════════════════════════════════════════════════
   js/cart.js
   Cart state, add/remove, UI updates, checkout, order
═══════════════════════════════════════════════════════ */

var cart           = {};   // { productId: qty }
var pendingWaLink  = '';

/* ── Helpers ── */
function cartItems() {
  return Object.keys(cart)
    .filter(function (id) { return cart[id] > 0; })
    .map(function (id) {
      return { p: PRODUCTS.find(function (p) { return p.id === parseInt(id); }), qty: cart[id] };
    })
    .filter(function (x) { return x.p; });
}

function cartTotal() {
  return cartItems().reduce(function (sum, x) { return sum + x.p.price * x.qty; }, 0);
}

function cartCount() {
  return cartItems().reduce(function (sum, x) { return sum + x.qty; }, 0);
}

/* ── Add to cart ── */
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  updateCartUI();
  refreshProductCard(id);
  showToast('Added to cart 🛒', 'green');
}

/* ── Change qty from cart sidebar ── */
function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  updateCartUI();
  refreshProductCard(id);
}

/* ── Refresh one product card's add-button ── */
function refreshProductCard(id) {
  var btn = document.querySelector('[data-pid="' + id + '"]');
  if (!btn) return;
  var qty = cart[id] || 0;
  if (qty > 0) {
    btn.className = 'add-btn in-cart';
    btn.innerHTML =
      '<button class="minus" onclick="changeQty(' + id + ',-1);event.stopPropagation()">−</button>' +
      '<span class="qty">' + qty + '</span>' +
      '<button class="plus"  onclick="changeQty(' + id + ', 1);event.stopPropagation()">+</button>';
  } else {
    btn.className = 'add-btn';
    btn.innerHTML = '+ Add';
    btn.onclick   = function () { addToCart(id); };
  }
}

/* ── Update entire cart UI ── */
function updateCartUI() {
  var items = cartItems();
  var total = cartTotal();
  var grand = total + PLATFORM_FEE;
  var count = cartCount();

  // Cart count badge
  var badge = document.getElementById('cartCount');
  badge.textContent = count;
  badge.classList.toggle('show', count > 0);

  // Cart header item count
  document.getElementById('cartItemCount').textContent = count > 0 ? '(' + count + ')' : '';

  // Bill totals
  document.getElementById('billItemTotal').textContent  = '₹' + total;
  document.getElementById('billGrandTotal').textContent = '₹' + grand;
  document.getElementById('checkoutTotal').textContent  = '₹' + grand;

  // Cart items list
  var itemsEl  = document.getElementById('cartItemsEl');
  var bottomEl = document.getElementById('cartBottomEl');

  if (!items.length) {
    itemsEl.innerHTML =
      '<div class="cart-empty-state">' +
        '<div class="ce-icon">🛒</div>' +
        '<div style="font-weight:700;font-size:.95rem;margin-bottom:4px">Your cart is empty</div>' +
        '<div style="font-size:.82rem">Add items to get started!</div>' +
      '</div>';
    bottomEl.style.display = 'none';
  } else {
    itemsEl.innerHTML = items.map(function (x) {
      return '<div class="c-item">' +
        '<img class="c-img" src="' + x.p.img + '" alt="' + x.p.name + '" onerror="this.src=\'\';this.style.background=\'#eee\'">' +
        '<div class="c-info">' +
          '<div class="c-name">'   + x.p.name   + '</div>' +
          '<div class="c-weight">' + x.p.weight + '</div>' +
          '<div class="c-price">₹' + (x.p.price * x.qty) + '</div>' +
        '</div>' +
        '<div class="c-qty">' +
          '<button onclick="changeQty(' + x.p.id + ',-1)">−</button>' +
          '<span>' + x.qty + '</span>' +
          '<button onclick="changeQty(' + x.p.id + ', 1)">+</button>' +
        '</div>' +
      '</div>';
    }).join('');
    bottomEl.style.display = '';
  }
}

/* ── Open / close cart sidebar ── */
function openCart() {
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartSidebar').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartSidebar').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Order form ── */
function openOrderForm() {
  var items = cartItems();
  if (!items.length) { showToast('Add items to your cart first!'); return; }

  // Pre-fill user details
  if (currentUser) {
    document.getElementById('oName').value  = currentUser.name  || '';
    document.getElementById('oPhone').value = currentUser.phone || '';

    // Show saved addresses if any
    var addresses = currentUser.addresses || [];
    var section   = document.getElementById('savedAddrSection');
    var select    = document.getElementById('savedAddrSelect');
    if (addresses.length) {
      section.style.display = '';
      select.innerHTML = '<option value="">— Select a saved address —</option>' +
        addresses.map(function (a, i) {
          return '<option value="' + i + '">' + a.type + ': ' + a.text + '</option>';
        }).join('');
    } else {
      section.style.display = 'none';
    }
  }

  // Order summary
  var total = cartTotal();
  var grand = total + PLATFORM_FEE;
  document.getElementById('oSummary').innerHTML =
    '<div class="o-summary-title">🛒 Order Summary</div>' +
    items.map(function (x) {
      return '<div class="o-item-row"><span>' + x.p.name + ' ×' + x.qty + '</span><span>₹' + (x.p.price * x.qty) + '</span></div>';
    }).join('') +
    '<div class="o-total"><span>Grand Total</span><span>₹' + grand + '</span></div>';

  closeCart();
  setTimeout(function () {
    document.getElementById('orderOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }, 200);
}

function closeOrderForm() {
  document.getElementById('orderOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Select saved address ── */
function onSavedAddrSelect(val) {
  if (val === '') return;
  var addresses = (currentUser && currentUser.addresses) || [];
  var addr = addresses[parseInt(val)];
  if (addr) document.getElementById('oAddress').value = addr.text;
}

/* ── Place order ── */
function placeOrder() {
  var name    = document.getElementById('oName').value.trim();
  var phone   = document.getElementById('oPhone').value.trim().replace(/\s/g, '');
  var address = document.getElementById('oAddress').value.trim();

  if (!name)                         { showToast('Please enter your name!');         document.getElementById('oName').focus();    return; }
  if (!phone || !/^\d{10}$/.test(phone)) { showToast('Please enter a valid phone!');  document.getElementById('oPhone').focus();   return; }
  if (!address)                      { showToast('Please enter your address!');       document.getElementById('oAddress').focus(); return; }

  var items      = cartItems();
  var total      = cartTotal();
  var grand      = total + PLATFORM_FEE;
  var orderId    = 'QC' + Date.now().toString().slice(-6);
  var now        = new Date();
  var dateTime   = now.toLocaleDateString('en-IN') + ' ' + now.toLocaleTimeString('en-IN');
  var itemLines  = items.map(function (x) { return x.p.name + ' x' + x.qty + ' = Rs.' + (x.p.price * x.qty); }).join('\n');
  var itemsSummary = items.map(function (x) { return x.p.name + ' ×' + x.qty; }).join(', ');

  // Save to order history
  if (currentUser) {
    var orders = getOrders(currentUser.email);
    orders.push({ orderId: orderId, dateTime: dateTime, itemsSummary: itemsSummary, total: total, grand: grand, address: address });
    saveOrders(currentUser.email, orders);
  }

  // Google Sheets
  fetch(SHEET_URL, {
    method: 'POST', mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId: orderId, dateTime: dateTime, name: name, phone: phone, address: address, items: itemLines, itemTotal: 'Rs.' + total, grandTotal: 'Rs.' + grand })
  }).catch(function () {});

  // WhatsApp message
  var waText =
    'New Order — QuickCart\n\nOrder ID: #' + orderId + '\nDate: ' + dateTime +
    '\nName: ' + name + '\nPhone: ' + phone + '\nAddress: ' + address +
    '\n\nItems:\n' + itemLines +
    '\n\nItem Total : Rs.' + total +
    '\nDelivery   : FREE' +
    '\nPlatform   : Rs.' + PLATFORM_FEE +
    '\nGrand Total: Rs.' + grand +
    '\n\nExpected delivery: 15-20 mins';

  pendingWaLink = 'https://wa.me/' + SHOP_WA + '?text=' + encodeURIComponent(waText);
  window.open(pendingWaLink, '_blank');

  // Email
  var emailSubject = 'New Order #' + orderId + ' — QuickCart';
  var emailBody    =
    'NEW ORDER — QuickCart\n\nOrder ID: #' + orderId +
    '\nDate & Time: ' + dateTime + '\nCustomer: ' + name +
    '\nPhone: ' + phone + '\nAddress: ' + address +
    '\n\nITEMS:\n' + itemLines +
    '\n\nItem Total: Rs.' + total + '\nDelivery: FREE\nPlatform: Rs.' + PLATFORM_FEE +
    '\nGrand Total: Rs.' + grand + '\n\nPlaced via QuickCart website.';
  var a = document.createElement('a');
  a.href = 'mailto:' + SHOP_EMAIL + '?subject=' + encodeURIComponent(emailSubject) + '&body=' + encodeURIComponent(emailBody);
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Show success
  document.getElementById('successOrderId').textContent = 'Order #' + orderId;
  document.getElementById('successWaBtn').onclick = function () { window.open(pendingWaLink, '_blank'); };

  // Clear cart
  cart = {};
  updateCartUI();
  document.getElementById('oAddress').value = '';

  closeOrderForm();
  setTimeout(function () {
    document.getElementById('successOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    filterCat(activeCategory);
  }, 250);
}

/* ── Close success popup ── */
function closeSuccess() {
  document.getElementById('successOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Overlay click-outside close ── */
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('successOverlay').addEventListener('click', function (e) { if (e.target === this) closeSuccess(); });
  document.getElementById('orderOverlay').addEventListener('click', function (e)   { if (e.target === this) closeOrderForm(); });
});

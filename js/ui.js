/* ═══════════════════════════════════════════════════════
   js/ui.js
   Toast, search, location, mobile nav,
   profile panel, orders panel, address mgmt, PWA install
═══════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════ */
var toastTimer;
function showToast(msg, cls) {
  clearTimeout(toastTimer);
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (cls ? ' ' + cls : '');
  toastTimer = setTimeout(function () { t.className = 'toast'; }, 2800);
}

/* ═══════════════════════════════════════════════════════
   SEARCH
═══════════════════════════════════════════════════════ */
function handleSearch(q) {
  var clearBtn   = document.getElementById('searchClear');
  var resultsEl  = document.getElementById('searchResults');
  var inner      = document.getElementById('searchResultsInner');

  clearBtn.className = 'search-clear' + (q.length > 0 ? ' show' : '');
  if (!q.trim()) { resultsEl.classList.remove('open'); return; }

  var results = PRODUCTS.filter(function (p) {
    return p.name.toLowerCase().includes(q.toLowerCase()) ||
      CATEGORIES.find(function (c) { return c.id === p.cat && c.name.toLowerCase().includes(q.toLowerCase()); });
  });

  if (!results.length) {
    inner.innerHTML = '<div class="sr-empty">No products found for "' + q + '"</div>';
  } else {
    inner.innerHTML =
      '<div class="sr-header">Results (' + results.length + ')</div>' +
      results.slice(0, 6).map(function (p) {
        var discount = Math.round((1 - p.price / p.mrp) * 100);
        return '<div class="sr-item">' +
          '<img class="sr-img" src="' + p.img + '" alt="' + p.name + '" onerror="this.style.background=\'#f0f0f0\';this.src=\'\'">' +
          '<div class="sr-info">' +
            '<div class="sr-name">' + p.name + '</div>' +
            '<div class="sr-sub">' + p.weight + ' &nbsp;|&nbsp; ' + discount + '% OFF</div>' +
          '</div>' +
          '<div class="sr-price">₹' + p.price + '</div>' +
          '<button class="sr-add" onclick="searchAdd(' + p.id + ')">+ Add</button>' +
        '</div>';
      }).join('');
  }
  resultsEl.classList.add('open');
}

function searchAdd(id) { addToCart(id); clearSearch(); }

function clearSearch() {
  document.getElementById('searchInput').value = '';
  document.getElementById('searchClear').className = 'search-clear';
  document.getElementById('searchResults').classList.remove('open');
}

// Close search on outside click
document.addEventListener('click', function (e) {
  var wrap = document.querySelector('.search-wrap');
  if (wrap && !wrap.contains(e.target)) {
    document.getElementById('searchResults').classList.remove('open');
  }
});
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') clearSearch(); });

/* ═══════════════════════════════════════════════════════
   LOCATION
═══════════════════════════════════════════════════════ */
function fetchLocation() {
  if (!navigator.geolocation) { showToast('Geolocation not supported'); return; }
  var addrEl = document.getElementById('locAddr');
  addrEl.innerHTML = '<span class="loc-fetching">Fetching…</span>';

  navigator.geolocation.getCurrentPosition(
    function (pos) {
      var lat = pos.coords.latitude;
      var lon = pos.coords.longitude;
      fetch('https://nominatim.openstreetmap.org/reverse?lat=' + lat + '&lon=' + lon + '&format=json')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var parts  = data.address || {};
          var suburb = parts.suburb || parts.neighbourhood || parts.village || '';
          var city   = parts.city   || parts.town || parts.county || '';
          var addr   = [suburb, city].filter(Boolean).join(', ') || data.display_name.split(',').slice(0, 2).join(',');
          addrEl.textContent = addr;
          saveLocation(addr);
          showToast('📍 Location updated!', 'green');
        })
        .catch(function () {
          var fallback = lat.toFixed(4) + ', ' + lon.toFixed(4);
          addrEl.textContent = fallback;
          saveLocation(fallback);
        });
    },
    function (err) {
      addrEl.textContent = 'Location unavailable';
      if (err.code === 1) showToast('Please allow location access');
      else showToast('Could not fetch location');
    },
    { timeout: 10000 }
  );
}

/* ═══════════════════════════════════════════════════════
   MOBILE NAV
═══════════════════════════════════════════════════════ */
function mnTab(tab) {
  setMnActive(tab);
  if      (tab === 'search')  { document.getElementById('searchInput').focus(); }
  else if (tab === 'orders')  { openOrders(); }
  else if (tab === 'profile') { openProfile(); }
  else if (tab === 'home')    { window.scrollTo({ top: 0, behavior: 'smooth' }); }
}

function setMnActive(tab) {
  ['mnHome', 'mnSearch', 'mnOrders', 'mnCart', 'mnProfile'].forEach(function (id) { document.getElementById(id).classList.remove('active'); });
  var map = { home: 'mnHome', search: 'mnSearch', orders: 'mnOrders', cart: 'mnCart', profile: 'mnProfile' };
  if (map[tab]) document.getElementById(map[tab]).classList.add('active');
}

/* ═══════════════════════════════════════════════════════
   PROFILE PANEL
═══════════════════════════════════════════════════════ */
var selectedAddrType = 'Home';

function openProfile() {
  if (!currentUser) return;
  var initial = currentUser.name.charAt(0).toUpperCase();
  document.getElementById('profileAvatar').textContent = initial;
  document.getElementById('profileName').textContent   = currentUser.name;
  document.getElementById('profileEmail').textContent  = currentUser.email;
  document.getElementById('profilePhone').textContent  = '📱 ' + currentUser.phone;
  document.getElementById('piName').textContent  = currentUser.name;
  document.getElementById('piEmail').textContent = currentUser.email;
  document.getElementById('piPhone').textContent = currentUser.phone;

  renderSavedAddresses();
  document.getElementById('profileOverlay').classList.add('open');
  document.getElementById('profilePanel').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProfile() {
  document.getElementById('profileOverlay').classList.remove('open');
  document.getElementById('profilePanel').classList.remove('open');
  document.body.style.overflow = '';
  setMnActive('home');
}

/* ── Saved Addresses ── */
function renderSavedAddresses() {
  var list  = document.getElementById('savedAddrList');
  var addrs = (currentUser && currentUser.addresses) || [];
  if (!addrs.length) {
    list.innerHTML = '<div style="font-size:.82rem;color:var(--gray-light);margin-bottom:12px;">No saved addresses yet.</div>';
    return;
  }
  list.innerHTML = addrs.map(function (a, idx) {
    var icon = a.type === 'Home' ? '🏠' : a.type === 'Work' ? '🏢' : '📍';
    return '<div class="addr-item">' +
      '<div class="addr-icon">' + icon + '</div>' +
      '<div style="flex:1">' +
        '<div class="addr-label">' + a.type + '</div>' +
        '<div class="addr-text">'  + a.text  + '</div>' +
      '</div>' +
      '<button class="addr-del" onclick="deleteAddress(' + idx + ')" title="Delete">🗑</button>' +
    '</div>';
  }).join('');
}

function toggleAddAddrForm() {
  var f = document.getElementById('addAddrForm');
  f.classList.toggle('show');
  if (f.classList.contains('show')) {
    document.getElementById('newAddrText').value = '';
    document.getElementById('newAddrText').focus();
  }
}

function selAddrType(btn) {
  document.querySelectorAll('.addr-type-btn').forEach(function (b) { b.classList.remove('sel'); });
  btn.classList.add('sel');
  selectedAddrType = btn.dataset.type;
}

function saveNewAddress() {
  var text = document.getElementById('newAddrText').value.trim();
  if (!text) { showToast('Please enter an address'); return; }
  var user = currentUser;
  user.addresses = user.addresses || [];
  user.addresses.push({ type: selectedAddrType, text: text });
  updateUser(user);
  renderSavedAddresses();
  document.getElementById('addAddrForm').classList.remove('show');
  document.getElementById('newAddrText').value = '';
  showToast('✅ Address saved!', 'green');
}

function deleteAddress(idx) {
  var user = currentUser;
  user.addresses.splice(idx, 1);
  updateUser(user);
  renderSavedAddresses();
  showToast('Address removed');
}

/* ═══════════════════════════════════════════════════════
   ORDERS HISTORY PANEL
═══════════════════════════════════════════════════════ */
function openOrders() {
  if (!currentUser) return;
  renderOrderHistory();
  document.getElementById('ordersOverlay').classList.add('open');
  document.getElementById('ordersPanel').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeOrders() {
  document.getElementById('ordersOverlay').classList.remove('open');
  document.getElementById('ordersPanel').classList.remove('open');
  document.body.style.overflow = '';
  setMnActive('home');
}

function renderOrderHistory() {
  var body   = document.getElementById('ordersPanelBody');
  var orders = getOrders(currentUser.email);
  if (!orders.length) {
    body.innerHTML =
      '<div class="orders-empty">' +
        '<div class="oe-icon">📦</div>' +
        '<div style="font-weight:700;font-size:.95rem;margin-bottom:6px">No orders yet</div>' +
        '<div style="font-size:.82rem">Your order history will appear here</div>' +
      '</div>';
    return;
  }
  var sorted = orders.slice().reverse();
  body.innerHTML = sorted.map(function (o) {
    return '<div class="order-hist-card">' +
      '<div class="ohc-head">' +
        '<div>' +
          '<div class="ohc-id">#' + o.orderId + '</div>' +
          '<div class="ohc-date">' + o.dateTime + '</div>' +
        '</div>' +
        '<div class="ohc-status">Delivered ✓</div>' +
      '</div>' +
      '<div class="ohc-items">' + o.itemsSummary + '</div>' +
      '<div class="ohc-footer">' +
        '<div class="ohc-total">₹' + o.grand + '</div>' +
        '<div class="ohc-addr">📍 ' + (o.address.length > 30 ? o.address.slice(0, 30) + '…' : o.address) + '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

/* ═══════════════════════════════════════════════════════
   PWA INSTALL
═══════════════════════════════════════════════════════ */
var deferredPrompt = null;

window.addEventListener('beforeinstallprompt', function (e) {
  e.preventDefault();
  deferredPrompt = e;
  showInstallUI();
});

function showInstallUI() {
  var banner    = document.getElementById('installBanner');
  var headerBtn = document.getElementById('headerInstallBtn');
  if (banner)    banner.classList.add('show');
  if (headerBtn) headerBtn.style.display = 'flex';
}

function hideInstallUI() {
  var banner    = document.getElementById('installBanner');
  var headerBtn = document.getElementById('headerInstallBtn');
  if (banner)    banner.classList.remove('show');
  if (headerBtn) headerBtn.style.display = 'none';
}

function triggerInstall() {
  if (deferredPrompt) {
    hideInstallUI();
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function (result) {
      if (result.outcome === 'accepted') showToast('QuickCart installed! 🎉', 'green');
      deferredPrompt = null;
    });
  } else {
    document.getElementById('manualInstallPopup').classList.add('open');
  }
}

function closeManualInstall() {
  document.getElementById('manualInstallPopup').classList.remove('open');
}

window.addEventListener('appinstalled', function () {
  showToast('QuickCart installed! 🎉', 'green');
  hideInstallUI();
});

// Hide install UI if already running as standalone PWA
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
  hideInstallUI();
}

// Dismiss banner button
document.addEventListener('DOMContentLoaded', function () {
  var dismissBtn = document.getElementById('installDismiss');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', function () {
      document.getElementById('installBanner').classList.remove('show');
    });
  }
});

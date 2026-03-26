/* ═══════════════════════════════════════════════════════
   js/main.js
   App boot — check session on load, register service worker
═══════════════════════════════════════════════════════ */

/* ── Boot: check saved session ── */
(function boot() {
  var email = getSession();
  if (email) {
    var users = getUsers();
    var user  = users.find(function (u) { return u.email === email; });
    if (user) {
      currentUser = user;
      // Skip auth page — go straight to the app
      document.getElementById('authPage').style.display = 'none';
      document.getElementById('mainApp').classList.add('show');

      // Populate header
      var initial = user.name.charAt(0).toUpperCase();
      document.getElementById('headerAvatar').textContent = initial;
      document.getElementById('headerName').textContent   = user.name.split(' ')[0];

      // Restore location
      var saved = getLocation();
      if (saved) document.getElementById('locAddr').textContent = saved;

      // Render UI
      renderOffers();
      renderCategories();
      filterCat('all');
      updateCartUI();
      return;
    }
  }
  // No valid session — show auth page (default HTML state)
})();

/* ── Service Worker registration ── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js')
      .then(function (reg)  { console.log('SW registered:', reg.scope); })
      .catch(function (err) { console.warn('SW error:', err); });
  });
}

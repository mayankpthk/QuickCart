/* ═══════════════════════════════════════════════════════
   js/storage.js
   All localStorage read/write helpers
═══════════════════════════════════════════════════════ */

/* ── Users ── */
function getUsers() {
  try { return JSON.parse(localStorage.getItem('qc_users') || '[]'); }
  catch (e) { return []; }
}
function saveUsers(users) {
  localStorage.setItem('qc_users', JSON.stringify(users));
}

/* ── Session ── */
function getSession() {
  return localStorage.getItem('qc_session') || null;
}
function setSession(email) {
  localStorage.setItem('qc_session', email);
}
function clearSession() {
  localStorage.removeItem('qc_session');
}

/* ── Order history ── */
function getOrders(email) {
  try { return JSON.parse(localStorage.getItem('qc_orders_' + email) || '[]'); }
  catch (e) { return []; }
}
function saveOrders(email, orders) {
  localStorage.setItem('qc_orders_' + email, JSON.stringify(orders));
}

/* ── Location ── */
function getLocation() {
  return localStorage.getItem('qc_location') || '';
}
function saveLocation(loc) {
  localStorage.setItem('qc_location', loc);
}

/* ── Update a user in the users array + sync currentUser ── */
function updateUser(updated) {
  var users = getUsers();
  var idx = users.findIndex(function (u) { return u.email === updated.email; });
  if (idx !== -1) { users[idx] = updated; saveUsers(users); }
  currentUser = updated;
}

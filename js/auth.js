/* ═══════════════════════════════════════════════════════
   js/auth.js
   Login, Signup, Logout, tab switching
═══════════════════════════════════════════════════════ */

/* ── Active user (set on login / boot) ── */
var currentUser = null;

/* ── Show / hide the auth page ── */
function showAuthPage() {
  var page = document.getElementById('authPage');
  var app  = document.getElementById('mainApp');
  page.style.display = '';
  page.classList.remove('hide');
  app.classList.remove('show');
}

/* ── Enter the main app after successful auth ── */
function enterApp() {
  var page = document.getElementById('authPage');
  var app  = document.getElementById('mainApp');

  page.classList.add('hide');
  setTimeout(function () { page.style.display = 'none'; }, 420);

  app.classList.add('show');

  // Populate header
  var initial = currentUser.name.charAt(0).toUpperCase();
  document.getElementById('headerAvatar').textContent = initial;
  document.getElementById('headerName').textContent   = currentUser.name.split(' ')[0];

  // Restore saved location
  var saved = getLocation();
  if (saved) document.getElementById('locAddr').textContent = saved;

  // Render products & categories
  renderOffers();
  renderCategories();
  filterCat('all');
}

/* ── Tab switch (Login / Signup) ── */
function switchTab(tab) {
  document.getElementById('tabLogin').classList.toggle('active',  tab === 'login');
  document.getElementById('tabSignup').classList.toggle('active', tab === 'signup');
  document.getElementById('formLogin').classList.toggle('active',  tab === 'login');
  document.getElementById('formSignup').classList.toggle('active', tab === 'signup');
  clearAuthErrors();
}

/* ── Error helpers ── */
function clearAuthErrors() {
  ['loginErr', 'signupErr'].forEach(function (id) {
    document.getElementById(id).className = 'auth-global-err';
  });
  ['lEmail', 'lPass', 'sName', 'sEmail', 'sPhone', 'sPass', 'sPass2'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('error');
  });
  ['lEmailErr', 'lPassErr', 'sNameErr', 'sEmailErr', 'sPhoneErr', 'sPassErr', 'sPass2Err'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.className = 'af-err';
  });
}

function showAuthErr(id, msg) {
  var el = document.getElementById(id);
  el.textContent = msg;
  el.className = 'auth-global-err show';
}

function showFieldErr(inputId, errId) {
  document.getElementById(inputId).classList.add('error');
  document.getElementById(errId).className = 'af-err show';
}

/* ── Password visibility toggle ── */
function togglePw(inputId, btn) {
  var inp = document.getElementById(inputId);
  if (inp.type === 'password') { inp.type = 'text';     btn.textContent = '🙈'; }
  else                         { inp.type = 'password'; btn.textContent = '👁';  }
}

/* ── Sign Up ── */
function doSignup() {
  clearAuthErrors();
  var name  = document.getElementById('sName').value.trim();
  var email = document.getElementById('sEmail').value.trim().toLowerCase();
  var phone = document.getElementById('sPhone').value.trim();
  var pass  = document.getElementById('sPass').value;
  var pass2 = document.getElementById('sPass2').value;
  var valid = true;

  if (!name)                                               { showFieldErr('sName',  'sNameErr');  valid = false; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ showFieldErr('sEmail', 'sEmailErr'); valid = false; }
  if (!phone || !/^\d{10}$/.test(phone.replace(/\s/g,''))) { showFieldErr('sPhone', 'sPhoneErr'); valid = false; }
  if (!pass || pass.length < 6)                            { showFieldErr('sPass',  'sPassErr');  valid = false; }
  if (pass !== pass2)                                      { showFieldErr('sPass2', 'sPass2Err'); valid = false; }
  if (!valid) return;

  var users = getUsers();
  if (users.find(function (u) { return u.email === email; })) {
    showAuthErr('signupErr', 'This email is already registered. Please login.');
    return;
  }

  var user = { name: name, email: email, phone: phone, password: pass, addresses: [] };
  users.push(user);
  saveUsers(users);
  setSession(email);
  currentUser = user;
  enterApp();
}

/* ── Login ── */
function doLogin() {
  clearAuthErrors();
  var email = document.getElementById('lEmail').value.trim().toLowerCase();
  var pass  = document.getElementById('lPass').value;
  var valid = true;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showFieldErr('lEmail', 'lEmailErr'); valid = false; }
  if (!pass)                                                 { showFieldErr('lPass',  'lPassErr');  valid = false; }
  if (!valid) return;

  var users = getUsers();
  var user  = users.find(function (u) { return u.email === email; });

  if (!user) {
    showAuthErr('loginErr', 'No account found with this email. Please sign up.');
    return;
  }
  if (user.password !== pass) {
    showAuthErr('loginErr', 'Incorrect password. Please try again.');
    document.getElementById('lPass').classList.add('error');
    return;
  }

  setSession(email);
  currentUser = user;
  enterApp();
}

/* ── Logout ── */
function doLogout() {
  clearSession();
  currentUser = null;
  cart = {};
  closeProfile();
  updateCartUI();
  showAuthPage();
  // Reset form fields
  ['lEmail', 'lPass', 'sName', 'sEmail', 'sPhone', 'sPass', 'sPass2'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.value = '';
  });
  clearAuthErrors();
  switchTab('login');
}

/* ── Keyboard: Enter submits auth forms ── */
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Enter') return;
  var loginActive  = document.getElementById('formLogin').classList.contains('active');
  var signupActive = document.getElementById('formSignup').classList.contains('active');
  var authVisible  = !document.getElementById('authPage').classList.contains('hide');
  if (!authVisible) return;
  if (loginActive)  doLogin();
  if (signupActive) doSignup();
});

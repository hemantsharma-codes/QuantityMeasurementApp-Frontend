/* ═══════════════════════════════════════════
   QUANTIX — Auth Store & Auth Operations
═══════════════════════════════════════════ */

// ── AuthStore: single source of truth for auth state ──
const AuthStore = (() => {
  const TOKEN_KEY = 'qx_token';
  const USER_KEY  = 'qx_user';

  let _token = localStorage.getItem(TOKEN_KEY) || null;
  let _user  = JSON.parse(localStorage.getItem(USER_KEY) || 'null');

  return {
    getToken:   ()     => _token,
    getUser:    ()     => _user,
    isLoggedIn: ()     => !!_token,
    isAdmin:    ()     => _user?.role === 'Admin',

    save(token, user) {
      _token = token;
      _user  = user;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    clear() {
      _token = null;
      _user  = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
  };
})();


// ── AuthController: handles auth actions and UI updates ──
const AuthController = (() => {

  // Called once on app boot if user is already logged in
  function applySession() {
    const user = AuthStore.getUser();
    if (!user) return;
    _updateNavUI(user);
  }

  // Login
  async function login() {
    const email = document.getElementById('login-email').value.trim();
    const pass  = document.getElementById('login-pass').value;

    if (!email || !pass) return UI.toast('Please fill in all fields', 'error');

    UI.setButtonLoading('login-btn', true, 'Signing in…');

    try {
      const res = await ApiService.Auth.login({ email, password: pass });

      const user = {
        username: res.username,
        email:    res.email,
        role:     res.role,
      };

      AuthStore.save(res.token, user);
      _updateNavUI(user);

      UI.toast(`Welcome back, ${user.username}!`, 'success');
      Router.navigate('calculator');

    } catch (e) {
      UI.toast(UI.extractError(e) || 'Login failed', 'error');
    } finally {
      UI.setButtonLoading('login-btn', false, 'Sign In');
    }
  }

  // Register
  async function register() {
    const username = document.getElementById('reg-username').value.trim();
    const email    = document.getElementById('reg-email').value.trim();
    const pass     = document.getElementById('reg-pass').value;

    if (!username || !email || !pass) return UI.toast('Please fill in all fields', 'error');

    UI.setButtonLoading('reg-btn', true, 'Creating account…');

    try {
      await ApiService.Auth.register({ username, email, password: pass });
      UI.toast('Account created! Please sign in.', 'success');
      AuthController.switchTab('login');
      document.getElementById('login-email').value = email;

    } catch (e) {
      UI.toast(UI.extractError(e) || 'Registration failed', 'error');
    } finally {
      UI.setButtonLoading('reg-btn', false, 'Create Account');
    }
  }

  // Logout
  function logout() {
    AuthStore.clear();
    _clearNavUI();
    Router.goToAuth();
    UI.toast('Logged out', 'info');
  }

  // Skip auth → guest mode
  function continueAsGuest() {
    Router.navigate('calculator');
  }

  // Switch auth tabs (login / register)
  function switchTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(el => {
      el.classList.toggle('active', el.dataset.tab === tab);
    });
    document.querySelectorAll('.auth-form').forEach(el => {
      el.classList.toggle('active', el.id === `${tab}-form`);
    });
  }

  // ── Private helpers ──

  function _updateNavUI(user) {
    document.getElementById('user-badge').classList.add('visible');
    document.getElementById('nav-username').textContent = user.username;
    document.getElementById('nav-avatar').textContent   = user.username[0].toUpperCase();

    const rolePill = document.getElementById('nav-role');
    rolePill.textContent = user.role;
    rolePill.className = 'role-pill' + (user.role === 'Admin' ? ' admin' : '');

    document.getElementById('logout-btn').classList.remove('hidden');
    document.getElementById('signin-btn').classList.add('hidden');

    // Show protected nav items
    document.querySelectorAll('[data-auth-show]').forEach(el => {
      const role = el.dataset.authShow;
      el.classList.toggle('hidden', role === 'Admin' && !AuthStore.isAdmin());
      if (role === 'user') el.classList.remove('hidden');
    });
  }

  function _clearNavUI() {
    document.getElementById('user-badge').classList.remove('visible');
    document.getElementById('logout-btn').classList.add('hidden');
    document.getElementById('signin-btn').classList.remove('hidden');

    document.querySelectorAll('[data-auth-show]').forEach(el => {
      el.classList.add('hidden');
    });
  }

  return { applySession, login, register, logout, continueAsGuest, switchTab };

})();
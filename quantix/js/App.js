/* ═══════════════════════════════════════════
   QUANTIX — App Entry Point (app.js)
   Bootstraps the entire application.
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Restore auth session (if token exists)
  AuthController.applySession();

  // 2. Route to correct page
  if (AuthStore.isLoggedIn()) {
    Router.navigate('calculator');
  } else {
    Router.goToAuth();
  }

  // 3. Attach global keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Enter key on auth forms
    if (e.key === 'Enter') {
      const active = document.querySelector('.auth-form.active');
      if (!active) return;
      if (active.id === 'login-form')    AuthController.login();
      if (active.id === 'register-form') AuthController.register();
    }
  });

});
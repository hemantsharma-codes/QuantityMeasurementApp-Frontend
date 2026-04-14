/* ═══════════════════════════════════════════
   QUANTIX — Router (Client-Side Navigation)
═══════════════════════════════════════════ */

const Router = (() => {

  const PAGE_MAP = {
    'auth':        'auth-page',
    'calculator':  'app-page',
    'history':     'app-page',
    'profile':     'app-page',
    'admin':       'app-page',
  };

  let _current = null;

  // Navigate to a named section
  function navigate(section) {
    // Auth guard
    if (section === 'history' || section === 'profile') {
      if (!AuthStore.isLoggedIn()) {
        UI.toast('Please sign in first', 'info');
        goToAuth();
        return;
      }
    }

    if (section === 'admin') {
      if (!AuthStore.isAdmin()) {
        UI.toast('Admin access required', 'error');
        return;
      }
    }

    _current = section;

    // Show correct HTML page, hide all others
    const targetPageId = PAGE_MAP[section] || 'app-page';
    document.querySelectorAll('.page').forEach(p => {
      const isTarget = p.id === targetPageId;
      p.classList.toggle('active', isTarget);
      p.style.display = isTarget ? '' : 'none';
    });

    // Within app-page: show/hide sub-sections
    if (targetPageId === 'app-page') {
      document.querySelectorAll('.app-section').forEach(s => {
        s.classList.toggle('active', s.id === `${section}-page`);
        s.style.display = s.id === `${section}-page` ? '' : 'none';
      });
    }

    // Sync sidebar + mobile nav highlights
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.classList.toggle('active', el.dataset.nav === section);
    });

    // Trigger page-load hooks
    _onNavigate(section);
  }

  function goToAuth() {
    _current = 'auth';
    document.querySelectorAll('.page').forEach(p => {
      const isAuth = p.id === 'auth-page';
      p.classList.toggle('active', isAuth);
      p.style.display = isAuth ? '' : 'none';
    });
    document.querySelectorAll('[data-nav]').forEach(el => el.classList.remove('active'));
  }

  function getCurrent() { return _current; }

  // Page-specific on-load actions
  function _onNavigate(section) {
    switch (section) {
      case 'calculator':
        CalcController.init();
        break;
      case 'history':
        HistoryController.load();
        break;
      case 'profile':
        ProfileController.load();
        break;
      case 'admin':
        AdminController.init();
        break;
    }
  }

  return { navigate, goToAuth, getCurrent };

})();
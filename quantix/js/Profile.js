/* ═══════════════════════════════════════════
   QUANTIX — Profile Controller
═══════════════════════════════════════════ */

const ProfileController = (() => {

  function load() {
    const user = AuthStore.getUser();
    if (!user) return;

    const avatar = document.getElementById('profile-avatar');
    const name   = document.getElementById('profile-name');
    const email  = document.getElementById('profile-email');
    const role   = document.getElementById('profile-role');

    if (avatar) avatar.textContent = user.username[0].toUpperCase();
    if (name)   name.textContent   = user.username;
    if (email)  email.textContent  = user.email;
    if (role) {
      role.textContent  = user.role;
      role.className    = 'role-pill' + (user.role === 'Admin' ? ' admin' : '');
    }
  }

  async function updatePassword() {
    const cur  = document.getElementById('cur-pass')?.value;
    const nw   = document.getElementById('new-pass')?.value;
    const conf = document.getElementById('conf-pass')?.value;

    if (!cur || !nw || !conf) return UI.toast('Fill in all fields', 'error');
    if (nw !== conf)           return UI.toast('New passwords do not match', 'error');
    if (nw.length < 6)        return UI.toast('Password must be at least 6 characters', 'error');

    try {
      await ApiService.Auth.updatePassword({
        currentPassword:    cur,
        newPassword:        nw,
        confirmNewPassword: conf,
      });
      UI.toast('Password updated successfully!', 'success');
      document.getElementById('cur-pass').value  = '';
      document.getElementById('new-pass').value  = '';
      document.getElementById('conf-pass').value = '';
    } catch (e) {
      UI.toast(UI.extractError(e), 'error');
    }
  }

  return { load, updatePassword };

})();
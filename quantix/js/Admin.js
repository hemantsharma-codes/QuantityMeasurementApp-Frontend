/* ═══════════════════════════════════════════
   QUANTIX — Admin Controller
   Handles: user list, all history, role mgmt, delete
═══════════════════════════════════════════ */

const AdminController = (() => {

  // ── Init ─────────────────────────────────────
  function init() {
    loadUsers();
    loadHistory();
  }

  // ── Users ─────────────────────────────────────
  async function loadUsers() {
    const tbody = document.getElementById('admin-users-body');
    if (tbody) tbody.innerHTML = UI.loaderRow(6);

    try {
      const data = await ApiService.Auth.getAllUsers();
      _renderUsers(data);
    } catch (e) {
      UI.toast(UI.extractError(e), 'error');
    }
  }

  function _renderUsers(data) {
    const tbody = document.getElementById('admin-users-body');
    if (!tbody) return;

    if (!data || data.length === 0) {
      tbody.innerHTML = UI.emptyRow(6, '👤', 'No users found');
      return;
    }

    tbody.innerHTML = data.map(u => `
      <tr>
        <td class="text-muted mono">#${u.id}</td>
        <td>${u.username}</td>
        <td class="text-muted">${u.email}</td>
        <td>
          <span class="role-pill ${u.role === 'Admin' ? 'admin' : ''}">${u.role}</span>
        </td>
        <td class="text-muted">${UI.fmtDate(u.createdAt)}</td>
        <td>
          <button class="btn btn-ghost btn-sm" onclick="AdminController.viewUserHistory(${u.id}, '${u.username}')">
            View History
          </button>
        </td>
      </tr>
    `).join('');
  }

  // ── View Specific User History ─────────────────
  async function viewUserHistory(userId, username) {
    try {
      const data = await ApiService.Measurement.getHistoryByUser(userId);
      _renderHistory(data, `${username}'s history`);
      UI.toast(`Showing history for ${username}`, 'info');
    } catch (e) {
      UI.toast(UI.extractError(e), 'error');
    }
  }

  // ── All History ───────────────────────────────
  async function loadHistory() {
    const op  = document.getElementById('admin-op-filter')?.value  || '';
    const cat = document.getElementById('admin-cat-filter')?.value || '';

    const tbody = document.getElementById('admin-hist-body');
    if (tbody) tbody.innerHTML = UI.loaderRow(8);

    try {
      const data = await ApiService.Measurement.getAllHistory(op, cat);
      _renderHistory(data);
    } catch (e) {
      UI.toast(UI.extractError(e), 'error');
    }
  }

  function _renderHistory(data, label = null) {
    const tbody = document.getElementById('admin-hist-body');
    if (!tbody) return;

    if (label) {
      const titleEl = document.getElementById('admin-hist-title');
      if (titleEl) titleEl.textContent = label;
    }

    if (!data || data.length === 0) {
      tbody.innerHTML = UI.emptyRow(8, '📭', 'No records found');
      return;
    }

    tbody.innerHTML = data.map(h => `
      <tr>
        <td class="text-muted mono">#${h.id}</td>
        <td class="text-muted">${h.userId ?? '—'}</td>
        <td>${UI.opChip(h.operation)}</td>
        <td>${h.category}</td>
        <td class="text-muted">
          ${h.value1} ${h.unit1}
          ${h.value2 != null ? `&amp; ${h.value2} ${h.unit2}` : ''}
        </td>
        <td style="color:var(--accent3);font-family:var(--font-mono)">
          ${h.resultValue} ${h.resultUnit}
        </td>
        <td class="text-muted">${UI.fmtDate(h.createdAt)}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="AdminController.deleteRecord(${h.id})">✕</button>
        </td>
      </tr>
    `).join('');
  }

  // ── Delete Single Record ──────────────────────
  async function deleteRecord(id) {
    if (!UI.confirm(`Delete record #${id}?`)) return;
    try {
      await ApiService.Measurement.deleteRecord(id);
      UI.toast(`Record #${id} deleted`, 'success');
      loadHistory();
    } catch (e) {
      UI.toast(UI.extractError(e), 'error');
    }
  }

  // ── Clear All History ─────────────────────────
  async function clearAll() {
    if (!UI.confirm('Delete ALL measurement records? This cannot be undone.')) return;
    try {
      await ApiService.Measurement.clearAllHistory();
      UI.toast('All records cleared', 'success');
      loadHistory();
    } catch (e) {
      UI.toast(UI.extractError(e), 'error');
    }
  }

  // ── Update Role ───────────────────────────────
  async function updateRole() {
    const email = document.getElementById('role-email')?.value.trim();
    const role  = document.getElementById('role-select')?.value;

    if (!email) return UI.toast('Enter user email', 'error');

    try {
      await ApiService.Auth.updateRole({ email, newRole: role });
      UI.toast(`Role updated to ${role} for ${email}`, 'success');
      loadUsers();
    } catch (e) {
      UI.toast(UI.extractError(e), 'error');
    }
  }

  return { init, loadUsers, loadHistory, viewUserHistory, deleteRecord, clearAll, updateRole };

})();
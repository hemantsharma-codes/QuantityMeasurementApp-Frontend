/* ═══════════════════════════════════════════
   QUANTIX — UI Utilities
   Shared helpers used across all controllers.
═══════════════════════════════════════════ */

const UI = (() => {

  // ── Toast Notifications ──────────────────────
  let _toastTimer = null;

  function toast(message, type = 'info') {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.className = `show ${type}`;
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => { el.className = ''; }, 3400);
  }

  // ── Button Loading State ─────────────────────
  function setButtonLoading(btnId, loading, label = '') {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.disabled = loading;
    if (loading) {
      btn.innerHTML = `<span class="spinner"></span>${label}`;
    } else {
      btn.textContent = label;
    }
  }

  // ── Error Message Extraction ─────────────────
  function extractError(e) {
    if (!e) return 'Something went wrong';
    if (e?.data?.message) return e.data.message;
    if (e?.data?.errors) {
      return Object.values(e.data.errors).flat().join(' · ');
    }
    if (typeof e?.data === 'string') return e.data;
    return 'Something went wrong';
  }

  // ── Unit Dropdown Population ─────────────────
  function populateUnits(selectId, type, selectedValue = null) {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    const units = UNITS[type] || [];
    sel.innerHTML = units
      .map(u => `<option value="${u}" ${u === selectedValue ? 'selected' : ''}>${u}</option>`)
      .join('');
  }

  function populateMultipleUnits(selectIds, type) {
    selectIds.forEach(id => populateUnits(id, type));
  }

  // ── Result Box ───────────────────────────────
  function showResult(boxId, valueId, text, variant = '') {
    const box = document.getElementById(boxId);
    const val = document.getElementById(valueId);
    if (!box || !val) return;
    val.className = 'result-box-value' + (variant ? ` ${variant}` : '');
    val.textContent = text;
    box.classList.add('show');
  }

  function hideResult(boxId) {
    const box = document.getElementById(boxId);
    if (box) box.classList.remove('show');
  }

  // ── Date Formatting ──────────────────────────
  function fmtDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  // ── Operation Chip HTML ──────────────────────
  function opChip(op) {
    return `<span class="op-chip ${op.toLowerCase()}">${op}</span>`;
  }

  // ── Empty State Row HTML ─────────────────────
  function emptyRow(cols, icon = '📭', message = 'No records found') {
    return `
      <tr>
        <td colspan="${cols}">
          <div class="empty-state">
            <span class="icon">${icon}</span>
            <p>${message}</p>
          </div>
        </td>
      </tr>`;
  }

  // ── Loader Row HTML ──────────────────────────
  function loaderRow(cols) {
    return `
      <tr>
        <td colspan="${cols}" class="loader-row">
          <span class="spinner"></span> Loading…
        </td>
      </tr>`;
  }

  // ── Confirm Dialog ───────────────────────────
  function confirm(message) {
    return window.confirm(message);
  }

  return {
    toast,
    setButtonLoading,
    extractError,
    populateUnits,
    populateMultipleUnits,
    showResult,
    hideResult,
    fmtDate,
    opChip,
    emptyRow,
    loaderRow,
    confirm,
  };

})();
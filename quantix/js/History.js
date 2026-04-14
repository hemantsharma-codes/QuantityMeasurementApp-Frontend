/* ═══════════════════════════════════════════
   QUANTIX — History Controller
   Handles the current user's calculation history.
═══════════════════════════════════════════ */

const HistoryController = (() => {

  // ── Load History ─────────────────────────────
  async function load() {
    const op  = document.getElementById('hist-op-filter')?.value  || '';
    const cat = document.getElementById('hist-cat-filter')?.value || '';

    _setLoading(true);

    try {
      const data = await ApiService.Measurement.getMyHistory(op, cat);
      _render(data);
    } catch (e) {
      UI.toast(UI.extractError(e), 'error');
      _renderError();
    }
  }

  // ── Clear All History ─────────────────────────
  async function clearAll() {
    if (!UI.confirm('Clear your entire calculation history?')) return;
    try {
      await ApiService.Measurement.clearMyHistory();
      UI.toast('History cleared', 'success');
      load();
    } catch (e) {
      UI.toast(UI.extractError(e), 'error');
    }
  }

  // ── Render ────────────────────────────────────
  function _render(data) {
    const tbody = document.getElementById('history-body');
    if (!tbody) return;

    if (!data || data.length === 0) {
      tbody.innerHTML = UI.emptyRow(5, '📭', 'No calculations yet. Try the calculator!');
      return;
    }

    tbody.innerHTML = data.map(h => `
      <tr>
        <td>${UI.opChip(h.operation)}</td>
        <td>${h.category}</td>
        <td class="text-muted">
          ${h.value1} ${h.unit1}
          ${h.value2 != null ? `<span style="color:var(--muted)"> &amp; </span>${h.value2} ${h.unit2}` : ''}
        </td>
        <td style="color:var(--accent3);font-family:var(--font-mono)">
          ${h.resultValue} ${h.resultUnit}
        </td>
        <td class="text-muted">${UI.fmtDate(h.createdAt)}</td>
      </tr>
    `).join('');
  }

  function _setLoading(yes) {
    const tbody = document.getElementById('history-body');
    if (tbody) tbody.innerHTML = yes ? UI.loaderRow(5) : '';
  }

  function _renderError() {
    const tbody = document.getElementById('history-body');
    if (tbody) tbody.innerHTML = UI.emptyRow(5, '⚠️', 'Failed to load history');
  }

  return { load, clearAll };

})();
/* ═══════════════════════════════════════════
   QUANTIX — Calculator Controller
   Handles: Convert, Compare, Add, Subtract, Divide
═══════════════════════════════════════════ */

const CalcController = (() => {

  let _currentOp = 'convert';
  let _initialized = false;

  // ── Init ─────────────────────────────────────
  function init() {
    if (_initialized) return;
    _initialized = true;

    // Populate all unit selects on page load
    QUANTITY_TYPES.forEach(type => {
      _refreshUnits('conv', type);
      _refreshUnits('cmp',  type);
      _refreshUnits('add',  type);
      _refreshUnits('sub',  type);
      _refreshUnits('div',  type);
    });

    // Initialize with default type (Length)
    _refreshUnits('conv', 'Length');
    _refreshUnits('cmp',  'Length');
    _refreshUnits('add',  'Length');
    _refreshUnits('sub',  'Length');
    _refreshUnits('div',  'Length');

    switchOp('convert');
  }

  // ── Operation Tabs ───────────────────────────
  function switchOp(op) {
    _currentOp = op;

    document.querySelectorAll('.op-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.op === op);
    });

    document.querySelectorAll('.op-section').forEach(sec => {
      const isActive = sec.id === `op-${op}`;
      sec.classList.toggle('active', isActive);
      sec.style.display = isActive ? '' : 'none';
    });
  }

  // ── Unit Refresh (on type change) ────────────
  function onTypeChange(prefix) {
    const typeId = `${prefix}-type`;
    const type = document.getElementById(typeId)?.value;
    if (type) _refreshUnits(prefix, type);
  }

  function _refreshUnits(prefix, type) {
    const selectMap = {
      conv: ['conv-unit-from', 'conv-unit-to'],
      cmp:  ['cmp-unit1', 'cmp-unit2'],
      add:  ['add-unit1', 'add-unit2'],
      sub:  ['sub-unit1', 'sub-unit2', 'sub-result-unit'],
      div:  ['div-unit1', 'div-unit2'],
    };
    UI.populateMultipleUnits(selectMap[prefix] || [], type);
  }

  // ── CONVERT ──────────────────────────────────
  async function doConvert() {
    const dto = {
      quantityType: _val('conv-type'),
      value:        +_val('conv-value'),
      sourceUnit:   _val('conv-unit-from'),
      targetUnit:   _val('conv-unit-to'),
    };

    if (!dto.quantityType || isNaN(dto.value)) return UI.toast('Please fill all fields', 'error');

    try {
      const res = await ApiService.Measurement.convert(dto);
      const d   = res.data ?? res;
      UI.showResult('res-convert', 'res-convert-val', `${_round(d.value)} ${d.unitSymbol ?? ''}`);
    } catch (e) {
      UI.toast(UI.extractError(e), 'error');
    }
  }

  // ── COMPARE ──────────────────────────────────
  async function doCompare() {
    const dto = {
      quantityType: _val('cmp-type'),
      value1:       +_val('cmp-val1'),
      unit1:        _val('cmp-unit1'),
      value2:       +_val('cmp-val2'),
      unit2:        _val('cmp-unit2'),
    };

    if (!dto.quantityType) return UI.toast('Please fill all fields', 'error');

    try {
      const res      = await ApiService.Measurement.compare(dto);
      const areEqual = (res.data ?? res).areEqual;
      UI.showResult(
        'res-compare', 'res-compare-val',
        areEqual ? '✓  Equal' : '✗  Not Equal',
        areEqual ? 'equal' : 'notequal'
      );
    } catch (e) {
      UI.toast(UI.extractError(e), 'error');
    }
  }

  // ── ADD ──────────────────────────────────────
  async function doAdd() {
    const dto = {
      quantityType: _val('add-type'),
      value1:       +_val('add-val1'),
      unit1:        _val('add-unit1'),
      value2:       +_val('add-val2'),
      unit2:        _val('add-unit2'),
    };

    if (!dto.quantityType) return UI.toast('Please fill all fields', 'error');

    try {
      const res = await ApiService.Measurement.add(dto);
      const d   = res.data ?? res;
      UI.showResult('res-add', 'res-add-val', `${_round(d.value)} ${d.unitSymbol ?? ''}`);
    } catch (e) {
      UI.toast(UI.extractError(e), 'error');
    }
  }

  // ── SUBTRACT ─────────────────────────────────
  async function doSubtract() {
    const dto = {
      quantityType: _val('sub-type'),
      value1:       +_val('sub-val1'),
      unit1:        _val('sub-unit1'),
      value2:       +_val('sub-val2'),
      unit2:        _val('sub-unit2'),
      resultUnit:   _val('sub-result-unit'),
    };

    if (!dto.quantityType) return UI.toast('Please fill all fields', 'error');

    try {
      const res = await ApiService.Measurement.subtract(dto);
      const d   = res.data ?? res;
      UI.showResult('res-subtract', 'res-subtract-val', `${_round(d.value)} ${d.unitSymbol ?? ''}`);
    } catch (e) {
      UI.toast(UI.extractError(e), 'error');
    }
  }

  // ── DIVIDE ───────────────────────────────────
  async function doDivide() {
    const dto = {
      quantityType: _val('div-type'),
      value1:       +_val('div-val1'),
      unit1:        _val('div-unit1'),
      value2:       +_val('div-val2'),
      unit2:        _val('div-unit2'),
    };

    if (!dto.quantityType) return UI.toast('Please fill all fields', 'error');
    if (dto.value2 < 0.000001) return UI.toast('Divisor cannot be zero', 'error');

    try {
      const res = await ApiService.Measurement.divide(dto);
      const d   = res.data ?? res;
      UI.showResult('res-divide', 'res-divide-val', `${_round(d.ratio ?? d.value)}`);
    } catch (e) {
      UI.toast(UI.extractError(e), 'error');
    }
  }

  // ── Helpers ──────────────────────────────────
  function _val(id) {
    return document.getElementById(id)?.value ?? '';
  }

  function _round(num, decimals = 6) {
    return parseFloat(Number(num).toFixed(decimals));
  }

  return { init, switchOp, onTypeChange, doConvert, doCompare, doAdd, doSubtract, doDivide };

})();
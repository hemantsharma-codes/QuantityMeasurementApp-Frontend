/* ═══════════════════════════════════════════
   QUANTIX — API Service
   Central HTTP client for all backend calls.
═══════════════════════════════════════════ */

const ApiService = (() => {

  /**
   * Core request method.
   * Automatically attaches JWT token if present.
   * Throws structured error on non-2xx responses.
   */
  async function request(method, path, body = null) {
    const headers = { 'Content-Type': 'application/json' };

    const token = AuthStore.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    try {
      const res = await fetch(CONFIG.BASE_URL + path, options);
      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (!res.ok) {
        throw { status: res.status, data };
      }

      return data;
    } catch (err) {
      // Network / parsing error
      if (!err.status) {
        throw { status: 0, data: { message: 'Network error. Is the backend running?' } };
      }
      throw err;
    }
  }

  // ── Auth Endpoints ──────────────────────────────
  const Auth = {
    login:          (dto)        => request('POST', '/auth/login', dto),
    register:       (dto)        => request('POST', '/auth/register', dto),
    getMe:          ()           => request('GET',  '/auth/me'),
    updatePassword: (dto)        => request('PUT',  '/auth/update-password', dto),
    updateRole:     (dto)        => request('PUT',  '/auth/update-role', dto),
    getAllUsers:     ()           => request('GET',  '/auth/users'),
  };

  // ── Measurement Endpoints ───────────────────────
  const Measurement = {
    convert:  (dto) => request('POST', '/QuantityMeasurement/convert', dto),
    compare:  (dto) => request('POST', '/QuantityMeasurement/compare', dto),
    add:      (dto) => request('POST', '/QuantityMeasurement/add', dto),
    subtract: (dto) => request('POST', '/QuantityMeasurement/subtract', dto),
    divide:   (dto) => request('POST', '/QuantityMeasurement/divide', dto),

    // User history
    getMyHistory:   (op, cat)    => {
      const p = new URLSearchParams();
      if (op)  p.append('operation', op);
      if (cat) p.append('category', cat);
      return request('GET', `/QuantityMeasurement/users/me/history?${p}`);
    },
    clearMyHistory: ()           => request('DELETE', '/QuantityMeasurement/users/me/history'),

    // Admin history
    getAllHistory:   (op, cat)   => {
      const p = new URLSearchParams();
      if (op)  p.append('operation', op);
      if (cat) p.append('category', cat);
      return request('GET', `/QuantityMeasurement/admin/history?${p}`);
    },
    getHistoryByUser: (userId)   => request('GET', `/QuantityMeasurement/admin/history/user/${userId}`),
    deleteRecord:     (id)       => request('DELETE', `/QuantityMeasurement/admin/history/${id}`),
    clearAllHistory:  ()         => request('DELETE', '/QuantityMeasurement/admin/history'),
  };

  return { Auth, Measurement };

})();
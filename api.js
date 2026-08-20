/* Shared API helper — included in all pages.
   Talks to the main ATIDETO backend (MongoDB source of truth) via the
   same-origin proxy in server.js. Uses cookie auth + CSRF double-submit. */

const API_BASE = '/api';
let csrfToken = null;

function getCsrfToken() {
  if (csrfToken) return csrfToken;
  if (typeof document !== 'undefined' && document.cookie) {
    const match = document.cookie.match(/(?:^|; )csrfToken=([^;]*)/);
    if (match) {
      csrfToken = decodeURIComponent(match[1]);
      return csrfToken;
    }
  }
  return null;
}

async function apiRequest(path, options = {}) {
  const url = API_BASE + path;
  const method = options.method || 'GET';
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // State-changing requests must echo the CSRF token (memory or cookie)
  const token = getCsrfToken();
  if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS' && token) {
    headers['x-csrf-token'] = token;
  }

  let res;
  try {
    res = await fetch(url, { ...options, method, headers, credentials: 'include' });
  } catch (e) {
    throw new Error('Cannot reach the backend API server. Please check the server.');
  }

  const text = await res.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch (e) {
    if (!res.ok) {
      throw new Error(`Server returned HTML error (${res.status}). Please check backend API server.`);
    }
    throw new Error('Invalid JSON response received from API server.');
  }

  if (!res.ok) {
    throw new Error(data.message || data.error || `Request failed with status ${res.status}`);
  }
  return data;
}

async function apiGet(path) {
  return apiRequest(path);
}

async function apiPost(path, body) {
  return apiRequest(path, {
    method: 'POST',
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

/* ---------- Auth (main backend, cookie + CSRF) ---------- */
async function login(email, password) {
  const data = await apiPost('/admin/auth/login', { email, password });
  csrfToken = (data.data && data.data.csrfToken) || null;
  return data;
}

async function logout() {
  return apiPost('/admin/auth/logout');
}

async function fetchMe() {
  return apiGet('/admin/auth/me');
}

/* ---------- Internship applications (students) ---------- */
async function listStudents(status) {
  // Fetch every application (paginate through the main backend, limit 100/page)
  const all = [];
  let page = 1;
  let total = Infinity;

  while (all.length < total) {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    params.set('limit', '100');
    params.set('page', String(page));
    const qs = params.toString();
    const data = await apiGet('/admin/applications' + (qs ? '?' + qs : ''));
    const payload = data.data || {};
    const applications = payload.applications || [];
    total = payload.total != null ? payload.total : all.length;
    all.push(...applications);
    if (applications.length === 0) break;
    page += 1;
  }

  return { applications: all, total: all.length };
}

/* ---------- Certificates ---------- */
async function listCertificates(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  const qs = params.toString();
  const data = await apiGet('/admin/certificates' + (qs ? '?' + qs : ''));
  return data.data || {};
}

async function generateCertificate(applicationId) {
  return apiPost('/admin/certificates/generate', { applicationId });
}

async function revokeCertificate(certificateId) {
  return apiPost(`/admin/certificates/${encodeURIComponent(certificateId)}/revoke`);
}

async function verifyCertificate(id) {
  return apiGet('/certificates/verify/' + encodeURIComponent(id));
}

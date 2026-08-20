import { ApplicationRecord, ApplicationListResponse, StatsResponse } from '../types/application';
import { CertificateRecord } from '../types/certificate';
import { AdminUser } from '../types/auth';

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '';

let inMemoryCsrf: string | null = null;

export function getCsrfToken(): string | null {
  if (inMemoryCsrf) return inMemoryCsrf;

  try {
    const s = sessionStorage.getItem('atideto_csrf_token');
    if (s) return s;
    const l = localStorage.getItem('atideto_csrf_token');
    if (l) return l;
  } catch {
    // storage unavailable
  }

  if (typeof document !== 'undefined' && document.cookie) {
    const match = document.cookie.match(/(?:^|; )atideto_csrf=([^;]*)/) || document.cookie.match(/(?:^|; )csrfToken=([^;]*)/);
    if (match) return decodeURIComponent(match[1]);
  }

  return null;
}

export function setCsrfToken(token: string | null) {
  inMemoryCsrf = token;
  if (!token) {
    try {
      sessionStorage.removeItem('atideto_csrf_token');
      localStorage.removeItem('atideto_csrf_token');
    } catch {
      // ignore
    }
    return;
  }
  try {
    sessionStorage.setItem('atideto_csrf_token', token);
    localStorage.setItem('atideto_csrf_token', token);
  } catch {
    // ignore
  }
}

export class ApiError extends Error {
  status: number;
  data?: unknown;
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = options.method || 'GET';
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (method !== 'GET') {
    const csrf = getCsrfToken();
    if (csrf) {
      headers['x-csrf-token'] = csrf;
    }
  }

  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      credentials: 'include',
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError('Network connection failed. Please check your internet connection.', 0);
  }

  let json: any = {};
  try {
    json = await res.json();
  } catch {
    // empty response or not json
  }

  if (!res.ok) {
    const msg = json.message || `Request failed with status ${res.status}`;
    throw new ApiError(msg, res.status, json);
  }

  return json as T;
}

/* ============================================================
   Auth API
   ============================================================ */
export async function login(email: string, password: string): Promise<{ admin: AdminUser; csrfToken: string }> {
  const res = await request<{ success: boolean; data: { admin: AdminUser; csrfToken: string } }>('/api/admin/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  if (res.data?.csrfToken) {
    setCsrfToken(res.data.csrfToken);
  }
  return res.data;
}

export async function fetchMe(): Promise<AdminUser | null> {
  try {
    const res = await request<{ success: boolean; data: { admin: AdminUser; csrfToken?: string } }>('/api/admin/auth/me');
    if (res.data?.csrfToken) {
      setCsrfToken(res.data.csrfToken);
    }
    return res.data?.admin || null;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await request('/api/admin/auth/logout', { method: 'POST' });
  } finally {
    setCsrfToken(null);
  }
}

/* ============================================================
   Applications API
   ============================================================ */
export async function listApplications(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: 'latest' | 'oldest';
}): Promise<ApplicationListResponse['data']> {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.search) qs.set('search', params.search);
  if (params.status) qs.set('status', params.status);
  if (params.sort) qs.set('sort', params.sort);
  const query = qs.toString();

  const res = await request<ApplicationListResponse>(`/api/admin/applications${query ? `?${query}` : ''}`);
  return res.data;
}

export async function getApplication(applicationId: string): Promise<ApplicationRecord> {
  const res = await request<{ success: boolean; data: { application: ApplicationRecord } }>(
    `/api/admin/applications/${encodeURIComponent(applicationId)}`
  );
  return res.data.application;
}

export async function updateApplicationStatus(applicationId: string, status: string): Promise<ApplicationRecord> {
  const res = await request<{ success: boolean; data: { application: ApplicationRecord } }>(
    `/api/admin/applications/${encodeURIComponent(applicationId)}/status`,
    {
      method: 'PATCH',
      body: { status },
    }
  );
  return res.data.application;
}

export async function getStats(): Promise<StatsResponse['data']> {
  const res = await request<StatsResponse>('/api/admin/stats');
  return res.data;
}

/* ============================================================
   Certificates API
   ============================================================ */
export async function listCertificates(params: {
  page?: number;
  limit?: number;
  status?: string;
} = {}): Promise<{ certificates: CertificateRecord[]; total: number; page: number; totalPages: number }> {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.status) qs.set('status', params.status);
  const query = qs.toString();

  const res = await request<{
    success: boolean;
    data: { certificates: CertificateRecord[]; total: number; page: number; totalPages: number };
  }>(`/api/admin/certificates${query ? `?${query}` : ''}`);
  return res.data;
}

export async function generateCertificate(applicationId: string): Promise<CertificateRecord> {
  const res = await request<{
    success: boolean;
    data: { certificate: CertificateRecord };
  }>('/api/admin/certificates/generate', {
    method: 'POST',
    body: { applicationId },
  });
  return res.data.certificate;
}

export async function revokeCertificate(certificateId: string): Promise<CertificateRecord> {
  const res = await request<{
    success: boolean;
    data: { certificate: CertificateRecord };
  }>(`/api/admin/certificates/${encodeURIComponent(certificateId)}/revoke`, {
    method: 'POST',
  });
  return res.data.certificate;
}

/* ============================================================
   Public Verification API
   ============================================================ */
export async function verifyCertificatePublic(certificateId: string): Promise<CertificateRecord> {
  const res = await request<{
    success: boolean;
    certificate: CertificateRecord;
  }>(`/api/certificates/verify/${encodeURIComponent(certificateId)}`);
  return res.certificate;
}

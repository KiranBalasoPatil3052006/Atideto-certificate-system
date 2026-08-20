export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    admin: AdminUser;
    csrfToken?: string;
  };
  message?: string;
}

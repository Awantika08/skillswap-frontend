export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  role: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
  refreshToken?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  token: string;
  refreshToken: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface AuthErrorResponse {
  success: false;
  message: string;
  error?: string;
  code?: string;
}

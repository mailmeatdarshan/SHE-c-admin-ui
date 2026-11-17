
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export type Credentials = LoginCredentials;

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface AuthResponse {
  accessToken: string;
  token: string;
  refreshToken?: string;
  user: User;
}

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
}
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'CUSTOMER' | 'SELLER';
  phone?: string;
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: 'ADMIN' | 'CUSTOMER' | 'SELLER';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

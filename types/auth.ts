export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'inventory' | 'pos' | 'tenant';
  createdAt: string;
  tenantId?: string; // For tenant users
  artistId?: string; // For tenant login
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'admin' | 'inventory' | 'pos' | 'tenant';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
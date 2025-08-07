import { LoginCredentials, User } from '@/types/auth';

const API_BASE_URL = '/api';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface ApiError {
  message: string;
  status?: number;
}

class AuthService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = 'An error occurred';
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || `HTTP ${response.status}`;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await this.makeRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Transform API response to match our User interface
    const user: User = {
      id: response.user.id,
      email: response.user.email,
      name: response.user.name,
      role: this.mapApiRoleToUserRole(response.user.role),
      createdAt: new Date().toISOString(), // API doesn't provide this, so we'll use current time
    };

    return {
      user,
      token: response.token,
    };
  }

  private mapApiRoleToUserRole(apiRole: string): 'admin' | 'inventory' | 'pos' | 'tenant' {
    switch (apiRole.toUpperCase()) {
      case 'ADMIN':
        return 'admin';
      case 'INVENTORY':
        return 'inventory';
      case 'POS':
        return 'pos';
      case 'TENANT':
        return 'tenant';
      default:
        return 'pos'; // Default fallback
    }
  }

  // Store token in localStorage
  setAuthToken(token: string): void {
    localStorage.setItem('cornven_token', token);
  }

  // Get token from localStorage
  getAuthToken(): string | null {
    return localStorage.getItem('cornven_token');
  }

  // Remove token from localStorage
  removeAuthToken(): void {
    localStorage.removeItem('cornven_token');
  }

  // Check if user is authenticated (has valid token)
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const authService = new AuthService();
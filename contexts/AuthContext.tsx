'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, LoginCredentials, SignupData } from '@/types/auth';
import { authService } from '@/services/authService';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('cornven_user');
    const token = authService.getAuthToken();
    
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('cornven_user');
        authService.removeAuthToken();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { user, token } = await authService.login(credentials);
      
      // Store user data and token
      setUser(user);
      localStorage.setItem('cornven_user', JSON.stringify(user));
      authService.setAuthToken(token);
      
      setIsLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Basic validation
      if (data.password !== data.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return false;
      }
      
      if (data.password.length < 6) {
        setError('Password must be at least 6 characters long');
        setIsLoading(false);
        return false;
      }
      
      // TODO: Implement signup API when available
      setError('Signup functionality is not available yet. Please contact the administrator.');
      setIsLoading(false);
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cornven_user');
    authService.removeAuthToken();
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
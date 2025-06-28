import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, User, LoginResponse } from '@/api/client';

interface AuthContextType {
  user: User | null;
  session: { token: string; expires_at: string } | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<{ error: any }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<{ token: string; expires_at: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on startup
    const checkAuthStatus = async () => {
      const token = apiClient.getToken();
      if (token) {
        try {
          // Try to fetch user journals to verify token is still valid
          await apiClient.getJournals();
          // Token is valid, but we don't have user info
          // For now, we'll create a minimal user object
          // In a real app, you'd want an endpoint to get current user info
          setSession({ token, expires_at: '' });
          setUser({ 
            id: 0, 
            name: 'Current User', 
            email: '', 
            role: 0, 
            created_at: '', 
            updated_at: '' 
          });
        } catch (error) {
          // Token is invalid, clear it
          apiClient.clearToken();
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response: LoginResponse = await apiClient.login(email, password);
      setSession(response.session);
      // Create user object from login response
      setUser({
        id: response.id,
        name: '', // Backend doesn't return name in login response
        email: response.email,
        role: 0,
        created_at: '',
        updated_at: ''
      });
      return { error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { error };
    }
  };

  const logout = async () => {
    await apiClient.logout();
    setUser(null);
    setSession(null);
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      await apiClient.register(name, email, password);
      return { error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAuthenticated: !!session,
      login,
      logout,
      signup,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

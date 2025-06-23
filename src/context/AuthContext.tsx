import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => { },
  register: async () => { },
  logout: () => { },
  isAuthenticated: false,
  authFetch: async () => new Response(),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedRefreshToken = localStorage.getItem('refreshToken');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    if (savedRefreshToken) {
      setRefreshToken(savedRefreshToken);
    }
  }, []);

  // Login method
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { token, refreshToken: newRefreshToken, data } = await response.json();
        const user = data.user;

        setToken(token);
        setUser({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        });
        setRefreshToken(newRefreshToken);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('refreshToken', newRefreshToken);
        router.push('/');
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Register method
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const { token, refreshToken: newRefreshToken, data } = await response.json();
        const user = data.user;

        setToken(token);
        setUser({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        });
        setRefreshToken(newRefreshToken);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('refreshToken', newRefreshToken);
        router.push('/');
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Helper: refresh access token
  const refreshAccessToken = async () => {
    const storedRefreshToken = refreshToken || localStorage.getItem('refreshToken');
    if (!storedRefreshToken) throw new Error('No refresh token');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: storedRefreshToken })
    });
    if (!response.ok) throw new Error('Failed to refresh token');
    const { token: newToken, refreshToken: newRefreshToken, data } = await response.json();
    setToken(newToken);
    setRefreshToken(newRefreshToken);
    localStorage.setItem('token', newToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    if (data && data.user) {
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return newToken;
  };

  // Authenticated fetch with auto-refresh
  const authFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    let accessToken = token || localStorage.getItem('token');
    if (!init) init = {};
    if (!init.headers) init.headers = {};
    (init.headers as any)['Authorization'] = `Bearer ${accessToken}`;
    let response = await fetch(input, init);
    if (response.status === 401 && refreshToken) {
      try {
        accessToken = await refreshAccessToken();
        (init.headers as any)['Authorization'] = `Bearer ${accessToken}`;
        response = await fetch(input, init);
      } catch (err) {
        logout();
        throw new Error('Session expired. Please log in again.');
      }
    }
    return response;
  };

  // Logout method
  const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

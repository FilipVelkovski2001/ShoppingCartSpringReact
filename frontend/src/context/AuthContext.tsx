import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { authApi } from '../api';
import type { AuthDto, UserDto } from '../dto';
import type { Login, Register } from '../dto';

// The stored user is AuthDto minus the token
type StoredUser = Omit<AuthDto, 'token'>;

interface AuthContextType {
  user: StoredUser | null;
  isAuthenticated: boolean;
  login: (credentials: Login) => Promise<StoredUser>;
  register: (data: Register) => Promise<StoredUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<StoredUser | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? (JSON.parse(stored) as StoredUser) : null;
  });

  const login = useCallback(async (credentials: Login): Promise<StoredUser> => {
    const { data } = await authApi.login(credentials);
    const { token, ...userData } = data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (formData: Register): Promise<StoredUser> => {
    const { data } = await authApi.register(formData);
    const { token, ...userData } = data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

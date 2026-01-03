'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/axios';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  role: string;
  location?: {
    type: string;
    coordinates: number[];
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get('token');
      if (!token) {
        setIsLoading(false);
        if (!pathname.startsWith('/login') && !pathname.startsWith('/register')) {
           router.push('/login');
        }
        return;
      }

      try {
        // Optional: Validate token with backend /me endpoint if exists, 
        // for now we rely on the stored cookie/localStorage user data or just token presence
        // We stored 'user' in cookie during login (implementation below)
        const storedUser = Cookies.get('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth init error', error);
        Cookies.remove('token');
        Cookies.remove('user');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [pathname, router]);

  const login = (token: string, userData: User) => {
    Cookies.set('token', token, { expires: 1 }); // 1 day
    Cookies.set('user', JSON.stringify(userData), { expires: 1 });
    setUser(userData);
    router.push('/dashboard');
    toast.success('Login Berhasil');
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    setUser(null);
    router.push('/login');
    toast.info('Logged out');
  };

  const updateUser = (data: Partial<User>) => {
      if (user) {
          const newUser = { ...user, ...data };
          setUser(newUser);
          Cookies.set('user', JSON.stringify(newUser), { expires: 1 });
      }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

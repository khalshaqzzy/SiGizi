'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/axios';
import { toast } from 'sonner';

interface User {
  id: string;
  username: string;
  role: string;
  posyandu_details?: {
    name: string;
    address: string;
    location: {
      type: string;
      coordinates: number[];
    };
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
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

  const isAuthenticated = !!user;

  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get('sigizi_posyandu_token');
      if (!token) {
        setIsLoading(false);
        // Only redirect if we are inside dashboard
        if (pathname.startsWith('/dashboard')) {
           router.push('/login');
        }
        return;
      }

      try {
        const storedUser = Cookies.get('sigizi_posyandu_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth init error', error);
        Cookies.remove('sigizi_posyandu_token');
        Cookies.remove('sigizi_posyandu_user');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [pathname, router]);

  const login = (token: string, userData: User) => {
    Cookies.set('sigizi_posyandu_token', token, { expires: 1 }); // 1 day
    Cookies.set('sigizi_posyandu_user', JSON.stringify(userData), { expires: 1 });
    setUser(userData);
    router.push('/dashboard');
    toast.success('Login Berhasil');
  };

  const logout = () => {
    Cookies.remove('sigizi_posyandu_token');
    Cookies.remove('sigizi_posyandu_user');
    setUser(null);
    router.push('/login');
    toast.info('Logged out');
  };

  const updateUser = (data: Partial<User>) => {
      if (user) {
          const newUser = { ...user, ...data };
          setUser(newUser);
          Cookies.set('sigizi_posyandu_user', JSON.stringify(newUser), { expires: 1 });
      }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, logout, updateUser }}>
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
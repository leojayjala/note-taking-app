"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => { success: boolean; error?: string };
  signUp: (email: string, password: string, name: string) => { success: boolean; error?: string };
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'notes_app_users';
const CURRENT_USER_KEY = 'notes_app_current_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({ user, isAuthenticated: true });
      } catch {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
  }, []);

  const getUsers = (): { [email: string]: { user: User; password: string } } => {
    try {
      const users = localStorage.getItem(USERS_KEY);
      return users ? JSON.parse(users) : {};
    } catch {
      return {};
    }
  };

  const signIn = (email: string, password: string) => {
    const users = getUsers();
    const userData = users[email.toLowerCase()];

    if (!userData) {
      return { success: false, error: 'No account found with this email' };
    }

    if (userData.password !== password) {
      return { success: false, error: 'Incorrect password' };
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData.user));
    setAuthState({ user: userData.user, isAuthenticated: true });
    return { success: true };
  };

  const signUp = (email: string, password: string, name: string) => {
    const users = getUsers();
    const normalizedEmail = email.toLowerCase();

    if (users[normalizedEmail]) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      name,
    };

    users[normalizedEmail] = { user: newUser, password };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    setAuthState({ user: newUser, isAuthenticated: true });
    return { success: true };
  };

  const signOut = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setAuthState({ user: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...authState, signIn, signUp, signOut }}>
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


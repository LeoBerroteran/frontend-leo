'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getCurrentUser, setCurrentUser as saveSession, removeCurrentUser, getUsers, addUser } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  isInitialized: boolean;
  login: (email: string, password?: string) => boolean;
  register: (user: User) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsInitialized(true);
  }, []);

  const login = (email: string, password?: string): boolean => {
    const users = getUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      // Create a session user without the password
      const sessionUser = { ...foundUser };
      delete sessionUser.password;
      
      setUser(sessionUser);
      saveSession(sessionUser);
      return true;
    }
    return false;
  };

  const register = (newUser: User): boolean => {
    const success = addUser(newUser);
    if (success) {
      // Automatically login or let them login after? Requirements say "y redirect to /login"
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    removeCurrentUser();
  };

  return (
    <AuthContext.Provider value={{ user, isInitialized, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

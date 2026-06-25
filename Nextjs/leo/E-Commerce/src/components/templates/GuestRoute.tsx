'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

interface GuestRouteProps {
  children: React.ReactNode;
}

/**
 * GuestRoute: Only accessible when the user is NOT authenticated.
 * If the user is already logged in, redirect them to home.
 */
export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { user, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && user) {
      router.replace('/');
    }
  }, [user, isInitialized, router]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If authenticated, render nothing while redirecting
  if (user) return null;

  return <>{children}</>;
};

'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Role } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized) {
      if (!user) {
        // Not authenticated
        router.push('/login');
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Authenticated but does not have the required role
        router.push('/');
      }
    }
  }, [user, isInitialized, allowedRoles, router]);

  // While initializing or if redirecting, show a minimal loading state or nothing
  if (!isInitialized || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If roles are restricted and user doesn't have it, don't render children
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

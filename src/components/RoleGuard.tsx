import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { activeRole, isAuthenticated, isLoading, roles } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  const userRoles = roles || [];
  const isSuperAdminAuthorized = activeRole === 'super_admin' ? userRoles.includes('super_admin') : true;

  if (!activeRole || !allowedRoles.includes(activeRole) || !isSuperAdminAuthorized) {
    return <Navigate to="/dashboard/role-selector" replace />;
  }

  return <>{children}</>;
}

import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import type { Role } from '../store/useAuthStore';

// Helper to determine the default landing path for a given role
const getDefaultPathForRole = (role: Role) => {
  switch (role) {
    case 'editor': return '/dashboard/editor/overview';
    case 'author': return '/dashboard/yazar/submissions';
    case 'reviewer': return '/dashboard/reviewer/assigned';
    case 'layout_editor': return '/dashboard/layout/queue';
    case 'super_admin': return '/dashboard/admin/system';
    default: return '/dashboard/role-selector';
  }
};

export default function DashboardGuard() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Always force entry to Role Selector Gateway upon logging in / entering dashboard
  return <Navigate to="/dashboard/role-selector" replace />;
}

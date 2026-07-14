import { Navigate } from 'react-router-dom';
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
  const { roles, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Smart Routing Logic
  // Scenario A: Single Role -> Bypass role selector
  if (roles.length === 1) {
    return <Navigate to={getDefaultPathForRole(roles[0])} replace />;
  }

  // Scenario B: Multi-Role -> Force to Role Selector Gateway
  return <Navigate to="/dashboard/role-selector" replace />;
}

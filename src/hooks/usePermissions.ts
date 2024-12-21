import { useAuthStore } from '../store/authStore';
import { Permission } from '../types/auth';

export const usePermissions = () => {
  const { user } = useAuthStore();

  const hasPermission = (permissionId: string): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.some(p => p.id === permissionId);
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return {
    hasPermission,
    hasRole,
    hasAnyRole,
    role: user?.role,
    permissions: user?.permissions || []
  };
};
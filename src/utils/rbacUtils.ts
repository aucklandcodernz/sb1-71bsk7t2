import { Role, Permission, RolePermissions, AuthUser } from '../types/auth';

// Define base permissions
const BASE_PERMISSIONS: Permission[] = [
  {
    id: 'view_profile',
    name: 'View Profile',
    description: 'View own profile information',
    scope: 'self'
  },
  {
    id: 'edit_profile',
    name: 'Edit Profile',
    description: 'Edit own profile information',
    scope: 'self'
  },
  {
    id: 'submit_leave',
    name: 'Submit Leave',
    description: 'Submit leave requests',
    scope: 'self'
  }
];

// Define role-specific permissions
const ROLE_PERMISSIONS: RolePermissions = {
  super_admin: [
    ...BASE_PERMISSIONS,
    {
      id: 'manage_organizations',
      name: 'Manage Organizations',
      description: 'Full access to manage all organizations',
      scope: 'global'
    },
    {
      id: 'manage_users',
      name: 'Manage Users',
      description: 'Full access to manage all users',
      scope: 'global'
    },
    {
      id: 'manage_roles',
      name: 'Manage Roles',
      description: 'Full access to manage roles and permissions',
      scope: 'global'
    },
    {
      id: 'manage_employees',
      name: 'Manage Employees',
      description: 'Full access to manage employees',
      scope: 'global'
    },
    {
      id: 'manage_payroll',
      name: 'Manage Payroll',
      description: 'Full access to payroll',
      scope: 'global'
    },
    {
      id: 'manage_settings',
      name: 'Manage Settings',
      description: 'Full access to settings',
      scope: 'global'
    },
    {
      id: 'manage_security',
      name: 'Manage Security',
      description: 'Full access to security settings',
      scope: 'global'
    },
    {
      id: 'manage_compliance',
      name: 'Manage Compliance',
      description: 'Full access to compliance',
      scope: 'global'
    },
    {
      id: 'manage_team',
      name: 'Manage Team',
      description: 'Full access to team management',
      scope: 'global'
    },
    {
      id: 'manage_roster',
      name: 'Manage Roster',
      description: 'Full access to roster management',
      scope: 'global'
    }
  ],
  hr_manager: [
    ...BASE_PERMISSIONS,
    {
      id: 'manage_employees',
      name: 'Manage Employees',
      description: 'Manage employees within organization',
      scope: 'organization'
    },
    {
      id: 'manage_leave',
      name: 'Manage Leave',
      description: 'Manage leave requests within organization',
      scope: 'organization'
    },
    {
      id: 'view_reports',
      name: 'View Reports',
      description: 'Access organization reports',
      scope: 'organization'
    },
    {
      id: 'manage_compliance',
      name: 'Manage Compliance',
      description: 'Manage compliance within organization',
      scope: 'organization'
    },
    {
      id: 'manage_roster',
      name: 'Manage Roster',
      description: 'Manage organization roster',
      scope: 'organization'
    },
    {
      id: 'manage_team',
      name: 'Manage Team',
      description: 'Manage teams within organization',
      scope: 'organization'
    }
  ],
  team_leader: [
    ...BASE_PERMISSIONS,
    {
      id: 'manage_team',
      name: 'Manage Team',
      description: 'Manage team members',
      scope: 'team'
    },
    {
      id: 'approve_leave',
      name: 'Approve Leave',
      description: 'Approve team leave requests',
      scope: 'team'
    },
    {
      id: 'manage_roster',
      name: 'Manage Roster',
      description: 'Manage team roster',
      scope: 'team'
    },
    {
      id: 'manage_employees',
      name: 'Manage Employees',
      description: 'Manage team employees',
      scope: 'team'
    }
  ],
  payroll_admin: [
    ...BASE_PERMISSIONS,
    {
      id: 'manage_payroll',
      name: 'Manage Payroll',
      description: 'Full access to payroll functions',
      scope: 'organization'
    },
    {
      id: 'view_financials',
      name: 'View Financials',
      description: 'Access financial reports',
      scope: 'organization'
    }
  ],
  compliance_officer: [
    ...BASE_PERMISSIONS,
    {
      id: 'manage_compliance',
      name: 'Manage Compliance',
      description: 'Manage compliance and risk',
      scope: 'organization'
    },
    {
      id: 'audit_access',
      name: 'Audit Access',
      description: 'Access audit logs and reports',
      scope: 'organization'
    }
  ],
  employee: BASE_PERMISSIONS
};

// Get permissions for a role
export const getRolePermissions = (role: Role): Permission[] => {
  return ROLE_PERMISSIONS[role] || [];
};

// Check if user has permission
export const hasPermission = (user: AuthUser, permissionId: string): boolean => {
  if (!user || !user.permissions) return false;
  return user.permissions.some(p => p.id === permissionId);
};

// Check if user has any of the given permissions
export const hasAnyPermission = (user: AuthUser, permissionIds: string[]): boolean => {
  if (!user || !user.permissions) return false;
  return permissionIds.some(id => hasPermission(user, id));
};

// Check if user has all of the given permissions
export const hasAllPermissions = (user: AuthUser, permissionIds: string[]): boolean => {
  if (!user || !user.permissions) return false;
  return permissionIds.every(id => hasPermission(user, id));
};

// Check if user can access organization
export const canAccessOrganization = (user: AuthUser, organizationId: string): boolean => {
  if (user.role === 'super_admin') return true;
  return user.organizationId === organizationId;
};

// Check if user can access team
export const canAccessTeam = (user: AuthUser, teamId: string): boolean => {
  if (user.role === 'super_admin' || user.role === 'hr_manager') return true;
  if (user.role === 'team_leader') return user.teamId === teamId;
  return false;
};

// Check if user can manage employee
export const canManageEmployee = (user: AuthUser, employeeId: string, employeeOrganizationId: string): boolean => {
  if (user.role === 'super_admin') return true;
  if (user.role === 'hr_manager' && user.organizationId === employeeOrganizationId) return true;
  if (user.role === 'team_leader' && user.teamId) return true;
  if (user.role === 'employee') return user.id === employeeId;
  return false;
};

// Validate action based on user role and scope
export const validateAction = (
  user: AuthUser,
  action: string,
  scope: {
    organizationId?: string;
    teamId?: string;
    employeeId?: string;
  }
): boolean => {
  // Super admin can do everything
  if (user.role === 'super_admin') return true;

  // Check organization scope
  if (scope.organizationId && !canAccessOrganization(user, scope.organizationId)) {
    return false;
  }

  // Check team scope
  if (scope.teamId && !canAccessTeam(user, scope.teamId)) {
    return false;
  }

  // Check employee scope
  if (scope.employeeId && scope.organizationId) {
    return canManageEmployee(user, scope.employeeId, scope.organizationId);
  }

  // Check specific action permission
  return hasPermission(user, action);
};
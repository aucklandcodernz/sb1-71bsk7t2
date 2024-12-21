export type Role = 'super_admin' | 'hr_manager' | 'team_leader' | 'payroll_admin' | 'compliance_officer' | 'employee';

export interface Permission {
  id: string;
  name: string;
  description: string;
  scope: 'global' | 'organization' | 'team' | 'self';
}

export interface RolePermissions {
  super_admin: Permission[];
  hr_manager: Permission[];
  team_leader: Permission[];
  payroll_admin: Permission[];
  compliance_officer: Permission[];
  employee: Permission[];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  organizationId?: string;
  teamId?: string;
  permissions: Permission[];
}

export interface Organization {
  id: string;
  name: string;
  subscription: {
    plan: 'starter' | 'business' | 'enterprise';
    status: 'active' | 'suspended' | 'cancelled';
    expiryDate: string;
  };
  settings: {
    modules: string[];
    features: string[];
    restrictions: string[];
  };
}
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role, Permission, TeamMember, AccessLog } from '../types/team';
import { v4 as uuidv4 } from 'uuid';

interface TeamStore {
  roles: Role[];
  permissions: Permission[];
  members: TeamMember[];
  accessLogs: AccessLog[];
  
  // Role Management
  addRole: (role: Omit<Role, 'id'>) => void;
  updateRole: (id: string, role: Partial<Role>) => void;
  deleteRole: (id: string) => void;
  
  // Permission Management
  addPermission: (permission: Omit<Permission, 'id'>) => void;
  updatePermission: (id: string, permission: Partial<Permission>) => void;
  deletePermission: (id: string) => void;
  
  // Team Member Management
  addMember: (member: Omit<TeamMember, 'id'>) => void;
  updateMember: (id: string, member: Partial<TeamMember>) => void;
  deleteMember: (id: string) => void;
  
  // Access Logging
  logAccess: (log: Omit<AccessLog, 'id' | 'timestamp'>) => void;
  getAccessLogs: (filters?: {
    userId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  }) => AccessLog[];
}

// Initial permissions
const DEFAULT_PERMISSIONS: Permission[] = [
  {
    id: 'view_employees',
    name: 'View Employees',
    description: 'Can view employee list and details',
    module: 'employees'
  },
  {
    id: 'manage_employees',
    name: 'Manage Employees',
    description: 'Can add, edit, and delete employees',
    module: 'employees'
  },
  {
    id: 'view_payroll',
    name: 'View Payroll',
    description: 'Can view payroll information',
    module: 'payroll'
  },
  {
    id: 'manage_payroll',
    name: 'Manage Payroll',
    description: 'Can process and manage payroll',
    module: 'payroll'
  },
  {
    id: 'view_leave',
    name: 'View Leave',
    description: 'Can view leave requests',
    module: 'leave'
  },
  {
    id: 'manage_leave',
    name: 'Manage Leave',
    description: 'Can approve/reject leave requests',
    module: 'leave'
  },
  {
    id: 'view_training',
    name: 'View Training',
    description: 'Can view training courses',
    module: 'training'
  },
  {
    id: 'manage_training',
    name: 'Manage Training',
    description: 'Can create and manage training courses',
    module: 'training'
  }
];

// Initial roles
const DEFAULT_ROLES: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access',
    permissions: DEFAULT_PERMISSIONS
  },
  {
    id: 'hr_manager',
    name: 'HR Manager',
    description: 'HR management access',
    permissions: DEFAULT_PERMISSIONS.filter(p => 
      ['employees', 'leave', 'training'].includes(p.module)
    )
  },
  {
    id: 'employee',
    name: 'Employee',
    description: 'Basic employee access',
    permissions: DEFAULT_PERMISSIONS.filter(p => 
      p.name.startsWith('view_')
    )
  }
];

export const useTeamStore = create<TeamStore>()(
  persist(
    (set, get) => ({
      roles: DEFAULT_ROLES,
      permissions: DEFAULT_PERMISSIONS,
      members: [],
      accessLogs: [],
      
      addRole: (role) => {
        const id = uuidv4();
        set((state) => ({
          roles: [...state.roles, { ...role, id }]
        }));
      },
      
      updateRole: (id, role) =>
        set((state) => ({
          roles: state.roles.map((r) =>
            r.id === id ? { ...r, ...role } : r
          )
        })),
      
      deleteRole: (id) =>
        set((state) => ({
          roles: state.roles.filter((r) => r.id !== id)
        })),
      
      addPermission: (permission) => {
        const id = uuidv4();
        set((state) => ({
          permissions: [...state.permissions, { ...permission, id }]
        }));
      },
      
      updatePermission: (id, permission) =>
        set((state) => ({
          permissions: state.permissions.map((p) =>
            p.id === id ? { ...p, ...permission } : p
          )
        })),
      
      deletePermission: (id) =>
        set((state) => ({
          permissions: state.permissions.filter((p) => p.id !== id)
        })),
      
      addMember: (member) => {
        const id = uuidv4();
        set((state) => ({
          members: [...state.members, { ...member, id }]
        }));
      },
      
      updateMember: (id, member) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.id === id ? { ...m, ...member } : m
          )
        })),
      
      deleteMember: (id) =>
        set((state) => ({
          members: state.members.filter((m) => m.id !== id)
        })),
      
      logAccess: (log) => {
        const id = uuidv4();
        const timestamp = new Date().toISOString();
        set((state) => ({
          accessLogs: [{ ...log, id, timestamp }, ...state.accessLogs]
        }));
      },
      
      getAccessLogs: (filters) => {
        const logs = get().accessLogs;
        if (!filters) return logs;
        
        return logs.filter((log) => {
          if (filters.userId && log.userId !== filters.userId) return false;
          if (filters.action && log.action !== filters.action) return false;
          if (filters.startDate && log.timestamp < filters.startDate) return false;
          if (filters.endDate && log.timestamp > filters.endDate) return false;
          return true;
        });
      },
    }),
    {
      name: 'team-storage',
    }
  )
);
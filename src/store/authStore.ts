import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthUser, Role } from '../types/auth';
import { getRolePermissions } from '../utils/rbacUtils';

// Initialize permissions for each role
const initializeUser = (
  id: string,
  email: string,
  name: string,
  role: Role,
  organizationId?: string,
  teamId?: string
): AuthUser => ({
  id,
  email,
  name,
  role,
  organizationId,
  teamId,
  permissions: getRolePermissions(role)
});

// Test users with enhanced data
const TEST_USERS = {
  super_admin: initializeUser('1', 'super.admin@kiwihr.co.nz', 'Super Admin', 'super_admin'),
  hr_manager: initializeUser('2', 'hr.manager@kiwihr.co.nz', 'HR Manager', 'hr_manager', 'org1'),
  team_leader: initializeUser('3', 'team.leader@kiwihr.co.nz', 'Team Leader', 'team_leader', 'org1', 'team1'),
  payroll_admin: initializeUser('4', 'payroll.admin@kiwihr.co.nz', 'Payroll Admin', 'payroll_admin', 'org1'),
  compliance_officer: initializeUser('5', 'compliance.officer@kiwihr.co.nz', 'Compliance Officer', 'compliance_officer', 'org1'),
  employee: initializeUser('6', 'employee@kiwihr.co.nz', 'Regular Employee', 'employee', 'org1', 'team1')
} as const;

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
  hasPermission: (permission: string) => boolean;
  canAccessDepartment: (departmentId: string) => boolean;
  canManageEmployee: (employeeId: string) => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        if (password !== 'password123') {
          throw new Error('Invalid credentials');
        }

        let user: AuthUser | null = null;

        // Match test users
        if (email === TEST_USERS.super_admin.email) {
          user = TEST_USERS.super_admin;
        } else if (email === TEST_USERS.hr_manager.email) {
          user = TEST_USERS.hr_manager;
        } else if (email === TEST_USERS.team_leader.email) {
          user = TEST_USERS.team_leader;
        } else if (email === TEST_USERS.payroll_admin.email) {
          user = TEST_USERS.payroll_admin;
        } else if (email === TEST_USERS.compliance_officer.email) {
          user = TEST_USERS.compliance_officer;
        } else if (email === TEST_USERS.employee.email) {
          user = TEST_USERS.employee;
        }

        if (!user) {
          throw new Error('Invalid credentials');
        }

        set({
          user,
          isAuthenticated: true
        });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null
        })),

      hasPermission: (permission: string) => {
        const user = get().user;
        if (!user || !user.permissions) return false;
        return user.permissions.some(p => p.id === permission);
      },

      canAccessDepartment: (departmentId: string) => {
        const user = get().user;
        if (!user) return false;
        
        switch (user.role) {
          case 'super_admin':
            return true;
          case 'hr_manager':
            return true; // HR Manager can access all departments in their org
          case 'team_leader':
            return user.teamId === departmentId;
          case 'employee':
            return user.teamId === departmentId;
          default:
            return false;
        }
      },

      canManageEmployee: (employeeId: string) => {
        const user = get().user;
        if (!user) return false;

        switch (user.role) {
          case 'super_admin':
            return true;
          case 'hr_manager':
            return true;
          case 'team_leader':
            return true; // Should check if employee is in their team
          case 'employee':
            return employeeId === user.id;
          default:
            return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            ...persistedState,
            isAuthenticated: false,
            user: null
          };
        }
        return persistedState;
      },
    }
  )
);
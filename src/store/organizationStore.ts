import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Organization, OrganizationUser, Department, Location, Team } from '../types/organization';
import { v4 as uuidv4 } from 'uuid';

interface OrganizationStore {
  organizations: Organization[];
  users: OrganizationUser[];
  departments: Department[];
  locations: Location[];
  teams: Team[];
  currentOrganization: string | null;
  
  addOrganization: (org: Omit<Organization, 'id'>) => void;
  updateOrganization: (id: string, org: Partial<Organization>) => void;
  deleteOrganization: (id: string) => void;
  
  addUser: (user: Omit<OrganizationUser, 'id'>) => void;
  updateUser: (id: string, user: Partial<OrganizationUser>) => void;
  removeUser: (id: string) => void;
  
  addDepartment: (dept: Omit<Department, 'id'>) => void;
  updateDepartment: (id: string, dept: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  
  addLocation: (loc: Omit<Location, 'id'>) => void;
  updateLocation: (id: string, loc: Partial<Location>) => void;
  deleteLocation: (id: string) => void;
  
  addTeam: (team: Omit<Team, 'id'>) => void;
  updateTeam: (id: string, team: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  
  setCurrentOrganization: (id: string | null) => void;
  getCurrentOrganization: () => Organization | null;
  getUserOrganizations: (userId: string) => Organization[];
}

export const useOrganizationStore = create<OrganizationStore>()(
  persist(
    (set, get) => ({
      organizations: [],
      users: [],
      departments: [],
      locations: [],
      teams: [],
      currentOrganization: null,
      
      addOrganization: (org) => {
        const id = uuidv4();
        set((state) => ({
          organizations: [...state.organizations, { ...org, id }],
        }));
      },
      
      updateOrganization: (id, org) =>
        set((state) => ({
          organizations: state.organizations.map((o) =>
            o.id === id ? { ...o, ...org } : o
          ),
        })),
      
      deleteOrganization: (id) =>
        set((state) => ({
          organizations: state.organizations.filter((o) => o.id !== id),
          currentOrganization:
            state.currentOrganization === id ? null : state.currentOrganization,
        })),
      
      addUser: (user) => {
        const id = uuidv4();
        set((state) => ({
          users: [...state.users, { ...user, id }],
        }));
      },
      
      updateUser: (id, user) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...user } : u)),
        })),
      
      removeUser: (id) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        })),
      
      addDepartment: (dept) => {
        const id = uuidv4();
        set((state) => ({
          departments: [...state.departments, { ...dept, id }],
        }));
      },
      
      updateDepartment: (id, dept) =>
        set((state) => ({
          departments: state.departments.map((d) =>
            d.id === id ? { ...d, ...dept } : d
          ),
        })),
      
      deleteDepartment: (id) =>
        set((state) => ({
          departments: state.departments.filter((d) => d.id !== id),
        })),
      
      addLocation: (loc) => {
        const id = uuidv4();
        set((state) => ({
          locations: [...state.locations, { ...loc, id }],
        }));
      },
      
      updateLocation: (id, loc) =>
        set((state) => ({
          locations: state.locations.map((l) =>
            l.id === id ? { ...l, ...loc } : l
          ),
        })),
      
      deleteLocation: (id) =>
        set((state) => ({
          locations: state.locations.filter((l) => l.id !== id),
        })),
      
      addTeam: (team) => {
        const id = uuidv4();
        set((state) => ({
          teams: [...state.teams, { ...team, id }],
        }));
      },
      
      updateTeam: (id, team) =>
        set((state) => ({
          teams: state.teams.map((t) => (t.id === id ? { ...t, ...team } : t)),
        })),
      
      deleteTeam: (id) =>
        set((state) => ({
          teams: state.teams.filter((t) => t.id !== id),
        })),
      
      setCurrentOrganization: (id) =>
        set({ currentOrganization: id }),
      
      getCurrentOrganization: () => {
        const { organizations, currentOrganization } = get();
        return (
          organizations.find((org) => org.id === currentOrganization) || null
        );
      },
      
      getUserOrganizations: (userId) => {
        const { organizations, users } = get();
        const userOrgs = users
          .filter((u) => u.userId === userId)
          .map((u) => u.organizationId);
        return organizations.filter((org) => userOrgs.includes(org.id));
      },
    }),
    {
      name: 'organization-storage',
    }
  )
);
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

// Initial test data
const INITIAL_INCIDENTS = [
  {
    id: '1',
    type: 'near_miss',
    date: '2024-03-15',
    location: 'Main Office Kitchen',
    description: 'Slippery floor near sink due to water spillage',
    reportedBy: 'John Smith',
    status: 'resolved',
    severity: 'low',
    actions: [
      {
        id: 'a1',
        description: 'Place wet floor signs',
        assignee: 'Maintenance',
        dueDate: '2024-03-15',
        completed: true,
      },
      {
        id: 'a2',
        description: 'Install non-slip mats',
        assignee: 'Facilities',
        dueDate: '2024-03-20',
        completed: true,
      },
    ],
    worksafeNotified: false,
    witnesses: ['Sarah Wilson'],
    attachments: [],
  },
  {
    id: '2',
    type: 'minor',
    date: '2024-03-10',
    location: 'Server Room',
    description: 'Minor burn from hot equipment',
    reportedBy: 'David Lee',
    status: 'resolved',
    severity: 'low',
    actions: [
      {
        id: 'a3',
        description: 'First aid provided',
        assignee: 'First Aid Officer',
        dueDate: '2024-03-10',
        completed: true,
      },
      {
        id: 'a4',
        description: 'Install warning signs',
        assignee: 'IT Team',
        dueDate: '2024-03-12',
        completed: true,
      },
    ],
    worksafeNotified: false,
    witnesses: ['Michael Chen'],
    attachments: [],
  },
  {
    id: '3',
    type: 'serious',
    date: '2024-02-28',
    location: 'Warehouse',
    description: 'Back strain from improper lifting',
    reportedBy: 'Emma Brown',
    status: 'investigating',
    severity: 'medium',
    actions: [
      {
        id: 'a5',
        description: 'Medical assessment',
        assignee: 'HR',
        dueDate: '2024-02-28',
        completed: true,
      },
      {
        id: 'a6',
        description: 'Manual handling training refresh',
        assignee: 'Safety Officer',
        dueDate: '2024-03-15',
        completed: false,
      },
    ],
    worksafeNotified: true,
    witnesses: ['William Parker', 'Sophie Taylor'],
    attachments: [],
  },
];

const INITIAL_HAZARDS = [
  {
    id: '1',
    type: 'physical',
    location: 'Main Office Kitchen',
    description: 'Uneven floor surface near entrance',
    identifiedDate: '2024-03-10',
    identifiedBy: 'Safety Officer',
    risk: 'medium',
    controls: [
      'Warning signs posted',
      'Area marked with hazard tape',
      'Repair scheduled',
    ],
    reviewDate: '2024-04-10',
    status: 'active',
  },
  {
    id: '2',
    type: 'ergonomic',
    location: 'Office Workstations',
    description: 'Poor desk setup causing posture issues',
    identifiedDate: '2024-03-05',
    identifiedBy: 'HR Manager',
    risk: 'medium',
    controls: [
      'Ergonomic assessment scheduled',
      'Adjustable chairs ordered',
      'Workstation setup guidelines distributed',
    ],
    reviewDate: '2024-04-05',
    status: 'active',
  },
  {
    id: '3',
    type: 'electrical',
    location: 'Server Room',
    description: 'Exposed wiring near water pipe',
    identifiedDate: '2024-03-01',
    identifiedBy: 'IT Manager',
    risk: 'critical',
    controls: [
      'Area cordoned off',
      'Emergency electrician called',
      'Regular inspections implemented',
    ],
    reviewDate: '2024-03-31',
    status: 'mitigated',
  },
];

interface HealthSafetyStore {
  incidents: typeof INITIAL_INCIDENTS;
  hazards: typeof INITIAL_HAZARDS;
  
  addIncident: (incident: Omit<typeof INITIAL_INCIDENTS[0], 'id'>) => void;
  updateIncident: (id: string, updates: Partial<typeof INITIAL_INCIDENTS[0]>) => void;
  addHazard: (hazard: Omit<typeof INITIAL_HAZARDS[0], 'id'>) => void;
  updateHazard: (id: string, updates: Partial<typeof INITIAL_HAZARDS[0]>) => void;
  
  getStats: () => {
    totalIncidents: number;
    openIncidents: number;
    criticalHazards: number;
    daysWithoutIncident: number;
    upcomingReviews: number;
    trainedStaff: number;
    nextReviewDate: string;
    recentActivity: {
      type: string;
      description: string;
      user: string;
      date: string;
    }[];
    upcomingTraining: {
      title: string;
      date: string;
      mandatory: boolean;
    }[];
  };
}

export const useHealthSafetyStore = create<HealthSafetyStore>()(
  persist(
    (set, get) => ({
      incidents: INITIAL_INCIDENTS,
      hazards: INITIAL_HAZARDS,
      
      addIncident: (incident) => {
        const id = uuidv4();
        set((state) => ({
          incidents: [{ ...incident, id }, ...state.incidents],
        }));
      },
      
      updateIncident: (id, updates) =>
        set((state) => ({
          incidents: state.incidents.map((incident) =>
            incident.id === id ? { ...incident, ...updates } : incident
          ),
        })),
      
      addHazard: (hazard) => {
        const id = uuidv4();
        set((state) => ({
          hazards: [{ ...hazard, id }, ...state.hazards],
        }));
      },
      
      updateHazard: (id, updates) =>
        set((state) => ({
          hazards: state.hazards.map((hazard) =>
            hazard.id === id ? { ...hazard, ...updates } : hazard
          ),
        })),
      
      getStats: () => {
        const { incidents, hazards } = get();
        const now = new Date();
        const lastIncident = [...incidents].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];
        
        return {
          totalIncidents: incidents.length,
          openIncidents: incidents.filter((i) => i.status === 'investigating').length,
          criticalHazards: hazards.filter((h) => h.risk === 'critical' && h.status === 'active').length,
          daysWithoutIncident: lastIncident
            ? Math.floor(
                (now.getTime() - new Date(lastIncident.date).getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            : 0,
          upcomingReviews: hazards.filter(h => 
            new Date(h.reviewDate) > now &&
            new Date(h.reviewDate) < new Date(now.setDate(now.getDate() + 30))
          ).length,
          trainedStaff: 45, // Example value - should be calculated from actual training records
          nextReviewDate: hazards
            .map(h => h.reviewDate)
            .sort()[0] || '',
          recentActivity: [
            {
              type: 'incident',
              description: 'New incident reported',
              user: 'John Smith',
              date: '2024-03-15T10:30:00Z',
            },
            {
              type: 'hazard',
              description: 'Hazard control updated',
              user: 'Sarah Wilson',
              date: '2024-03-14T15:45:00Z',
            },
            {
              type: 'training',
              description: 'Safety training completed',
              user: 'David Lee',
              date: '2024-03-13T11:20:00Z',
            },
          ],
          upcomingTraining: [
            {
              title: 'Fire Safety Refresher',
              date: '2024-04-01',
              mandatory: true,
            },
            {
              title: 'First Aid Level 2',
              date: '2024-04-15',
              mandatory: true,
            },
            {
              title: 'Manual Handling',
              date: '2024-04-30',
              mandatory: false,
            },
          ],
        };
      },
    }),
    {
      name: 'health-safety-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            ...persistedState,
            incidents: persistedState.incidents || INITIAL_INCIDENTS,
            hazards: persistedState.hazards || INITIAL_HAZARDS,
          };
        }
        return persistedState;
      },
    }
  )
);
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LeaveRequest } from '../types';
import { addDays, differenceInBusinessDays } from 'date-fns';

// Initial test data
const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: '1',
    employeeId: '1',
    type: 'annual',
    startDate: '2024-04-01',
    endDate: '2024-04-05',
    status: 'approved',
    reason: 'Family vacation',
  },
  {
    id: '2',
    employeeId: '2',
    type: 'sick',
    startDate: '2024-03-15',
    endDate: '2024-03-15',
    status: 'approved',
    reason: 'Doctor appointment',
  },
  {
    id: '3',
    employeeId: '3',
    type: 'annual',
    startDate: '2024-03-20',
    endDate: '2024-03-31',
    status: 'approved',
    reason: 'Overseas trip',
  },
  {
    id: '4',
    employeeId: '4',
    type: 'sick',
    startDate: '2024-03-18',
    endDate: '2024-03-19',
    status: 'approved',
    reason: 'Flu',
  },
  {
    id: '5',
    employeeId: '5',
    type: 'bereavement',
    startDate: '2024-03-25',
    endDate: '2024-03-27',
    status: 'approved',
    reason: 'Family bereavement',
  },
  {
    id: '6',
    employeeId: '6',
    type: 'annual',
    startDate: '2024-04-15',
    endDate: '2024-04-26',
    status: 'pending',
    reason: 'Family wedding',
  },
  {
    id: '7',
    employeeId: '7',
    type: 'sick',
    startDate: '2024-03-28',
    endDate: '2024-03-28',
    status: 'pending',
    reason: 'Medical procedure',
  },
  {
    id: '8',
    employeeId: '8',
    type: 'annual',
    startDate: '2024-05-01',
    endDate: '2024-05-10',
    status: 'pending',
    reason: 'Holiday',
  },
  {
    id: '9',
    employeeId: '9',
    type: 'parental',
    startDate: '2024-06-01',
    endDate: '2024-11-30',
    status: 'approved',
    reason: 'Parental leave',
  },
  {
    id: '10',
    employeeId: '10',
    type: 'annual',
    startDate: '2024-04-08',
    endDate: '2024-04-12',
    status: 'rejected',
    reason: 'Personal time',
  },
];

interface LeaveStore {
  leaveRequests: LeaveRequest[];
  addLeaveRequest: (request: Omit<LeaveRequest, 'id'>) => void;
  updateLeaveRequest: (id: string, status: LeaveRequest['status']) => void;
  calculateLeaveBalance: (employeeId: string, startDate: Date) => number;
}

export const useLeaveStore = create<LeaveStore>()(
  persist(
    (set, get) => ({
      leaveRequests: INITIAL_LEAVE_REQUESTS,
      
      addLeaveRequest: (request) => {
        const id = Math.random().toString(36).substr(2, 9);
        set((state) => ({
          leaveRequests: [...state.leaveRequests, { ...request, id }],
        }));
      },
      
      updateLeaveRequest: (id, status) =>
        set((state) => ({
          leaveRequests: state.leaveRequests.map((req) =>
            req.id === id ? { ...req, status } : req
          ),
        })),
      
      calculateLeaveBalance: (employeeId, startDate) => {
        const requests = get().leaveRequests.filter(
          (req) => req.employeeId === employeeId && req.status === 'approved'
        );
        
        const usedDays = requests.reduce((total, req) => {
          return total + differenceInBusinessDays(
            new Date(req.endDate),
            new Date(req.startDate)
          );
        }, 0);

        return 20 - usedDays; // NZ statutory minimum
      },
    }),
    {
      name: 'leave-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            ...persistedState,
            leaveRequests: persistedState.leaveRequests || INITIAL_LEAVE_REQUESTS,
          };
        }
        return persistedState;
      },
    }
  )
);
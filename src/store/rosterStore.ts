import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Shift, ShiftPattern, RosterWeek } from '../types/roster';
import { v4 as uuidv4 } from 'uuid';
import { addDays, startOfWeek, endOfWeek } from 'date-fns';

interface RosterStore {
  shifts: Shift[];
  patterns: ShiftPattern[];
  weeks: RosterWeek[];
  
  addShift: (shift: Omit<Shift, 'id'>) => void;
  updateShift: (id: string, shift: Partial<Shift>) => void;
  deleteShift: (id: string) => void;
  
  addPattern: (pattern: Omit<ShiftPattern, 'id'>) => void;
  updatePattern: (id: string, pattern: Partial<ShiftPattern>) => void;
  deletePattern: (id: string) => void;
  
  generateWeekRoster: (startDate: string, patternId: string) => void;
  publishWeek: (weekId: string) => void;
  
  getEmployeeShifts: (employeeId: string, startDate: string, endDate: string) => Shift[];
  getWeekStats: (weekId: string) => {
    totalHours: number;
    employeeCount: number;
    shiftsCount: number;
  };
}

export const useRosterStore = create<RosterStore>()(
  persist(
    (set, get) => ({
      shifts: [],
      patterns: [],
      weeks: [],
      
      addShift: (shift) => {
        const id = uuidv4();
        set((state) => ({
          shifts: [...state.shifts, { ...shift, id }]
        }));
      },
      
      updateShift: (id, shift) =>
        set((state) => ({
          shifts: state.shifts.map((s) =>
            s.id === id ? { ...s, ...shift } : s
          )
        })),
      
      deleteShift: (id) =>
        set((state) => ({
          shifts: state.shifts.filter((s) => s.id !== id)
        })),
      
      addPattern: (pattern) => {
        const id = uuidv4();
        set((state) => ({
          patterns: [...state.patterns, { ...pattern, id }]
        }));
      },
      
      updatePattern: (id, pattern) =>
        set((state) => ({
          patterns: state.patterns.map((p) =>
            p.id === id ? { ...p, ...pattern } : p
          )
        })),
      
      deletePattern: (id) =>
        set((state) => ({
          patterns: state.patterns.filter((p) => p.id !== id)
        })),
      
      generateWeekRoster: (startDate, patternId) => {
        const pattern = get().patterns.find(p => p.id === patternId);
        if (!pattern) return;
        
        const weekStart = startOfWeek(new Date(startDate));
        const shifts: Omit<Shift, 'id'>[] = [];
        
        pattern.pattern.forEach((day) => {
          const shiftDate = addDays(weekStart, day.dayOfWeek);
          shifts.push({
            employeeId: '', // To be assigned
            startTime: `${shiftDate.toISOString().split('T')[0]}T${day.startTime}`,
            endTime: `${shiftDate.toISOString().split('T')[0]}T${day.endTime}`,
            breakDuration: day.breakDuration,
            status: 'scheduled'
          });
        });
        
        const weekId = uuidv4();
        const week: RosterWeek = {
          id: weekId,
          startDate: weekStart.toISOString(),
          shifts: [],
          status: 'draft',
          totalHours: 0
        };
        
        set((state) => ({
          weeks: [...state.weeks, week]
        }));
        
        shifts.forEach((shift) => {
          get().addShift(shift);
        });
      },
      
      publishWeek: (weekId) =>
        set((state) => ({
          weeks: state.weeks.map((w) =>
            w.id === weekId ? { ...w, status: 'published' } : w
          )
        })),
      
      getEmployeeShifts: (employeeId, startDate, endDate) => {
        return get().shifts.filter((shift) =>
          shift.employeeId === employeeId &&
          shift.startTime >= startDate &&
          shift.endTime <= endDate
        );
      },
      
      getWeekStats: (weekId) => {
        const week = get().weeks.find(w => w.id === weekId);
        if (!week) return { totalHours: 0, employeeCount: 0, shiftsCount: 0 };
        
        const shifts = get().shifts.filter(s =>
          s.startTime >= week.startDate &&
          s.startTime <= endOfWeek(new Date(week.startDate)).toISOString()
        );
        
        const totalHours = shifts.reduce((sum, shift) => {
          const start = new Date(shift.startTime);
          const end = new Date(shift.endTime);
          const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          return sum + hours - (shift.breakDuration / 60);
        }, 0);
        
        const uniqueEmployees = new Set(shifts.map(s => s.employeeId));
        
        return {
          totalHours,
          employeeCount: uniqueEmployees.size,
          shiftsCount: shifts.length
        };
      },
    }),
    {
      name: 'roster-storage',
    }
  )
);
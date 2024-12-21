import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TimeEntry, TimeTrackingSettings } from '../types/timeTracking';
import { v4 as uuidv4 } from 'uuid';
import { addDays, format } from 'date-fns';

// Default settings
const DEFAULT_SETTINGS: TimeTrackingSettings = {
  workHours: {
    start: '09:00',
    end: '17:00',
    minBreakAfter: 120, // 2 hours
    minMealBreakAfter: 240, // 4 hours
    maxWorkDuration: 8, // hours
  },
  overtime: {
    enabledAfter: 8, // hours
    rates: {
      first3Hours: 1.5,
      after3Hours: 2.0,
      publicHoliday: 2.5,
    },
  },
  geofencing: {
    enabled: true,
    radius: 100, // meters
    locations: [
      {
        id: 'main-office',
        name: 'Main Office',
        latitude: -36.8485, // Auckland CBD coordinates
        longitude: 174.7633,
      }
    ]
  },
  breaks: {
    restBreakDuration: 10,
    mealBreakDuration: 30,
    maxTimeBetweenBreaks: 4,
  },
};

interface TimeTrackingStore {
  entries: TimeEntry[];
  settings: TimeTrackingSettings;
  
  clockIn: (employeeId: string, type: TimeEntry['type'], location: { latitude: number; longitude: number }) => void;
  clockOut: (employeeId: string, location: { latitude: number; longitude: number }) => void;
  startBreak: (entryId: string, type: 'rest' | 'meal') => void;
  endBreak: (entryId: string) => void;
  
  getEmployeeEntries: (employeeId: string) => TimeEntry[];
  getActiveEntry: (employeeId: string) => TimeEntry | undefined;
  calculateHours: (employeeId: string, startDate: string, endDate: string) => {
    regular: number;
    overtime: number;
  };
}

// Generate test data for the past month
const generateTestData = () => {
  const entries: TimeEntry[] = [];
  const employeeIds = Array.from({ length: 15 }, (_, i) => (i + 1).toString());
  const now = new Date();
  const pastMonth = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  });

  employeeIds.forEach(employeeId => {
    pastMonth.forEach(date => {
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) return;

      // Regular day entry
      const clockIn = new Date(date);
      clockIn.setHours(9, 0, 0);
      const clockOut = new Date(date);
      clockOut.setHours(17, 0, 0);

      // Random variations in clock in/out times
      const randomOffset = () => Math.floor(Math.random() * 15);
      clockIn.setMinutes(randomOffset());
      clockOut.setMinutes(randomOffset());

      // Add breaks
      const breaks = [
        {
          startTime: new Date(date.setHours(12, 0, 0)).toISOString(),
          endTime: new Date(date.setHours(13, 0, 0)).toISOString(),
          type: 'meal' as const,
          duration: 60
        }
      ];

      // Sometimes add a rest break
      if (Math.random() > 0.5) {
        breaks.push({
          startTime: new Date(date.setHours(15, 0, 0)).toISOString(),
          endTime: new Date(date.setHours(15, 10, 0)).toISOString(),
          type: 'rest' as const,
          duration: 10
        });
      }

      entries.push({
        id: uuidv4(),
        employeeId,
        clockIn: clockIn.toISOString(),
        clockOut: clockOut.toISOString(),
        type: 'regular',
        breakDuration: breaks.reduce((total, b) => total + b.duration, 0),
        location: {
          latitude: -36.8485,
          longitude: 174.7633,
        },
        overtimeRate: 1.5,
        breaks,
        notes: ''
      });

      // Add some overtime entries (20% chance)
      if (Math.random() < 0.2) {
        const overtimeStart = new Date(clockOut);
        const overtimeEnd = new Date(clockOut);
        overtimeEnd.setHours(overtimeEnd.getHours() + 2);

        entries.push({
          id: uuidv4(),
          employeeId,
          clockIn: overtimeStart.toISOString(),
          clockOut: overtimeEnd.toISOString(),
          type: 'overtime',
          breakDuration: 0,
          location: {
            latitude: -36.8485,
            longitude: 174.7633,
          },
          overtimeRate: 1.5,
          breaks: [],
          notes: 'Project deadline'
        });
      }
    });
  });

  return entries;
};

export const useTimeTrackingStore = create<TimeTrackingStore>()(
  persist(
    (set, get) => ({
      entries: generateTestData(),
      settings: DEFAULT_SETTINGS,

      clockIn: (employeeId, type, location) => {
        const id = uuidv4();
        set((state) => ({
          entries: [
            ...state.entries,
            {
              id,
              employeeId,
              clockIn: new Date().toISOString(),
              type,
              location,
              breakDuration: 0,
              overtimeRate: type === 'overtime' ? 1.5 : 1,
              breaks: [],
              notes: '',
            },
          ],
        }));
      },

      clockOut: (employeeId, location) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.employeeId === employeeId && !entry.clockOut
              ? {
                  ...entry,
                  clockOut: new Date().toISOString(),
                  location,
                }
              : entry
          ),
        }));
      },

      startBreak: (entryId, type) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === entryId
              ? {
                  ...entry,
                  breaks: [
                    ...entry.breaks,
                    {
                      startTime: new Date().toISOString(),
                      type,
                      duration: type === 'meal' ? 30 : 10,
                    },
                  ],
                }
              : entry
          ),
        }));
      },

      endBreak: (entryId) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === entryId
              ? {
                  ...entry,
                  breaks: entry.breaks.map((breakItem, index) =>
                    index === entry.breaks.length - 1
                      ? {
                          ...breakItem,
                          endTime: new Date().toISOString(),
                        }
                      : breakItem
                  ),
                }
              : entry
          ),
        }));
      },

      getEmployeeEntries: (employeeId) => {
        return get().entries
          .filter((entry) => entry.employeeId === employeeId)
          .sort((a, b) => new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime());
      },

      getActiveEntry: (employeeId) => {
        return get().entries.find(
          (entry) =>
            entry.employeeId === employeeId && !entry.clockOut
        );
      },

      calculateHours: (employeeId, startDate, endDate) => {
        const entries = get().entries.filter(
          (entry) =>
            entry.employeeId === employeeId &&
            entry.clockIn >= startDate &&
            entry.clockIn <= endDate &&
            entry.clockOut
        );

        return entries.reduce(
          (acc, entry) => {
            if (!entry.clockOut) return acc;

            const start = new Date(entry.clockIn);
            const end = new Date(entry.clockOut);
            const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            const breakHours = (entry.breakDuration || 0) / 60;
            const netHours = hours - breakHours;

            if (entry.type === 'overtime') {
              acc.overtime += netHours;
            } else {
              acc.regular += netHours;
            }

            return acc;
          },
          { regular: 0, overtime: 0 }
        );
      },
    }),
    {
      name: 'time-tracking-storage',
      version: 1,
    }
  )
);
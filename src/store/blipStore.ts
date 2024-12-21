import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BlipSession, BlipLocation, BlipSettings } from '../types/blip';
import { v4 as uuidv4 } from 'uuid';
import { isWithinRadius } from 'geolocation-utils';

// Initial settings with NZ-specific defaults
const DEFAULT_SETTINGS: BlipSettings = {
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
  workHours: {
    start: '09:00',
    end: '17:00',
    breakDuration: 60 // minutes, as per NZ law minimum break requirements
  },
  notifications: {
    reminderEnabled: true,
    reminderTime: 15 // minutes before shift
  }
};

interface BlipStore {
  sessions: BlipSession[];
  settings: BlipSettings;
  
  startSession: (employeeId: string, location: BlipLocation) => string;
  endSession: (sessionId: string, location: BlipLocation) => void;
  
  startBreak: (sessionId: string, type: 'lunch' | 'rest') => void;
  endBreak: (sessionId: string) => void;
  
  updateSettings: (settings: Partial<BlipSettings>) => void;
  
  isWithinWorkLocation: (location: BlipLocation) => boolean;
  getActiveSession: (employeeId: string) => BlipSession | undefined;
  getSessionHistory: (employeeId: string, startDate: string, endDate: string) => BlipSession[];
}

// Initial dummy data for testing
const INITIAL_SESSIONS: BlipSession[] = [
  {
    id: '1',
    employeeId: 'emp1',
    clockIn: {
      time: new Date().toISOString(),
      location: {
        latitude: -36.8485,
        longitude: 174.7633,
        accuracy: 10,
        timestamp: new Date().toISOString()
      }
    },
    status: 'active',
    breaks: []
  }
];

export const useBlipStore = create<BlipStore>()(
  persist(
    (set, get) => ({
      sessions: INITIAL_SESSIONS,
      settings: DEFAULT_SETTINGS,
      
      startSession: (employeeId, location) => {
        const id = uuidv4();
        const session: BlipSession = {
          id,
          employeeId,
          clockIn: {
            time: new Date().toISOString(),
            location
          },
          status: 'active',
          breaks: []
        };
        
        set((state) => ({
          sessions: [...state.sessions, session]
        }));
        
        return id;
      },
      
      endSession: (sessionId, location) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  clockOut: {
                    time: new Date().toISOString(),
                    location
                  },
                  status: 'completed'
                }
              : session
          )
        })),
      
      startBreak: (sessionId, type) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  breaks: [
                    ...session.breaks,
                    {
                      startTime: new Date().toISOString(),
                      type
                    }
                  ]
                }
              : session
          )
        })),
      
      endBreak: (sessionId) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  breaks: session.breaks.map((breakItem, index) =>
                    index === session.breaks.length - 1
                      ? { ...breakItem, endTime: new Date().toISOString() }
                      : breakItem
                  )
                }
              : session
          )
        })),
      
      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings }
        })),
      
      isWithinWorkLocation: (location) => {
        const { settings } = get();
        if (!settings.geofencing.enabled) return true;
        
        return settings.geofencing.locations.some((workLocation) =>
          isWithinRadius(
            { lat: location.latitude, lng: location.longitude },
            { lat: workLocation.latitude, lng: workLocation.longitude },
            settings.geofencing.radius
          )
        );
      },
      
      getActiveSession: (employeeId) =>
        get().sessions.find(
          (session) =>
            session.employeeId === employeeId && session.status === 'active'
        ),
      
      getSessionHistory: (employeeId, startDate, endDate) =>
        get().sessions.filter(
          (session) =>
            session.employeeId === employeeId &&
            session.clockIn.time >= startDate &&
            session.clockIn.time <= endDate
        ),
    }),
    {
      name: 'blip-storage',
    }
  )
);
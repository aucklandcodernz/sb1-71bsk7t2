export interface BlipLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
}

export interface BlipSession {
  id: string;
  employeeId: string;
  clockIn: {
    time: string;
    location: BlipLocation;
  };
  clockOut?: {
    time: string;
    location: BlipLocation;
  };
  status: 'active' | 'completed';
  breaks: {
    startTime: string;
    endTime?: string;
    type: 'lunch' | 'rest';
  }[];
  notes?: string;
}

export interface BlipSettings {
  geofencing: {
    enabled: boolean;
    radius: number; // in meters
    locations: {
      id: string;
      name: string;
      latitude: number;
      longitude: number;
    }[];
  };
  workHours: {
    start: string;
    end: string;
    breakDuration: number; // in minutes
  };
  notifications: {
    reminderEnabled: boolean;
    reminderTime: number; // minutes before shift
  };
}
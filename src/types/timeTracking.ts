export interface TimeEntry {
  id: string;
  employeeId: string;
  clockIn: string;
  clockOut?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  type: 'regular' | 'overtime' | 'public_holiday';
  notes?: string;
  breakDuration: number;
  breaks: {
    startTime: string;
    endTime?: string;
    type: 'rest' | 'meal';
    duration: number;
  }[];
  overtimeRate: number;
}

export interface TimeTrackingSettings {
  workHours: {
    start: string;
    end: string;
    minBreakAfter: number; // minutes
    minMealBreakAfter: number; // minutes
    maxWorkDuration: number; // hours
  };
  overtime: {
    enabledAfter: number; // hours
    rates: {
      first3Hours: number;
      after3Hours: number;
      publicHoliday: number;
    };
  };
  geofencing: {
    enabled: boolean;
    radius: number; // meters
    locations: {
      id: string;
      name: string;
      latitude: number;
      longitude: number;
    }[];
  };
  breaks: {
    restBreakDuration: number; // minutes
    mealBreakDuration: number; // minutes
    maxTimeBetweenBreaks: number; // hours
  };
}

export interface TimeTrackingReport {
  id: string;
  employeeId: string;
  period: {
    start: string;
    end: string;
  };
  entries: TimeEntry[];
  totals: {
    regularHours: number;
    overtimeHours: number;
    publicHolidayHours: number;
    breaks: number;
  };
  status: 'draft' | 'submitted' | 'approved';
  notes?: string;
}
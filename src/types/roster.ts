export interface Shift {
  id: string;
  employeeId: string;
  startTime: string;
  endTime: string;
  breakDuration: number; // in minutes
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface ShiftPattern {
  id: string;
  name: string;
  pattern: {
    dayOfWeek: number; // 0-6 (Sunday-Saturday)
    startTime: string;
    endTime: string;
    breakDuration: number;
  }[];
}

export interface RosterWeek {
  id: string;
  startDate: string;
  shifts: Shift[];
  status: 'draft' | 'published' | 'completed';
  totalHours: number;
  notes?: string;
}
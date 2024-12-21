import { differenceInHours, differenceInMinutes, isWeekend } from 'date-fns';
import { TimeEntry, TimeTrackingSettings } from '../types/timeTracking';
import { NZ_PUBLIC_HOLIDAYS_2024 } from './nzCompliance';

// NZ work time constants
export const MIN_REST_BREAK = 10; // minutes
export const MIN_MEAL_BREAK = 30; // minutes
export const MAX_WORK_DURATION = 8; // hours
export const MAX_TIME_BETWEEN_BREAKS = 4; // hours

// Calculate break requirements based on work duration
export const calculateBreakRequirements = (clockInTime: string) => {
  const hoursWorked = differenceInHours(new Date(), new Date(clockInTime));
  
  return {
    restBreakDue: hoursWorked >= 2 && hoursWorked < 4,
    mealBreakDue: hoursWorked >= 4,
  };
};

// Validate work hours against settings
export const validateWorkHours = (date: Date, settings: TimeTrackingSettings): boolean => {
  const hour = date.getHours();
  const [startHour] = settings.workHours.start.split(':').map(Number);
  const [endHour] = settings.workHours.end.split(':').map(Number);
  
  return hour >= startHour && hour < endHour;
};

// Calculate total hours worked
export const calculateTotalHours = (entries: TimeEntry[]): number => {
  return entries.reduce((total, entry) => {
    if (!entry.clockOut) return total;

    const start = new Date(entry.clockIn);
    const end = new Date(entry.clockOut);
    const totalMinutes = differenceInMinutes(end, start);

    // Subtract unpaid breaks (meal breaks)
    const unpaidBreakMinutes = entry.breaks
      .filter(b => b.type === 'meal' && b.endTime)
      .reduce((sum, b) => {
        return sum + differenceInMinutes(
          new Date(b.endTime!),
          new Date(b.startTime)
        );
      }, 0);

    return total + ((totalMinutes - unpaidBreakMinutes) / 60);
  }, 0);
};

// Calculate payable hours with overtime and public holiday rates
export const calculatePayableHours = (entry: TimeEntry): {
  regular: number;
  overtime: number;
  publicHoliday: number;
} => {
  if (!entry.clockOut) {
    return { regular: 0, overtime: 0, publicHoliday: 0 };
  }

  const start = new Date(entry.clockIn);
  const end = new Date(entry.clockOut);
  const totalHours = differenceInHours(end, start);

  // Check if it's a public holiday
  const isPublicHoliday = NZ_PUBLIC_HOLIDAYS_2024.some(
    holiday => holiday.date === start.toISOString().split('T')[0]
  );

  if (isPublicHoliday) {
    return {
      regular: 0,
      overtime: 0,
      publicHoliday: totalHours,
    };
  }

  // Regular workday calculation
  if (totalHours <= MAX_WORK_DURATION) {
    return {
      regular: totalHours,
      overtime: 0,
      publicHoliday: 0,
    };
  }

  // Overtime calculation
  const overtimeHours = totalHours - MAX_WORK_DURATION;
  const firstThreeOvertimeHours = Math.min(3, overtimeHours);
  const remainingOvertimeHours = Math.max(0, overtimeHours - 3);

  return {
    regular: MAX_WORK_DURATION,
    overtime: firstThreeOvertimeHours + (remainingOvertimeHours * 2), // Convert double-time hours to equivalent hours
    publicHoliday: 0,
  };
};
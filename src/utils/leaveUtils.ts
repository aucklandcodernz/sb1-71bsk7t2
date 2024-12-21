import { differenceInMonths, differenceInDays, addDays, isWeekend } from 'date-fns';
import { NZ_PUBLIC_HOLIDAYS_2024 } from './nzCompliance';

// NZ Leave Entitlements
export const ANNUAL_LEAVE_DAYS = 20; // 4 weeks
export const SICK_LEAVE_DAYS = 10;
export const BEREAVEMENT_LEAVE_DAYS = 3;
export const FAMILY_VIOLENCE_LEAVE_DAYS = 10;

// Calculate working days between dates (excluding weekends and public holidays)
export const calculateWorkingDays = (startDate: Date, endDate: Date): number => {
  let days = 0;
  let currentDate = startDate;

  while (currentDate <= endDate) {
    if (
      !isWeekend(currentDate) &&
      !NZ_PUBLIC_HOLIDAYS_2024.some(
        (holiday) => holiday.date === currentDate.toISOString().split('T')[0]
      )
    ) {
      days++;
    }
    currentDate = addDays(currentDate, 1);
  }

  return days;
};

// Validate leave request
export const validateLeaveRequest = (
  startDate: Date,
  endDate: Date,
  type: string,
  balance: number
): { valid: boolean; message?: string } => {
  const workingDays = calculateWorkingDays(startDate, endDate);

  if (workingDays <= 0) {
    return { valid: false, message: 'Invalid date range' };
  }

  if (workingDays > balance) {
    return {
      valid: false,
      message: `Insufficient leave balance. Available: ${balance} days`,
    };
  }

  // Validate notice period for annual leave
  if (type === 'annual') {
    const noticeWeeks = differenceInDays(startDate, new Date()) / 7;
    if (noticeWeeks < 2) {
      return {
        valid: false,
        message: 'Annual leave requires 2 weeks notice',
      };
    }
  }

  return { valid: true };
};

// Calculate leave balance
export const calculateLeaveBalance = (
  startDate: string,
  currentDate = new Date()
): number => {
  const months = differenceInMonths(currentDate, new Date(startDate));
  
  // Annual leave accrual (4 weeks after 12 months)
  if (months >= 12) {
    return ANNUAL_LEAVE_DAYS;
  }
  
  // Pro-rata accrual before 12 months
  return Math.floor((months / 12) * ANNUAL_LEAVE_DAYS);
};

// Calculate sick leave entitlement
export const calculateSickLeaveEntitlement = (
  startDate: string,
  currentDate = new Date()
): number => {
  const months = differenceInMonths(currentDate, new Date(startDate));
  return months >= 6 ? SICK_LEAVE_DAYS : 0;
};

// Calculate bereavement leave entitlement
export const calculateBereavementLeaveEntitlement = (
  startDate: string,
  currentDate = new Date()
): number => {
  const months = differenceInMonths(currentDate, new Date(startDate));
  return months >= 6 ? BEREAVEMENT_LEAVE_DAYS : 0;
};

// Calculate family violence leave entitlement
export const calculateFamilyViolenceLeaveEntitlement = (
  startDate: string,
  currentDate = new Date()
): number => {
  const months = differenceInMonths(currentDate, new Date(startDate));
  return months >= 6 ? FAMILY_VIOLENCE_LEAVE_DAYS : 0;
};
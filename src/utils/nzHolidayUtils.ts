// NZ Holiday Pay Calculator
import { differenceInWeeks, differenceInDays, addDays } from 'date-fns';
import { Employee } from '../types';

// Constants
export const WEEKS_PER_YEAR = 52;
export const ANNUAL_LEAVE_WEEKS = 4;
export const SICK_LEAVE_DAYS = 10;
export const BEREAVEMENT_LEAVE_DAYS = 3;
export const FAMILY_VIOLENCE_LEAVE_DAYS = 10;

// Calculate annual leave entitlement
export const calculateAnnualLeaveEntitlement = (
  employee: Employee,
  currentDate = new Date()
): number => {
  const startDate = new Date(employee.startDate);
  const weeksEmployed = differenceInWeeks(currentDate, startDate);
  
  // Full entitlement after 12 months
  if (weeksEmployed >= WEEKS_PER_YEAR) {
    return ANNUAL_LEAVE_WEEKS;
  }
  
  // Pro-rata calculation before 12 months
  return (weeksEmployed / WEEKS_PER_YEAR) * ANNUAL_LEAVE_WEEKS;
};

// Calculate holiday pay
export const calculateHolidayPay = (
  employee: Employee,
  days: number
): number => {
  const annualSalary = parseFloat(employee.salary || '0');
  const dailyRate = annualSalary / (WEEKS_PER_YEAR * 5); // 5 working days per week
  return dailyRate * days;
};

// Calculate public holiday entitlement
export const calculatePublicHolidayPay = (
  employee: Employee,
  hoursWorked: number
): number => {
  const annualSalary = parseFloat(employee.salary || '0');
  const hourlyRate = annualSalary / (WEEKS_PER_YEAR * 40); // 40 hours per week
  return hourlyRate * hoursWorked * 1.5; // Time and a half
};

// Check if alternative holiday is earned
export const checkAlternativeHolidayEarned = (
  date: Date,
  normalWorkingDays: number[]
): boolean => {
  // Check if the date is a normal working day for the employee
  return normalWorkingDays.includes(date.getDay());
};

// Calculate leave balance
export const calculateLeaveBalance = (
  employee: Employee,
  leaveType: 'annual' | 'sick' | 'bereavement' | 'family_violence'
): number => {
  const startDate = new Date(employee.startDate);
  const currentDate = new Date();
  const monthsEmployed = differenceInDays(currentDate, startDate) / 30;

  switch (leaveType) {
    case 'annual':
      return calculateAnnualLeaveEntitlement(employee);
    case 'sick':
      return monthsEmployed >= 6 ? SICK_LEAVE_DAYS : 0;
    case 'bereavement':
      return monthsEmployed >= 6 ? BEREAVEMENT_LEAVE_DAYS : 0;
    case 'family_violence':
      return monthsEmployed >= 6 ? FAMILY_VIOLENCE_LEAVE_DAYS : 0;
    default:
      return 0;
  }
};

// Calculate parental leave eligibility
export const calculateParentalLeaveEligibility = (
  employee: Employee
): { eligible: boolean; weeks: number } => {
  const startDate = new Date(employee.startDate);
  const currentDate = new Date();
  const monthsEmployed = differenceInDays(currentDate, startDate) / 30;

  // 6 months eligibility - 26 weeks leave
  if (monthsEmployed >= 6) {
    return { eligible: true, weeks: 26 };
  }
  
  // 12 months eligibility - 52 weeks leave
  if (monthsEmployed >= 12) {
    return { eligible: true, weeks: 52 };
  }

  return { eligible: false, weeks: 0 };
};
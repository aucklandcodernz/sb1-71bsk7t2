import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import { Employee } from '../types';
import { PayrollEntry } from '../types/payroll';
import { calculatePAYE, calculateKiwiSaver, calculateACC, calculateStudentLoan } from './payrollCalculator';
import Big from 'big.js';

// Re-export commonly used functions
export { calculatePAYE, calculateKiwiSaver, calculateACC, calculateStudentLoan } from './payrollCalculator';

// Generate IR348 data
export const generateIR348Data = (entries: PayrollEntry[]) => {
  return entries.map(entry => ({
    irdNumber: entry.employeeId, // In a real app, get from employee record
    name: entry.employeeName,
    grossEarnings: new Big(entry.grossPay).toFixed(2),
    paye: new Big(entry.deductions.paye).toFixed(2),
    studentLoan: new Big(entry.deductions.studentLoan || 0).toFixed(2),
    kiwiSaverEmployee: new Big(entry.deductions.kiwiSaver.employee).toFixed(2),
    kiwiSaverEmployer: new Big(entry.deductions.kiwiSaver.employer).toFixed(2),
  }));
};

// Validate IRD number
export const validateIRDNumber = (irdNumber: string): boolean => {
  // Remove any spaces or dashes
  const cleanNumber = irdNumber.replace(/[\s-]/g, '');

  // For test/dummy data, allow any 8-9 digit number
  if (process.env.NODE_ENV === 'development') {
    return /^\d{8,9}$/.test(cleanNumber);
  }

  // Production validation
  if (!/^\d{8,9}$/.test(cleanNumber)) return false;

  const weights = [3, 2, 7, 6, 5, 4, 3, 2];
  const digits = cleanNumber.padStart(9, '0').split('').map(Number);
  
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += digits[i] * weights[i];
  }
  
  const checkDigit = (11 - (sum % 11)) % 11;
  return checkDigit === digits[8];
};

// Validate bank account
export const validateBankAccount = (account: string): boolean => {
  // For test/dummy data, be more lenient
  if (process.env.NODE_ENV === 'development') {
    return /^\d{2}-\d{4}-\d{7,8}-\d{2,3}$/.test(account);
  }

  // Production validation
  return /^\d{2}-\d{4}-\d{7}-\d{2,3}$/.test(account);
};

// Generate bank payment file
export const generateBankPaymentFile = (entries: PayrollEntry[]): string => {
  const rows = [
    ['Account', 'Amount', 'Reference', 'Particulars'],
    ...entries.map(entry => [
      entry.paymentDetails.bankAccount,
      new Big(entry.netPay).toFixed(2),
      entry.paymentDetails.reference,
      entry.employeeId
    ])
  ];

  return rows.map(row => row.join(',')).join('\n');
};

// Generate IR348 file
export const generateIR348File = (entries: PayrollEntry[], period: string): string => {
  const rows = [
    ['IRD Number', 'Name', 'Gross Earnings', 'PAYE', 'Student Loan', 'KiwiSaver Employee', 'KiwiSaver Employer'],
    ...entries.map(entry => [
      entry.employeeId,
      entry.employeeName,
      new Big(entry.grossPay).toFixed(2),
      new Big(entry.deductions.paye).toFixed(2),
      new Big(entry.deductions.studentLoan || 0).toFixed(2),
      new Big(entry.deductions.kiwiSaver.employee).toFixed(2),
      new Big(entry.deductions.kiwiSaver.employer).toFixed(2)
    ])
  ];

  return rows.map(row => row.join(',')).join('\n');
};

// Calculate pay period dates
export const calculatePayPeriod = (date: Date, frequency: 'weekly' | 'fortnightly' | 'monthly'): {
  start: string;
  end: string;
} => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  switch (frequency) {
    case 'monthly':
      return {
        start: format(new Date(year, month, 1), 'yyyy-MM-dd'),
        end: format(new Date(year, month + 1, 0), 'yyyy-MM-dd')
      };
    case 'fortnightly':
      // Implement fortnightly logic
      return {
        start: format(new Date(year, month, 1), 'yyyy-MM-dd'),
        end: format(new Date(year, month, 14), 'yyyy-MM-dd')
      };
    case 'weekly':
      // Implement weekly logic
      return {
        start: format(new Date(year, month, 1), 'yyyy-MM-dd'),
        end: format(new Date(year, month, 7), 'yyyy-MM-dd')
      };
  }
};

// Calculate average daily pay
export const calculateAverageDailyPay = (earnings: number[]): number => {
  if (earnings.length === 0) return 0;
  return new Big(earnings.reduce((sum, e) => sum + e, 0))
    .div(earnings.length)
    .toNumber();
};

// Calculate relevant daily pay
export const calculateRelevantDailyPay = (
  ordinaryPay: number,
  averageDailyPay: number
): number => {
  // Return the greater of ordinary daily pay and average daily pay
  return Math.max(ordinaryPay, averageDailyPay);
};

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
  }).format(amount);
};

// Calculate tax year dates
export const calculateTaxYear = (date: Date = new Date()): {
  start: string;
  end: string;
} => {
  const year = date.getMonth() < 3 ? date.getFullYear() - 1 : date.getFullYear();
  return {
    start: `${year}-04-01`,
    end: `${year + 1}-03-31`
  };
};
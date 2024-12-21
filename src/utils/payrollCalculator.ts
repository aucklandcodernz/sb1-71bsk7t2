import Big from 'big.js';

// NZ Tax Rates for 2024-2025
const TAX_RATES = [
  { threshold: 14000, rate: 0.105 },
  { threshold: 48000, rate: 0.175 },
  { threshold: 70000, rate: 0.300 },
  { threshold: 180000, rate: 0.330 },
  { threshold: Infinity, rate: 0.390 }
];

// Calculate PAYE tax
export const calculatePAYE = (annualIncome: number): number => {
  let remainingIncome = new Big(annualIncome);
  let tax = new Big(0);
  let previousThreshold = 0;

  for (const { threshold, rate } of TAX_RATES) {
    const taxableAmount = remainingIncome.gt(threshold - previousThreshold) 
      ? new Big(threshold - previousThreshold)
      : remainingIncome;
    
    tax = tax.plus(taxableAmount.times(rate));
    remainingIncome = remainingIncome.minus(taxableAmount);
    
    if (remainingIncome.lte(0)) break;
    previousThreshold = threshold;
  }

  return tax.toNumber();
};

// Calculate ACC Levy
export const calculateACC = (earnings: number): number => {
  const ACC_RATE = new Big(0.0139); // $1.39 per $100 for 2024
  return new Big(earnings).times(ACC_RATE).toNumber();
};

// Calculate KiwiSaver
export const calculateKiwiSaver = (
  earnings: number,
  employeeRate: number,
  employerRate: number = 3
): { employee: number; employer: number } => {
  const income = new Big(earnings);
  return {
    employee: income.times(employeeRate).div(100).toNumber(),
    employer: income.times(employerRate).div(100).toNumber()
  };
};

// Student Loan Rates
const STUDENT_LOAN_RATE = 0.12; // 12%
const STUDENT_LOAN_THRESHOLD = 22828; // Annual repayment threshold for 2024

// Calculate Student Loan Repayment
export const calculateStudentLoan = (annualIncome: number): number => {
  if (annualIncome <= STUDENT_LOAN_THRESHOLD) return 0;
  return new Big(annualIncome - STUDENT_LOAN_THRESHOLD)
    .times(STUDENT_LOAN_RATE)
    .toNumber();
};

// Calculate overtime rates
export const calculateOvertimeRate = (
  baseRate: number,
  hours: number,
  type: 'firstThreeHours' | 'subsequent' | 'publicHoliday'
): number => {
  const rate = new Big(baseRate);
  switch (type) {
    case 'firstThreeHours':
      return rate.times(1.5).toNumber();
    case 'subsequent':
      return rate.times(2.0).toNumber();
    case 'publicHoliday':
      return rate.times(2.5).toNumber();
    default:
      return rate.toNumber();
  }
};

// Calculate net pay
export const calculateNetPay = (
  grossPay: number,
  deductions: {
    paye: number;
    acc: number;
    kiwiSaver: { employee: number; employer: number };
    studentLoan?: number;
    other?: { amount: number }[];
  }
): number => {
  const totalDeductions = new Big(deductions.paye)
    .plus(deductions.acc)
    .plus(deductions.kiwiSaver.employee)
    .plus(deductions.studentLoan || 0)
    .plus(
      (deductions.other || []).reduce(
        (sum, d) => sum.plus(d.amount),
        new Big(0)
      )
    );

  return new Big(grossPay).minus(totalDeductions).toNumber();
};

// Validate minimum wage compliance
export const validateMinimumWage = (hourlyRate: number): boolean => {
  const MINIMUM_WAGE = new Big(22.70); // NZ minimum wage 2024
  return new Big(hourlyRate).gte(MINIMUM_WAGE);
};

// Calculate annual salary from hourly rate
export const calculateAnnualSalary = (hourlyRate: number): number => {
  return new Big(hourlyRate)
    .times(40) // hours per week
    .times(52) // weeks per year
    .toNumber();
};

// Calculate hourly rate from annual salary
export const calculateHourlyRate = (annualSalary: number): number => {
  return new Big(annualSalary)
    .div(52) // weeks per year
    .div(40) // hours per week
    .toNumber();
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
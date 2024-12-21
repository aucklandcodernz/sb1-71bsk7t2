// NZ-specific validation utilities

// Validate IRD number
export const validateIRDNumber = (irdNumber: string): boolean => {
  if (!/^\d{8,9}$/.test(irdNumber)) return false;

  const weights = [3, 2, 7, 6, 5, 4, 3, 2];
  const digits = irdNumber.padStart(9, '0').split('').map(Number);
  
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += digits[i] * weights[i];
  }
  
  const checkDigit = (11 - (sum % 11)) % 11;
  return checkDigit === digits[8];
};

// Validate bank account
export const validateBankAccount = (account: string): boolean => {
  return /^\d{2}-\d{4}-\d{7}-\d{2,3}$/.test(account);
};

// Validate GST number
export const validateGSTNumber = (gstNumber: string): boolean => {
  return /^\d{3}-\d{3}-\d{3}$/.test(gstNumber);
};

// Validate tax code
export const validateTaxCode = (taxCode: string): boolean => {
  const validCodes = ['M', 'M SL', 'S', 'S SL', 'SH', 'SH SL', 'ST', 'ST SL'];
  return validCodes.includes(taxCode);
};

// Validate minimum wage compliance
export const validateMinimumWage = (hourlyRate: number, employeeType: string): boolean => {
  const MINIMUM_WAGES = {
    ADULT: 22.70,      // From April 1, 2024
    STARTING_OUT: 18.16,
    TRAINING: 18.16
  };

  switch (employeeType) {
    case 'adult':
      return hourlyRate >= MINIMUM_WAGES.ADULT;
    case 'starting_out':
    case 'training':
      return hourlyRate >= MINIMUM_WAGES.STARTING_OUT;
    default:
      return false;
  }
};

// Validate employment agreement
export const validateEmploymentAgreement = (agreement: any): {
  valid: boolean;
  issues: string[];
} => {
  const issues: string[] = [];
  const requiredClauses = [
    'parties',
    'role',
    'location',
    'hours',
    'pay',
    'leave',
    'publicHolidays',
    'termination'
  ];

  requiredClauses.forEach(clause => {
    if (!agreement[clause]) {
      issues.push(`Missing required clause: ${clause}`);
    }
  });

  // Check trial period
  if (agreement.trialPeriod) {
    if (agreement.trialPeriod.duration > 90) {
      issues.push('Trial period cannot exceed 90 days');
    }
  }

  // Check leave entitlements
  if (agreement.leave) {
    if (agreement.leave.annual < 20) {
      issues.push('Annual leave must be at least 4 weeks');
    }
    if (agreement.leave.sick < 10) {
      issues.push('Sick leave must be at least 10 days');
    }
  }

  return {
    valid: issues.length === 0,
    issues
  };
};
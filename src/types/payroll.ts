export interface PayrollEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  grossPay: number;
  netPay: number;
  status: 'pending' | 'paid';
  deductions: {
    paye: number;
    acc: number;
    kiwiSaver: {
      employee: number;
      employer: number;
    };
    studentLoan?: number;
    other?: { name: string; amount: number }[];
  };
  additions?: {
    overtime?: number;
    allowances?: { name: string; amount: number }[];
    bonus?: number;
  };
  paymentDetails: {
    bankAccount: string;
    paymentDate: string;
    reference: string;
  };
}

export interface PayrollRun {
  id: string;
  period: {
    start: string;
    end: string;
  };
  status: 'draft' | 'processing' | 'completed' | 'error';
  employees: PayrollRunEmployee[];
  totals: {
    grossPay: number;
    netPay: number;
    paye: number;
    kiwiSaver: {
      employee: number;
      employer: number;
    };
    acc: number;
    studentLoan: number;
    deductions: number;
  };
  bankFile?: string;
  ir348File?: string;
  createdAt: string;
  processedAt?: string;
  processedBy?: string;
}

export interface PayrollRunEmployee {
  employeeId: string;
  regularHours: number;
  overtimeHours: {
    firstThreeHours: number;
    subsequent: number;
    publicHoliday: number;
  };
  leaveHours: {
    annual: number;
    sick: number;
    bereavement: number;
    publicHoliday: number;
    alternative: number;
  };
  earnings: {
    regular: number;
    overtime: number;
    allowances: {
      id: string;
      amount: number;
    }[];
    leave: number;
    other: number;
  };
  deductions: {
    paye: number;
    acc: number;
    kiwiSaver: {
      employee: number;
      employer: number;
    };
    studentLoan: number;
    other: {
      id: string;
      amount: number;
    }[];
  };
  grossPay: number;
  netPay: number;
  bankAccount: string;
  taxCode: string;
  notes?: string;
}

export interface PayrollTaxCodes {
  M: {
    description: 'Main employment';
    studentLoan?: boolean;
  };
  ME: {
    description: 'Main employment, tax-exempt';
    studentLoan?: boolean;
  };
  SB: {
    description: 'Secondary employment, low rate';
    studentLoan?: boolean;
  };
  S: {
    description: 'Secondary employment';
    studentLoan?: boolean;
  };
  SH: {
    description: 'Secondary employment, high rate';
    studentLoan?: boolean;
  };
  ST: {
    description: 'Secondary employment, special rate';
    studentLoan?: boolean;
  };
  WT: {
    description: 'Withholding tax';
    rate: number;
  };
}

export interface PayrollTaxRates {
  [key: string]: {
    threshold: number;
    rate: number;
  }[];
}

export interface KiwiSaverSettings {
  employeeRates: number[];
  minEmployerRate: number;
  optOutPeriod: number; // days
  waitPeriod: number; // days
  maxAge: number;
  minAge: number;
}

export interface PayrollReport {
  id: string;
  type: 'IR348' | 'bankfile' | 'payslips' | 'summary' | 'deductions' | 'leave';
  period: {
    start: string;
    end: string;
  };
  format: 'pdf' | 'csv' | 'xlsx';
  data: any;
  generatedAt: string;
  generatedBy: string;
}
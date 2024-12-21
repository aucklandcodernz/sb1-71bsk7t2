export interface Expense {
  id: string;
  employeeId: string;
  date: string;
  category: 'travel' | 'meals' | 'accommodation' | 'supplies' | 'other';
  amount: number;
  description: string;
  receiptUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedDate?: string;
  reimbursementDate?: string;
  notes?: string;
  gstNumber?: string;
  mileage?: {
    distance: number; // in kilometers
    rate: number; // NZ standard mileage rate
  };
  perDiem?: {
    days: number;
    rate: number; // NZ standard per diem rate
  };
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description: string;
  limit?: number;
  requiresReceipt: boolean;
  requiresApproval: boolean;
  gstRequired?: boolean;
  mileageRate?: number;
  perDiemRate?: number;
}

export interface ExpensePolicy {
  id: string;
  name: string;
  description: string;
  rules: {
    maxAmount?: number;
    requiresPreApproval?: boolean;
    requiresGST?: boolean;
    allowedCategories?: string[];
  };
  effectiveDate: string;
  version: number;
}

export interface ExpenseReport {
  id: string;
  employeeId: string;
  period: {
    start: string;
    end: string;
  };
  expenses: string[]; // expense IDs
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  totals: {
    amount: number;
    gst: number;
    mileage: number;
    perDiem: number;
  };
  submittedDate?: string;
  approvedDate?: string;
  approvedBy?: string;
  notes?: string;
}
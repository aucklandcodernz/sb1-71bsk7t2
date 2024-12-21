// NZ-specific compliance types
export interface NZEmploymentAgreement {
  type: 'individual' | 'collective';
  status: 'draft' | 'active' | 'expired';
  startDate: string;
  endDate?: string;
  trialPeriod?: {
    enabled: boolean;
    duration: number; // in days, max 90
  };
  terms: {
    hoursOfWork: string;
    workLocation: string;
    salary: string;
    leaveEntitlements: string;
    publicHolidays: string;
    notice: string;
  };
}

export interface NZLeaveEntitlements {
  annualLeave: {
    entitled: number; // 4 weeks minimum
    taken: number;
    remaining: number;
  };
  sickLeave: {
    entitled: number; // 10 days minimum after 6 months
    taken: number;
    remaining: number;
  };
  bereavementLeave: {
    taken: number;
  };
  parentalLeave: {
    primaryCarer: boolean;
    startDate?: string;
    duration?: number; // up to 26 weeks paid
  };
  familyViolenceLeave: {
    taken: number; // 10 days entitled
    remaining: number;
  };
}

export interface NZPayrollDetails {
  taxCode: 'M' | 'M SL' | 'S' | 'S SL' | 'SH' | 'SH SL' | 'ST' | 'ST SL';
  kiwiSaver: {
    optOut: boolean;
    contributionRate: 3 | 4 | 6 | 8 | 10;
    employerContribution: number;
  };
  bankAccount: string;
  irdNumber: string;
  studentLoan: boolean;
  payFrequency: 'weekly' | 'fortnightly' | 'monthly';
}

export interface NZHealthSafety {
  hazardRegisters: {
    id: string;
    hazard: string;
    risk: 'low' | 'medium' | 'high' | 'critical';
    controls: string[];
    reviewDate: string;
  }[];
  incidents: {
    id: string;
    type: 'near_miss' | 'minor' | 'serious';
    date: string;
    description: string;
    actions: string[];
    worksafeNotified: boolean;
    status: 'investigating' | 'resolved';
  }[];
  training: {
    id: string;
    type: string;
    completionDate: string;
    expiryDate?: string;
    provider: string;
  }[];
}

export interface NZCompliance {
  employmentAgreements: NZEmploymentAgreement[];
  leaveEntitlements: NZLeaveEntitlements;
  payroll: NZPayrollDetails;
  healthAndSafety: NZHealthSafety;
  policies: {
    id: string;
    name: string;
    version: string;
    lastReviewed: string;
    nextReview: string;
    content: string;
    acknowledgements: string[]; // employee IDs
  }[];
}
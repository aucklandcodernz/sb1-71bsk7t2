// NZ Government Services Integration Utils
import { format } from 'date-fns';

export const NZ_SERVICES = {
  IRD: {
    BASE_URL: 'https://gateway.ird.govt.nz/gateway/api/v1',
    ENDPOINTS: {
      PAYE: '/paye',
      KIWISAVER: '/kiwisaver',
      GST: '/gst',
      PAYDAY_FILING: '/payday-filing'
    }
  },
  WORKSAFE: {
    BASE_URL: 'https://api.worksafe.govt.nz/v1',
    ENDPOINTS: {
      INCIDENTS: '/incidents',
      NOTIFICATIONS: '/notifications',
      HAZARDS: '/hazards',
      INSPECTIONS: '/inspections'
    }
  },
  EMPLOYMENT: {
    BASE_URL: 'https://api.employment.govt.nz/v1',
    ENDPOINTS: {
      AGREEMENTS: '/agreements',
      HOLIDAYS: '/holidays',
      LEAVE: '/leave',
      MINIMUM_WAGE: '/minimum-wage'
    }
  }
};

// IRD Integration
export const submitPaydayFiling = async (data: any) => {
  const payload = {
    employerIRD: data.employerIRD,
    period: {
      startDate: data.startDate,
      endDate: data.endDate
    },
    employees: data.employees.map((emp: any) => ({
      irdNumber: emp.irdNumber,
      name: emp.name,
      taxCode: emp.taxCode,
      grossEarnings: emp.grossEarnings,
      paye: emp.paye,
      studentLoan: emp.studentLoan,
      kiwiSaver: {
        employeeContribution: emp.kiwiSaver.employee,
        employerContribution: emp.kiwiSaver.employer
      }
    }))
  };

  // In a real app, this would submit to IRD
  console.log('Submitting payday filing:', payload);
};

// WorkSafe Integration
export const notifyWorkSafe = async (incident: any) => {
  const notification = {
    type: incident.type,
    date: incident.date,
    location: incident.location,
    description: incident.description,
    severity: incident.severity,
    injured: incident.injured || [],
    witnesses: incident.witnesses || [],
    notifier: {
      name: incident.reportedBy,
      role: incident.reporterRole,
      contact: incident.reporterContact
    },
    immediateActions: incident.actions
  };

  // In a real app, this would submit to WorkSafe NZ
  console.log('Notifying WorkSafe:', notification);
};

// Employment NZ Integration
export const validateEmploymentAgreement = async (agreement: any) => {
  const validation = {
    minimumRequirements: {
      parties: true,
      duties: true,
      location: true,
      hours: true,
      remuneration: true,
      leaveEntitlements: true
    },
    trialPeriod: agreement.trialPeriod ? {
      valid: agreement.trialPeriod.duration <= 90,
      issues: []
    } : null,
    leaveEntitlements: {
      annualLeave: agreement.leaveEntitlements.annual >= 20,
      sickLeave: agreement.leaveEntitlements.sick >= 10,
      publicHolidays: true,
      bereavementLeave: true
    }
  };

  // In a real app, this would validate against Employment NZ standards
  console.log('Agreement validation:', validation);
  return validation;
};
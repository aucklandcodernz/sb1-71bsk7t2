// Advanced reporting utilities for NZ compliance
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

export const generateComplianceReport = (data: any) => {
  const workbook = XLSX.utils.book_new();

  // Leave Summary
  const leaveSheet = XLSX.utils.json_to_sheet([
    { type: 'Annual Leave', balance: data.annualLeave },
    { type: 'Sick Leave', balance: data.sickLeave },
    { type: 'Alternative Days', balance: data.alternativeDays }
  ]);
  XLSX.utils.book_append_sheet(workbook, leaveSheet, 'Leave Summary');

  // Health & Safety
  const hsSheet = XLSX.utils.json_to_sheet([
    { type: 'Incidents', count: data.incidents },
    { type: 'Hazards', count: data.hazards },
    { type: 'Training Complete', count: data.trainingComplete }
  ]);
  XLSX.utils.book_append_sheet(workbook, hsSheet, 'H&S Summary');

  // Payroll
  const payrollSheet = XLSX.utils.json_to_sheet([
    { type: 'PAYE', amount: data.paye },
    { type: 'KiwiSaver', amount: data.kiwiSaver },
    { type: 'Student Loan', amount: data.studentLoan }
  ]);
  XLSX.utils.book_append_sheet(workbook, payrollSheet, 'Payroll Summary');

  return workbook;
};

export const generateAuditReport = (data: any) => {
  // Generate comprehensive audit report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      employees: data.employeeCount,
      compliance: data.complianceScore,
      risks: data.riskCount
    },
    details: {
      leaveCompliance: data.leaveCompliance,
      payrollAccuracy: data.payrollAccuracy,
      safetyMeasures: data.safetyMeasures
    }
  };

  return report;
};
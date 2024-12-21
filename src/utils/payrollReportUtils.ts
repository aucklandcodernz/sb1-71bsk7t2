import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { Employee } from '../types';
import { PayrollEntry } from '../types/payroll';
import { calculateKiwiSaver, calculatePAYE, calculateACC } from './payrollCalculator';

// Generate KiwiSaver compliance report
export const generateKiwiSaverReport = (employees: Employee[], entries: PayrollEntry[], period: string) => {
  const data = [
    ['KiwiSaver Compliance Report'],
    ['Period:', period],
    ['Generated:', format(new Date(), 'dd/MM/yyyy HH:mm')],
    [''],
    ['Employee', 'IRD Number', 'Rate', 'Status', 'Employee Contribution', 'Employer Contribution', 'Total'],
    ...employees.map(employee => {
      const entry = entries.find(e => e.employeeId === employee.id);
      const rate = parseFloat(employee.kiwiSaverRate || '3');
      const contributions = entry?.deductions.kiwiSaver || { employee: 0, employer: 0 };
      
      return [
        employee.name,
        employee.irdNumber,
        `${rate}%`,
        'Active', // Should be dynamic based on actual status
        contributions.employee.toFixed(2),
        contributions.employer.toFixed(2),
        (contributions.employee + contributions.employer).toFixed(2),
      ];
    })
  ];

  return createWorkbook(data, 'KiwiSaver Report');
};

// Generate leave liability report
export const generateLeaveLiabilityReport = (employees: Employee[], period: string) => {
  const data = [
    ['Leave Liability Report'],
    ['Period:', period],
    ['Generated:', format(new Date(), 'dd/MM/yyyy HH:mm')],
    [''],
    ['Employee', 'Annual Leave Balance', 'Sick Leave Balance', 'Hourly Rate', 'Annual Leave Value', 'Total Liability'],
    ...employees.map(employee => {
      const salary = parseFloat(employee.salary || '0');
      const hourlyRate = salary / (52 * 40); // 40 hours per week
      const annualLeaveBalance = 20; // Example - should be calculated from actual records
      const sickLeaveBalance = 10; // Example
      const annualLeaveValue = hourlyRate * (annualLeaveBalance * 8);
      
      return [
        employee.name,
        annualLeaveBalance,
        sickLeaveBalance,
        hourlyRate.toFixed(2),
        annualLeaveValue.toFixed(2),
        annualLeaveValue.toFixed(2), // Total liability
      ];
    })
  ];

  return createWorkbook(data, 'Leave Liability');
};

// Generate payroll audit report
export const generatePayrollAuditReport = (entries: PayrollEntry[], period: string) => {
  const data = [
    ['Payroll Audit Report'],
    ['Period:', period],
    ['Generated:', format(new Date(), 'dd/MM/yyyy HH:mm')],
    [''],
    ['Employee', 'Gross Pay', 'Net Pay', 'Deductions Total', 'Payment Reference', 'Status', 'Processed Date'],
    ...entries
      .filter(entry => entry.period === period)
      .map(entry => {
        const deductionsTotal = 
          entry.deductions.paye +
          entry.deductions.acc +
          entry.deductions.kiwiSaver.employee +
          (entry.deductions.studentLoan || 0);
        
        return [
          entry.employeeName,
          entry.grossPay.toFixed(2),
          entry.netPay.toFixed(2),
          deductionsTotal.toFixed(2),
          entry.paymentDetails.reference,
          entry.status.toUpperCase(),
          format(new Date(entry.paymentDetails.paymentDate), 'dd/MM/yyyy'),
        ];
      })
  ];

  return createWorkbook(data, 'Payroll Audit');
};

// Generate employee cost analysis
export const generateCostAnalysisReport = (employees: Employee[], entries: PayrollEntry[], period: string) => {
  // Group by department
  const departmentCosts = entries
    .filter(entry => entry.period === period)
    .reduce((acc, entry) => {
      const employee = employees.find(e => e.id === entry.employeeId);
      const dept = employee?.department || 'Unassigned';
      
      if (!acc[dept]) {
        acc[dept] = {
          employees: new Set(),
          grossWages: 0,
          kiwiSaver: 0,
          acc: 0,
          totalCost: 0,
        };
      }
      
      acc[dept].employees.add(entry.employeeId);
      acc[dept].grossWages += entry.grossPay;
      acc[dept].kiwiSaver += entry.deductions.kiwiSaver.employer;
      acc[dept].acc += entry.deductions.acc;
      acc[dept].totalCost += entry.grossPay + 
        entry.deductions.kiwiSaver.employer +
        entry.deductions.acc;
      
      return acc;
    }, {} as Record<string, {
      employees: Set<string>;
      grossWages: number;
      kiwiSaver: number;
      acc: number;
      totalCost: number;
    }>);

  const data = [
    ['Employee Cost Analysis'],
    ['Period:', period],
    ['Generated:', format(new Date(), 'dd/MM/yyyy HH:mm')],
    [''],
    ['Department', 'Employees', 'Gross Wages', 'KiwiSaver (ER)', 'ACC', 'Total Cost', 'Avg Cost/Employee'],
    ...Object.entries(departmentCosts).map(([dept, stats]) => [
      dept,
      stats.employees.size,
      stats.grossWages.toFixed(2),
      stats.kiwiSaver.toFixed(2),
      stats.acc.toFixed(2),
      stats.totalCost.toFixed(2),
      (stats.totalCost / stats.employees.size).toFixed(2),
    ])
  ];

  return createWorkbook(data, 'Cost Analysis');
};

// Generate tax reconciliation report
export const generateTaxReconciliationReport = (entries: PayrollEntry[], period: string) => {
  const data = [
    ['Tax Reconciliation Report'],
    ['Period:', period],
    ['Generated:', format(new Date(), 'dd/MM/yyyy HH:mm')],
    [''],
    ['Category', 'Amount', 'Notes'],
    ['Gross Earnings', 
      entries.reduce((sum, e) => sum + e.grossPay, 0).toFixed(2),
      'Total taxable earnings'
    ],
    ['PAYE Deducted',
      entries.reduce((sum, e) => sum + e.deductions.paye, 0).toFixed(2),
      'Total PAYE tax withheld'
    ],
    ['KiwiSaver Employee',
      entries.reduce((sum, e) => sum + e.deductions.kiwiSaver.employee, 0).toFixed(2),
      'Total employee contributions'
    ],
    ['KiwiSaver Employer',
      entries.reduce((sum, e) => sum + e.deductions.kiwiSaver.employer, 0).toFixed(2),
      'Total employer contributions'
    ],
    ['Student Loan Deductions',
      entries.reduce((sum, e) => sum + (e.deductions.studentLoan || 0), 0).toFixed(2),
      'Total student loan repayments'
    ],
    ['ACC Levies',
      entries.reduce((sum, e) => sum + e.deductions.acc, 0).toFixed(2),
      'Total ACC levies'
    ],
    ['Net Payments',
      entries.reduce((sum, e) => sum + e.netPay, 0).toFixed(2),
      'Total net payments to employees'
    ],
  ];

  return createWorkbook(data, 'Tax Reconciliation');
};

// Helper function to create workbook
const createWorkbook = (data: any[][], sheetName: string) => {
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  return wb;
};
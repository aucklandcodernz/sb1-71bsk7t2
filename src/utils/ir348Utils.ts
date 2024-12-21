import { format } from 'date-fns';
import { PayrollEntry } from '../types/payroll';
import Big from 'big.js';
import Papa from 'papaparse';

// Generate IR348 (Monthly Schedule) file
export const generateIR348File = (entries: PayrollEntry[], period: string): string => {
  // Group entries by employee and calculate totals
  const employeeTotals = entries
    .filter(entry => entry.period === period)
    .reduce((acc, entry) => {
      if (!acc[entry.employeeId]) {
        acc[entry.employeeId] = {
          name: entry.employeeName,
          grossEarnings: new Big(0),
          paye: new Big(0),
          studentLoan: new Big(0),
          kiwiSaver: {
            employee: new Big(0),
            employer: new Big(0),
          },
        };
      }

      acc[entry.employeeId].grossEarnings = acc[entry.employeeId].grossEarnings.plus(entry.grossPay);
      acc[entry.employeeId].paye = acc[entry.employeeId].paye.plus(entry.deductions.paye);
      acc[entry.employeeId].studentLoan = acc[entry.employeeId].studentLoan.plus(entry.deductions.studentLoan || 0);
      acc[entry.employeeId].kiwiSaver.employee = acc[entry.employeeId].kiwiSaver.employee.plus(entry.deductions.kiwiSaver.employee);
      acc[entry.employeeId].kiwiSaver.employer = acc[entry.employeeId].kiwiSaver.employer.plus(entry.deductions.kiwiSaver.employer);

      return acc;
    }, {} as Record<string, {
      name: string;
      grossEarnings: Big;
      paye: Big;
      studentLoan: Big;
      kiwiSaver: {
        employee: Big;
        employer: Big;
      };
    }>);

  // Convert to CSV format
  const records = Object.entries(employeeTotals).map(([employeeId, totals]) => ({
    employeeId,
    name: totals.name,
    grossEarnings: totals.grossEarnings.toFixed(2),
    paye: totals.paye.toFixed(2),
    studentLoan: totals.studentLoan.toFixed(2),
    kiwiSaverEmployee: totals.kiwiSaver.employee.toFixed(2),
    kiwiSaverEmployer: totals.kiwiSaver.employer.toFixed(2),
  }));

  return Papa.unparse(records, {
    delimiter: ',',
    header: true,
  });
};
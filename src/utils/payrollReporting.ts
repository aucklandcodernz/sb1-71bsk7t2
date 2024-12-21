import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { PayrollRun, PayrollRunEmployee } from '../types/payroll';

// Generate IR348 (Monthly Schedule)
export const generateIR348 = (payrollRun: PayrollRun): string => {
  const csvData = [
    ['IRD Number', 'Name', 'Tax Code', 'Gross Earnings', 'PAYE', 'Student Loan', 'KiwiSaver Employee', 'KiwiSaver Employer'],
    ...payrollRun.employees.map(employee => [
      employee.employeeId,
      employee.employeeId, // Replace with actual name
      employee.taxCode,
      employee.grossPay.toFixed(2),
      employee.deductions.paye.toFixed(2),
      employee.deductions.studentLoan.toFixed(2),
      employee.deductions.kiwiSaver.employee.toFixed(2),
      employee.deductions.kiwiSaver.employer.toFixed(2)
    ])
  ];

  return Papa.unparse(csvData);
};

// Generate bank payment file
export const generateBankFile = (payrollRun: PayrollRun): string => {
  const csvData = [
    ['Account', 'Amount', 'Reference', 'Particulars'],
    ...payrollRun.employees.map(employee => [
      employee.bankAccount,
      employee.netPay.toFixed(2),
      `WAGES ${format(new Date(payrollRun.period.end), 'ddMMyy')}`,
      employee.employeeId
    ])
  ];

  return Papa.unparse(csvData);
};

// Generate payslips
export const generatePayslips = async (payrollRun: PayrollRun): Promise<Buffer> => {
  const doc = new jsPDF();
  let currentPage = 1;

  for (const employee of payrollRun.employees) {
    if (currentPage > 1) {
      doc.addPage();
    }

    // Header
    doc.setFontSize(20);
    doc.text('PAYSLIP', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Pay Period: ${format(new Date(payrollRun.period.start), 'dd/MM/yyyy')} - ${format(new Date(payrollRun.period.end), 'dd/MM/yyyy')}`, 20, 40);
    
    // Employee Details
    doc.text(`Employee: ${employee.employeeId}`, 20, 60);
    doc.text(`Tax Code: ${employee.taxCode}`, 20, 70);
    
    // Earnings
    doc.text('Earnings', 20, 90);
    doc.text(`Regular Pay: $${employee.earnings.regular.toFixed(2)}`, 30, 100);
    doc.text(`Overtime: $${employee.earnings.overtime.toFixed(2)}`, 30, 110);
    doc.text(`Allowances: $${employee.earnings.allowances.reduce((sum, a) => sum + a.amount, 0).toFixed(2)}`, 30, 120);
    
    // Deductions
    doc.text('Deductions', 20, 140);
    doc.text(`PAYE: $${employee.deductions.paye.toFixed(2)}`, 30, 150);
    doc.text(`KiwiSaver: $${employee.deductions.kiwiSaver.employee.toFixed(2)}`, 30, 160);
    doc.text(`Student Loan: $${employee.deductions.studentLoan.toFixed(2)}`, 30, 170);
    
    // Summary
    doc.text(`Gross Pay: $${employee.grossPay.toFixed(2)}`, 20, 190);
    doc.text(`Net Pay: $${employee.netPay.toFixed(2)}`, 20, 200);
    
    // Footer
    doc.setFontSize(8);
    doc.text(`Generated: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 20, 280);
    
    currentPage++;
  }

  return Buffer.from(doc.output('arraybuffer'));
};

// Generate payroll summary report
export const generatePayrollSummary = (payrollRun: PayrollRun): XLSX.WorkBook => {
  const workbook = XLSX.utils.book_new();

  // Summary Sheet
  const summaryData = [
    ['Payroll Summary'],
    [`Period: ${format(new Date(payrollRun.period.start), 'dd/MM/yyyy')} - ${format(new Date(payrollRun.period.end), 'dd/MM/yyyy')}`],
    [''],
    ['Category', 'Amount'],
    ['Gross Pay', payrollRun.totals.grossPay],
    ['PAYE', payrollRun.totals.paye],
    ['KiwiSaver (Employee)', payrollRun.totals.kiwiSaver.employee],
    ['KiwiSaver (Employer)', payrollRun.totals.kiwiSaver.employer],
    ['ACC Levy', payrollRun.totals.acc],
    ['Student Loan', payrollRun.totals.studentLoan],
    ['Net Pay', payrollRun.totals.netPay]
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, wsSummary, 'Summary');

  // Details Sheet
  const detailsData = [
    ['Employee', 'Gross Pay', 'PAYE', 'KiwiSaver', 'Student Loan', 'Net Pay'],
    ...payrollRun.employees.map(employee => [
      employee.employeeId,
      employee.grossPay,
      employee.deductions.paye,
      employee.deductions.kiwiSaver.employee,
      employee.deductions.studentLoan,
      employee.netPay
    ])
  ];

  const wsDetails = XLSX.utils.aoa_to_sheet(detailsData);
  XLSX.utils.book_append_sheet(workbook, wsDetails, 'Details');

  return workbook;
};

// Generate leave liability report
export const generateLeaveLiabilityReport = (employees: PayrollRunEmployee[]): XLSX.WorkBook => {
  const workbook = XLSX.utils.book_new();

  const leaveData = [
    ['Employee', 'Annual Leave Balance', 'Sick Leave Balance', 'Alternative Days', 'Estimated Value'],
    ...employees.map(employee => [
      employee.employeeId,
      employee.leaveHours.annual,
      employee.leaveHours.sick,
      employee.leaveHours.alternative,
      (employee.leaveHours.annual * (employee.earnings.regular / employee.regularHours)).toFixed(2)
    ])
  ];

  const wsLeave = XLSX.utils.aoa_to_sheet(leaveData);
  XLSX.utils.book_append_sheet(workbook, wsLeave, 'Leave Liability');

  return workbook;
};

// Generate deductions report
export const generateDeductionsReport = (payrollRun: PayrollRun): XLSX.WorkBook => {
  const workbook = XLSX.utils.book_new();

  const deductionsData = [
    ['Employee', 'KiwiSaver', 'Student Loan', 'Other Deductions', 'Total'],
    ...payrollRun.employees.map(employee => [
      employee.employeeId,
      employee.deductions.kiwiSaver.employee,
      employee.deductions.studentLoan,
      employee.deductions.other.reduce((sum, d) => sum + d.amount, 0),
      (
        employee.deductions.kiwiSaver.employee +
        employee.deductions.studentLoan +
        employee.deductions.other.reduce((sum, d) => sum + d.amount, 0)
      ).toFixed(2)
    ])
  ];

  const wsDeductions = XLSX.utils.aoa_to_sheet(deductionsData);
  XLSX.utils.book_append_sheet(workbook, wsDeductions, 'Deductions');

  return workbook;
};
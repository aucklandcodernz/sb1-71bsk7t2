import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { Employee } from '../types';
import Big from 'big.js';

interface PayslipData {
  earnings: {
    regular: number;
    overtime: number;
    publicHoliday: number;
    allowances: { name: string; amount: number }[];
  };
  deductions: {
    paye: number;
    acc: number;
    kiwiSaver: { employee: number; employer: number };
    studentLoan: number;
    other: { name: string; amount: number }[];
  };
  leaveBalances?: {
    annual: number;
    sick: number;
    alternative: number;
  };
}

export const generatePayslip = async (
  employee: Employee,
  period: string,
  earnings: PayslipData['earnings'],
  deductions: PayslipData['deductions'],
  leaveBalances?: PayslipData['leaveBalances']
): Promise<void> => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Company Header
    doc.setFontSize(20);
    doc.text('KiwiHR', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.text('PAYSLIP', pageWidth / 2, 30, { align: 'center' });
    doc.text(`Period: ${period}`, pageWidth / 2, 40, { align: 'center' });

    // Employee Details
    doc.text(`Employee: ${employee.name}`, 20, 60);
    doc.text(`Position: ${employee.position}`, 20, 70);
    doc.text(`Tax Code: ${employee.taxCode || 'M'}`, 20, 80);
    doc.text(`IRD Number: ${employee.irdNumber || 'Not provided'}`, 20, 90);

    // Earnings
    let yPos = 110;
    doc.text('Earnings', 20, yPos);
    yPos += 10;

    // Regular Pay
    const regularPay = new Big(earnings.regular);
    doc.text('Regular Pay:', 30, yPos);
    doc.text(`$${regularPay.toFixed(2)}`, 120, yPos);
    yPos += 10;

    // Overtime
    if (earnings.overtime > 0) {
      const overtimePay = new Big(earnings.overtime);
      doc.text('Overtime:', 30, yPos);
      doc.text(`$${overtimePay.toFixed(2)}`, 120, yPos);
      yPos += 10;
    }

    // Public Holiday
    if (earnings.publicHoliday > 0) {
      const publicHolidayPay = new Big(earnings.publicHoliday);
      doc.text('Public Holiday:', 30, yPos);
      doc.text(`$${publicHolidayPay.toFixed(2)}`, 120, yPos);
      yPos += 10;
    }

    // Allowances
    earnings.allowances.forEach(allowance => {
      doc.text(`${allowance.name}:`, 30, yPos);
      doc.text(`$${new Big(allowance.amount).toFixed(2)}`, 120, yPos);
      yPos += 10;
    });

    // Total Gross
    const totalGross = earnings.allowances.reduce(
      (sum, a) => sum.plus(a.amount),
      regularPay.plus(earnings.overtime).plus(earnings.publicHoliday)
    );

    yPos += 5;
    doc.text('Total Gross:', 20, yPos);
    doc.text(`$${totalGross.toFixed(2)}`, 120, yPos);

    // Deductions
    yPos += 20;
    doc.text('Deductions', 20, yPos);
    yPos += 10;

    // PAYE
    const payeDeduction = new Big(deductions.paye);
    doc.text('PAYE Tax:', 30, yPos);
    doc.text(`$${payeDeduction.toFixed(2)}`, 120, yPos);
    yPos += 10;

    // ACC
    const accDeduction = new Big(deductions.acc);
    doc.text('ACC Levy:', 30, yPos);
    doc.text(`$${accDeduction.toFixed(2)}`, 120, yPos);
    yPos += 10;

    // KiwiSaver
    const kiwiSaverEmployee = new Big(deductions.kiwiSaver.employee);
    const kiwiSaverEmployer = new Big(deductions.kiwiSaver.employer);
    doc.text('KiwiSaver (Employee):', 30, yPos);
    doc.text(`$${kiwiSaverEmployee.toFixed(2)}`, 120, yPos);
    yPos += 10;
    doc.text('KiwiSaver (Employer):', 30, yPos);
    doc.text(`$${kiwiSaverEmployer.toFixed(2)}`, 120, yPos);
    yPos += 10;

    // Student Loan
    if (deductions.studentLoan > 0) {
      const studentLoanDeduction = new Big(deductions.studentLoan);
      doc.text('Student Loan:', 30, yPos);
      doc.text(`$${studentLoanDeduction.toFixed(2)}`, 120, yPos);
      yPos += 10;
    }

    // Other deductions
    deductions.other.forEach(deduction => {
      doc.text(`${deduction.name}:`, 30, yPos);
      doc.text(`$${new Big(deduction.amount).toFixed(2)}`, 120, yPos);
      yPos += 10;
    });

    // Total Deductions
    const totalDeductions = deductions.other.reduce(
      (sum, d) => sum.plus(d.amount),
      payeDeduction
        .plus(accDeduction)
        .plus(kiwiSaverEmployee)
        .plus(deductions.studentLoan)
    );

    yPos += 5;
    doc.text('Total Deductions:', 20, yPos);
    doc.text(`$${totalDeductions.toFixed(2)}`, 120, yPos);

    // Net Pay
    yPos += 20;
    const netPay = totalGross.minus(totalDeductions);
    doc.text('Net Pay:', 20, yPos);
    doc.text(`$${netPay.toFixed(2)}`, 120, yPos);

    // Leave Balances
    if (leaveBalances) {
      yPos += 20;
      doc.text('Leave Balances', 20, yPos);
      yPos += 10;

      doc.text('Annual Leave:', 30, yPos);
      doc.text(`${leaveBalances.annual} days`, 120, yPos);
      yPos += 10;

      doc.text('Sick Leave:', 30, yPos);
      doc.text(`${leaveBalances.sick} days`, 120, yPos);
      yPos += 10;

      doc.text('Alternative Days:', 30, yPos);
      doc.text(`${leaveBalances.alternative} days`, 120, yPos);
      yPos += 10;
    }

    // Payment Details
    yPos += 10;
    doc.text('Payment Details', 20, yPos);
    yPos += 10;
    doc.text(`Bank Account: ${employee.bankAccount || 'Not provided'}`, 30, yPos);
    yPos += 10;
    doc.text(`Payment Date: ${format(new Date(), 'dd/MM/yyyy')}`, 30, yPos);

    // Footer
    doc.setFontSize(8);
    doc.text('Generated by KiwiHR', 20, 280);
    doc.text(format(new Date(), 'dd/MM/yyyy HH:mm'), pageWidth - 20, 280, { align: 'right' });

    // Save the PDF
    const filename = `payslip-${employee.name.replace(/\s+/g, '-')}-${period}.pdf`;
    doc.save(filename);
  } catch (error) {
    console.error('Payslip generation error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate payslip');
  }
};
// NZ Payroll Utilities
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import { Employee } from '../types';

// Tax rates for 2024
const TAX_RATES = [
  { threshold: 14000, rate: 0.105 },
  { threshold: 48000, rate: 0.175 },
  { threshold: 70000, rate: 0.300 },
  { threshold: 180000, rate: 0.330 },
  { threshold: Infinity, rate: 0.390 }
];

// Calculate PAYE tax
export const calculatePAYE = (annualIncome: number): number => {
  let tax = 0;
  let remainingIncome = annualIncome;
  let previousThreshold = 0;

  for (const { threshold, rate } of TAX_RATES) {
    const taxableAmount = Math.min(remainingIncome, threshold - previousThreshold);
    tax += taxableAmount * rate;
    remainingIncome -= taxableAmount;
    if (remainingIncome <= 0) break;
    previousThreshold = threshold;
  }

  return tax;
};

// Calculate ACC Levy
export const calculateACC = (earnings: number): number => {
  // 2024 ACC earners' levy rate is $1.39 per $100
  return earnings * 0.0139;
};

// Calculate KiwiSaver
export const calculateKiwiSaver = (
  salary: number,
  employeeRate: number,
  employerRate: number = 3
) => ({
  employee: (salary * employeeRate) / 100,
  employer: (salary * employerRate) / 100,
});

// Generate payslip
export const generatePayslip = async (
  employee: Employee,
  period: string
): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Company Header
  doc.setFontSize(20);
  doc.text('KiwiHR', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text('Payslip', pageWidth / 2, 30, { align: 'center' });
  doc.text(`Period: ${period}`, pageWidth / 2, 40, { align: 'center' });
  
  // Employee Details
  doc.setFontSize(12);
  doc.text(`Employee: ${employee.name}`, 20, 60);
  doc.text(`Position: ${employee.position}`, 20, 70);
  doc.text(`Tax Code: ${employee.taxCode}`, 20, 80);
  doc.text(`IRD Number: ${employee.irdNumber}`, 20, 90);
  
  // Calculate Pay Details
  const salary = parseFloat(employee.salary || '0');
  const monthlyGross = salary / 12;
  const paye = calculatePAYE(salary) / 12;
  const acc = calculateACC(salary) / 12;
  const kiwiSaver = calculateKiwiSaver(
    monthlyGross,
    parseFloat(employee.kiwiSaverRate || '3')
  );
  
  // Pay Details
  doc.text('Pay Details:', 20, 110);
  doc.text(`Gross Pay: $${monthlyGross.toFixed(2)}`, 30, 120);
  doc.text(`PAYE Tax: $${paye.toFixed(2)}`, 30, 130);
  doc.text(`ACC Levy: $${acc.toFixed(2)}`, 30, 140);
  doc.text(`KiwiSaver (Employee): $${kiwiSaver.employee.toFixed(2)}`, 30, 150);
  doc.text(`KiwiSaver (Employer): $${kiwiSaver.employer.toFixed(2)}`, 30, 160);
  
  const netPay = monthlyGross - paye - acc - kiwiSaver.employee;
  doc.text(`Net Pay: $${netPay.toFixed(2)}`, 20, 180);
  
  // Payment Details
  doc.text('Payment Details:', 20, 200);
  doc.text(`Bank Account: ${employee.bankAccount}`, 30, 210);
  doc.text(`Payment Date: ${format(new Date(), 'dd/MM/yyyy')}`, 30, 220);
  
  // Save the PDF
  doc.save(`payslip-${employee.name}-${period}.pdf`);
};

// Generate IR348 Monthly Schedule
export const generateIR348 = (employees: Employee[], period: string) => {
  return employees.map(employee => {
    const salary = parseFloat(employee.salary || '0');
    const monthlyGross = salary / 12;
    const paye = calculatePAYE(salary) / 12;
    const kiwiSaver = calculateKiwiSaver(
      monthlyGross,
      parseFloat(employee.kiwiSaverRate || '3')
    );

    return {
      irdNumber: employee.irdNumber,
      name: employee.name,
      grossEarnings: monthlyGross.toFixed(2),
      paye: paye.toFixed(2),
      kiwiSaverEmployee: kiwiSaver.employee.toFixed(2),
      kiwiSaverEmployer: kiwiSaver.employer.toFixed(2),
    };
  });
};
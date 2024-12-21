import { format } from 'date-fns';
import * as XLSX from 'xlsx';

// NZ-specific expense utilities

// Constants
export const GST_RATE = 0.15; // NZ GST rate is 15%
export const MILEAGE_RATE = 0.83; // NZ IRD rate for 2024
export const PER_DIEM_RATE = 65; // Example rate for NZ domestic travel

// Calculate GST amount
export const calculateGST = (amount: number): number => {
  return amount * GST_RATE;
};

// Calculate mileage reimbursement
export const calculateMileage = (distance: number): number => {
  return distance * MILEAGE_RATE;
};

// Calculate per diem amount
export const calculatePerDiem = (days: number): number => {
  return days * PER_DIEM_RATE;
};

// Validate GST number format
export const validateGSTNumber = (gstNumber: string): boolean => {
  // NZ GST number format: nnn-nnn-nnn
  const gstRegex = /^\d{3}-\d{3}-\d{3}$/;
  return gstRegex.test(gstNumber);
};

// Format currency in NZD
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
  }).format(amount);
};

// Generate GST return data
export const generateGSTReturn = (expenses: any[], period: { start: string; end: string }) => {
  const filteredExpenses = expenses.filter(
    expense => 
      expense.date >= period.start && 
      expense.date <= period.end
  );

  const byCategory = filteredExpenses.reduce((acc: Record<string, number>, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalGST = totalAmount * GST_RATE;

  return {
    byCategory,
    totalAmount,
    totalGST,
    period: {
      start: period.start,
      end: period.end
    },
    summary: {
      box5: totalAmount, // Total sales and income
      box6: totalAmount - (totalAmount * GST_RATE), // Zero-rated supplies
      box7: totalAmount * GST_RATE, // GST charged on sales/income
      box9: totalGST, // Total GST to pay or refund
    }
  };
};

// Generate expense report
export const generateExpenseReport = (expenses: any[], period: { start: string; end: string }) => {
  const workbook = XLSX.utils.book_new();

  // Summary sheet
  const summaryData = [
    ['Expense Report Summary'],
    ['Period:', `${format(new Date(period.start), 'dd/MM/yyyy')} to ${format(new Date(period.end), 'dd/MM/yyyy')}`],
    ['Generated:', format(new Date(), 'dd/MM/yyyy')],
    [''],
    ['Category', 'Amount', 'GST', 'Net'],
    ...Object.entries(
      expenses.reduce((acc: Record<string, number>, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {})
    ).map(([category, amount]) => [
      category,
      formatCurrency(amount),
      formatCurrency(amount * GST_RATE),
      formatCurrency(amount - (amount * GST_RATE))
    ]),
    [''],
    ['Total', formatCurrency(expenses.reduce((sum, e) => sum + e.amount, 0))]
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, wsSummary, 'Summary');

  // Details sheet
  const detailsData = [
    ['Date', 'Category', 'Description', 'Amount', 'GST', 'Net', 'Status'],
    ...expenses.map(expense => [
      format(new Date(expense.date), 'dd/MM/yyyy'),
      expense.category,
      expense.description,
      formatCurrency(expense.amount),
      formatCurrency(expense.amount * GST_RATE),
      formatCurrency(expense.amount - (expense.amount * GST_RATE)),
      expense.status
    ])
  ];

  const wsDetails = XLSX.utils.aoa_to_sheet(detailsData);
  XLSX.utils.book_append_sheet(workbook, wsDetails, 'Details');

  return workbook;
};
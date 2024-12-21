import { format } from 'date-fns';
import { PayrollEntry } from '../types/payroll';
import Big from 'big.js';

// Generate bank payment file in common NZ bank format
export const generateBankPaymentFile = (entries: PayrollEntry[]): string => {
  // Filter only pending payments
  const pendingPayments = entries.filter(entry => entry.status === 'pending');

  // Calculate total payment amount
  const totalAmount = pendingPayments.reduce(
    (sum, entry) => sum.plus(entry.netPay),
    new Big(0)
  );

  // Create header record
  const header = {
    recordType: '0',
    bankNumber: '12', // Example bank number
    date: format(new Date(), 'ddMMyy'),
    sequence: '01',
    description: `KIWIHR PAY ${format(new Date(), 'MMMyy').toUpperCase()}`,
    totalAmount: totalAmount.toFixed(2),
    totalTransactions: pendingPayments.length.toString().padStart(6, '0'),
  };

  // Create transaction records
  const transactions = pendingPayments.map(entry => ({
    recordType: '1',
    bankNumber: entry.paymentDetails.bankAccount.split('-')[0],
    branchNumber: entry.paymentDetails.bankAccount.split('-')[1],
    accountNumber: entry.paymentDetails.bankAccount.split('-')[2],
    suffix: entry.paymentDetails.bankAccount.split('-')[3],
    amount: new Big(entry.netPay).toFixed(2),
    reference: entry.paymentDetails.reference,
    particularCode: 'WAGES',
    name: entry.employeeName.substring(0, 12), // Max 12 characters
  }));

  // Create footer record
  const footer = {
    recordType: '9',
    bankNumber: '12',
    branchNumber: '3456', // Example branch number
    totalAmount: totalAmount.toFixed(2),
    totalTransactions: pendingPayments.length.toString().padStart(6, '0'),
  };

  // Combine all records and convert to CSV
  const records = [header, ...transactions, footer];
  return records.map(record => Object.values(record).join(',')).join('\n');
};
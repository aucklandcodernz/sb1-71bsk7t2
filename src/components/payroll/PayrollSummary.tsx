import React from 'react';

interface PayrollSummaryProps {
  grossPayments: {
    regular: number;
    overtime: number;
    publicHoliday: number;
  };
  totalAllowances: number;
  grossTotal: number;
  payrollDeductions: {
    paye: number;
    acc: number;
    kiwiSaver: {
      employee: number;
      employer: number;
    };
    studentLoan: number;
    other: number;
  };
  netPay: number;
  hasStudentLoan: boolean;
}

export const PayrollSummary = ({
  grossPayments,
  totalAllowances,
  grossTotal,
  payrollDeductions,
  netPay,
  hasStudentLoan,
}: PayrollSummaryProps) => {
  const totalDeductions =
    payrollDeductions.paye +
    payrollDeductions.acc +
    payrollDeductions.kiwiSaver.employee +
    payrollDeductions.studentLoan +
    payrollDeductions.other;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="font-medium mb-4">Earnings Summary</h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Regular Pay</span>
            <span className="font-medium">${grossPayments.regular.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Overtime Pay</span>
            <span className="font-medium">${grossPayments.overtime.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Public Holiday Pay</span>
            <span className="font-medium">${grossPayments.publicHoliday.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Allowances</span>
            <span className="font-medium">${totalAllowances.toFixed(2)}</span>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between items-center font-medium">
              <span>Gross Pay</span>
              <span>${grossTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="font-medium mb-4">Deductions</h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">PAYE Tax</span>
            <span className="font-medium">${payrollDeductions.paye.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">ACC Levy</span>
            <span className="font-medium">${payrollDeductions.acc.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">KiwiSaver (Employee)</span>
            <span className="font-medium">${payrollDeductions.kiwiSaver.employee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-gray-500">
            <span>KiwiSaver (Employer)</span>
            <span>${payrollDeductions.kiwiSaver.employer.toFixed(2)}</span>
          </div>
          {hasStudentLoan && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Student Loan</span>
              <span className="font-medium">${payrollDeductions.studentLoan.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center font-medium">
              <span>Total Deductions</span>
              <span>${totalDeductions.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 rounded-lg p-6">
        <div className="flex justify-between items-center">
          <span className="font-medium text-indigo-900">Net Pay</span>
          <span className="text-2xl font-bold text-indigo-600">
            ${netPay.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
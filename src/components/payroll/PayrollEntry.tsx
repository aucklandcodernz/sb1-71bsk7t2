import React from 'react';
import { PayrollEntry as PayrollEntryType } from '../../types/payroll';
import { format } from 'date-fns';
import { DollarSign, Download } from 'lucide-react';

interface PayrollEntryProps {
  entry: PayrollEntryType;
  onDownloadPayslip: () => void;
}

export const PayrollEntry = ({ entry, onDownloadPayslip }: PayrollEntryProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{format(new Date(entry.period), 'MMMM yyyy')}</h3>
          <p className="text-sm text-gray-500">Reference: {entry.paymentDetails.reference}</p>
        </div>
        <button
          onClick={onDownloadPayslip}
          className="text-indigo-600 hover:text-indigo-800"
          title="Download Payslip"
        >
          <Download size={20} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Gross Pay</p>
          <p className="text-lg font-medium">${entry.grossPay.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Net Pay</p>
          <p className="text-lg font-medium">${entry.netPay.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Deductions</h4>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">PAYE</span>
            <span>${entry.deductions.paye.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">ACC</span>
            <span>${entry.deductions.acc.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">KiwiSaver</span>
            <span>${entry.deductions.kiwiSaver.employee.toFixed(2)}</span>
          </div>
          {entry.deductions.studentLoan > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Student Loan</span>
              <span>${entry.deductions.studentLoan.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Payment Date</span>
          <span>{format(new Date(entry.paymentDetails.paymentDate), 'dd/MM/yyyy')}</span>
        </div>
        <div className="mt-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            entry.status === 'paid'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {entry.status.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};
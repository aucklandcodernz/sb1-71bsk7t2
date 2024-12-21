import React, { useState } from 'react';
import { usePayrollStore } from '../../store/payrollStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { useLeaveStore } from '../../store/leaveStore';
import { generatePayslip } from '../../utils/payslipGenerator';
import { FileText, Download, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface PayslipViewerProps {
  employeeId: string;
  period: string;
}

export const PayslipViewer = ({ employeeId, period }: PayslipViewerProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const employee = useEmployeeStore((state) => state.getEmployeeById(employeeId));
  const payrollEntry = usePayrollStore((state) => 
    state.entries.find(e => e.employeeId === employeeId && e.period === period)
  );
  const leaveBalance = useLeaveStore((state) => state.calculateLeaveBalance(employeeId, new Date()));

  const handleDownload = async () => {
    if (!employee || !payrollEntry) {
      toast.error('No payroll data found for selected period');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Calculate earnings
      const earnings = {
        regular: payrollEntry.grossPay,
        overtime: payrollEntry.additions?.overtime || 0,
        publicHoliday: 0,
        allowances: payrollEntry.additions?.allowances || []
      };

      // Calculate deductions
      const deductions = {
        paye: payrollEntry.deductions.paye,
        acc: payrollEntry.deductions.acc,
        kiwiSaver: payrollEntry.deductions.kiwiSaver,
        studentLoan: payrollEntry.deductions.studentLoan || 0,
        other: payrollEntry.deductions.other || []
      };

      // Calculate leave balances
      const leaveBalances = {
        annual: leaveBalance,
        sick: 10, // Default NZ entitlement
        alternative: 0
      };

      await generatePayslip(employee, period, earnings, deductions, leaveBalances);
      toast.success('Payslip downloaded successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate payslip';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!payrollEntry) {
    return (
      <div className="text-center py-8 text-gray-500">
        No payroll data available for this period
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Payslip Details</h3>
        <button
          onClick={handleDownload}
          disabled={loading}
          className="btn-primary flex items-center space-x-2"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <Download size={20} />
          )}
          <span>{loading ? 'Generating...' : 'Download Payslip'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="text-red-500 mr-2" size={20} />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-medium mb-4">Earnings</h4>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Regular Pay</span>
              <span className="font-medium">${payrollEntry.grossPay.toFixed(2)}</span>
            </div>
            {payrollEntry.additions?.overtime && (
              <div className="flex justify-between">
                <span className="text-gray-600">Overtime</span>
                <span className="font-medium">${payrollEntry.additions.overtime.toFixed(2)}</span>
              </div>
            )}
            {payrollEntry.additions?.allowances?.map((allowance, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-600">{allowance.name}</span>
                <span className="font-medium">${allowance.amount.toFixed(2)}</span>
              </div>
            ))}
            <div className="pt-2 mt-2 border-t">
              <div className="flex justify-between font-medium">
                <span>Total Gross</span>
                <span>${payrollEntry.grossPay.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-medium mb-4">Deductions</h4>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">PAYE Tax</span>
              <span className="font-medium">${payrollEntry.deductions.paye.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ACC Levy</span>
              <span className="font-medium">${payrollEntry.deductions.acc.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">KiwiSaver (Employee)</span>
              <span className="font-medium">
                ${payrollEntry.deductions.kiwiSaver.employee.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>KiwiSaver (Employer)</span>
              <span>${payrollEntry.deductions.kiwiSaver.employer.toFixed(2)}</span>
            </div>
            {payrollEntry.deductions.studentLoan > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Student Loan</span>
                <span className="font-medium">
                  ${payrollEntry.deductions.studentLoan.toFixed(2)}
                </span>
              </div>
            )}
            {payrollEntry.deductions.other?.map((deduction, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-600">{deduction.name}</span>
                <span className="font-medium">${deduction.amount.toFixed(2)}</span>
              </div>
            ))}
            <div className="pt-2 mt-2 border-t">
              <div className="flex justify-between font-medium">
                <span>Total Deductions</span>
                <span>
                  ${(
                    payrollEntry.deductions.paye +
                    payrollEntry.deductions.acc +
                    payrollEntry.deductions.kiwiSaver.employee +
                    (payrollEntry.deductions.studentLoan || 0) +
                    (payrollEntry.deductions.other?.reduce((sum, d) => sum + d.amount, 0) || 0)
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Net Pay</span>
          <span className="text-2xl font-bold text-indigo-600">
            ${payrollEntry.netPay.toFixed(2)}
          </span>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          Payment will be made to: {payrollEntry.paymentDetails.bankAccount}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="font-medium mb-4">Leave Balances</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-gray-500">Annual Leave</p>
            <p className="text-xl font-medium">{leaveBalance} days</p>
          </div>
          <div>
            <p className="text-gray-500">Sick Leave</p>
            <p className="text-xl font-medium">10 days</p>
          </div>
          <div>
            <p className="text-gray-500">Alternative Days</p>
            <p className="text-xl font-medium">0 days</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">NZ Payroll Requirements:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>PAYE deducted at source</li>
              <li>KiwiSaver contributions</li>
              <li>ACC levies calculated</li>
              <li>Student loan deductions (if applicable)</li>
              <li>Leave balances must be shown</li>
              <li>Payment details must be included</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
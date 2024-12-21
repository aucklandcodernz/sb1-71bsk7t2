import React, { useState } from 'react';
import { usePayrollStore } from '../../store/payrollStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { PayrollCalculator } from '../payroll/PayrollCalculator';
import { PayslipViewer } from '../payroll/PayslipViewer';
import { PayrollEntry } from '../payroll/PayrollEntry';
import { DollarSign, FileText, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface PayrollTabProps {
  employeeId: string;
}

export const PayrollTab = ({ employeeId }: PayrollTabProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState(format(new Date(), 'yyyy-MM'));
  const employee = useEmployeeStore((state) => state.getEmployeeById(employeeId));
  const payrollHistory = usePayrollStore((state) => state.getPayrollHistory(employeeId));

  if (!employee) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Payroll Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Annual Salary</p>
                <p className="text-lg font-medium">
                  ${parseFloat(employee.salary || '0').toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tax Code</p>
                <p className="text-lg font-medium">{employee.taxCode || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">KiwiSaver Rate</p>
                <p className="text-lg font-medium">{employee.kiwiSaverRate || '3'}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bank Account</p>
                <p className="text-lg font-medium">{employee.bankAccount || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">IRD Number</p>
                <p className="text-lg font-medium">{employee.irdNumber || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Student Loan</p>
                <p className="text-lg font-medium">
                  {employee.taxCode?.includes('SL') ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <PayrollCalculator
              employeeId={employeeId}
              payPeriod={{
                start: format(new Date(), 'yyyy-MM-01'),
                end: format(new Date(), 'yyyy-MM-dd'),
              }}
            />
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Payslips</h3>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="input-field"
              >
                {payrollHistory.map((entry) => (
                  <option key={entry.id} value={entry.period}>
                    {format(new Date(entry.period), 'MMMM yyyy')}
                  </option>
                ))}
              </select>
            </div>

            <PayslipViewer
              employeeId={employeeId}
              period={selectedPeriod}
            />
          </div>

          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Payroll Information:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>PAYE deducted at source</li>
                  <li>KiwiSaver contributions</li>
                  <li>ACC levies calculated</li>
                  <li>Student loan deductions (if applicable)</li>
                  <li>Tax codes must be current</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium">Payroll History</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {payrollHistory.map((entry) => (
              <PayrollEntry
                key={entry.id}
                entry={entry}
                onDownloadPayslip={() => {
                  // PayslipViewer handles the download
                }}
              />
            ))}
          </div>

          {payrollHistory.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No payroll history available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
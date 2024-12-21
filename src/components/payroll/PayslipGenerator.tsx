import React, { useState } from 'react';
import { usePayrollStore } from '../../store/payrollStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { FileText, Download, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { generatePayslip } from '../../utils/payslipGenerator';
import toast from 'react-hot-toast';

interface PayslipGeneratorProps {
  employeeId?: string;
  period?: string;
}

export const PayslipGenerator = ({ employeeId, period }: PayslipGeneratorProps) => {
  const [selectedEmployee, setSelectedEmployee] = useState(employeeId || '');
  const [selectedPeriod, setSelectedPeriod] = useState(period || format(new Date(), 'yyyy-MM'));
  const [generating, setGenerating] = useState(false);

  const employees = useEmployeeStore((state) => state.employees);
  const entries = usePayrollStore((state) => state.entries);

  const handleGenerate = async () => {
    if (!selectedEmployee || !selectedPeriod) {
      toast.error('Please select an employee and period');
      return;
    }

    setGenerating(true);
    try {
      const employee = employees.find(e => e.id === selectedEmployee);
      const entry = entries.find(e => 
        e.employeeId === selectedEmployee && e.period === selectedPeriod
      );

      if (!employee || !entry) {
        throw new Error('No payroll data found for selected period');
      }

      // Calculate earnings
      const earnings = {
        regular: entry.grossPay,
        overtime: entry.additions.overtime || 0,
        publicHoliday: 0,
        allowances: Object.entries(entry.additions)
          .filter(([key]) => key !== 'overtime')
          .map(([name, amount]) => ({ name, amount: amount as number }))
      };

      // Calculate deductions
      const deductions = {
        paye: entry.deductions.paye,
        acc: entry.deductions.acc,
        kiwiSaver: entry.deductions.kiwiSaver,
        studentLoan: entry.deductions.studentLoan || 0,
        other: Object.entries(entry.deductions)
          .filter(([key]) => !['paye', 'acc', 'kiwiSaver', 'studentLoan'].includes(key))
          .map(([name, amount]) => ({ name, amount: amount as number }))
      };

      await generatePayslip(employee, selectedPeriod, earnings, deductions);
      toast.success('Payslip generated successfully');
    } catch (error) {
      toast.error('Failed to generate payslip');
      console.error('Payslip generation error:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Generate Payslip</h2>
        <FileText className="text-gray-400" size={24} />
      </div>

      <div className="space-y-4">
        {!employeeId && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Employee
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="input-field"
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {!period && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pay Period
            </label>
            <input
              type="month"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="input-field"
            />
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={generating || !selectedEmployee || !selectedPeriod}
          className="btn-primary w-full flex items-center justify-center space-x-2"
        >
          {generating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Download size={20} />
              <span>Generate Payslip</span>
            </>
          )}
        </button>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Payslip Requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Employee details and tax codes</li>
                <li>Gross earnings breakdown</li>
                <li>All deductions itemized</li>
                <li>KiwiSaver contributions</li>
                <li>Net pay and payment details</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
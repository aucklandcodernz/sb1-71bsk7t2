import React, { useState } from 'react';
import { usePayrollStore } from '../../store/payrollStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { format } from 'date-fns';
import { DollarSign, Calendar, AlertCircle, Download, FileText, CheckCircle, X } from 'lucide-react';
import { generatePayslip } from '../../utils/payslipGenerator';
import { generateBankPaymentFile } from '../../utils/bankPaymentUtils';
import { generateIR348Data } from '../../utils/payrollUtils';
import { validateIRDNumber, validateBankAccount } from '../../utils/payrollUtils';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

export const PayrollProcessing = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(format(new Date(), 'yyyy-MM'));
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<number>(0);
  
  const { processPayroll, entries } = usePayrollStore();
  const employees = useEmployeeStore((state) => state.getActiveEmployees());

  // Validate employee information
  const validateEmployees = () => {
    const errors: string[] = [];
    employees.forEach(emp => {
      if (!emp.salary) errors.push(`${emp.name}: Missing salary information`);
      if (!emp.bankAccount) errors.push(`${emp.name}: Missing bank account`);
      if (!validateBankAccount(emp.bankAccount || '')) errors.push(`${emp.name}: Invalid bank account format`);
      if (!emp.taxCode) errors.push(`${emp.name}: Missing tax code`);
      if (!emp.irdNumber) errors.push(`${emp.name}: Missing IRD number`);
      if (!validateIRDNumber(emp.irdNumber || '')) errors.push(`${emp.name}: Invalid IRD number format`);
      if (!emp.kiwiSaverRate) errors.push(`${emp.name}: Missing KiwiSaver rate`);
    });
    return errors;
  };

  const handleProcessPayroll = async () => {
    try {
      setProcessing(true);
      setError(null);
      setValidationErrors([]);
      setProcessingStep(1);

      // Step 1: Validate
      const errors = validateEmployees();
      if (errors.length > 0) {
        setValidationErrors(errors);
        throw new Error('Employee validation failed');
      }

      // Step 2: Process payroll
      setProcessingStep(2);
      await processPayroll(employees, selectedPeriod);

      // Step 3: Generate payslips
      setProcessingStep(3);
      for (const employee of employees) {
        setSelectedEmployee(employee.id);
        const entry = entries.find(e => e.employeeId === employee.id && e.period === selectedPeriod);
        if (!entry) continue;

        try {
          await generatePayslip(
            employee,
            selectedPeriod,
            {
              regular: entry.grossPay,
              overtime: entry.additions?.overtime || 0,
              publicHoliday: 0,
              allowances: entry.additions?.allowances || []
            },
            {
              paye: entry.deductions.paye,
              acc: entry.deductions.acc,
              kiwiSaver: entry.deductions.kiwiSaver,
              studentLoan: entry.deductions.studentLoan || 0,
              other: entry.deductions.other || []
            }
          );
        } catch (error) {
          console.error(`Error generating payslip for ${employee.name}:`, error);
          toast.error(`Failed to generate payslip for ${employee.name}`);
        }
      }

      // Step 4: Generate bank payment file
      setProcessingStep(4);
      const bankFile = generateBankPaymentFile(entries.filter(e => e.period === selectedPeriod));
      const bankBlob = new Blob([bankFile], { type: 'text/csv' });
      const bankUrl = URL.createObjectURL(bankBlob);
      const bankLink = document.createElement('a');
      bankLink.href = bankUrl;
      bankLink.download = `bank-payments-${selectedPeriod}.csv`;
      bankLink.click();
      URL.revokeObjectURL(bankUrl);

      // Step 5: Generate IR348 data
      setProcessingStep(5);
      const ir348Data = generateIR348Data(entries.filter(e => e.period === selectedPeriod));
      const ws = XLSX.utils.json_to_sheet(ir348Data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'IR348');
      XLSX.writeFile(wb, `ir348-${selectedPeriod}.xlsx`);

      toast.success('Payroll processed successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process payroll';
      setError(message);
      toast.error(message);
    } finally {
      setProcessing(false);
      setSelectedEmployee(null);
      setProcessingStep(0);
    }
  };

  const steps = [
    'Validate employee data',
    'Calculate pay and deductions',
    'Generate payslips',
    'Create bank payment file',
    'Generate IR348 schedule'
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">Process Payroll</h2>
          <p className="text-sm text-gray-500">Process individual employee payroll</p>
        </div>
        <div className="flex space-x-4">
          <input
            type="month"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input-field"
          />
          <button
            onClick={handleProcessPayroll}
            disabled={processing}
            className="btn-primary flex items-center space-x-2"
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <DollarSign size={20} />
                <span>Process Payroll</span>
              </>
            )}
          </button>
        </div>
      </div>

      {validationErrors.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="text-red-600 mt-0.5 mr-2" size={16} />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Please fix the following errors:
              </h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">Processing Steps</h3>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  processingStep > index + 1
                    ? 'text-green-600'
                    : processingStep === index + 1
                    ? 'text-indigo-600'
                    : 'text-gray-400'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  processingStep > index + 1
                    ? 'bg-green-100'
                    : processingStep === index + 1
                    ? 'bg-indigo-100'
                    : 'bg-gray-100'
                }`}>
                  {processingStep > index + 1 ? (
                    <CheckCircle size={16} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span className="text-sm">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">Employee Status</h3>
          <div className="space-y-4">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  selectedEmployee === employee.id ? 'border-indigo-500 bg-indigo-50' : ''
                }`}
              >
                <div>
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-sm text-gray-500">{employee.position}</p>
                </div>
                <div className="flex items-center">
                  {processingStep > 0 && (
                    selectedEmployee === employee.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                    ) : (
                      processingStep === 5 && (
                        <CheckCircle className="text-green-500" size={16} />
                      )
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Important Notes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Verify all employee tax codes and KiwiSaver rates</li>
              <li>Ensure bank account details are correct</li>
              <li>Check for any special payments or deductions</li>
              <li>Confirm public holiday payments</li>
              <li>Review overtime calculations</li>
              <li>Ensure all statutory deductions are correct</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
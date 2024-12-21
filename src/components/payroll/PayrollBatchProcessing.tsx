import React, { useState } from 'react';
import { usePayrollStore } from '../../store/payrollStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { useLeaveStore } from '../../store/leaveStore';
import { generateBankPaymentFile } from '../../utils/bankPaymentUtils';
import { generateIR348File } from '../../utils/ir348Utils';
import { generatePayslip } from '../../utils/payslipGenerator';
import { DollarSign, Download, AlertCircle, Calendar, FileText, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { validateIRDNumber, validateBankAccount } from '../../utils/payrollUtils';
import Big from 'big.js';
import toast from 'react-hot-toast';

export const PayrollBatchProcessing = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(format(new Date(), 'yyyy-MM'));
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [processedEmployees, setProcessedEmployees] = useState<string[]>([]);
  const [processingStep, setProcessingStep] = useState<number>(0);
  const [processingStats, setProcessingStats] = useState({
    totalEmployees: 0,
    processedCount: 0,
    totalAmount: new Big(0),
    errors: 0,
    startTime: new Date(),
    estimatedTimeRemaining: 0
  });

  const { entries, processPayroll } = usePayrollStore();
  const employees = useEmployeeStore((state) => state.getActiveEmployees());
  const calculateLeaveBalance = useLeaveStore((state) => state.calculateLeaveBalance);

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

      // Validate tax code
      const validTaxCodes = ['M', 'M SL', 'S', 'S SL', 'SH', 'SH SL', 'ST', 'ST SL'];
      if (emp.taxCode && !validTaxCodes.includes(emp.taxCode)) {
        errors.push(`${emp.name}: Invalid tax code`);
      }

      // Validate KiwiSaver rate
      const validKiwiSaverRates = ['3', '4', '6', '8', '10'];
      if (emp.kiwiSaverRate && !validKiwiSaverRates.includes(emp.kiwiSaverRate)) {
        errors.push(`${emp.name}: Invalid KiwiSaver rate`);
      }
    });
    return errors;
  };

  const updateProgress = (employeeId: string, success: boolean, amount?: number) => {
    setProcessedEmployees(prev => [...prev, employeeId]);
    setProcessingStats(prev => {
      const newStats = {
        ...prev,
        processedCount: prev.processedCount + 1,
        errors: prev.errors + (success ? 0 : 1),
        totalAmount: amount ? prev.totalAmount.plus(amount) : prev.totalAmount
      };

      // Calculate estimated time remaining
      const elapsedTime = (new Date().getTime() - prev.startTime.getTime()) / 1000;
      const averageTimePerEmployee = elapsedTime / newStats.processedCount;
      const remainingEmployees = prev.totalEmployees - newStats.processedCount;
      newStats.estimatedTimeRemaining = Math.round(averageTimePerEmployee * remainingEmployees);

      return newStats;
    });
  };

  const handleProcessPayroll = async () => {
    try {
      setProcessing(true);
      setError(null);
      setValidationErrors([]);
      setProcessedEmployees([]);
      setProcessingStep(1);
      setProcessingStats({
        totalEmployees: employees.length,
        processedCount: 0,
        totalAmount: new Big(0),
        errors: 0,
        startTime: new Date(),
        estimatedTimeRemaining: 0
      });

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
        try {
          const entry = entries.find(e => 
            e.employeeId === employee.id && 
            e.period === selectedPeriod
          );

          if (entry) {
            const leaveBalance = calculateLeaveBalance(employee.id, new Date());
            
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
              },
              {
                annual: leaveBalance,
                sick: 10,
                alternative: 0
              }
            );

            updateProgress(employee.id, true, entry.netPay);
          }
        } catch (error) {
          console.error(`Error processing ${employee.name}:`, error);
          updateProgress(employee.id, false);
        }
      }

      // Step 4: Generate bank payment file
      setProcessingStep(4);
      const bankFile = generateBankPaymentFile(
        entries.filter(e => e.period === selectedPeriod)
      );
      const bankBlob = new Blob([bankFile], { type: 'text/csv' });
      const bankUrl = URL.createObjectURL(bankBlob);
      const bankLink = document.createElement('a');
      bankLink.href = bankUrl;
      bankLink.download = `bank-payments-${selectedPeriod}.csv`;
      bankLink.click();
      URL.revokeObjectURL(bankUrl);

      // Step 5: Generate IR348 data
      setProcessingStep(5);
      const ir348File = generateIR348File(
        entries.filter(e => e.period === selectedPeriod),
        selectedPeriod
      );
      const ir348Blob = new Blob([ir348File], { type: 'text/csv' });
      const ir348Url = URL.createObjectURL(ir348Blob);
      const ir348Link = document.createElement('a');
      ir348Link.href = ir348Url;
      ir348Link.download = `ir348-${selectedPeriod}.csv`;
      ir348Link.click();
      URL.revokeObjectURL(ir348Url);

      const errorMessage = processingStats.errors > 0 
        ? ` (${processingStats.errors} errors occurred)`
        : '';
      toast.success(`Payroll processed successfully${errorMessage}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process payroll';
      setError(message);
      toast.error(message);
    } finally {
      setProcessing(false);
      setProcessingStep(0);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">Batch Processing</h2>
          <p className="text-sm text-gray-500">Process payroll for all employees</p>
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
            {[
              'Validate employee data',
              'Calculate pay and deductions',
              'Generate payslips',
              'Create bank payment file',
              'Generate IR348 schedule'
            ].map((step, index) => (
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
                  processedEmployees.includes(employee.id) ? 'bg-gray-50' : ''
                }`}
              >
                <div>
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-sm text-gray-500">{employee.position}</p>
                </div>
                <div className="flex items-center">
                  {processedEmployees.includes(employee.id) ? (
                    <CheckCircle className="text-green-500" size={16} />
                  ) : processing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  ) : (
                    <span className="text-gray-400">Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {processing && (
            <div className="mt-6 bg-indigo-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress:</span>
                  <span>{Math.round((processingStats.processedCount / processingStats.totalEmployees) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 rounded-full h-2 transition-all duration-300"
                    style={{
                      width: `${(processingStats.processedCount / processingStats.totalEmployees) * 100}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total Amount: ${processingStats.totalAmount.toFixed(2)}</span>
                  <span>Errors: {processingStats.errors}</span>
                </div>
                {processingStats.estimatedTimeRemaining > 0 && (
                  <div className="text-sm text-gray-600">
                    Estimated time remaining: {processingStats.estimatedTimeRemaining} seconds
                  </div>
                )}
              </div>
            </div>
          )}
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
              <li>Keep payroll records for 7 years</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
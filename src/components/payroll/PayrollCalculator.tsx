import React, { useState } from 'react';
import { usePayrollStore } from '../../store/payrollStore';
import { useTimeTrackingStore } from '../../store/timeTrackingStore';
import { Calculator, AlertCircle } from 'lucide-react';
import {
  calculatePAYE,
  calculateKiwiSaver,
  calculateACC,
  calculateStudentLoan,
  calculateNetPay,
  calculateOvertimeRate
} from '../../utils/payrollCalculator';
import { PayDetails } from './PayDetails';
import { TaxSettings } from './TaxSettings';
import { PayrollSummary } from './PayrollSummary';
import { format } from 'date-fns';
import Big from 'big.js';
import toast from 'react-hot-toast';

interface PayrollCalculatorProps {
  employeeId: string;
  payPeriod: {
    start: string;
    end: string;
  };
}

export const PayrollCalculator = ({ employeeId, payPeriod }: PayrollCalculatorProps) => {
  const [hourlyRate, setHourlyRate] = useState(22.70);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [kiwiSaverRate, setKiwiSaverRate] = useState(3);
  const [hasStudentLoan, setHasStudentLoan] = useState(false);
  const [taxCode, setTaxCode] = useState('M');
  const [allowances, setAllowances] = useState([{ name: '', amount: 0, taxable: true }]);
  const [deductions, setDeductions] = useState([{ name: '', amount: 0, beforeTax: true }]);

  const { entries } = usePayrollStore();
  const timeEntries = useTimeTrackingStore((state) =>
    state.getEmployeeEntries(employeeId)
      .filter(entry =>
        entry.clockIn >= payPeriod.start &&
        entry.clockIn <= payPeriod.end &&
        entry.clockOut
      )
  );

  // Calculate YTD totals
  const calculateYTD = () => {
    const currentYear = new Date().getFullYear();
    const ytdEntries = entries.filter(entry => 
      entry.employeeId === employeeId &&
      new Date(entry.period).getFullYear() === currentYear
    );

    return ytdEntries.reduce((acc, entry) => ({
      gross: acc.gross.plus(entry.grossPay),
      paye: acc.paye.plus(entry.deductions.paye),
      kiwiSaver: {
        employee: acc.kiwiSaver.employee.plus(entry.deductions.kiwiSaver.employee),
        employer: acc.kiwiSaver.employer.plus(entry.deductions.kiwiSaver.employer)
      },
      acc: acc.acc.plus(entry.deductions.acc),
      studentLoan: acc.studentLoan.plus(entry.deductions.studentLoan || 0),
      net: acc.net.plus(entry.netPay)
    }), {
      gross: new Big(0),
      paye: new Big(0),
      kiwiSaver: { employee: new Big(0), employer: new Big(0) },
      acc: new Big(0),
      studentLoan: new Big(0),
      net: new Big(0)
    });
  };

  const calculateGrossPay = () => {
    let regularHours = 0;
    let overtimeHours = 0;
    let publicHolidayHours = 0;

    timeEntries.forEach(entry => {
      const start = new Date(entry.clockIn);
      const end = new Date(entry.clockOut!);
      const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      const breakHours = (entry.breakDuration || 0) / 60;
      const netDuration = duration - breakHours;
      
      if (entry.type === 'regular') {
        if (netDuration <= 8) {
          regularHours += netDuration;
        } else {
          regularHours += 8;
          overtimeHours += netDuration - 8;
        }
      } else if (entry.type === 'overtime') {
        overtimeHours += netDuration;
      } else if (entry.type === 'public_holiday') {
        publicHolidayHours += netDuration;
      }
    });

    const regularPay = regularHours * hourlyRate;
    const overtimePay = overtimeHours * calculateOvertimeRate(hourlyRate, overtimeHours, 'firstThreeHours');
    const publicHolidayPay = publicHolidayHours * calculateOvertimeRate(hourlyRate, publicHolidayHours, 'publicHoliday');

    return {
      regular: regularPay,
      overtime: overtimePay,
      publicHoliday: publicHolidayPay,
      hours: {
        regular: regularHours,
        overtime: overtimeHours,
        publicHoliday: publicHolidayHours,
      },
    };
  };

  const calculateAllowances = () => {
    return allowances.reduce((total, allowance) => total + allowance.amount, 0);
  };

  const calculatePayrollDeductions = (grossPay: number) => {
    const taxableAllowances = allowances
      .filter(a => a.taxable)
      .reduce((sum, a) => sum + a.amount, 0);

    const taxableIncome = grossPay + taxableAllowances;
    const paye = calculatePAYE(taxableIncome * 12) / 12;
    const acc = calculateACC(taxableIncome);
    const kiwiSaver = calculateKiwiSaver(taxableIncome, kiwiSaverRate);
    const studentLoan = hasStudentLoan ? calculateStudentLoan(taxableIncome * 12) / 12 : 0;

    const otherDeductions = deductions.reduce((total, deduction) => {
      return total + deduction.amount;
    }, 0);

    return {
      paye,
      acc,
      kiwiSaver,
      studentLoan,
      other: otherDeductions,
    };
  };

  const validateCalculations = () => {
    const newErrors: Record<string, string> = {};

    if (hourlyRate < 22.70) {
      newErrors.hourlyRate = 'Rate cannot be below NZ minimum wage ($22.70)';
    }

    if (kiwiSaverRate < 3) {
      newErrors.kiwiSaver = 'KiwiSaver rate must be at least 3%';
    }

    const totalHours = Object.values(calculateGrossPay().hours).reduce((a, b) => a + b, 0);
    if (totalHours > 60) {
      newErrors.hours = 'Total weekly hours exceed maximum allowed (60 hours)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateCalculations()) {
      toast.error('Please fix validation errors before saving');
      return;
    }

    try {
      const grossPayments = calculateGrossPay();
      const totalAllowances = calculateAllowances();
      const grossTotal = grossPayments.regular + grossPayments.overtime +
                        grossPayments.publicHoliday + totalAllowances;
      const payrollDeductions = calculatePayrollDeductions(grossTotal);
      const netPay = calculateNetPay(grossTotal, payrollDeductions);
      const ytdTotals = calculateYTD();

      toast.success('Calculations saved successfully');
    } catch (error) {
      console.error('Error saving calculations:', error);
      toast.error('Failed to save calculations');
    }
  };

  const grossPayments = calculateGrossPay();
  const totalAllowances = calculateAllowances();
  const grossTotal = grossPayments.regular + grossPayments.overtime +
                    grossPayments.publicHoliday + totalAllowances;
  const payrollDeductions = calculatePayrollDeductions(grossTotal);
  const netPay = calculateNetPay(grossTotal, payrollDeductions);
  const ytdTotals = calculateYTD();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Payroll Calculator</h3>
        <button
          onClick={handleSave}
          className="btn-primary flex items-center space-x-2"
        >
          <Calculator size={20} />
          <span>Save Calculations</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <PayDetails
            hourlyRate={hourlyRate}
            setHourlyRate={setHourlyRate}
            hours={grossPayments.hours}
            errors={errors}
          />

          <TaxSettings
            taxCode={taxCode}
            setTaxCode={setTaxCode}
            kiwiSaverRate={kiwiSaverRate}
            setKiwiSaverRate={setKiwiSaverRate}
            hasStudentLoan={hasStudentLoan}
            setHasStudentLoan={setHasStudentLoan}
            errors={errors}
          />

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-4">Year to Date Totals</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Gross Pay</span>
                <span className="font-medium">${ytdTotals.gross.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">PAYE Tax</span>
                <span className="font-medium">${ytdTotals.paye.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">KiwiSaver (Employee)</span>
                <span className="font-medium">${ytdTotals.kiwiSaver.employee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">KiwiSaver (Employer)</span>
                <span className="font-medium">${ytdTotals.kiwiSaver.employer.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ACC Levy</span>
                <span className="font-medium">${ytdTotals.acc.toFixed(2)}</span>
              </div>
              {hasStudentLoan && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Student Loan</span>
                  <span className="font-medium">${ytdTotals.studentLoan.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-2 mt-2 border-t">
                <div className="flex justify-between font-medium">
                  <span>Net Pay YTD</span>
                  <span>${ytdTotals.net.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <PayrollSummary
          grossPayments={grossPayments}
          totalAllowances={totalAllowances}
          grossTotal={grossTotal}
          payrollDeductions={payrollDeductions}
          netPay={netPay}
          hasStudentLoan={hasStudentLoan}
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Important Notes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Minimum wage: $22.70 per hour</li>
              <li>Time and a half for first 3 overtime hours</li>
              <li>Double time for subsequent overtime hours</li>
              <li>Double time for public holidays</li>
              <li>Alternative holiday earned for working on public holidays</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PayrollEntry, PayrollRun } from '../types/payroll';
import { Employee } from '../types';
import { calculatePAYE, calculateKiwiSaver, calculateACC, calculateStudentLoan } from '../utils/payrollCalculator';
import { v4 as uuidv4 } from 'uuid';
import Big from 'big.js';

interface PayrollStore {
  entries: PayrollEntry[];
  runs: PayrollRun[];
  
  addEntry: (entry: Omit<PayrollEntry, 'id'>) => void;
  updateEntry: (id: string, entry: Partial<PayrollEntry>) => void;
  deleteEntry: (id: string) => void;
  
  processPayroll: (employees: Employee[], period: string) => void;
  getPayrollHistory: (employeeId: string) => PayrollEntry[];
  getPayrollStats: () => {
    totalPayroll: number;
    pendingPayments: number;
    taxLiability: number;
    kiwiSaverLiability: number;
    studentLoanLiability: number;
  };
}

// Generate test payroll data
const generateTestPayrollData = (): PayrollEntry[] => {
  const currentPeriod = new Date().toISOString().slice(0, 7); // YYYY-MM
  const entries: PayrollEntry[] = [];

  // Use employee IDs 1-15 to match our test employees
  for (let i = 1; i <= 15; i++) {
    const employeeId = i.toString();
    const baseSalary = new Big(50000).plus(new Big(Math.random()).times(50000)); // Random salary between 50k-100k
    const monthlyGross = baseSalary.div(12);
    
    const paye = new Big(calculatePAYE(baseSalary.toNumber())).div(12);
    const acc = new Big(calculateACC(monthlyGross.toNumber()));
    const kiwiSaver = calculateKiwiSaver(monthlyGross.toNumber(), 3);
    const studentLoan = i % 3 === 0 ? new Big(calculateStudentLoan(baseSalary.toNumber())).div(12) : new Big(0);

    const totalDeductions = paye.plus(acc).plus(kiwiSaver.employee).plus(studentLoan);
    const netPay = monthlyGross.minus(totalDeductions);

    entries.push({
      id: uuidv4(),
      employeeId,
      employeeName: `Employee ${i}`,
      period: currentPeriod,
      grossPay: monthlyGross.toNumber(),
      netPay: netPay.toNumber(),
      status: 'pending',
      deductions: {
        paye: paye.toNumber(),
        acc: acc.toNumber(),
        kiwiSaver: {
          employee: kiwiSaver.employee,
          employer: kiwiSaver.employer
        },
        studentLoan: studentLoan.toNumber(),
        other: []
      },
      additions: {
        overtime: i % 4 === 0 ? 500 : 0,
        allowances: i % 5 === 0 ? [{ name: 'Transport', amount: 200 }] : []
      },
      paymentDetails: {
        bankAccount: '12-3456-7890123-00',
        paymentDate: new Date().toISOString(),
        reference: `PAY-${currentPeriod}-${employeeId}`
      }
    });
  }

  return entries;
};

export const usePayrollStore = create<PayrollStore>()(
  persist(
    (set, get) => ({
      entries: generateTestPayrollData(),
      runs: [],
      
      addEntry: (entry) => {
        const id = uuidv4();
        set((state) => ({
          entries: [...state.entries, { ...entry, id }],
        }));
      },
      
      updateEntry: (id, entry) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, ...entry } : e
          ),
        })),
      
      deleteEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),
      
      processPayroll: (employees, period) => {
        const processedEntries = employees
          .filter((emp) => emp.status === 'active')
          .map((employee) => {
            const salary = new Big(employee.salary || '0');
            const monthlyGross = salary.div(12);
            
            const paye = new Big(calculatePAYE(salary.toNumber())).div(12);
            const acc = new Big(calculateACC(monthlyGross.toNumber()));
            const kiwiSaver = calculateKiwiSaver(
              monthlyGross.toNumber(),
              parseFloat(employee.kiwiSaverRate || '3')
            );
            const studentLoan = new Big(calculateStudentLoan(salary.toNumber())).div(12);
            
            const totalDeductions = paye
              .plus(acc)
              .plus(kiwiSaver.employee)
              .plus(studentLoan);
            
            const netPay = monthlyGross.minus(totalDeductions);
            
            return {
              id: uuidv4(),
              employeeId: employee.id,
              employeeName: employee.name,
              period,
              grossPay: monthlyGross.toNumber(),
              netPay: netPay.toNumber(),
              status: 'pending',
              deductions: {
                paye: paye.toNumber(),
                acc: acc.toNumber(),
                kiwiSaver,
                studentLoan: studentLoan.toNumber(),
                other: []
              },
              additions: {},
              paymentDetails: {
                bankAccount: employee.bankAccount || '',
                paymentDate: new Date().toISOString(),
                reference: `PAY-${period}-${employee.id}`,
              },
            };
          });
        
        set((state) => ({
          entries: [...state.entries, ...processedEntries],
        }));
      },
      
      getPayrollHistory: (employeeId) => {
        return get().entries
          .filter((entry) => entry.employeeId === employeeId)
          .sort((a, b) => b.paymentDetails.paymentDate.localeCompare(a.paymentDetails.paymentDate));
      },
      
      getPayrollStats: () => {
        const entries = get().entries;
        const totalPayroll = entries.reduce((sum, entry) => sum + entry.grossPay, 0);
        const pendingPayments = entries.filter(
          (entry) => entry.status === 'pending'
        ).length;
        
        const taxLiability = entries.reduce(
          (sum, entry) => sum + entry.deductions.paye + entry.deductions.acc,
          0
        );
        
        const kiwiSaverLiability = entries.reduce(
          (sum, entry) =>
            sum +
            entry.deductions.kiwiSaver.employee +
            entry.deductions.kiwiSaver.employer,
          0
        );

        const studentLoanLiability = entries.reduce(
          (sum, entry) => sum + (entry.deductions.studentLoan || 0),
          0
        );
        
        return {
          totalPayroll,
          pendingPayments,
          taxLiability,
          kiwiSaverLiability,
          studentLoanLiability,
        };
      },
    }),
    {
      name: 'payroll-storage',
      storage: localStorage,
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            ...persistedState,
            entries: generateTestPayrollData(),
            runs: [],
          };
        }
        return persistedState;
      },
    }
  )
);
import React from 'react';
import { usePayrollStore } from '../../store/payrollStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { DollarSign, Users, AlertCircle, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export const PayrollDashboard = () => {
  const stats = usePayrollStore((state) => state.getPayrollStats());
  const employees = useEmployeeStore((state) => state.getActiveEmployees());

  // Calculate department costs
  const departmentCosts = employees.reduce((acc, emp) => {
    const dept = emp.department || 'Unassigned';
    const salary = parseFloat(emp.salary || '0') / 12; // Monthly salary
    acc[dept] = (acc[dept] || 0) + salary;
    return acc;
  }, {} as Record<string, number>);

  // Prepare chart data
  const distributionData = {
    labels: ['Net Pay', 'PAYE', 'KiwiSaver', 'ACC', 'Student Loan'],
    datasets: [
      {
        data: [
          stats.totalPayroll - stats.taxLiability - stats.kiwiSaverLiability,
          stats.taxLiability,
          stats.kiwiSaverLiability,
          stats.taxLiability * 0.0139, // ACC rate
          stats.studentLoanLiability,
        ],
        backgroundColor: [
          'rgba(99, 102, 241, 0.2)',
          'rgba(239, 68, 68, 0.2)',
          'rgba(16, 185, 129, 0.2)',
          'rgba(245, 158, 11, 0.2)',
          'rgba(59, 130, 246, 0.2)',
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const departmentData = {
    labels: Object.keys(departmentCosts),
    datasets: [
      {
        label: 'Monthly Cost',
        data: Object.values(departmentCosts),
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Payroll</p>
              <p className="text-2xl font-bold mt-1">
                ${stats.totalPayroll.toLocaleString()}
              </p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <DollarSign className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Employees</p>
              <p className="text-2xl font-bold mt-1">{employees.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Tax Liability</p>
              <p className="text-2xl font-bold mt-1">
                ${stats.taxLiability.toLocaleString()}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertCircle className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Average Salary</p>
              <p className="text-2xl font-bold mt-1">
                ${(stats.totalPayroll / Math.max(employees.length, 1)).toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Payroll Distribution</h3>
          <div className="aspect-square">
            <Doughnut
              data={distributionData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const value = context.raw as number;
                        return `$${value.toLocaleString()}`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Department Costs</h3>
          <Bar
            data={departmentData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const value = context.raw as number;
                      return `$${value.toLocaleString()}`;
                    },
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => `$${value.toLocaleString()}`,
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Important Dates:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="font-medium">PAYE Due Dates</p>
                <ul className="list-disc list-inside">
                  <li>5th of the month (twice-monthly filers)</li>
                  <li>20th of the month (monthly filers)</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">KiwiSaver</p>
                <ul className="list-disc list-inside">
                  <li>Payment due with PAYE</li>
                  <li>New employee opt-out period: 2-8 weeks</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">End of Tax Year</p>
                <ul className="list-disc list-inside">
                  <li>31 March {new Date().getFullYear()}</li>
                  <li>IR348 due with final payment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { useEmployeeStore } from '../../store/employeeStore';
import { Calculator, Download, AlertCircle } from 'lucide-react';
import { calculateKiwiSaver } from '../../utils/payrollUtils';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

export const KiwiSaverCompliance = () => {
  const employees = useEmployeeStore((state) => state.getActiveEmployees());
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));

  const handleExport = () => {
    const data = [
      ['KiwiSaver Contributions Report'],
      ['Period:', selectedMonth],
      ['Generated:', format(new Date(), 'dd/MM/yyyy')],
      [''],
      [
        'Employee',
        'IRD Number',
        'Salary',
        'Employee Rate',
        'Employee Contribution',
        'Employer Contribution',
        'Total',
      ],
      ...employees.map((employee) => {
        const salary = parseFloat(employee.salary || '0') / 12; // Monthly salary
        const rate = parseFloat(employee.kiwiSaverRate || '3');
        const contributions = calculateKiwiSaver(salary, rate);

        return [
          employee.name,
          employee.irdNumber,
          salary.toFixed(2),
          `${rate}%`,
          contributions.employee.toFixed(2),
          contributions.employer.toFixed(2),
          (contributions.employee + contributions.employer).toFixed(2),
        ];
      }),
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'KiwiSaver Report');
    XLSX.writeFile(wb, `kiwisaver-report-${selectedMonth}.xlsx`);
    toast.success('KiwiSaver report exported successfully');
  };

  const totalContributions = employees.reduce((total, employee) => {
    const salary = parseFloat(employee.salary || '0') / 12;
    const rate = parseFloat(employee.kiwiSaverRate || '3');
    const contributions = calculateKiwiSaver(salary, rate);
    return total + contributions.employee + contributions.employer;
  }, 0);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">KiwiSaver Compliance</h2>
            <p className="text-sm text-gray-500">Manage KiwiSaver contributions</p>
          </div>
          <div className="flex space-x-4">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="input-field"
            />
            <button
              onClick={handleExport}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download size={20} />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee Contribution
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employer Contribution
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => {
                const salary = parseFloat(employee.salary || '0') / 12;
                const rate = parseFloat(employee.kiwiSaverRate || '3');
                const contributions = calculateKiwiSaver(salary, rate);
                const total = contributions.employee + contributions.employer;

                return (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        IRD: {employee.irdNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {rate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      ${contributions.employee.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      ${contributions.employer.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      ${total.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Contributions</p>
              <p className="text-2xl font-bold">
                ${totalContributions.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Enrolled Employees</p>
              <p className="text-2xl font-bold">
                {employees.filter((e) => e.kiwiSaverRate).length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Rate</p>
              <p className="text-2xl font-bold">
                {(
                  employees.reduce(
                    (sum, e) => sum + parseFloat(e.kiwiSaverRate || '0'),
                    0
                  ) / employees.length
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="text-blue-600 mt-0.5 mr-2" size={16} />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">KiwiSaver Requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Automatic enrollment for new employees (18-64)</li>
                <li>Minimum employer contribution: 3%</li>
                <li>Employee contribution options: 3%, 4%, 6%, 8%, 10%</li>
                <li>Contributions start after 8 weeks employment</li>
                <li>Opt-out window: 2-8 weeks from start date</li>
                <li>Employer SuperChoice allowed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
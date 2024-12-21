import React from 'react';
import { useLeaveStore } from '../../store/leaveStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

export const LeaveBalances = () => {
  const employees = useEmployeeStore((state) => state.employees);
  const calculateLeaveBalance = useLeaveStore((state) => state.calculateLeaveBalance);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Leave Balances</h2>
        <p className="text-sm text-gray-500 mt-1">NZ statutory leave entitlements</p>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {employees.map((employee) => {
            const balance = calculateLeaveBalance(employee.id, new Date());
            const startDate = new Date(employee.startDate);
            const monthsEmployed = (new Date().getFullYear() - startDate.getFullYear()) * 12 +
              (new Date().getMonth() - startDate.getMonth());

            return (
              <div key={employee.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium">{employee.name}</h3>
                    <p className="text-sm text-gray-500">{employee.position}</p>
                  </div>
                  {monthsEmployed < 6 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md px-3 py-1">
                      <p className="text-sm text-yellow-800">
                        Probation Period ({6 - monthsEmployed} months remaining)
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      Annual Leave
                    </div>
                    <p className="text-2xl font-bold text-indigo-600">
                      {monthsEmployed >= 12 ? '4 weeks' : `${(monthsEmployed / 12 * 4).toFixed(1)} weeks`}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {monthsEmployed >= 12 ? 'Full entitlement' : 'Accruing'}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Sick Leave
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {monthsEmployed >= 6 ? '10 days' : 'Not eligible'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {monthsEmployed >= 6 ? 'Available' : `Available after ${6 - monthsEmployed} months`}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Clock className="w-4 h-4 mr-1" />
                      Other Leave
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Bereavement:</span> 3 days
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Family Violence:</span> 10 days
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Public Holidays:</span> 11 days
                      </p>
                    </div>
                  </div>
                </div>

                {monthsEmployed >= 6 && (
                  <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                    <h4 className="text-sm font-medium text-indigo-800">Leave History</h4>
                    <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Annual Leave Taken</p>
                        <p className="font-medium">{balance.annualTaken || 0} days</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Sick Leave Taken</p>
                        <p className="font-medium">{balance.sickTaken || 0} days</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Leave Balance</p>
                        <p className="font-medium">{balance.remaining || 0} days</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
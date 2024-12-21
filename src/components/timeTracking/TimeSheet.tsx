import React, { useState } from 'react';
import { useTimeTrackingStore } from '../../store/timeTrackingStore';
import { format, differenceInHours, differenceInMinutes } from 'date-fns';
import { Clock, Plus, AlertCircle } from 'lucide-react';
import { ManualTimeEntry } from './ManualTimeEntry';

interface TimeSheetProps {
  employeeId: string;
  startDate: string;
  endDate: string;
}

export const TimeSheet = ({ employeeId, startDate, endDate }: TimeSheetProps) => {
  const [showManualEntry, setShowManualEntry] = useState(false);
  
  const entries = useTimeTrackingStore((state) => 
    state.getEmployeeEntries(employeeId)
      .filter(entry => 
        entry.clockIn >= startDate && 
        entry.clockIn <= endDate &&
        entry.clockOut
      )
  );

  const calculateDuration = (clockIn: string, clockOut: string, breakDuration: number = 0) => {
    const start = new Date(clockIn);
    const end = new Date(clockOut);
    const totalMinutes = differenceInMinutes(end, start) - breakDuration;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const getTotalHours = () => {
    return entries.reduce((total, entry) => {
      const duration = differenceInMinutes(
        new Date(entry.clockOut!),
        new Date(entry.clockIn)
      ) - (entry.breakDuration || 0);
      return total + duration / 60;
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Time Sheet</h2>
          <p className="text-sm text-gray-500">
            {format(new Date(startDate), 'MMM d')} - {format(new Date(endDate), 'MMM d, yyyy')}
          </p>
        </div>
        <button
          onClick={() => setShowManualEntry(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Entry</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="text-gray-400 mr-2" size={20} />
              <span className="text-sm font-medium">
                Total Hours: {getTotalHours().toFixed(2)}h
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clock In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clock Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Break
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {format(new Date(entry.clockIn), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {format(new Date(entry.clockIn), 'HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {format(new Date(entry.clockOut!), 'HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {entry.breakDuration || 0}m
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {calculateDuration(entry.clockIn, entry.clockOut!, entry.breakDuration)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      entry.type === 'overtime'
                        ? 'bg-yellow-100 text-yellow-800'
                        : entry.type === 'public_holiday'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {entry.type.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {entries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No time entries found for this period
            </div>
          )}
        </div>
      </div>

      {showManualEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <ManualTimeEntry
              employeeId={employeeId}
              onClose={() => setShowManualEntry(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
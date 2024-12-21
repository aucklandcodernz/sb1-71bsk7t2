import React, { useState } from 'react';
import { useTimeTrackingStore } from '../../store/timeTrackingStore';
import { Clock, Calendar, AlertCircle, Download } from 'lucide-react';
import { format, startOfWeek, endOfWeek, differenceInHours, differenceInMinutes } from 'date-fns';
import { calculatePayableHours } from '../../utils/timeTrackingUtils';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TimeTrackingTabProps {
  employeeId: string;
}

export const TimeTrackingTab = ({ employeeId }: TimeTrackingTabProps) => {
  const [dateRange, setDateRange] = useState({
    start: format(startOfWeek(new Date()), 'yyyy-MM-dd'),
    end: format(endOfWeek(new Date()), 'yyyy-MM-dd'),
  });

  const entries = useTimeTrackingStore((state) => 
    state.getEmployeeEntries(employeeId)
      .filter(entry => 
        entry.clockIn >= dateRange.start && 
        entry.clockIn <= dateRange.end
      )
  );

  const calculateDuration = (clockIn: string, clockOut: string | undefined, breakDuration: number = 0) => {
    if (!clockOut) return 'Active';
    
    const start = new Date(clockIn);
    const end = new Date(clockOut);
    const totalMinutes = differenceInMinutes(end, start) - breakDuration;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const calculateHoursByType = () => {
    return entries.reduce((acc, entry) => {
      if (!entry.clockOut) return acc;

      const hours = calculatePayableHours(entry);
      return {
        regular: acc.regular + hours.regular,
        overtime: acc.overtime + hours.overtime,
        publicHoliday: acc.publicHoliday + hours.publicHoliday,
      };
    }, { regular: 0, overtime: 0, publicHoliday: 0 });
  };

  const hoursByType = calculateHoursByType();

  const chartData = {
    labels: ['Regular', 'Overtime', 'Public Holiday'],
    datasets: [
      {
        data: [
          hoursByType.regular,
          hoursByType.overtime,
          hoursByType.publicHoliday,
        ],
        backgroundColor: [
          'rgba(99, 102, 241, 0.2)',
          'rgba(245, 158, 11, 0.2)',
          'rgba(16, 185, 129, 0.2)',
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const handleExport = () => {
    const data = [
      ['Time Sheet'],
      ['Employee ID:', employeeId],
      ['Period:', `${format(new Date(dateRange.start), 'dd/MM/yyyy')} to ${format(new Date(dateRange.end), 'dd/MM/yyyy')}`],
      ['Generated:', format(new Date(), 'dd/MM/yyyy HH:mm')],
      [''],
      ['Date', 'Clock In', 'Clock Out', 'Break', 'Duration', 'Type', 'Notes'],
      ...entries.map(entry => [
        format(new Date(entry.clockIn), 'dd/MM/yyyy'),
        format(new Date(entry.clockIn), 'HH:mm'),
        entry.clockOut ? format(new Date(entry.clockOut), 'HH:mm') : '-',
        `${entry.breakDuration || 0}m`,
        calculateDuration(entry.clockIn, entry.clockOut, entry.breakDuration),
        entry.type.toUpperCase(),
        entry.notes || '-'
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Time Sheet');
    XLSX.writeFile(wb, `timesheet-${employeeId}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    toast.success('Time sheet exported successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="input-field"
            />
          </div>
        </div>
        <button
          onClick={handleExport}
          className="btn-secondary flex items-center space-x-2"
        >
          <Download size={20} />
          <span>Export Time Sheet</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
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
                        {entry.clockOut ? format(new Date(entry.clockOut), 'HH:mm') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {entry.breakDuration || 0}m
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {calculateDuration(entry.clockIn, entry.clockOut, entry.breakDuration)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          entry.type === 'overtime'
                            ? 'bg-yellow-100 text-yellow-800'
                            : entry.type === 'public_holiday'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {entry.type.replace('_', ' ').toUpperCase()}
                        </span>
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
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Hours Distribution</h3>
            <div className="aspect-square">
              <Doughnut
                data={chartData}
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
                          return `${value.toFixed(1)} hours`;
                        },
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
                <p className="font-medium mb-1">NZ Employment Law:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Rest breaks (10 min) after 2 hours</li>
                  <li>Meal break (30 min) after 4 hours</li>
                  <li>Time and a half for overtime</li>
                  <li>Double time for public holidays</li>
                  <li>Alternative holiday for working PH</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};